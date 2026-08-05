package queue

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"strconv"
	"strings"
	"time"

	"github.com/redis/go-redis/v9"
)

// Message is a single job published to the stream.
type Message struct {
	ID          string
	Type        string
	Payload     []byte
	PublishedAt time.Time
}

// Handler processes a single queued message.
// Returning an error leaves the message in the pending state.
type Handler func(ctx context.Context, message Message) error

// Queue is a Redis Streams based job queue.
type Queue struct {
	client    *redis.Client
	stream    string
	group     string
	claimIdle time.Duration
	logger    *slog.Logger
}

// Config holds connection settings for a Redis backed queue.
type Config struct {
	Addr     string
	Password string
	DB       int

	Stream string
	Group  string

	// ClaimIdle is how long a message may sit in the pending list
	// before it is reclaimed by a consumer for retry. Zero reclaims
	// pending messages immediately.
	ClaimIdle time.Duration
}

// New creates subscription to the stream.
func New(cfg Config, logger *slog.Logger) (*Queue, error) {
	client := redis.NewClient(&redis.Options{
		Addr:     cfg.Addr,
		Password: cfg.Password,
		DB:       cfg.DB,
	})

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := client.Ping(ctx).Err(); err != nil {
		return nil, fmt.Errorf("connect to redis: %w", err)
	}

	q := &Queue{
		client:    client,
		stream:    cfg.Stream,
		group:     cfg.Group,
		claimIdle: cfg.ClaimIdle,
		logger:    logger,
	}

	if err := q.ensureGroup(ctx); err != nil {
		_ = client.Close()
		return nil, fmt.Errorf("create consumer group: %w", err)
	}

	return q, nil
}

// ensureGroup creates the consumer group if it does not exist.
func (q *Queue) ensureGroup(ctx context.Context) error {
	err := q.client.XGroupCreateMkStream(
		ctx,
		q.stream,
		q.group,
		"$",
	).Err()

	if err == nil || strings.Contains(err.Error(), "BUSYGROUP") {
		return nil
	}

	return err
}

// Publish appends a new job to the stream.
func (q *Queue) Publish(
	ctx context.Context,
	messageType string,
	payload any,
) (string, error) {

	data, err := json.Marshal(payload)
	if err != nil {
		return "", fmt.Errorf("marshal message payload: %w", err)
	}

	id, err := q.client.XAdd(ctx, &redis.XAddArgs{
		Stream: q.stream,
		Values: map[string]any{
			"type":    messageType,
			"payload": string(data),
			"time":    time.Now().UnixMilli(),
		},
	}).Result()
	if err != nil {
		return "", fmt.Errorf("publish message: %w", err)
	}

	return id, nil
}

// Consume blocks and processes messages from the stream for the given
// consumer, acknowledging each message after the handler succeeds.
func (q *Queue) Consume(
	ctx context.Context,
	consumer string,
	handler Handler,
) error {

	q.logger.Info(
		"starting queue consumer",
		"stream", q.stream,
		"group", q.group,
		"consumer", consumer,
	)

	for {
		if err := ctx.Err(); err != nil {
			return nil
		}

		// Reclaim pending messages left by failed or crashed
		// consumers so their jobs are retried.
		if err := q.claimPending(
			ctx,
			consumer,
			handler,
		); err != nil {
			q.logger.Error(
				"pending message claim failed",
				"error", err,
			)
		}

		results, err := q.client.XReadGroup(ctx, &redis.XReadGroupArgs{
			Group:    q.group,
			Consumer: consumer,
			Streams:  []string{q.stream, ">"},
			Count:    10,
			Block:    time.Second,
		}).Result()
		if err == redis.Nil {
			continue
		}
		if err != nil {
			if ctx.Err() != nil {
				return nil
			}

			q.logger.Error(
				"queue read failed",
				"error", err,
			)
			time.Sleep(time.Second)
			continue
		}

		for _, stream := range results {
			for _, message := range stream.Messages {
				if err := q.process(
					ctx,
					consumer,
					message,
					handler,
				); err != nil {
					q.logger.Error(
						"message processing failed",
						"error", err,
						"message_id", message.ID,
					)
				}
			}
		}
	}
}

// claimPending reclaims messages that have been idle for longer
// than the configured threshold and reprocesses them.
func (q *Queue) claimPending(
	ctx context.Context,
	consumer string,
	handler Handler,
) error {

	claimed, _, err := q.client.XAutoClaim(ctx, &redis.XAutoClaimArgs{
		Stream:   q.stream,
		Group:    q.group,
		Consumer: consumer,
		MinIdle:  q.claimIdle,
		Start:    "0",
		Count:    100,
	}).Result()
	if err != nil {
		return fmt.Errorf("claim pending messages: %w", err)
	}

	for _, message := range claimed {
		if err := q.process(
			ctx,
			consumer,
			message,
			handler,
		); err != nil {
			q.logger.Error(
				"claimed message processing failed",
				"error", err,
				"message_id", message.ID,
			)
		}
	}

	return nil
}

// process decodes a stream message and delegates to the handler.
func (q *Queue) process(
	ctx context.Context,
	consumer string,
	message redis.XMessage,
	handler Handler,
) error {

	values := message.Values

	messageType, _ := values["type"].(string)

	payload, _ := values["payload"].(string)

	var publishedAt time.Time
	if raw, ok := values["time"].(string); ok {
		if millis, err := strconv.ParseInt(raw, 10, 64); err == nil {
			publishedAt = time.UnixMilli(millis)
		}
	}

if err := handler(ctx, Message{
		ID:          message.ID,
		Type:        messageType,
		Payload:     []byte(payload),
		PublishedAt: publishedAt,
	}); err != nil {
		// Return without acknowledging so the message stays in the
		// pending list and is redelivered to a consumer for retry.
		return fmt.Errorf("handle message %s: %w", message.ID, err)
	}

	if err := q.client.XAck(
		ctx,
		q.stream,
		q.group,
		message.ID,
	).Err(); err != nil {
		return fmt.Errorf("acknowledge message %s: %w", message.ID, err)
	}

	if err := q.client.XDel(
		ctx,
		q.stream,
		message.ID,
	).Err(); err != nil {
		return fmt.Errorf("delete message %s: %w", message.ID, err)
	}

	q.logger.Debug(
		"message processed",
		"message_id", message.ID,
		"type", messageType,
		"consumer", consumer,
	)

	return nil
}

// Close releases the underlying redis connection.
func (q *Queue) Close() error {
	return q.client.Close()
}
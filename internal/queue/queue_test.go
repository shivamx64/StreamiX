package queue

import (
	"context"
	"errors"
	"io"
	"log/slog"
	"sync"
	"testing"
	"time"

	"github.com/alicebob/miniredis/v2"
	"github.com/redis/go-redis/v9"
)

func newTestQueue(
	t *testing.T,
	claimIdle time.Duration,
) (*miniredis.Miniredis, *redis.Client, *Queue) {
	t.Helper()

	mr := miniredis.RunT(t)

	client := redis.NewClient(&redis.Options{
		Addr: mr.Addr(),
	})

	discard := slog.New(slog.NewTextHandler(io.Discard, nil))

	q, err := New(Config{
		Addr:      mr.Addr(),
		Stream:    "test-stream",
		Group:     "test-group",
		ClaimIdle: claimIdle,
	}, discard)
	if err != nil {
		t.Fatalf("New() error = %v", err)
	}

	t.Cleanup(func() {
		_ = q.Close()
		_ = client.Close()
	})

	return mr, client, q
}

// streamLength returns the number of messages in the stream.
func streamLength(t *testing.T, client *redis.Client, stream string) int64 {
	t.Helper()

	length, err := client.XLen(context.Background(), stream).Result()
	if err != nil {
		t.Fatalf("XLen() error = %v", err)
	}

	return length
}

// waitForEmptyStream polls until the stream is drained or the timeout
// expires. Handler acknowledgements happen asynchronously, so callers
// must poll instead of asserting immediately.
func waitForEmptyStream(t *testing.T, client *redis.Client, stream string) {
	t.Helper()

	deadline := time.Now().Add(5 * time.Second)

	for streamLength(t, client, stream) != 0 {
		if time.Now().After(deadline) {
			t.Fatal("stream was not drained within the timeout")
		}

		time.Sleep(10 * time.Millisecond)
	}
}

func TestPublishAddsMessage(t *testing.T) {
	_, _, q := newTestQueue(t, 0)

	id, err := q.Publish(
		context.Background(),
		"video.transcode",
		map[string]string{"video_id": "abc"},
	)
	if err != nil {
		t.Fatalf("Publish() error = %v", err)
	}

	if id == "" {
		t.Error("Publish() returned empty message id")
	}
}

func TestConsumeDeliversAndAcknowledges(t *testing.T) {
	_, client, q := newTestQueue(t, 0)

	if _, err := q.Publish(
		context.Background(),
		"video.transcode",
		map[string]string{"video_id": "abc"},
	); err != nil {
		t.Fatalf("Publish() error = %v", err)
	}

	var received Message
	var mu sync.Mutex

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// The handler signals through a channel instead of canceling the
	// context, so the acknowledgement still has a live context.
	processed := make(chan struct{})

	done := make(chan struct{})

	go func() {
		_ = q.Consume(ctx, "consumer-1", func(ctx context.Context, message Message) error {
			mu.Lock()
			received = message
			mu.Unlock()

			close(processed)
			return nil
		})
		close(done)
	}()

	select {
	case <-processed:
	case <-time.After(5 * time.Second):
		t.Fatal("Consume() did not process the message in time")
	}

	// The acknowledgement happens after the handler returns, so wait
	// for the message to leave the stream before stopping the consumer.
	waitForEmptyStream(t, client, "test-stream")

	cancel()

	select {
	case <-done:
	case <-time.After(5 * time.Second):
		t.Fatal("Consume() did not stop after context cancellation")
	}

	mu.Lock()
	defer mu.Unlock()

	if received.Type != "video.transcode" {
		t.Errorf("message Type = %q, want %q", received.Type, "video.transcode")
	}

	if string(received.Payload) == "" {
		t.Error("message Payload is empty")
	}

	if received.PublishedAt.IsZero() {
		t.Error("message PublishedAt is zero")
	}

	// Message must be acknowledged and removed from the stream.
	length := streamLength(t, client, "test-stream")
	if length != 0 {
		t.Errorf("stream length = %d, want 0 (message not acknowledged)", length)
	}
}

func TestConsumeRetriesOnHandlerError(t *testing.T) {
	_, client, q := newTestQueue(t, 0)

	if _, err := q.Publish(
		context.Background(),
		"video.transcode",
		map[string]string{"video_id": "abc"},
	); err != nil {
		t.Fatalf("Publish() error = %v", err)
	}

	attempts := 0

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	succeeded := make(chan struct{})
	done := make(chan struct{})

	go func() {
		_ = q.Consume(ctx, "consumer-1", func(ctx context.Context, message Message) error {
			attempts++

			// Fail twice, then succeed on the third attempt.
			if attempts < 3 {
				return errors.New("transient failure")
			}

			close(succeeded)
			return nil
		})
		close(done)
	}()

	select {
	case <-succeeded:
	case <-time.After(10 * time.Second):
		t.Fatal("Consume() did not reclaim and retry the message")
	}

	waitForEmptyStream(t, client, "test-stream")

	cancel()

	select {
	case <-done:
	case <-time.After(5 * time.Second):
		t.Fatal("Consume() did not stop after context cancellation")
	}

	if attempts != 3 {
		t.Errorf("handler attempts = %d, want 3 (two failures + one success)", attempts)
	}
}

func TestConsumeStopsOnCancellation(t *testing.T) {
	_, _, q := newTestQueue(t, 0)

	ctx, cancel := context.WithCancel(context.Background())

	done := make(chan struct{})

	go func() {
		_ = q.Consume(ctx, "consumer-1", func(ctx context.Context, message Message) error {
			return nil
		})
		close(done)
	}()

	cancel()

	select {
	case <-done:
	case <-time.After(5 * time.Second):
		t.Fatal("Consume() did not stop after context cancellation")
	}
}

func TestReopenWithExistingGroup(t *testing.T) {
	mr, _, q := newTestQueue(t, 0)

	// Close and recreate with the same group; must not error.
	_ = q.Close()

	discard := slog.New(slog.NewTextHandler(io.Discard, nil))

	reopened, err := New(Config{
		Addr:   mr.Addr(),
		Stream: "test-stream",
		Group:  "test-group",
	}, discard)
	if err != nil {
		t.Fatalf("New() with existing group error = %v", err)
	}
	defer reopened.Close()
}

func TestNewRequiresRedis(t *testing.T) {
	discard := slog.New(slog.NewTextHandler(io.Discard, nil))

	_, err := New(Config{
		Addr:   "127.0.0.1:1", // nothing listens here
		Stream: "test-stream",
		Group:  "test-group",
	}, discard)
	if err == nil {
		t.Fatal("New() with unreachable redis expected error, got nil")
	}
}
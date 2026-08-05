package main

import (
	"context"
	"encoding/json"
	"log"
	"log/slog"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/shivamx64/streamix/apps/api/worker/internal/processor"
	"github.com/shivamx64/streamix/internal/config"
	"github.com/shivamx64/streamix/internal/database"
	"github.com/shivamx64/streamix/internal/logger"
	"github.com/shivamx64/streamix/internal/queue"
	"github.com/shivamx64/streamix/internal/storage"
	"github.com/shivamx64/streamix/internal/transcoder"
	"github.com/shivamx64/streamix/internal/videos"
)

// maxJobAge is how long a job may keep retrying before it is
// considered failed and discarded.
const maxJobAge = 30 * time.Minute

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatal(err)
	}

	logger := logger.New(cfg)

	db, err := database.New(cfg, logger)
	if err != nil {
		log.Fatal(err)
	}

	storageBackend := storage.NewLocalStorage(
		cfg.Storage.LocalRoot,
	)

	tx, err := transcoder.New("", "")
	if err != nil {
		log.Fatalf("initialize transcoder: %v", err)
	}

	streams, err := queue.New(
		queue.Config{
			Addr:      cfg.Queue.RedisAddr,
			Password:  cfg.Queue.RedisPassword,
			DB:        cfg.Queue.RedisDB,
			Stream:    cfg.Queue.Stream,
			Group:     cfg.Queue.Group,
			ClaimIdle: cfg.Queue.ClaimIdle,
		},
		logger,
	)
	if err != nil {
		log.Fatalf("connect to queue: %v", err)
	}
	defer streams.Close()

	repo := videos.NewRepository(db)

	proc := processor.New(
		repo,
		storageBackend,
		tx,
		os.TempDir(),
		logger,
	)

	consumer, err := os.Hostname()
	if err != nil || consumer == "" {
		consumer = "worker"
	}

	ctx, stop := signal.NotifyContext(
		context.Background(),
		os.Interrupt,
		syscall.SIGTERM,
	)
	defer stop()

	logger.Info(
		"transcoding worker started",
		"consumer", consumer,
		"stream", cfg.Queue.Stream,
	)

	if err := streams.Consume(
		ctx,
		consumer,
		func(ctx context.Context, message queue.Message) error {
			return handleMessage(ctx, proc, message, logger)
		},
	); err != nil {
		logger.Error(
			"queue consumer stopped",
			"error", err,
		)
	}

	logger.Info("transcoding worker shut down")
}

// handleMessage processes a single queued job.
func handleMessage(
	ctx context.Context,
	proc *processor.Processor,
	message queue.Message,
	log *slog.Logger,
) error {

	if message.Type != "video.transcode" {
		log.Warn(
			"discarding unknown message type",
			"type", message.Type,
		)
		return nil
	}

	var job videos.Job

	if err := json.Unmarshal(
		message.Payload,
		&job,
	); err != nil {
		log.Error(
			"discarding malformed job payload",
			"message_id", message.ID,
			"error", err,
		)
		return nil
	}

	permanent, err := proc.Process(ctx, job)
	if err == nil {
		return nil
	}

	// Permanent failures and jobs past the retry window are
	// acknowledged so they are not redelivered indefinitely.
	if permanent {
		log.Error(
			"permanent processing failure",
			"video_id", job.VideoID,
			"error", err,
		)
		return nil
	}

	if time.Since(message.PublishedAt) > maxJobAge {
		proc.Fail(ctx, job.VideoID)

		log.Error(
			"job exceeded retry window",
			"video_id", job.VideoID,
			"error", err,
		)
		return nil
	}

	log.Error(
		"transient processing failure, retrying",
		"video_id", job.VideoID,
		"error", err,
	)

	return err
}
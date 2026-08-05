package bootstrap

import (
	"context"
	"fmt"

	"github.com/gin-gonic/gin"

	"github.com/shivamx64/streamix/apps/api/internal/container"
	"github.com/shivamx64/streamix/apps/api/internal/routes"
	"github.com/shivamx64/streamix/internal/auth"
	"github.com/shivamx64/streamix/internal/config"
	"github.com/shivamx64/streamix/internal/database"
	"github.com/shivamx64/streamix/internal/logger"
	"github.com/shivamx64/streamix/internal/queue"
	"github.com/shivamx64/streamix/internal/storage"
	"github.com/shivamx64/streamix/internal/videos"
)

type Application struct {
	Container *container.Container
	Router    *gin.Engine
}

// New initializes all application dependencies and returns
// a fully configured Application.
func New() (*Application, error) {
	cfg, err := config.Load()
	if err != nil {
		return nil, fmt.Errorf("load configuration: %w", err)
	}

	log := logger.New(cfg)

	db, err := database.New(cfg, log)
	if err != nil {
		return nil, fmt.Errorf("initialize database: %w", err)
	}

	if err := database.Migrate(db); err != nil {
		return nil, fmt.Errorf("run database migrations: %w", err)
	}

	tokenManager := auth.NewTokenManager(cfg.Auth)

	storageBackend := storage.NewLocalStorage(
		cfg.Storage.LocalRoot,
	)

	// The job queue publishes transcoding work for workers.
	// Fall back to a no-op queue when redis is unavailable so the
	// upload flow keeps working without the worker infrastructure.
	var jobQueue videos.JobQueue

	streams, err := queue.New(
		queue.Config{
			Addr:      cfg.Queue.RedisAddr,
			Password:  cfg.Queue.RedisPassword,
			DB:        cfg.Queue.RedisDB,
			Stream:    cfg.Queue.Stream,
			Group:     cfg.Queue.Group,
			ClaimIdle: cfg.Queue.ClaimIdle,
		},
		log,
	)
	if err != nil {
		log.Warn(
			"queue unavailable; videos will not be queued for transcoding",
			"error", err,
		)
	} else {
		jobQueue = videos.JobQueueFunc(
			func(ctx context.Context, job videos.Job) error {
				_, err := streams.Publish(ctx, "video.transcode", job)
				return err
			},
		)
	}

	c := container.New(
		cfg,
		log,
		db,
		tokenManager,
		storageBackend,
		jobQueue,
	)

	router := gin.New()

	routes.Register(router, c)

	return &Application{
		Container: c,
		Router:    router,
	}, nil
}

package container

import (
	"log/slog"

	"github.com/shivamx64/streamix/internal/auth"
	"github.com/shivamx64/streamix/internal/config"
	"github.com/shivamx64/streamix/internal/storage"
	"github.com/shivamx64/streamix/internal/users"
	"github.com/shivamx64/streamix/internal/videos"

	"gorm.io/gorm"
)

type Container struct {
	Config *config.Config
	Logger *slog.Logger
	DB     *gorm.DB

	TokenManager *auth.TokenManager
	Storage storage.Storage
	UserHandler *users.Handler
	VideoHandler *videos.Handler
}

func New(
	cfg *config.Config,
	logger *slog.Logger,
	db *gorm.DB,
	tokenManager *auth.TokenManager,
	storageBackend storage.Storage,
	jobQueue videos.JobQueue,
) *Container {

	userRepository := users.NewRepository(db)

	userService := users.NewService(
		userRepository,
		tokenManager,
	)

	userHandler := users.NewHandler(
		userService,
	)

	videoRepository := videos.NewRepository(db)

	videoService := videos.NewService(
		videoRepository,
		storageBackend,
		jobQueue,
	)

	videoHandler := videos.NewHandler(
		videoService,
	)

	return &Container{
		Config: cfg,
		Logger: logger,
		DB:     db,

		TokenManager: tokenManager,
		Storage:      storageBackend,

		UserHandler: userHandler,

		VideoHandler: videoHandler,
	}
}

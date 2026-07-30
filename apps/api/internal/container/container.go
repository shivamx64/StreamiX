package container

import (
	"log/slog"

	"github.com/shivamx64/streamix/internal/auth"
	"github.com/shivamx64/streamix/internal/config"
	"github.com/shivamx64/streamix/internal/users"

	"gorm.io/gorm"
)

type Container struct {
	Config *config.Config
	Logger *slog.Logger
	DB     *gorm.DB

	TokenManager *auth.TokenManager

	UserHandler *users.Handler
}

func New(
	cfg *config.Config,
	logger *slog.Logger,
	db *gorm.DB,
	tokenManager *auth.TokenManager,
) *Container {

	userRepository := users.NewRepository(db)

	userService := users.NewService(
		userRepository,
		tokenManager,
	)

	userHandler := users.NewHandler(
		userService,
	)

	return &Container{
		Config: cfg,
		Logger: logger,
		DB:     db,

		TokenManager: tokenManager,
		UserHandler:  userHandler,
	}
}
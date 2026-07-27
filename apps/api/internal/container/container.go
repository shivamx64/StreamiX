package container

import (
	"log/slog"

	"github.com/shivamx64/streamix/internal/config"
	"gorm.io/gorm"
)

// Container holds the application's shared dependencies.
type Container struct {
	Config *config.Config
	Logger *slog.Logger
	DB 	   *gorm.DB
}

// New constructs and returns the application's dependency container.
func New(
	cfg *config.Config,
	logger *slog.Logger,
	db *gorm.DB,
) *Container {
	return &Container{
		Config: cfg,
		Logger: logger,
		DB:     db,
	}
}
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

// This new function constructs a dependency container
func New(
	cfg 	*config.Config,
	logger	*slog.Logger,
	db 		*gorm.DB,
)
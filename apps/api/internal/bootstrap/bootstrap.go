package bootstrap

import (
	"fmt"

	"github.com/gin-gonic/gin"

	"github.com/shivamx64/streamix/apps/api/internal/container"
	"github.com/shivamx64/streamix/internal/config"
	"github.com/shivamx64/streamix/internal/database"
	"github.com/shivamx64/streamix/internal/logger"
)

type Application struct {
	Container *container.Container
	Router    *gin.Engine
}

// New initializes the application's dependencies and returns a ready-to-run Application.
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

	c := container.New(cfg, log, db)

	router := gin.New()

	return &Application{
		Container: c,
		Router:    router,
	}, nil
}
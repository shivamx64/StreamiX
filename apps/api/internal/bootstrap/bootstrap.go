package bootstrap

import (
	"fmt"

	"github.com/gin-gonic/gin"

	"github.com/shivamx64/streamix/apps/api/internal/container"
	"github.com/shivamx64/streamix/apps/api/internal/routes"
	"github.com/shivamx64/streamix/internal/auth"
	"github.com/shivamx64/streamix/internal/config"
	"github.com/shivamx64/streamix/internal/database"
	"github.com/shivamx64/streamix/internal/logger"
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

	tokenManager := auth.NewTokenManager(cfg.Auth)

	c := container.New(
		cfg,
		log,
		db,
		tokenManager,
	)

	router := gin.New()

	routes.Register(router, c)

	return &Application{
		Container: c,
		Router:    router,
	}, nil
}

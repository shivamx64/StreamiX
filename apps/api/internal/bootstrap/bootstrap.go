package bootstrap

import (
	"fmt"

	"github.com/gin-gonic/gin"

	"github.com/shivamx64/streamix/apps/api/internal/container"
)

type Application struct {
	router *gin.Engine
}

func NewApplication() (*Application, error) {

	// Create dependency container.
	c := container.New()

	// Create Gin router.
	router := gin.New()

	// Standard middleware.
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	// Register all routes.
	c.RegisterRoutes(router)

	return &Application{
		router: router,
	}, nil
}

func (a *Application) Run() error {
	fmt.Println("StreamiX API listening on :8080")
	return a.router.Run(":8080")
}
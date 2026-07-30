package routes

import (
	"github.com/gin-gonic/gin"

	"github.com/shivamx64/streamix/apps/api/internal/container"
	apphttp "github.com/shivamx64/streamix/internal/http"
	"github.com/shivamx64/streamix/internal/middleware"
)

// HealthResponse represents the response payload for the health endpoint.
type HealthResponse struct {
	Status      string `json:"status"`
	Environment string `json:"environment"`
	Version     string `json:"version"`
}

// Register configures all HTTP routes for the application.
func Register(router *gin.Engine, c *container.Container) {

	// Register global middleware.
	router.Use(
		middleware.RequestID(),
		middleware.Recovery(c.Logger),
		middleware.Logger(c.Logger),
		middleware.CORS(),
	)

	// Health check endpoint.
	router.GET("/health", func(ctx *gin.Context) {

		apphttp.Success(
			ctx,
			"Service is healthy",
			HealthResponse{
				Status:      "healthy",
				Environment: c.Config.App.Environment,
				Version:     c.Config.App.Version,
			},
		)
	})

	api := router.Group("/api/v1")

	// Authentication routes.
	auth := api.Group("/auth")
	{
		auth.POST(
			"/register",
			c.UserHandler.Register,
		)
	}
}
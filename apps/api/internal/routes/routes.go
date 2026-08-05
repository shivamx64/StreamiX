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
	// Public authentication routes.
	{
		auth.POST(
			"/register",
			c.UserHandler.Register,
		)

		auth.POST(
			"/login",
			c.UserHandler.Login,
		)

		auth.POST(
			"/refresh",
			c.UserHandler.Refresh,
		)
	}

	// Protected authentication routes.
	protected := auth.Group("")
	protected.Use(
		middleware.Auth(c.TokenManager),
	)

	protected.GET(
		"/me",
		c.UserHandler.Me,
	)

	// Video routes.
	videos := api.Group("/videos")
	videos.Use(
		middleware.Auth(c.TokenManager),
	)

	videos.POST(
		"",
		c.VideoHandler.Upload,
	)

	videos.GET(
		"",
		c.VideoHandler.List,
	)

	videos.GET(
		"/:id",
		c.VideoHandler.Get,
	)

	videos.GET(
		"/:id/status",
		c.VideoHandler.Status,
	)

	videos.DELETE(
		"/:id",
		c.VideoHandler.Delete,
	)
}

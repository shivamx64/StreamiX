package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/shivamx64/streamix/apps/api/internal/container"
)

// Register configures all HTTP routes for the application.
func Register(router *gin.Engine, c *container.Container) {
	router.GET("/health", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "Service is healthy",
		})
	})

	api := router.Group("/api/v1")

	// Future feature modules will register their routes here.
	_ = api
	_ = c
}

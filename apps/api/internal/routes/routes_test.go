package routes

import (
	"log/slog"
	"testing"

	"github.com/gin-gonic/gin"

	"github.com/shivamx64/streamix/apps/api/internal/container"
	"github.com/shivamx64/streamix/internal/config"
	"github.com/shivamx64/streamix/internal/users"
	"github.com/shivamx64/streamix/internal/videos"
)

func TestRegisterMediaRoutes(t *testing.T) {
	gin.SetMode(gin.TestMode)

	router := gin.New()

	Register(router, &container.Container{
		Config:       &config.Config{},
		Logger:       slog.Default(),
		UserHandler:  users.NewHandler(nil),
		VideoHandler: videos.NewHandler(nil),
	})

	registered := make(map[string]bool)

	for _, route := range router.Routes() {
		registered[route.Method+" "+route.Path] = true
	}

	want := []string{
		"GET /api/v1/videos/:id/thumbnail",
		"GET /api/v1/videos/:id/hls/*path",
	}

	for _, route := range want {
		if !registered[route] {
			t.Errorf("route %q is not registered", route)
		}
	}
}

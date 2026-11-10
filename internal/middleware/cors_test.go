package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestCORSAllowsConfiguredOrigin(t *testing.T) {
	gin.SetMode(gin.TestMode)

	origin := "http://localhost:3100"
	router := gin.New()
	router.Use(CORS([]string{origin}))
	router.GET("/health", func(ctx *gin.Context) {
		ctx.Status(http.StatusOK)
	})

	request := httptest.NewRequest(http.MethodGet, "/health", nil)
	request.Header.Set("Origin", origin)
	response := httptest.NewRecorder()

	router.ServeHTTP(response, request)

	if got := response.Header().Get("Access-Control-Allow-Origin"); got != origin {
		t.Errorf("Access-Control-Allow-Origin = %q, want %q", got, origin)
	}
}

func TestCORSUsesDefaultOriginWhenUnconfigured(t *testing.T) {
	gin.SetMode(gin.TestMode)

	origin := "http://localhost:3000"
	router := gin.New()
	router.Use(CORS(nil))
	router.GET("/health", func(ctx *gin.Context) {
		ctx.Status(http.StatusOK)
	})

	request := httptest.NewRequest(http.MethodGet, "/health", nil)
	request.Header.Set("Origin", origin)
	response := httptest.NewRecorder()

	router.ServeHTTP(response, request)

	if got := response.Header().Get("Access-Control-Allow-Origin"); got != origin {
		t.Errorf("Access-Control-Allow-Origin = %q, want %q", got, origin)
	}
}

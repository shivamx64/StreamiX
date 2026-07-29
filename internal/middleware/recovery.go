package middleware

import (
	"log/slog"
	"runtime/debug"

	"github.com/gin-gonic/gin"

	apphttp "github.com/shivamx64/streamix/internal/http"
)

// Recovery recovers from panics, logs the error,
// and returns a standardized 500 response.
func Recovery(logger *slog.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {

		defer func() {

			if err := recover(); err != nil {

				requestID := c.GetString(RequestIDKey)

				logger.Error(
					"panic recovered",
					slog.Any("panic", err),
					slog.String("request_id", requestID),
					slog.String("path", c.Request.URL.Path),
					slog.String("method", c.Request.Method),
					slog.Any("stack", string(debug.Stack())),
				)

				apphttp.InternalServerError(c)

				c.Abort()
			}
		}()

		c.Next()
	}
}

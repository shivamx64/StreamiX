package middleware

import (
	"log/slog"
	"time"

	"github.com/gin-gonic/gin"
)

// Logger logs every HTTP request using slog.
func Logger(logger *slog.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {

		start := time.Now()

		c.Next()

		requestID := c.GetString(RequestIDKey)

		logger.Info(
			"request completed",
			slog.String("request_id", requestID),
			slog.String("method", c.Request.Method),
			slog.String("path", c.Request.URL.Path),
			slog.Int("status", c.Writer.Status()),
			slog.Duration("latency", time.Since(start)),
			slog.String("client_ip", c.ClientIP()),
			slog.String("user_agent", c.Request.UserAgent()),
		)
	}
}

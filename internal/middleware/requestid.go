package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

const RequestIDKey = "request_id"

// RequestID assigns a unique identifier to every incoming request.
func RequestID() gin.HandlerFunc {
	return func(c *gin.Context) {
		requestID := uuid.NewString()

		c.Set(RequestIDKey, requestID)
		
		c.Writer.Header().Set("X-Request-ID", requestID)

		c.Next()
	}
}
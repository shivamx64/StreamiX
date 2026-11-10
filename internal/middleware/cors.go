package middleware

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// CORS configures Cross-Origin Resource Sharing.
func CORS(allowedOrigins []string) gin.HandlerFunc {
	if len(allowedOrigins) == 0 {
		allowedOrigins = []string{"http://localhost:3000"}
	}

	return cors.New(cors.Config{
		AllowOrigins: allowedOrigins,

		AllowMethods: []string{
			"GET",
			"POST",
			"PUT",
			"PATCH",
			"DELETE",
			"OPTIONS",
		},

		AllowHeaders: []string{
			"Origin",
			"Content-Type",
			"Accept",
			"Authorization",
			RequestIDHeader,
		},

		ExposeHeaders: []string{
			RequestIDHeader,
		},

		AllowCredentials: true,

		MaxAge: 12 * time.Hour,
	})
}

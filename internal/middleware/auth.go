package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"

	"github.com/shivamx64/streamix/internal/auth"
	apphttp "github.com/shivamx64/streamix/internal/http"
)

// Auth validates JWT access tokens and authenticates requests.
func Auth(
	tokenManager *auth.TokenManager,
) gin.HandlerFunc {

	return func(ctx *gin.Context) {

		authorization := ctx.GetHeader("Authorization")

		if authorization == "" {
			apphttp.Unauthorized(
				ctx,
				"missing authorization header",
			)
			ctx.Abort()
			return
		}

		const bearerPrefix = "Bearer "

		if !strings.HasPrefix(
			authorization,
			bearerPrefix,
		) {
			apphttp.Unauthorized(
				ctx,
				"invalid authorization header",
			)
			ctx.Abort()
			return
		}

		token := strings.TrimPrefix(
			authorization,
			bearerPrefix,
		)

		claims, err := tokenManager.ValidateAccessToken(
			token,
		)

		if err != nil {
			apphttp.Unauthorized(
				ctx,
				"invalid or expired token",
			)
			ctx.Abort()
			return
		}

		SetUserID(
			ctx,
			claims.UserID,
		)

		ctx.Next()
	}
}
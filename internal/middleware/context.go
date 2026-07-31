package middleware

import (
	"github.com/gin-gonic/gin"
)

const (
	contextUserIDKey = "userID"
)

// Storing user ID
func SetuserID(
	ctx *gin.Context,
	userID string,
) {
	ctx.Set(
		contextUserIDKey,
		userID,
	)
}

// Retrieve user ID
func UserID(
	ctx *gin.Context,
) (string, bool) {

	value, exists := ctx.Get(
		contextUserIDKey,
	)

	if !exists {
		return "", false
	}

	userID, ok := value.(string)

	return userID, ok
}
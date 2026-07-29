package http

import (
	nethttp "net/http"

	"github.com/gin-gonic/gin"
)

// Error represents the standard API error payload.
type Error struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

// ErrorResponse represents the standard error response.
type ErrorResponse struct {
	Success bool  `json:"success"`
	Error   Error `json:"error"`
}

// JSONError writes a standard error response.
func JSONError(
	ctx *gin.Context,
	status int,
	code string,
	message string,
) {
	ctx.JSON(status, ErrorResponse{
		Success: false,
		Error: Error{
			Code:    code,
			Message: message,
		},
	})
}

// BadRequest writes a 400 response.
func BadRequest(ctx *gin.Context, message string) {
	JSONError(ctx, nethttp.StatusBadRequest, "BAD_REQUEST", message)
}

// Unauthorized writes a 401 response.
func Unauthorized(ctx *gin.Context, message string) {
	JSONError(ctx, nethttp.StatusUnauthorized, "UNAUTHORIZED", message)
}

// Forbidden writes a 403 response.
func Forbidden(ctx *gin.Context, message string) {
	JSONError(ctx, nethttp.StatusForbidden, "FORBIDDEN", message)
}

// NotFound writes a 404 response.
func NotFound(ctx *gin.Context, message string) {
	JSONError(ctx, nethttp.StatusNotFound, "NOT_FOUND", message)
}

// Conflict writes a 409 response.
func Conflict(ctx *gin.Context, message string) {
	JSONError(ctx, nethttp.StatusConflict, "CONFLICT", message)
}

// InternalServerError writes a 500 response.
func InternalServerError(ctx *gin.Context) {
	JSONError(
		ctx,
		nethttp.StatusInternalServerError,
		"INTERNAL_SERVER_ERROR",
		"An unexpected error occurred.",
	)
}
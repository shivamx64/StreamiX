package http

import (
	nethttp "net/http"

	"github.com/gin-gonic/gin"
)

// Response represents the standard successful API response.
//
// Every successful endpoint in StreamiX should return this shape.
type Response struct {
	Success bool   `json:"success"`
	Message string `json:"message,omitempty"`
	Data    any    `json:"data,omitempty"`
}

// JSON writes a standard API response.
func JSON(
	ctx *gin.Context,
	status int,
	message string,
	data any,
) {
	ctx.JSON(status, Response{
		Success: true,
		Message: message,
		Data:    data,
	})
}

// Success writes a 200 OK response.
func Success(
	ctx *gin.Context,
	message string,
	data any,
) {
	JSON(ctx, nethttp.StatusOK, message, data)
}

// Created writes a 201 Created response.
func Created(
	ctx *gin.Context,
	message string,
	data any,
) {
	JSON(ctx, nethttp.StatusCreated, message, data)
}

// NoContent writes a 204 No Content response.
func NoContent(ctx *gin.Context) {
	ctx.Status(nethttp.StatusNoContent)
}

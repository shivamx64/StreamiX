package users

import (
	"github.com/gin-gonic/gin"

	apphttp "github.com/shivamx64/streamix/internal/http"
	"github.com/shivamx64/streamix/internal/middleware"
)

// Handler handles user HTTP requests.
type Handler struct {
	service Service
}

// NewHandler creates a new user handler.
func NewHandler(service Service) *Handler {
	return &Handler{
		service: service,
	}
}

// Register handles user registration.
func (h *Handler) Register(ctx *gin.Context) {
	var request RegisterRequest
	if err := ctx.ShouldBindJSON(&request); err != nil {

		apphttp.BadRequest(
			ctx,
			"invalid request payload",
		)
		return
	}

	user, err := h.service.Register(
		ctx.Request.Context(),
		request.Email,
		request.Password,
	)

	if err != nil {
		switch err {
		case ErrEmailExists:
			apphttp.Conflict(
				ctx,
				"email already registered",
			)
		default:
			apphttp.InternalServerError(ctx)
		}
		return
	}

	response := UserResponse{
		ID:        user.ID.String(),
		Email:     user.Email,
		CreatedAt: user.CreatedAt,
	}
	apphttp.Created(
		ctx,
		"user registered successfully",
		response,
	)
}

// Login authenticates a user and returns JTW tokens.
func (h *Handler) Login(ctx *gin.Context) {

	var request LoginRequest

	if err := ctx.ShouldBindJSON(&request); err != nil {
		apphttp.BadRequest(
			ctx,
			"invalid request payload",
		)
		return
	}

	response, err := h.service.Login(
		ctx.Request.Context(),
		request.Email,
		request.Password,
	)

	if err != nil {
		switch err {
		case ErrInvalidCredentials:
			apphttp.Unauthorized(
				ctx,
				"invalid email or password",
			)
		default:
			apphttp.InternalServerError(ctx)
		}
		return
	}

	apphttp.Success(
		ctx,
		"login successful",
		response,
	)
}

// Refresh issues a new token pair from a valid refresh token.
func (h *Handler) Refresh(ctx *gin.Context) {

	var request RefreshRequest

	if err := ctx.ShouldBindJSON(&request); err != nil {
		apphttp.BadRequest(
			ctx,
			"invalid request payload",
		)
		return
	}

	response, err := h.service.Refresh(
		ctx.Request.Context(),
		request.RefreshToken,
	)

	if err != nil {
		switch err {
		case ErrInvalidRefreshToken:
			apphttp.Unauthorized(
				ctx,
				"invalid or expired refresh token",
			)
		default:
			apphttp.InternalServerError(ctx)
		}
		return
	}

	apphttp.Success(
		ctx,
		"tokens refreshed successfully",
		response,
	)
}

// Logout revokes the presented refresh token server-side.
func (h *Handler) Logout(ctx *gin.Context) {

	var request RefreshRequest

	if err := ctx.ShouldBindJSON(&request); err != nil {
		apphttp.BadRequest(
			ctx,
			"invalid request payload",
		)
		return
	}

	if err := h.service.Logout(
		ctx.Request.Context(),
		request.RefreshToken,
	); err != nil {
		apphttp.InternalServerError(ctx)
		return
	}

	apphttp.Success(
		ctx,
		"logged out successfully",
		nil,
	)
}

// Me returns the currently authenticated user.
func (h *Handler) Me(ctx *gin.Context) {

	userID, ok := middleware.UserID(ctx)

	if !ok {
		apphttp.Unauthorized(
			ctx,
			"authentication required",
		)
		return
	}

	user, err := h.service.Me(
		ctx.Request.Context(),
		userID,
	)

	if err != nil {
		apphttp.InternalServerError(ctx)
		return
	}

	response := UserResponse{
		ID:        user.ID.String(),
		Email:     user.Email,
		CreatedAt: user.CreatedAt,
	}

	apphttp.Success(
		ctx,
		"current user retrieved successfully",
		response,
	)
}

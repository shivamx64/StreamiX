package users

import (
	"github.com/gin-gonic/gin"

	apphttp "github.com/shivamx64/streamix/internal/http"
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

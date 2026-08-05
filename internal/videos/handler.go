package videos

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"

	apphttp "github.com/shivamx64/streamix/internal/http"
	"github.com/shivamx64/streamix/internal/middleware"
)

const maxUploadSize = 2 << 30 // 2GB

// Handler handles video HTTP requests.
type Handler struct {
	service Service
}

// NewHandler creates a new video handler.
func NewHandler(service Service) *Handler {
	return &Handler{
		service: service,
	}
}

// Upload handles video file uploads.
func (h *Handler) Upload(ctx *gin.Context) {

	userID, ok := middleware.UserID(ctx)
	if !ok {
		apphttp.Unauthorized(ctx, "authentication required")
		return
	}

	ctx.Request.Body = http.MaxBytesReader(
		ctx.Writer,
		ctx.Request.Body,
		maxUploadSize,
	)

	fileHeader, err := ctx.FormFile("file")
	if err != nil {
		apphttp.BadRequest(ctx, "file is required")
		return
	}

	file, err := fileHeader.Open()
	if err != nil {
		apphttp.BadRequest(ctx, "unable to read uploaded file")
		return
	}
	defer file.Close()

	video, err := h.service.Upload(
		ctx.Request.Context(),
		userID,
		fileHeader.Filename,
		fileHeader.Header.Get("Content-Type"),
		file,
	)
	if err != nil {
		switch {
		case errors.Is(err, ErrInvalidVideo):
			apphttp.BadRequest(ctx, "invalid video file")
		default:
			apphttp.InternalServerError(ctx)
		}
		return
	}

	apphttp.Created(
		ctx,
		"video uploaded successfully",
		VideoStatusResponse{
			ID:     video.ID.String(),
			Status: video.Status,
		},
	)
}

// List returns all videos belonging to the authenticated user.
func (h *Handler) List(ctx *gin.Context) {

	userID, ok := middleware.UserID(ctx)
	if !ok {
		apphttp.Unauthorized(ctx, "authentication required")
		return
	}

	videos, err := h.service.ListByUser(
		ctx.Request.Context(),
		userID,
	)
	if err != nil {
		apphttp.InternalServerError(ctx)
		return
	}

	responses := make([]VideoResponse, 0, len(videos))
	for i := range videos {
		responses = append(responses, toResponse(&videos[i]))
	}

	apphttp.Success(
		ctx,
		"videos retrieved successfully",
		responses,
	)
}

// Get returns a single video belonging to the authenticated user.
func (h *Handler) Get(ctx *gin.Context) {

	userID, ok := middleware.UserID(ctx)
	if !ok {
		apphttp.Unauthorized(ctx, "authentication required")
		return
	}

	video, err := h.service.GetByID(
		ctx.Request.Context(),
		userID,
		ctx.Param("id"),
	)
	if err != nil {
		switch {
		case errors.Is(err, ErrNotFound):
			apphttp.NotFound(ctx, "video not found")
		case errors.Is(err, ErrForbidden):
			apphttp.Forbidden(ctx, "video does not belong to user")
		default:
			apphttp.InternalServerError(ctx)
		}
		return
	}

	apphttp.Success(
		ctx,
		"video retrieved successfully",
		toResponse(video),
	)
}

// Status returns the processing status of a video.
func (h *Handler) Status(ctx *gin.Context) {

	userID, ok := middleware.UserID(ctx)
	if !ok {
		apphttp.Unauthorized(ctx, "authentication required")
		return
	}

	video, err := h.service.GetByID(
		ctx.Request.Context(),
		userID,
		ctx.Param("id"),
	)
	if err != nil {
		switch {
		case errors.Is(err, ErrNotFound):
			apphttp.NotFound(ctx, "video not found")
		case errors.Is(err, ErrForbidden):
			apphttp.Forbidden(ctx, "video does not belong to user")
		default:
			apphttp.InternalServerError(ctx)
		}
		return
	}

	apphttp.Success(
		ctx,
		"video status retrieved successfully",
		VideoStatusResponse{
			ID:     video.ID.String(),
			Status: video.Status,
		},
	)
}

// Delete removes a video belonging to the authenticated user.
func (h *Handler) Delete(ctx *gin.Context) {

	userID, ok := middleware.UserID(ctx)
	if !ok {
		apphttp.Unauthorized(ctx, "authentication required")
		return
	}

	err := h.service.Delete(
		ctx.Request.Context(),
		userID,
		ctx.Param("id"),
	)
	if err != nil {
		switch {
		case errors.Is(err, ErrNotFound):
			apphttp.NotFound(ctx, "video not found")
		case errors.Is(err, ErrForbidden):
			apphttp.Forbidden(ctx, "video does not belong to user")
		default:
			apphttp.InternalServerError(ctx)
		}
		return
	}

	apphttp.NoContent(ctx)
}

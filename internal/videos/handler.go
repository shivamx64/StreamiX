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
		case errors.Is(err, ErrQueueUnavailable):
			apphttp.ServiceUnavailable(
				ctx,
				"video processing queue is unavailable; please retry",
			)
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

// Thumbnail streams the generated poster image for a completed video.
func (h *Handler) Thumbnail(ctx *gin.Context) {

	userID, ok := middleware.UserID(ctx)
	if !ok {
		apphttp.Unauthorized(ctx, "authentication required")
		return
	}

	media, err := h.service.OpenThumbnail(
		ctx.Request.Context(),
		userID,
		ctx.Param("id"),
	)

	h.serveMedia(ctx, media, err)
}

// HLS streams a playlist or segment from a completed video's HLS output.
func (h *Handler) HLS(ctx *gin.Context) {

	userID, ok := middleware.UserID(ctx)
	if !ok {
		apphttp.Unauthorized(ctx, "authentication required")
		return
	}

	media, err := h.service.OpenHLS(
		ctx.Request.Context(),
		userID,
		ctx.Param("id"),
		ctx.Param("path"),
	)

	h.serveMedia(ctx, media, err)
}

// serveMedia writes an opened media object or maps its error to HTTP.
func (h *Handler) serveMedia(
	ctx *gin.Context,
	media *MediaFile,
	err error,
) {
	if err != nil {
		switch {
		case errors.Is(err, ErrNotFound):
			apphttp.NotFound(ctx, "media not available")
		case errors.Is(err, ErrForbidden):
			apphttp.Forbidden(ctx, "video does not belong to user")
		default:
			apphttp.InternalServerError(ctx)
		}
		return
	}

	defer media.Content.Close()

	ctx.DataFromReader(
		http.StatusOK,
		-1,
		media.ContentType,
		media.Content,
		map[string]string{
			"Cache-Control":          "private, max-age=3600",
			"X-Content-Type-Options": "nosniff",
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

package videos

import (
	"errors"
	"strings"

	"github.com/gin-gonic/gin"

	"github.com/shivamx64/streamix/internal/auth"
	apphttp "github.com/shivamx64/streamix/internal/http"
	"github.com/shivamx64/streamix/internal/middleware"
)

const playbackPathPrefix = "/playback/"

// PlaybackHandler exposes short-lived signed URLs for media playback.
type PlaybackHandler struct {
	service Service
	tokens  *auth.TokenManager
}

// NewPlaybackHandler creates a playback handler.
func NewPlaybackHandler(
	service Service,
	tokens *auth.TokenManager,
) *PlaybackHandler {
	return &PlaybackHandler{
		service: service,
		tokens:  tokens,
	}
}

// Session issues a video-scoped playback token for the authenticated
// owner. The returned media paths can be used without an Authorization
// header until the token expires.
func (h *PlaybackHandler) Session(ctx *gin.Context) {

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

	if video.Status != StatusCompleted || video.HLSMasterKey == "" {
		apphttp.Conflict(ctx, "video is not ready for playback")
		return
	}

	if h.tokens == nil {
		apphttp.InternalServerError(ctx)
		return
	}

	token, expiresAt, err := h.tokens.GeneratePlaybackToken(
		userID,
		video.ID.String(),
	)
	if err != nil {
		apphttp.InternalServerError(ctx)
		return
	}

	ctx.Header("Cache-Control", "no-store")

	apphttp.Success(
		ctx,
		"playback session created",
		PlaybackSessionResponse{
			Token:        token,
			ExpiresAt:    expiresAt,
			HLSURL:       playbackPathPrefix + token + "/hls/master.m3u8",
			ThumbnailURL: playbackPathPrefix + token + "/thumbnail",
		},
	)
}

// HLS streams a playlist or segment through a signed playback token.
func (h *PlaybackHandler) HLS(ctx *gin.Context) {

	claims, ok := h.claims(ctx)
	if !ok {
		return
	}

	media, err := h.service.OpenHLS(
		ctx.Request.Context(),
		claims.UserID,
		claims.VideoID,
		ctx.Param("path"),
	)

	serveMedia(ctx, media, err)
}

// Thumbnail streams a poster through a signed playback token.
func (h *PlaybackHandler) Thumbnail(ctx *gin.Context) {

	claims, ok := h.claims(ctx)
	if !ok {
		return
	}

	media, err := h.service.OpenThumbnail(
		ctx.Request.Context(),
		claims.UserID,
		claims.VideoID,
	)

	serveMedia(ctx, media, err)
}

// claims validates the playback token in the URL path.
func (h *PlaybackHandler) claims(
	ctx *gin.Context,
) (*auth.Claims, bool) {

	if h.tokens == nil {
		apphttp.InternalServerError(ctx)
		return nil, false
	}

	claims, err := h.tokens.ValidatePlaybackToken(
		strings.TrimSpace(ctx.Param("token")),
	)
	if err != nil {
		apphttp.Unauthorized(ctx, "invalid or expired playback token")
		return nil, false
	}

	return claims, true
}

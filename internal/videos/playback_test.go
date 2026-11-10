package videos

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/shivamx64/streamix/internal/auth"
	"github.com/shivamx64/streamix/internal/config"
	"github.com/shivamx64/streamix/internal/middleware"
)

const playbackTestUserID = "11111111-1111-1111-1111-111111111111"

func newPlaybackTestManager(t *testing.T, ttl time.Duration) *auth.TokenManager {
	t.Helper()

	return auth.NewTokenManager(config.AuthConfig{
		JWTSecret:        "test-secret-that-is-long-enough-for-hs256",
		PlaybackTokenTTL: ttl,
	})
}

func newPlaybackRouter(
	service Service,
	tokens *auth.TokenManager,
) *gin.Engine {

	gin.SetMode(gin.TestMode)

	router := gin.New()
	router.Use(func(ctx *gin.Context) {
		middleware.SetUserID(ctx, playbackTestUserID)
	})

	handler := NewPlaybackHandler(service, tokens)

	router.GET("/videos/:id/playback", handler.Session)
	router.GET("/playback/:token/hls/*path", handler.HLS)
	router.GET("/playback/:token/thumbnail", handler.Thumbnail)

	return router
}

func TestPlaybackSessionIssuesScopedURLs(t *testing.T) {
	video := newCompletedVideoFixture()
	video.UserID = uuid.MustParse(playbackTestUserID)
	service := &stubService{video: video}
	tokens := newPlaybackTestManager(t, time.Hour)

	request := httptest.NewRequest(
		http.MethodGet,
		"/videos/"+video.ID.String()+"/playback",
		nil,
	)
	response := httptest.NewRecorder()

	newPlaybackRouter(service, tokens).ServeHTTP(response, request)

	if response.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", response.Code, http.StatusOK)
	}

	if got := response.Header().Get("Cache-Control"); got != "no-store" {
		t.Errorf("Cache-Control = %q, want no-store", got)
	}

	var envelope struct {
		Data PlaybackSessionResponse `json:"data"`
	}
	if err := json.Unmarshal(response.Body.Bytes(), &envelope); err != nil {
		t.Fatalf("decode response: %v", err)
	}

	session := envelope.Data
	claims, err := tokens.ValidatePlaybackToken(session.Token)
	if err != nil {
		t.Fatalf("ValidatePlaybackToken() error = %v", err)
	}

	if claims.UserID != video.UserID.String() {
		t.Errorf("token user = %q, want %q", claims.UserID, video.UserID)
	}

	if claims.VideoID != video.ID.String() {
		t.Errorf("token video = %q, want %q", claims.VideoID, video.ID)
	}

	if want := playbackPathPrefix + session.Token + "/hls/master.m3u8"; session.HLSURL != want {
		t.Errorf("HLSURL = %q, want %q", session.HLSURL, want)
	}

	if want := playbackPathPrefix + session.Token + "/thumbnail"; session.ThumbnailURL != want {
		t.Errorf("ThumbnailURL = %q, want %q", session.ThumbnailURL, want)
	}
}

func TestPlaybackSessionRequiresCompletedVideo(t *testing.T) {
	video := newCompletedVideoFixture()
	video.Status = StatusProcessing

	request := httptest.NewRequest(
		http.MethodGet,
		"/videos/"+video.ID.String()+"/playback",
		nil,
	)
	response := httptest.NewRecorder()

	newPlaybackRouter(
		&stubService{video: video},
		newPlaybackTestManager(t, time.Hour),
	).ServeHTTP(response, request)

	if response.Code != http.StatusConflict {
		t.Fatalf("status = %d, want %d", response.Code, http.StatusConflict)
	}
}

func TestSignedHLSStreamsWithPlaybackToken(t *testing.T) {
	video := newCompletedVideoFixture()
	service := &stubService{
		hls: &MediaFile{
			Content:     io.NopCloser(strings.NewReader("#EXTM3U")),
			ContentType: "application/vnd.apple.mpegurl",
		},
	}
	tokens := newPlaybackTestManager(t, time.Hour)

	token, _, err := tokens.GeneratePlaybackToken(
		video.UserID.String(),
		video.ID.String(),
	)
	if err != nil {
		t.Fatalf("GeneratePlaybackToken() error = %v", err)
	}

	request := httptest.NewRequest(
		http.MethodGet,
		"/playback/"+token+"/hls/720p/index.m3u8",
		nil,
	)
	response := httptest.NewRecorder()

	newPlaybackRouter(service, tokens).ServeHTTP(response, request)

	if response.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", response.Code, http.StatusOK)
	}

	if service.hlsPath != "/720p/index.m3u8" {
		t.Errorf("OpenHLS() path = %q, want /720p/index.m3u8", service.hlsPath)
	}

	if service.hlsUserID != video.UserID.String() {
		t.Errorf("OpenHLS() user = %q, want %q", service.hlsUserID, video.UserID)
	}

	if service.hlsVideo != video.ID.String() {
		t.Errorf("OpenHLS() video = %q, want %q", service.hlsVideo, video.ID)
	}
}

func TestSignedThumbnailStreamsWithPlaybackToken(t *testing.T) {
	video := newCompletedVideoFixture()
	service := &stubService{
		thumbnail: &MediaFile{
			Content:     io.NopCloser(strings.NewReader("image-bytes")),
			ContentType: "image/jpeg",
		},
	}
	tokens := newPlaybackTestManager(t, time.Hour)

	token, _, err := tokens.GeneratePlaybackToken(
		video.UserID.String(),
		video.ID.String(),
	)
	if err != nil {
		t.Fatalf("GeneratePlaybackToken() error = %v", err)
	}

	request := httptest.NewRequest(
		http.MethodGet,
		"/playback/"+token+"/thumbnail",
		nil,
	)
	response := httptest.NewRecorder()

	newPlaybackRouter(service, tokens).ServeHTTP(response, request)

	if response.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", response.Code, http.StatusOK)
	}

	if got := response.Body.String(); got != "image-bytes" {
		t.Errorf("body = %q, want image-bytes", got)
	}
}

func TestSignedPlaybackRejectsInvalidAndExpiredTokens(t *testing.T) {
	tests := []struct {
		name  string
		token string
	}{
		{name: "invalid", token: "not-a-token"},
	}

	video := newCompletedVideoFixture()
	expiredManager := newPlaybackTestManager(t, -time.Minute)
	expiredToken, _, err := expiredManager.GeneratePlaybackToken(
		video.UserID.String(),
		video.ID.String(),
	)
	if err != nil {
		t.Fatalf("GeneratePlaybackToken() error = %v", err)
	}
	tests = append(tests, struct {
		name  string
		token string
	}{name: "expired", token: expiredToken})

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			service := &stubService{}
			request := httptest.NewRequest(
				http.MethodGet,
				"/playback/"+test.token+"/hls/master.m3u8",
				nil,
			)
			response := httptest.NewRecorder()

			newPlaybackRouter(
				service,
				newPlaybackTestManager(t, time.Hour),
			).ServeHTTP(response, request)

			if response.Code != http.StatusUnauthorized {
				t.Errorf("status = %d, want %d", response.Code, http.StatusUnauthorized)
			}

			if service.hlsPath != "" {
				t.Errorf("media opened with invalid token: %q", service.hlsPath)
			}
		})
	}
}

func TestPlaybackSessionMapsOwnerErrors(t *testing.T) {
	tests := []struct {
		name string
		err  error
		want int
	}{
		{name: "not found", err: ErrNotFound, want: http.StatusNotFound},
		{name: "forbidden", err: ErrForbidden, want: http.StatusForbidden},
		{name: "internal", err: context.Canceled, want: http.StatusInternalServerError},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			request := httptest.NewRequest(
				http.MethodGet,
				"/videos/video-id/playback",
				nil,
			)
			response := httptest.NewRecorder()

			newPlaybackRouter(
				&stubService{getErr: test.err},
				newPlaybackTestManager(t, time.Hour),
			).ServeHTTP(response, request)

			if response.Code != test.want {
				t.Errorf("status = %d, want %d", response.Code, test.want)
			}
		})
	}
}

package videos

import (
	"context"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"

	"github.com/shivamx64/streamix/internal/middleware"
)

type stubService struct {
	video        *Video
	getErr       error
	thumbnail    *MediaFile
	thumbnailErr error

	hls       *MediaFile
	hlsErr    error
	hlsPath   string
	hlsUserID string
	hlsVideo  string
}

func (s *stubService) Upload(
	ctx context.Context,
	userID string,
	filename string,
	mimeType string,
	reader io.Reader,
) (*Video, error) {
	return nil, nil
}

func (s *stubService) ListByUser(
	ctx context.Context,
	userID string,
) ([]Video, error) {
	return nil, nil
}

func (s *stubService) GetByID(
	ctx context.Context,
	userID string,
	videoID string,
) (*Video, error) {
	return s.video, s.getErr
}

func (s *stubService) Delete(
	ctx context.Context,
	userID string,
	videoID string,
) error {
	return nil
}

func (s *stubService) OpenThumbnail(
	ctx context.Context,
	userID string,
	videoID string,
) (*MediaFile, error) {
	return s.thumbnail, s.thumbnailErr
}

func (s *stubService) OpenHLS(
	ctx context.Context,
	userID string,
	videoID string,
	relativePath string,
) (*MediaFile, error) {
	s.hlsPath = relativePath
	s.hlsUserID = userID
	s.hlsVideo = videoID

	return s.hls, s.hlsErr
}

func newMediaRouter(service Service) *gin.Engine {
	gin.SetMode(gin.TestMode)

	router := gin.New()
	router.Use(func(ctx *gin.Context) {
		middleware.SetUserID(ctx, "owner-id")
	})

	handler := NewHandler(service)

	router.GET("/videos/:id/thumbnail", handler.Thumbnail)
	router.GET("/videos/:id/hls/*path", handler.HLS)

	return router
}

func TestThumbnailStreamsMedia(t *testing.T) {
	service := &stubService{
		thumbnail: &MediaFile{
			Content:     io.NopCloser(strings.NewReader("image-bytes")),
			ContentType: "image/jpeg",
		},
	}

	request := httptest.NewRequest(
		http.MethodGet,
		"/videos/video-id/thumbnail",
		nil,
	)
	response := httptest.NewRecorder()

	newMediaRouter(service).ServeHTTP(response, request)

	if response.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", response.Code, http.StatusOK)
	}

	if got := response.Header().Get("Content-Type"); got != "image/jpeg" {
		t.Errorf("Content-Type = %q, want image/jpeg", got)
	}

	if got := response.Body.String(); got != "image-bytes" {
		t.Errorf("body = %q, want image-bytes", got)
	}
}

func TestHLSStreamsMediaAndPassesPath(t *testing.T) {
	service := &stubService{
		hls: &MediaFile{
			Content:     io.NopCloser(strings.NewReader("#EXTM3U")),
			ContentType: "application/vnd.apple.mpegurl",
		},
	}

	request := httptest.NewRequest(
		http.MethodGet,
		"/videos/video-id/hls/720p/index.m3u8",
		nil,
	)
	response := httptest.NewRecorder()

	newMediaRouter(service).ServeHTTP(response, request)

	if response.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", response.Code, http.StatusOK)
	}

	if service.hlsPath != "/720p/index.m3u8" {
		t.Errorf("OpenHLS() path = %q, want /720p/index.m3u8", service.hlsPath)
	}

	if service.hlsUserID != "owner-id" {
		t.Errorf("OpenHLS() user = %q, want owner-id", service.hlsUserID)
	}

	if service.hlsVideo != "video-id" {
		t.Errorf("OpenHLS() video = %q, want video-id", service.hlsVideo)
	}
}

func TestMediaErrorsMapToHTTP(t *testing.T) {
	tests := []struct {
		name string
		err  error
		want int
	}{
		{name: "not found", err: ErrNotFound, want: http.StatusNotFound},
		{name: "forbidden", err: ErrForbidden, want: http.StatusForbidden},
		{name: "internal", err: errBoom, want: http.StatusInternalServerError},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			service := &stubService{thumbnailErr: test.err}

			request := httptest.NewRequest(
				http.MethodGet,
				"/videos/video-id/thumbnail",
				nil,
			)
			response := httptest.NewRecorder()

			newMediaRouter(service).ServeHTTP(response, request)

			if response.Code != test.want {
				t.Errorf("status = %d, want %d", response.Code, test.want)
			}
		})
	}
}

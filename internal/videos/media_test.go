package videos

import (
	"context"
	"errors"
	"io"
	"path"
	"testing"

	"github.com/shivamx64/streamix/internal/storage"
)

func TestOpenThumbnailServesStoredImage(t *testing.T) {
	ctx := context.Background()

	video := newCompletedVideoFixture()
	repo := &mockRepository{findResult: video}
	store := &mockStorage{openContent: "thumbnail-bytes"}

	service := newTestService(repo, store, nil)

	media, err := service.OpenThumbnail(
		ctx,
		video.UserID.String(),
		video.ID.String(),
	)
	if err != nil {
		t.Fatalf("OpenThumbnail() error = %v", err)
	}
	defer media.Content.Close()

	if store.openedKey != video.ThumbnailKey {
		t.Errorf("OpenThumbnail() opened %q, want %q", store.openedKey, video.ThumbnailKey)
	}

	if media.ContentType != "image/jpeg" {
		t.Errorf("OpenThumbnail() content type = %q, want image/jpeg", media.ContentType)
	}

	content, err := io.ReadAll(media.Content)
	if err != nil {
		t.Fatalf("read thumbnail content: %v", err)
	}

	if string(content) != "thumbnail-bytes" {
		t.Errorf("OpenThumbnail() content = %q, want %q", content, "thumbnail-bytes")
	}
}

func TestOpenHLSMapsNestedFiles(t *testing.T) {
	ctx := context.Background()

	video := newCompletedVideoFixture()
	repo := &mockRepository{findResult: video}
	store := &mockStorage{openContent: "playlist"}

	service := newTestService(repo, store, nil)

	media, err := service.OpenHLS(
		ctx,
		video.UserID.String(),
		video.ID.String(),
		"/720p/index.m3u8",
	)
	if err != nil {
		t.Fatalf("OpenHLS() error = %v", err)
	}
	defer media.Content.Close()

	wantKey := path.Join(
		path.Dir(video.HLSMasterKey),
		"720p",
		"index.m3u8",
	)

	if store.openedKey != wantKey {
		t.Errorf("OpenHLS() opened %q, want %q", store.openedKey, wantKey)
	}

	if media.ContentType != "application/vnd.apple.mpegurl" {
		t.Errorf("OpenHLS() content type = %q, want HLS playlist", media.ContentType)
	}
}

func TestOpenHLSRejectsTraversal(t *testing.T) {
	ctx := context.Background()

	paths := []string{
		"",
		"/",
		"../source.mp4",
		"../../etc/passwd",
		"720p/../master.m3u8",
		`..\source.mp4`,
		"720p//index.m3u8",
	}

	for _, requested := range paths {
		t.Run(requested, func(t *testing.T) {
			video := newCompletedVideoFixture()
			repo := &mockRepository{findResult: video}
			store := &mockStorage{}

			service := newTestService(repo, store, nil)

			_, err := service.OpenHLS(
				ctx,
				video.UserID.String(),
				video.ID.String(),
				requested,
			)
			if !errors.Is(err, ErrNotFound) {
				t.Fatalf("OpenHLS(%q) error = %v, want ErrNotFound", requested, err)
			}

			if store.openedKey != "" {
				t.Errorf("OpenHLS(%q) opened %q, want no storage access", requested, store.openedKey)
			}
		})
	}
}

func TestOpenMediaRequiresCompletedVideo(t *testing.T) {
	ctx := context.Background()

	video := newCompletedVideoFixture()
	video.Status = StatusProcessing

	repo := &mockRepository{findResult: video}
	store := &mockStorage{}

	service := newTestService(repo, store, nil)

	if _, err := service.OpenThumbnail(
		ctx,
		video.UserID.String(),
		video.ID.String(),
	); !errors.Is(err, ErrNotFound) {
		t.Fatalf("OpenThumbnail() error = %v, want ErrNotFound", err)
	}

	if _, err := service.OpenHLS(
		ctx,
		video.UserID.String(),
		video.ID.String(),
		"master.m3u8",
	); !errors.Is(err, ErrNotFound) {
		t.Fatalf("OpenHLS() error = %v, want ErrNotFound", err)
	}

	if store.openedKey != "" {
		t.Errorf("media opened %q for an unfinished video", store.openedKey)
	}
}

func TestOpenMediaRequiresOwnership(t *testing.T) {
	ctx := context.Background()

	video := newCompletedVideoFixture()
	repo := &mockRepository{findResult: video}
	store := &mockStorage{}

	service := newTestService(repo, store, nil)

	if _, err := service.OpenThumbnail(
		ctx,
		mustUUIDString(),
		video.ID.String(),
	); !errors.Is(err, ErrForbidden) {
		t.Fatalf("OpenThumbnail() error = %v, want ErrForbidden", err)
	}

	if store.openedKey != "" {
		t.Errorf("media opened %q for a non-owner", store.openedKey)
	}
}

func TestOpenMediaMapsMissingStorageObject(t *testing.T) {
	ctx := context.Background()

	video := newCompletedVideoFixture()
	repo := &mockRepository{findResult: video}
	store := &mockStorage{openErr: storage.ErrFileNotFound}

	service := newTestService(repo, store, nil)

	if _, err := service.OpenThumbnail(
		ctx,
		video.UserID.String(),
		video.ID.String(),
	); !errors.Is(err, ErrNotFound) {
		t.Fatalf("OpenThumbnail() error = %v, want ErrNotFound", err)
	}
}

func TestMediaContentType(t *testing.T) {
	tests := map[string]string{
		"master.m3u8":    "application/vnd.apple.mpegurl",
		"segment_001.ts": "video/mp2t",
		"thumbnail.jpg":  "image/jpeg",
		"poster.PNG":     "image/png",
		"captions.vtt":   "text/vtt",
		"source.mp4":     "application/octet-stream",
	}

	for key, want := range tests {
		if got := mediaContentType(key); got != want {
			t.Errorf("mediaContentType(%q) = %q, want %q", key, got, want)
		}
	}
}

func newCompletedVideoFixture() *Video {
	video := newVideoFixture()
	video.Status = StatusCompleted
	video.HLSMasterKey = path.Join(
		video.UserID.String(),
		video.ID.String(),
		"hls",
		"master.m3u8",
	)
	video.ThumbnailKey = path.Join(
		video.UserID.String(),
		video.ID.String(),
		"thumbnail.jpg",
	)

	return video
}

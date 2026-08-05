package videos

import (
	"context"
	"io"
	"path/filepath"

	"github.com/google/uuid"
	"github.com/shivamx64/streamix/internal/storage"
)

// Service defines video business operations.
type Service interface {
	Upload(
		ctx context.Context,
		userID string,
		filename string,
		mimeType string,
		reader io.Reader,
	) (*Video, error)

	ListByUser(
		ctx context.Context,
		userID string,
	) ([]Video, error)

	GetByID(
		ctx context.Context,
		userID string,
		videoID string,
	) (*Video, error)

	Delete(
		ctx context.Context,
		userID string,
		videoID string,
	) error
}

type service struct {
	repository Repository
	storage    storage.Storage
	queue      JobQueue
}

// NewService creates a video service.
func NewService(
	repository Repository,
	storageBackend storage.Storage,
	queue JobQueue,
) Service {
	return &service{
		repository: repository,
		storage:    storageBackend,
		queue:      queue,
	}
}

// Upload stores a video file and creates its database record.
func (s *service) Upload(
	ctx context.Context,
	userID string,
	filename string,
	mimeType string,
	reader io.Reader,
) (*Video, error) {

	video := &Video{
		ID:               uuid.New(),
		UserID:           uuid.MustParse(userID),
		OriginalFilename: filepath.Base(filename),
		MimeType:         mimeType,
		Status:           StatusUploaded,
	}

	video.StorageKey = filepath.Join(
		userID,
		video.ID.String(),
		video.OriginalFilename,
	)

	file, err := s.storage.Save(
		ctx,
		video.StorageKey,
		reader,
	)
	if err != nil {
		return nil, err
	}

	video.Size = file.Size

	err = s.repository.Create(ctx, video)
	if err != nil {
		// Roll back the stored file so we do not leak orphaned objects.
		_ = s.storage.Delete(ctx, video.StorageKey)
		return nil, err
	}

	// Queue the video for transcoding. A temporary failure to publish
	// is non-fatal so the upload itself still succeeds; the video
	// remains in the uploaded state until retried.
	if s.queue != nil {
		err = s.queue.Enqueue(ctx, Job{
			VideoID:    video.ID.String(),
			UserID:     userID,
			StorageKey: video.StorageKey,
			Filename:   video.OriginalFilename,
		})
		if err == nil {
			video.Status = StatusQueued
			_ = s.repository.SetStatus(ctx, video.ID.String(), StatusQueued)
		}
	}

	return video, nil
}

// ListByUser returns all videos belonging to a user.
func (s *service) ListByUser(
	ctx context.Context,
	userID string,
) ([]Video, error) {

	return s.repository.ListByUser(ctx, userID)
}

// GetByID retrieves a video and verifies ownership.
func (s *service) GetByID(
	ctx context.Context,
	userID string,
	videoID string,
) (*Video, error) {

	video, err := s.repository.FindByID(ctx, videoID)
	if err != nil {
		return nil, err
	}

	if video.UserID.String() != userID {
		return nil, ErrForbidden
	}

	return video, nil
}

// Delete removes a video and its stored file.
func (s *service) Delete(
	ctx context.Context,
	userID string,
	videoID string,
) error {

	video, err := s.GetByID(ctx, userID, videoID)
	if err != nil {
		return err
	}

	if err := s.storage.Delete(ctx, video.StorageKey); err != nil {
		return err
	}

	return s.repository.Delete(ctx, video.ID.String())
}

package videos

import (
	"context"
	"errors"
	"fmt"
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

	OpenThumbnail(
		ctx context.Context,
		userID string,
		videoID string,
	) (*MediaFile, error)

	OpenHLS(
		ctx context.Context,
		userID string,
		videoID string,
		relativePath string,
	) (*MediaFile, error)
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

	if s.queue == nil {
		return nil, ErrQueueUnavailable
	}

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
		rollbackErr := s.storage.Delete(ctx, video.StorageKey)

		if rollbackErr != nil && !errors.Is(rollbackErr, storage.ErrFileNotFound) {
			return nil, errors.Join(
				err,
				fmt.Errorf("roll back stored object: %w", rollbackErr),
			)
		}

		return nil, err
	}

	// Mark the video queued before publishing. This keeps the worker
	// from observing an uploaded record and lets a fast worker finish
	// processing without a late status update overwriting it.
	if err := s.repository.TransitionStatus(
		ctx,
		video.ID.String(),
		[]Status{StatusUploaded},
		StatusQueued,
	); err != nil {
		return nil, s.rollbackUpload(
			ctx,
			video,
			fmt.Errorf("mark video queued: %w", err),
		)
	}

	video.Status = StatusQueued

	if err := s.queue.Enqueue(ctx, Job{
		VideoID:    video.ID.String(),
		UserID:     userID,
		StorageKey: video.StorageKey,
		Filename:   video.OriginalFilename,
	}); err != nil {
		return nil, s.rollbackUpload(
			ctx,
			video,
			errors.Join(
				ErrQueueUnavailable,
				fmt.Errorf("enqueue video: %w", err),
			),
		)
	}

	return video, nil
}

// rollbackUpload removes the video record and stored source after a
// failed upload, preserving the original failure for error matching.
func (s *service) rollbackUpload(
	ctx context.Context,
	video *Video,
	cause error,
) error {

	var rollbackErrors []error

	if err := s.repository.Delete(
		ctx,
		video.ID.String(),
	); err != nil {
		rollbackErrors = append(
			rollbackErrors,
			fmt.Errorf("delete video record: %w", err),
		)
	}

	if err := s.storage.Delete(
		ctx,
		video.StorageKey,
	); err != nil && !errors.Is(err, storage.ErrFileNotFound) {
		rollbackErrors = append(
			rollbackErrors,
			fmt.Errorf("delete stored object: %w", err),
		)
	}

	if len(rollbackErrors) == 0 {
		return cause
	}

	return errors.Join(
		append([]error{cause}, rollbackErrors...)...,
	)
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

package videos

import (
	"context"
	"errors"

	"gorm.io/gorm"
)

// Repository defines database operations for videos.
type Repository interface {
	Create(ctx context.Context, video *Video) error

	FindByID(
		ctx context.Context,
		id string,
	) (*Video, error)

	ListByUser(
		ctx context.Context,
		userID string,
	) ([]Video, error)

	TransitionStatus(
		ctx context.Context,
		id string,
		from []Status,
		to Status,
	) error

	SetCompleted(
		ctx context.Context,
		id string,
		result ProcessingResult,
	) error

	SetFailed(
		ctx context.Context,
		id string,
		processingError string,
	) error

	Delete(
		ctx context.Context,
		id string,
	) error
}

type repository struct {
	db *gorm.DB
}

// NewRepository creates a new video repository.
func NewRepository(db *gorm.DB) Repository {
	return &repository{
		db: db,
	}
}

// Create stores a video in the database.
func (r *repository) Create(
	ctx context.Context,
	video *Video,
) error {

	return r.db.
		WithContext(ctx).
		Create(video).
		Error
}

// FindByID retrieves a video by its ID.
func (r *repository) FindByID(
	ctx context.Context,
	id string,
) (*Video, error) {

	var video Video

	err := r.db.
		WithContext(ctx).
		First(&video, "id = ?", id).
		Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, ErrNotFound
	}

	if err != nil {
		return nil, err
	}

	return &video, nil
}

// ListByUser retrieves all videos belonging to a user.
func (r *repository) ListByUser(
	ctx context.Context,
	userID string,
) ([]Video, error) {

	var videos []Video

	err := r.db.
		WithContext(ctx).
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&videos).
		Error

	if err != nil {
		return nil, err
	}

	return videos, nil
}

// TransitionStatus atomically changes a video's status when it currently
// has one of the allowed source statuses.
func (r *repository) TransitionStatus(
	ctx context.Context,
	id string,
	from []Status,
	to Status,
) error {

	result := r.db.
		WithContext(ctx).
		Model(&Video{}).
		Where("id = ? AND status IN ?", id, from).
		Update("status", to)

	return requireAffectedRow(result)
}

// SetCompleted persists transcode outputs and marks the video completed.
// It only applies while the video is processing so stale jobs cannot
// overwrite a terminal state.
func (r *repository) SetCompleted(
	ctx context.Context,
	id string,
	result ProcessingResult,
) error {

	update := r.db.
		WithContext(ctx).
		Model(&Video{}).
		Where("id = ? AND status = ?", id, StatusProcessing).
		Updates(map[string]any{
			"status":           StatusCompleted,
			"duration_seconds": result.DurationSeconds,
			"width":            result.Width,
			"height":           result.Height,
			"hls_master_key":   result.HLSMasterKey,
			"thumbnail_key":    result.ThumbnailKey,
			"renditions":       result.Renditions,
			"processing_error": nil,
			"completed_at":     result.CompletedAt,
		})

	return requireAffectedRow(update)
}

// SetFailed marks the video failed and records the processing error.
// It only applies to queued or processing videos.
func (r *repository) SetFailed(
	ctx context.Context,
	id string,
	processingError string,
) error {

	update := r.db.
		WithContext(ctx).
		Model(&Video{}).
		Where("id = ? AND status IN ?", id, []Status{
			StatusQueued,
			StatusProcessing,
		}).
		Updates(map[string]any{
			"status":           StatusFailed,
			"processing_error": processingError,
			"completed_at":     nil,
		})

	return requireAffectedRow(update)
}

// requireAffectedRow reports a transition conflict when no record matched
// the guarded update.
func requireAffectedRow(result *gorm.DB) error {
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return ErrInvalidTransition
	}

	return nil
}

// Delete removes a video record by its ID.
func (r *repository) Delete(
	ctx context.Context,
	id string,
) error {

	return r.db.
		WithContext(ctx).
		Delete(&Video{}, "id = ?", id).
		Error
}

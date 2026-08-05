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

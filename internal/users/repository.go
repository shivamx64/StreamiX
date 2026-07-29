package users

import (
	"context"
	"errors"

	"gorm.io/gorm"
)

// Repository defines database operations for users.
type Repository interface {
	Create(ctx context.Context, user *User) error
	FindByEmail(ctx context.Context, email string) (*User, error)
	FindByID(ctx context.Context, id string) (*User, error)
}

type repository struct {
	db *gorm.DB
}

// NewRepository creates a new user repository.
func NewRepository(db *gorm.DB) Repository {
	return &repository{
		db: db,
	}
}

// Create stores a user in database.
func (r *repository) Create(
	ctx context.Context,
	user *User,
) error {

	err := r.db.
		WithContext(ctx).
		Create(user).
		Error

	if err != nil {
		return err
	}

	return nil
}

// FindByEmail retrieves a user by email.
func (r *repository) FindByEmail(
	ctx context.Context,
	email string,
) (*User, error) {

	var user User

	err := r.db.
		WithContext(ctx).
		Where("email = ?", email).
		First(&user).
		Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, ErrNotFound
	}

	if err != nil {
		return nil, err
	}

	return &user, nil
}

// FindByID retrieves a user by ID.
func (r *repository) FindByID(
	ctx context.Context,
	id string,
) (*User, error) {

	var user User

	err := r.db.
		WithContext(ctx).
		First(&user, "id = ?", id).
		Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, ErrNotFound
	}

	if err != nil {
		return nil, err
	}

	return &user, nil
}

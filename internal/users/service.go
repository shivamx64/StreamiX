package users

import (
	"context"
	"errors"

	"github.com/shivamx64/streamix/internal/auth"
	"golang.org/x/crypto/bcrypt"
)

// Service defines user business operations.
type Service interface {
	Register(
		ctx context.Context,
		email string,
		password string,
	) (*User, error)
}

type service struct {
	repository   Repository
	tokenManager *auth.TokenManager
}

// NewService creates a user service.
func NewService(
	repository Repository,
	tokenManager *auth.TokenManager,
) Service {
	return &service{
		repository:   repository,
		tokenManager: tokenManager,
	}
}

// Register creates a new user.
func (s *service) Register(
	ctx context.Context,
	email string,
	password string,
) (*User, error) {

	existingUser, err := s.repository.FindByEmail(
		ctx,
		email,
	)

	if err == nil && existingUser != nil {
		return nil, ErrEmailExists
	}

	if !errors.Is(err, ErrNotFound) && err != nil {
		return nil, err
	}

	passwordHash, err := bcrypt.GenerateFromPassword(
		[]byte(password),
		bcrypt.DefaultCost,
	)

	if err != nil {
		return nil, err
	}

	user := &User{
		Email:        email,
		PasswordHash: string(passwordHash),
	}

	err = s.repository.Create(
		ctx,
		user,
	)

	if err != nil {
		return nil, err
	}

	return user, nil
}
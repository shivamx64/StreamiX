package users

import (
	"context"
	"errors"

	"github.com/google/uuid"
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

	Login(
		ctx context.Context,
		email string,
		password string,
	) (*LoginResponse, error)

	Refresh(
		ctx context.Context,
		refreshToken string,
	) (*LoginResponse, error)

	Me(
		ctx context.Context,
		userID string,
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
		ID:           uuid.New(),
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

// Login authenticates a user and returns JWT tokens.
func (s *service) Login(
	ctx context.Context,
	email string,
	password string,
) (*LoginResponse, error) {

	user, err := s.repository.FindByEmail(
		ctx,
		email,
	)
	if err != nil {
		return nil, ErrInvalidCredentials
	}

	err = bcrypt.CompareHashAndPassword(
		[]byte(user.PasswordHash),
		[]byte(password),
	)
	if err != nil {
		return nil, ErrInvalidCredentials
	}

	accessToken, err := s.tokenManager.GenerateAccessToken(
		user.ID.String(),
	)
	if err != nil {
		return nil, err
	}

	refreshToken, err := s.tokenManager.GenerateRefreshToken(
		user.ID.String(),
	)
	if err != nil {
		return nil, err
	}

	return &LoginResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		TokenType:    "Bearer",
		ExpiresIn:    s.tokenManager.AccessTokenExpiresIn(),
	}, nil
}

// Refresh validates a refresh token and issues a new token pair.
//
// The refresh token is rotated: both the returned access token and
// refresh token are freshly generated, so each refresh invalidates the
// previously held refresh token.
func (s *service) Refresh(
	ctx context.Context,
	refreshToken string,
) (*LoginResponse, error) {

	claims, err := s.tokenManager.ValidateRefreshToken(
		refreshToken,
	)
	if err != nil {
		return nil, ErrInvalidRefreshToken
	}

	user, err := s.repository.FindByID(
		ctx,
		claims.UserID,
	)
	if err != nil {
		if errors.Is(err, ErrNotFound) {
			return nil, ErrInvalidRefreshToken
		}
		return nil, err
	}

	accessToken, err := s.tokenManager.GenerateAccessToken(
		user.ID.String(),
	)
	if err != nil {
		return nil, err
	}

	newRefreshToken, err := s.tokenManager.GenerateRefreshToken(
		user.ID.String(),
	)
	if err != nil {
		return nil, err
	}

	return &LoginResponse{
		AccessToken:  accessToken,
		RefreshToken: newRefreshToken,
		TokenType:    "Bearer",
		ExpiresIn:    s.tokenManager.AccessTokenExpiresIn(),
	}, nil
}

// Me returns the currently authenticated user,
func (s *service) Me(
	ctx context.Context,
	userID string,
) (*User, error) {

	user, err := s.repository.FindByID(
		ctx,
		userID,
	)

	if err != nil {
		return nil, err
	}
	return user, nil
}

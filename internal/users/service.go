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

	Logout(
		ctx context.Context,
		refreshToken string,
	) error

	Me(
		ctx context.Context,
		userID string,
	) (*User, error)
}

type service struct {
	repository   Repository
	tokenManager *auth.TokenManager
	sessions     auth.RefreshSessionStore
}

// NewService creates a user service.
func NewService(
	repository Repository,
	tokenManager *auth.TokenManager,
	sessions auth.RefreshSessionStore,
) Service {
	return &service{
		repository:   repository,
		tokenManager: tokenManager,
		sessions:     sessions,
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

	refreshToken, refreshID, err := s.tokenManager.GenerateRefreshTokenWithID(
		user.ID.String(),
	)
	if err != nil {
		return nil, err
	}

	// Record the refresh token as an active session so it can be
	// enforced, revoked, and reused-detected on later refresh calls.
	if err := s.sessions.Put(
		ctx,
		refreshID,
		user.ID.String(),
		s.tokenManager.RefreshTokenTTL(),
	); err != nil {
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
// The refresh token is rotated and enforced server-side: only the most
// recently issued token for a session is accepted. Presenting an older,
// already-rotated token is treated as reuse of a possibly stolen token
// and rejected.
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

	// Reuse detection: the token must still be an active session.
	userID, err := s.sessions.Get(ctx, claims.ID)
	if err != nil {
		if errors.Is(err, auth.ErrInvalidToken) {
			return nil, ErrInvalidRefreshToken
		}
		return nil, err
	}
	if userID != claims.UserID {
		return nil, ErrInvalidRefreshToken
	}

	user, err := s.repository.FindByID(
		ctx,
		userID,
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

	newRefreshToken, newRefreshID, err := s.tokenManager.GenerateRefreshTokenWithID(
		user.ID.String(),
	)
	if err != nil {
		return nil, err
	}

	// Register the successor session before revoking the current one
	// so a failure in between never leaves the user sessionless.
	if err := s.sessions.Put(
		ctx,
		newRefreshID,
		user.ID.String(),
		s.tokenManager.RefreshTokenTTL(),
	); err != nil {
		return nil, err
	}

	// Rotate: the presented refresh token stops working immediately.
	if err := s.sessions.Delete(ctx, claims.ID); err != nil {
		return nil, err
	}

	return &LoginResponse{
		AccessToken:  accessToken,
		RefreshToken: newRefreshToken,
		TokenType:    "Bearer",
		ExpiresIn:    s.tokenManager.AccessTokenExpiresIn(),
	}, nil
}

// Logout revokes a refresh token server-side. Logout is idempotent:
// presenting an already-invalid token still counts as logged out.
func (s *service) Logout(
	ctx context.Context,
	refreshToken string,
) error {

	claims, err := s.tokenManager.ValidateRefreshToken(
		refreshToken,
	)
	if err != nil {
		// Nothing to revoke; the token is either expired or was
		// already rotated away.
		return nil
	}

	return s.sessions.Delete(ctx, claims.ID)
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

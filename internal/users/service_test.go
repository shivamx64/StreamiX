package users

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/shivamx64/streamix/internal/auth"
	"github.com/shivamx64/streamix/internal/config"
)

type mockUserRepository struct {
	user      *User
	findErr   error
	createErr error
}

func (m *mockUserRepository) Create(ctx context.Context, user *User) error {
	return m.createErr
}

func (m *mockUserRepository) FindByEmail(ctx context.Context, email string) (*User, error) {
	return nil, ErrNotFound
}

func (m *mockUserRepository) FindByID(ctx context.Context, id string) (*User, error) {
	if m.findErr != nil {
		return nil, m.findErr
	}
	if m.user == nil {
		return nil, ErrNotFound
	}
	return m.user, nil
}

func newTestService(repo Repository) *service {
	manager := auth.NewTokenManager(config.AuthConfig{
		JWTSecret:       "test-secret-that-is-long-enough-for-hs256",
		AccessTokenTTL:  15 * time.Minute,
		RefreshTokenTTL: 168 * time.Hour,
	})
	return &service{
		repository:   repo,
		tokenManager: manager,
	}
}

func TestRefreshReturnsNewTokenPair(t *testing.T) {
	user := &User{ID: uuid.New()}
	s := newTestService(&mockUserRepository{user: user})

	refreshToken, err := s.tokenManager.GenerateRefreshToken(user.ID.String())
	if err != nil {
		t.Fatalf("GenerateRefreshToken() error = %v", err)
	}

	response, err := s.Refresh(context.Background(), refreshToken)
	if err != nil {
		t.Fatalf("Refresh() error = %v", err)
	}

	if response.AccessToken == "" {
		t.Error("Refresh() returned empty access token")
	}
	if response.RefreshToken == "" {
		t.Error("Refresh() returned empty refresh token")
	}
	if response.RefreshToken == refreshToken {
		t.Error("Refresh() did not rotate the refresh token")
	}
	if response.TokenType != "Bearer" {
		t.Errorf("TokenType = %q, want %q", response.TokenType, "Bearer")
	}

	// The new tokens must be usable.
	if _, err := s.tokenManager.ValidateAccessToken(response.AccessToken); err != nil {
		t.Errorf("new access token invalid: %v", err)
	}
	if _, err := s.tokenManager.ValidateRefreshToken(response.RefreshToken); err != nil {
		t.Errorf("new refresh token invalid: %v", err)
	}
}

func TestRefreshRejectsInvalidToken(t *testing.T) {
	s := newTestService(&mockUserRepository{user: &User{ID: uuid.New()}})

	_, err := s.Refresh(context.Background(), "not-a-valid-token")
	if !errors.Is(err, ErrInvalidRefreshToken) {
		t.Errorf("Refresh() error = %v, want %v", err, ErrInvalidRefreshToken)
	}
}

func TestRefreshRejectsAccessToken(t *testing.T) {
	user := &User{ID: uuid.New()}
	s := newTestService(&mockUserRepository{user: user})

	accessToken, err := s.tokenManager.GenerateAccessToken(user.ID.String())
	if err != nil {
		t.Fatalf("GenerateAccessToken() error = %v", err)
	}

	_, err = s.Refresh(context.Background(), accessToken)
	if !errors.Is(err, ErrInvalidRefreshToken) {
		t.Errorf("Refresh() error = %v, want %v", err, ErrInvalidRefreshToken)
	}
}

func TestRefreshRejectsDeletedUser(t *testing.T) {
	s := newTestService(&mockUserRepository{})

	refreshToken, err := s.tokenManager.GenerateRefreshToken(uuid.New().String())
	if err != nil {
		t.Fatalf("GenerateRefreshToken() error = %v", err)
	}

	_, err = s.Refresh(context.Background(), refreshToken)
	if !errors.Is(err, ErrInvalidRefreshToken) {
		t.Errorf("Refresh() error = %v, want %v", err, ErrInvalidRefreshToken)
	}
}

func TestRefreshSurfacesRepositoryErrors(t *testing.T) {
	s := newTestService(&mockUserRepository{findErr: errors.New("db down")})

	refreshToken, err := s.tokenManager.GenerateRefreshToken(uuid.New().String())
	if err != nil {
		t.Fatalf("GenerateRefreshToken() error = %v", err)
	}

	_, err = s.Refresh(context.Background(), refreshToken)
	if err == nil || errors.Is(err, ErrInvalidRefreshToken) {
		t.Errorf("Refresh() error = %v, want repository error", err)
	}
}

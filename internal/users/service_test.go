package users

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/shivamx64/streamix/internal/auth"
	"github.com/shivamx64/streamix/internal/config"
	"golang.org/x/crypto/bcrypt"
)

type mockUserRepository struct {
	user      *User
	emailUser *User
	findErr   error
	createErr error
	emailErr  error
}

func (m *mockUserRepository) Create(ctx context.Context, user *User) error {
	return m.createErr
}

func (m *mockUserRepository) FindByEmail(ctx context.Context, email string) (*User, error) {
	if m.emailErr != nil {
		return nil, m.emailErr
	}
	if m.emailUser == nil {
		return nil, ErrNotFound
	}
	return m.emailUser, nil
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

type mockSessionStore struct {
	sessions map[string]string
}

func newMockSessionStore() *mockSessionStore {
	return &mockSessionStore{
		sessions: make(map[string]string),
	}
}

func (m *mockSessionStore) Put(
	ctx context.Context,
	jti string,
	userID string,
	ttl time.Duration,
) error {
	m.sessions[jti] = userID
	return nil
}

func (m *mockSessionStore) Get(
	ctx context.Context,
	jti string,
) (string, error) {
	userID, ok := m.sessions[jti]
	if !ok {
		return "", auth.ErrInvalidToken
	}
	return userID, nil
}

func (m *mockSessionStore) Delete(
	ctx context.Context,
	jti string,
) error {
	delete(m.sessions, jti)
	return nil
}

func newTestService(repo Repository) (*service, *mockSessionStore) {
	manager := auth.NewTokenManager(config.AuthConfig{
		JWTSecret:       "test-secret-that-is-long-enough-for-hs256",
		AccessTokenTTL:  15 * time.Minute,
		RefreshTokenTTL: 168 * time.Hour,
	})
	sessions := newMockSessionStore()
	return &service{
		repository:   repo,
		tokenManager: manager,
		sessions:     sessions,
	}, sessions
}

// registerRefreshToken generates a refresh token and its jti and
// records it as an active session, mimicking a fresh login.
func registerRefreshToken(
	t *testing.T,
	s *service,
	sessions *mockSessionStore,
	userID string,
) string {
	t.Helper()

	token, jti, err := s.tokenManager.GenerateRefreshTokenWithID(userID)
	if err != nil {
		t.Fatalf("GenerateRefreshTokenWithID() error = %v", err)
	}

	if err := sessions.Put(
		context.Background(),
		jti,
		userID,
		s.tokenManager.RefreshTokenTTL(),
	); err != nil {
		t.Fatalf("Put() error = %v", err)
	}

	return token
}

func TestLoginReturnsTokensAndStoresSession(t *testing.T) {
	passwordHash, err := bcrypt.GenerateFromPassword(
		[]byte("Password123!"),
		bcrypt.MinCost,
	)
	if err != nil {
		t.Fatalf("GenerateFromPassword() error = %v", err)
	}

	user := &User{
		ID:           uuid.New(),
		Email:        "user@streamix.dev",
		PasswordHash: string(passwordHash),
	}
	s, sessions := newTestService(&mockUserRepository{
		user:      user,
		emailUser: user,
	})

	response, err := s.Login(context.Background(), user.Email, "Password123!")
	if err != nil {
		t.Fatalf("Login() error = %v", err)
	}

	if response.AccessToken == "" || response.RefreshToken == "" {
		t.Fatal("Login() returned empty tokens")
	}

	claims, err := s.tokenManager.ValidateRefreshToken(response.RefreshToken)
	if err != nil {
		t.Fatalf("ValidateRefreshToken() error = %v", err)
	}

	storedUserID, err := sessions.Get(context.Background(), claims.ID)
	if err != nil {
		t.Fatalf("session not stored after login: %v", err)
	}
	if storedUserID != user.ID.String() {
		t.Errorf("session userID = %q, want %q", storedUserID, user.ID.String())
	}
}

func TestRefreshReturnsNewTokenPair(t *testing.T) {
	user := &User{ID: uuid.New()}
	s, sessions := newTestService(&mockUserRepository{user: user})

	oldRefresh := registerRefreshToken(t, s, sessions, user.ID.String())

	response, err := s.Refresh(context.Background(), oldRefresh)
	if err != nil {
		t.Fatalf("Refresh() error = %v", err)
	}

	if response.AccessToken == "" {
		t.Error("Refresh() returned empty access token")
	}
	if response.RefreshToken == "" {
		t.Error("Refresh() returned empty refresh token")
	}
	if response.RefreshToken == oldRefresh {
		t.Error("Refresh() did not rotate the refresh token")
	}
	if response.TokenType != "Bearer" {
		t.Errorf("TokenType = %q, want %q", response.TokenType, "Bearer")
	}

	// The successor session is active and the old one is revoked.
	newClaims, err := s.tokenManager.ValidateRefreshToken(response.RefreshToken)
	if err != nil {
		t.Fatalf("ValidateRefreshToken() error = %v", err)
	}

	storedUserID, err := sessions.Get(context.Background(), newClaims.ID)
	if err != nil {
		t.Fatalf("successor session not stored: %v", err)
	}
	if storedUserID != user.ID.String() {
		t.Errorf("successor session userID = %q, want %q", storedUserID, user.ID.String())
	}
}

func TestRefreshRejectsReusedTokenAfterRotation(t *testing.T) {
	user := &User{ID: uuid.New()}
	s, sessions := newTestService(&mockUserRepository{user: user})

	oldRefresh := registerRefreshToken(t, s, sessions, user.ID.String())

	if _, err := s.Refresh(context.Background(), oldRefresh); err != nil {
		t.Fatalf("first Refresh() error = %v", err)
	}

	// Replaying the rotated-away token must be rejected.
	_, err := s.Refresh(context.Background(), oldRefresh)
	if !errors.Is(err, ErrInvalidRefreshToken) {
		t.Errorf("Refresh(reused) error = %v, want %v", err, ErrInvalidRefreshToken)
	}
}

func TestRefreshRejectsInvalidToken(t *testing.T) {
	s, _ := newTestService(&mockUserRepository{user: &User{ID: uuid.New()}})

	_, err := s.Refresh(context.Background(), "not-a-valid-token")
	if !errors.Is(err, ErrInvalidRefreshToken) {
		t.Errorf("Refresh() error = %v, want %v", err, ErrInvalidRefreshToken)
	}
}

func TestRefreshRejectsAccessToken(t *testing.T) {
	user := &User{ID: uuid.New()}
	s, _ := newTestService(&mockUserRepository{user: user})

	accessToken, err := s.tokenManager.GenerateAccessToken(user.ID.String())
	if err != nil {
		t.Fatalf("GenerateAccessToken() error = %v", err)
	}

	_, err = s.Refresh(context.Background(), accessToken)
	if !errors.Is(err, ErrInvalidRefreshToken) {
		t.Errorf("Refresh() error = %v, want %v", err, ErrInvalidRefreshToken)
	}
}

func TestRefreshRejectsTokenWithNoSession(t *testing.T) {
	user := &User{ID: uuid.New()}
	s, _ := newTestService(&mockUserRepository{user: user})

	// A validly signed token that was never recorded as a session.
	token, _, err := s.tokenManager.GenerateRefreshTokenWithID(user.ID.String())
	if err != nil {
		t.Fatalf("GenerateRefreshTokenWithID() error = %v", err)
	}

	_, err = s.Refresh(context.Background(), token)
	if !errors.Is(err, ErrInvalidRefreshToken) {
		t.Errorf("Refresh() error = %v, want %v", err, ErrInvalidRefreshToken)
	}
}

func TestRefreshRejectsDeletedUser(t *testing.T) {
	s, sessions := newTestService(&mockUserRepository{})

	userID := uuid.New().String()
	refreshToken := registerRefreshToken(t, s, sessions, userID)

	_, err := s.Refresh(context.Background(), refreshToken)
	if !errors.Is(err, ErrInvalidRefreshToken) {
		t.Errorf("Refresh() error = %v, want %v", err, ErrInvalidRefreshToken)
	}
}

func TestRefreshSurfacesRepositoryErrors(t *testing.T) {
	s, sessions := newTestService(&mockUserRepository{findErr: errors.New("db down")})

	userID := uuid.New().String()
	refreshToken := registerRefreshToken(t, s, sessions, userID)

	_, err := s.Refresh(context.Background(), refreshToken)
	if err == nil || errors.Is(err, ErrInvalidRefreshToken) {
		t.Errorf("Refresh() error = %v, want repository error", err)
	}
}

func TestLogoutRevokesSession(t *testing.T) {
	user := &User{ID: uuid.New()}
	s, sessions := newTestService(&mockUserRepository{user: user})

	refreshToken := registerRefreshToken(t, s, sessions, user.ID.String())

	if err := s.Logout(context.Background(), refreshToken); err != nil {
		t.Fatalf("Logout() error = %v", err)
	}

	// The revoked token can no longer refresh.
	_, err := s.Refresh(context.Background(), refreshToken)
	if !errors.Is(err, ErrInvalidRefreshToken) {
		t.Errorf("Refresh(revoked) error = %v, want %v", err, ErrInvalidRefreshToken)
	}
}

func TestLogoutIsIdempotent(t *testing.T) {
	s, _ := newTestService(&mockUserRepository{user: &User{ID: uuid.New()}})

	if err := s.Logout(context.Background(), "not-a-real-token"); err != nil {
		t.Errorf("Logout(garbage) error = %v, want nil", err)
	}
}

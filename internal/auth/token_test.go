package auth

import (
	"testing"
	"time"

	"github.com/shivamx64/streamix/internal/config"
)

func newTestTokenManager(t *testing.T) *TokenManager {
	t.Helper()

	return NewTokenManager(config.AuthConfig{
		JWTSecret:       "test-secret-that-is-long-enough-for-hs256",
		AccessTokenTTL:  15 * time.Minute,
		RefreshTokenTTL: 168 * time.Hour,
	})
}

func TestGenerateAndValidateAccessToken(t *testing.T) {
	manager := newTestTokenManager(t)

	token, err := manager.GenerateAccessToken("user-123")
	if err != nil {
		t.Fatalf("GenerateAccessToken() error = %v", err)
	}

	claims, err := manager.ValidateAccessToken(token)
	if err != nil {
		t.Fatalf("ValidateAccessToken() error = %v", err)
	}

	if claims.UserID != "user-123" {
		t.Errorf("UserID = %q, want %q", claims.UserID, "user-123")
	}
}

func TestGenerateAndValidateRefreshToken(t *testing.T) {
	manager := newTestTokenManager(t)

	token, err := manager.GenerateRefreshToken("user-123")
	if err != nil {
		t.Fatalf("GenerateRefreshToken() error = %v", err)
	}

	claims, err := manager.ValidateRefreshToken(token)
	if err != nil {
		t.Fatalf("ValidateRefreshToken() error = %v", err)
	}

	if claims.UserID != "user-123" {
		t.Errorf("UserID = %q, want %q", claims.UserID, "user-123")
	}
}

func TestTokenTypesCannotBeUsedInterchangeably(t *testing.T) {
	manager := newTestTokenManager(t)

	accessToken, err := manager.GenerateAccessToken("user-123")
	if err != nil {
		t.Fatalf("GenerateAccessToken() error = %v", err)
	}

	refreshToken, err := manager.GenerateRefreshToken("user-123")
	if err != nil {
		t.Fatalf("GenerateRefreshToken() error = %v", err)
	}

	if _, err := manager.ValidateAccessToken(refreshToken); err == nil {
		t.Error("ValidateAccessToken(refreshToken) succeeded, want error")
	}

	if _, err := manager.ValidateRefreshToken(accessToken); err == nil {
		t.Error("ValidateRefreshToken(accessToken) succeeded, want error")
	}
}

func TestValidateAccessTokenRejectsExpiredToken(t *testing.T) {
	manager := NewTokenManager(config.AuthConfig{
		JWTSecret:       "test-secret-that-is-long-enough-for-hs256",
		AccessTokenTTL:  -time.Minute,
		RefreshTokenTTL: 168 * time.Hour,
	})

	token, err := manager.GenerateAccessToken("user-123")
	if err != nil {
		t.Fatalf("GenerateAccessToken() error = %v", err)
	}

	if _, err := manager.ValidateAccessToken(token); err == nil {
		t.Error("ValidateAccessToken() succeeded for expired token, want error")
	}
}

func TestValidateRefreshTokenRejectsExpiredToken(t *testing.T) {
	manager := NewTokenManager(config.AuthConfig{
		JWTSecret:       "test-secret-that-is-long-enough-for-hs256",
		AccessTokenTTL:  15 * time.Minute,
		RefreshTokenTTL: -time.Minute,
	})

	token, err := manager.GenerateRefreshToken("user-123")
	if err != nil {
		t.Fatalf("GenerateRefreshToken() error = %v", err)
	}

	if _, err := manager.ValidateRefreshToken(token); err == nil {
		t.Error("ValidateRefreshToken() succeeded for expired token, want error")
	}
}

func TestValidateTokenRejectsTamperedToken(t *testing.T) {
	manager := newTestTokenManager(t)

	token, err := manager.GenerateAccessToken("user-123")
	if err != nil {
		t.Fatalf("GenerateAccessToken() error = %v", err)
	}

	if _, err := manager.ValidateAccessToken(token + "tampered"); err == nil {
		t.Error("ValidateAccessToken() succeeded for tampered token, want error")
	}
}

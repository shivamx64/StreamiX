package auth

import (
	"testing"
	"time"

	"github.com/shivamx64/streamix/internal/config"
)

func newTestTokenManager(t *testing.T) *TokenManager {
	t.Helper()

	return NewTokenManager(config.AuthConfig{
		JWTSecret:        "test-secret-that-is-long-enough-for-hs256",
		AccessTokenTTL:   15 * time.Minute,
		RefreshTokenTTL:  168 * time.Hour,
		PlaybackTokenTTL: time.Hour,
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

func TestGenerateAndValidatePlaybackToken(t *testing.T) {
	manager := newTestTokenManager(t)

	token, expiresAt, err := manager.GeneratePlaybackToken(
		"user-123",
		"video-456",
	)
	if err != nil {
		t.Fatalf("GeneratePlaybackToken() error = %v", err)
	}

	if time.Until(expiresAt) <= 0 {
		t.Errorf("expiresAt = %v, want a future time", expiresAt)
	}

	claims, err := manager.ValidatePlaybackToken(token)
	if err != nil {
		t.Fatalf("ValidatePlaybackToken() error = %v", err)
	}

	if claims.UserID != "user-123" {
		t.Errorf("UserID = %q, want user-123", claims.UserID)
	}

	if claims.VideoID != "video-456" {
		t.Errorf("VideoID = %q, want video-456", claims.VideoID)
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

	playbackToken, _, err := manager.GeneratePlaybackToken(
		"user-123",
		"video-456",
	)
	if err != nil {
		t.Fatalf("GeneratePlaybackToken() error = %v", err)
	}

	if _, err := manager.ValidateAccessToken(refreshToken); err == nil {
		t.Error("ValidateAccessToken(refreshToken) succeeded, want error")
	}

	if _, err := manager.ValidateRefreshToken(accessToken); err == nil {
		t.Error("ValidateRefreshToken(accessToken) succeeded, want error")
	}

	if _, err := manager.ValidateAccessToken(playbackToken); err == nil {
		t.Error("ValidateAccessToken(playbackToken) succeeded, want error")
	}

	if _, err := manager.ValidateRefreshToken(playbackToken); err == nil {
		t.Error("ValidateRefreshToken(playbackToken) succeeded, want error")
	}

	if _, err := manager.ValidatePlaybackToken(accessToken); err == nil {
		t.Error("ValidatePlaybackToken(accessToken) succeeded, want error")
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

func TestValidatePlaybackTokenRejectsExpiredToken(t *testing.T) {
	manager := NewTokenManager(config.AuthConfig{
		JWTSecret:        "test-secret-that-is-long-enough-for-hs256",
		AccessTokenTTL:   15 * time.Minute,
		RefreshTokenTTL:  168 * time.Hour,
		PlaybackTokenTTL: -time.Minute,
	})

	token, _, err := manager.GeneratePlaybackToken("user-123", "video-456")
	if err != nil {
		t.Fatalf("GeneratePlaybackToken() error = %v", err)
	}

	if _, err := manager.ValidatePlaybackToken(token); err == nil {
		t.Error("ValidatePlaybackToken() succeeded for expired token, want error")
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

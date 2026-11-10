package auth

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"

	"github.com/shivamx64/streamix/internal/config"
)

// Claims represents the JWT claims used by StreamiX.
type Claims struct {
	UserID  string `json:"user_id"`
	VideoID string `json:"video_id,omitempty"`
	Type    string `json:"type"`

	jwt.RegisteredClaims
}

// TokenManager is responsible for generating and validating JWTs.
type TokenManager struct {
	secret           []byte
	accessTokenTTL   time.Duration
	refreshTokenTTL  time.Duration
	playbackTokenTTL time.Duration
}

// NewTokenManager creates a new JWT token manager.
func NewTokenManager(cfg config.AuthConfig) *TokenManager {
	return &TokenManager{
		secret:           []byte(cfg.JWTSecret),
		accessTokenTTL:   cfg.AccessTokenTTL,
		refreshTokenTTL:  cfg.RefreshTokenTTL,
		playbackTokenTTL: cfg.PlaybackTokenTTL,
	}
}

// GenerateAccessToken creates a signed access token.
func (m *TokenManager) GenerateAccessToken(userID string) (string, error) {
	token, _, err := m.generateToken(userID, "", "access", m.accessTokenTTL)
	return token, err
}

// GenerateRefreshToken creates a signed refresh token.
func (m *TokenManager) GenerateRefreshToken(userID string) (string, error) {
	token, _, err := m.generateToken(userID, "", "refresh", m.refreshTokenTTL)
	return token, err
}

// GenerateRefreshTokenWithID creates a signed refresh token and returns
// it alongside its unique ID (jti). The jti identifies the token in the
// refresh session store for rotation, revocation, and reuse detection.
func (m *TokenManager) GenerateRefreshTokenWithID(
	userID string,
) (string, string, error) {
	token, claims, err := m.generateToken(
		userID,
		"",
		"refresh",
		m.refreshTokenTTL,
	)
	if err != nil {
		return "", "", err
	}

	return token, claims.ID, nil
}

// GeneratePlaybackToken creates a short-lived, video-scoped token for
// media requests that cannot attach an Authorization header.
func (m *TokenManager) GeneratePlaybackToken(
	userID string,
	videoID string,
) (string, time.Time, error) {
	token, claims, err := m.generateToken(
		userID,
		videoID,
		"playback",
		m.playbackTokenTTL,
	)
	if err != nil {
		return "", time.Time{}, err
	}

	return token, claims.ExpiresAt.Time, nil
}

// RefreshTokenTTL returns the refresh token lifetime.
func (m *TokenManager) RefreshTokenTTL() time.Duration {
	return m.refreshTokenTTL
}

// AccessTokenExpiresIn returns the access token lifetime in seconds.
func (m *TokenManager) AccessTokenExpiresIn() int64 {
	return int64(m.accessTokenTTL.Seconds())
}

// RefreshTokenExpiresIn returns the refresh token lifetime in seconds.
func (m *TokenManager) RefreshTokenExpiresIn() int64 {
	return int64(m.refreshTokenTTL.Seconds())
}

// validateToken parses a JWT and checks that it is valid and of the
// expected type ("access", "refresh", or "playback").
func (m *TokenManager) validateToken(
	tokenString string,
	wantType string,
) (*Claims, error) {

	token, err := jwt.ParseWithClaims(
		tokenString,
		&Claims{},
		func(token *jwt.Token) (any, error) {

			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, ErrUnexpectedSigningAlg
			}

			return m.secret, nil
		},
	)

	if err != nil {
		return nil, ErrInvalidToken
	}

	claims, ok := token.Claims.(*Claims)

	if !ok || !token.Valid {
		return nil, ErrInvalidToken
	}

	// A token issued for one purpose must never be accepted for another
	// (for example, a playback URL must not authenticate API requests).
	if claims.Type != wantType {
		return nil, ErrInvalidToken
	}

	return claims, nil
}

// ValidateAccessToken validates an access token and returns its claims.
func (m *TokenManager) ValidateAccessToken(
	tokenString string,
) (*Claims, error) {
	return m.validateToken(tokenString, "access")
}

// ValidateRefreshToken validates a refresh token and returns its claims.
func (m *TokenManager) ValidateRefreshToken(
	tokenString string,
) (*Claims, error) {
	return m.validateToken(tokenString, "refresh")
}

// ValidatePlaybackToken validates a signed playback URL token and
// returns its claims.
func (m *TokenManager) ValidatePlaybackToken(
	tokenString string,
) (*Claims, error) {
	claims, err := m.validateToken(tokenString, "playback")
	if err != nil {
		return nil, err
	}

	if claims.VideoID == "" {
		return nil, ErrInvalidToken
	}

	return claims, nil
}

// generateToken creates and signs a JWT and returns the token string
// alongside its claims.
func (m *TokenManager) generateToken(
	userID string,
	videoID string,
	tokenType string,
	ttl time.Duration,
) (string, *Claims, error) {

	now := time.Now()
	claims := Claims{
		UserID:  userID,
		VideoID: videoID,
		Type:    tokenType,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   userID,
			ID:        uuid.New().String(),
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(ttl)),
		},
	}
	token := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		&claims,
	)
	signed, err := token.SignedString(m.secret)
	if err != nil {
		return "", nil, err
	}

	return signed, &claims, nil
}

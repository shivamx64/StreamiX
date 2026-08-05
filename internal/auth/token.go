package auth

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"

	"github.com/shivamx64/streamix/internal/config"
)

// Claims represents the JWT claims used by StreamiX.
type Claims struct {
	UserID string `json:"user_id"`
	Type   string `json:"type"`

	jwt.RegisteredClaims
}

// TokenManager is responsible for generating and validating JWTs.
type TokenManager struct {
	secret          []byte
	accessTokenTTL  time.Duration
	refreshTokenTTL time.Duration
}

// NewTokenManager creates a new JWT token manager.
func NewTokenManager(cfg config.AuthConfig) *TokenManager {
	return &TokenManager{
		secret:          []byte(cfg.JWTSecret),
		accessTokenTTL:  cfg.AccessTokenTTL,
		refreshTokenTTL: cfg.RefreshTokenTTL,
	}
}

// GenerateAccessToken creates a signed access token.
func (m *TokenManager) GenerateAccessToken(userID string) (string, error) {
	token, _, err := m.generateToken(userID, m.accessTokenTTL, "access")
	return token, err
}

// GenerateRefreshToken creates a signed refresh token.
func (m *TokenManager) GenerateRefreshToken(userID string) (string, error) {
	token, _, err := m.generateToken(userID, m.refreshTokenTTL, "refresh")
	return token, err
}

// GenerateRefreshTokenWithID creates a signed refresh token and returns
// it alongside its unique ID (jti). The jti identifies the token in the
// refresh session store for rotation, revocation, and reuse detection.
func (m *TokenManager) GenerateRefreshTokenWithID(
	userID string,
) (string, string, error) {
	return m.generateToken(userID, m.refreshTokenTTL, "refresh")
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
// expected type ("access" or "refresh").
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

	// A refresh token must never be accepted as an access token and
	// vice versa.
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

// generateToken creates and signs a JWT and returns the token string
// alongside its unique ID (jti).
func (m *TokenManager) generateToken(
	userID string,
	ttl time.Duration,
	tokenType string,
) (string, string, error) {

	now := time.Now()
	claims := Claims{
		UserID: userID,
		Type:   tokenType,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   userID,
			ID:        uuid.New().String(),
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(ttl)),
		},
	}
	token := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		claims,
	)
	signed, err := token.SignedString(m.secret)
	if err != nil {
		return "", "", err
	}

	return signed, claims.ID, nil
}

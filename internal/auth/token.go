package auth

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"

	"github.com/shivamx64/streamix/internal/config"
)

// Claims represents the JWT claims used by StreamiX.
type Claims struct {
	UserID string `json:"user_id"`

	jwt.RegisteredClaims
}

// TokenManager is responsible for generating and validating JWTs.
type TokenManager struct {
	secret           []byte
	accessTokenTTL   time.Duration
	refreshTokenTTL  time.Duration
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
	return m.generateToken(userID, m.accessTokenTTL)
}

// GenerateRefreshToken creates a signed refresh token.
func (m *TokenManager) GenerateRefreshToken(userID string) (string, error) {
	return m.generateToken(userID, m.refreshTokenTTL)
}

// ValidateToken validates a JWT and returns its claims.
func (m *TokenManager) ValidateToken(tokenString string) (*Claims, error) {

	token, err := jwt.ParseWithClaims(
		tokenString,
		&Claims{},
		func(token *jwt.Token) (any, error) {

			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("unexpected signing method")
			}

			return m.secret, nil
		},
	)

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, errors.New("invalid token")
	}

	return claims, nil
}

// generateToken creates and signs a JWT.
func (m *TokenManager) generateToken(
	userID string,
	ttl time.Duration,
) (string, error) {

	now := time.Now()

	claims := Claims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   userID,
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(ttl)),
		},
	}

	token := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		claims,
	)

	return token.SignedString(m.secret)
}
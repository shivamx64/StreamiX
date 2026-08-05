package auth

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/redis/go-redis/v9"
)

// RefreshSessionStore tracks the refresh tokens that are currently
// valid. This enables server-side rotation enforcement, logout
// revocation, and reuse detection, none of which are possible with
// stateless JWTs alone.
type RefreshSessionStore interface {
	// Put records a refresh token (identified by its jti) as valid
	// for the given user until it expires.
	Put(ctx context.Context, jti string, userID string, ttl time.Duration) error

	// Get returns the user ID bound to a refresh token, or
	// ErrInvalidToken when the token is not (or no longer) valid.
	Get(ctx context.Context, jti string) (string, error)

	// Delete revokes a refresh token.
	Delete(ctx context.Context, jti string) error
}

const refreshSessionKeyPrefix = "refresh-session:"

// RedisRefreshSessionStore persists refresh sessions in Redis.
type RedisRefreshSessionStore struct {
	client *redis.Client
}

// NewRedisRefreshSessionStore creates a Redis backed session store.
func NewRedisRefreshSessionStore(client *redis.Client) *RedisRefreshSessionStore {
	return &RedisRefreshSessionStore{
		client: client,
	}
}

func (s *RedisRefreshSessionStore) Put(
	ctx context.Context,
	jti string,
	userID string,
	ttl time.Duration,
) error {

	return s.client.Set(
		ctx,
		refreshSessionKeyPrefix+jti,
		userID,
		ttl,
	).Err()
}

func (s *RedisRefreshSessionStore) Get(
	ctx context.Context,
	jti string,
) (string, error) {

	value, err := s.client.Get(
		ctx,
		refreshSessionKeyPrefix+jti,
	).Result()

	if err == redis.Nil {
		return "", ErrInvalidToken
	}

	if err != nil {
		return "", fmt.Errorf("get refresh session: %w", err)
	}

	return value, nil
}

func (s *RedisRefreshSessionStore) Delete(
	ctx context.Context,
	jti string,
) error {

	return s.client.Del(
		ctx,
		refreshSessionKeyPrefix+jti,
	).Err()
}

// MemoryRefreshSessionStore is an in-process fallback used when Redis
// is unavailable. Sessions are only tracked for the lifetime of the
// process; restarts lose all sessions.
type MemoryRefreshSessionStore struct {
	mu       sync.RWMutex
	sessions map[string]string
}

// NewMemoryRefreshSessionStore creates an in-memory session store.
func NewMemoryRefreshSessionStore() *MemoryRefreshSessionStore {
	return &MemoryRefreshSessionStore{
		sessions: make(map[string]string),
	}
}

func (s *MemoryRefreshSessionStore) Put(
	ctx context.Context,
	jti string,
	userID string,
	ttl time.Duration,
) error {

	s.mu.Lock()
	defer s.mu.Unlock()

	s.sessions[jti] = userID

	// Best-effort expiry cleanup. A short-lived entry that survives
	// its TTL only widens the reuse window by at most one login.
	go func() {
		time.Sleep(ttl)
		s.mu.Lock()
		defer s.mu.Unlock()
		delete(s.sessions, jti)
	}()

	return nil
}

func (s *MemoryRefreshSessionStore) Get(
	ctx context.Context,
	jti string,
) (string, error) {

	s.mu.RLock()
	defer s.mu.RUnlock()

	userID, ok := s.sessions[jti]
	if !ok {
		return "", ErrInvalidToken
	}

	return userID, nil
}

func (s *MemoryRefreshSessionStore) Delete(
	ctx context.Context,
	jti string,
) error {

	s.mu.Lock()
	defer s.mu.Unlock()

	delete(s.sessions, jti)

	return nil
}

package auth

import (
	"context"
	"testing"
	"time"

	"github.com/alicebob/miniredis/v2"
	"github.com/redis/go-redis/v9"
)

func newTestRedisStore(t *testing.T) (*miniredis.Miniredis, RefreshSessionStore) {
	t.Helper()

	mr := miniredis.RunT(t)
	client := redis.NewClient(&redis.Options{Addr: mr.Addr()})
	t.Cleanup(func() { _ = client.Close() })

	return mr, NewRedisRefreshSessionStore(client)
}

func TestRedisStorePutGetDelete(t *testing.T) {
	_, store := newTestRedisStore(t)
	ctx := context.Background()

	if err := store.Put(ctx, "jti-1", "user-1", time.Hour); err != nil {
		t.Fatalf("Put() error = %v", err)
	}

	userID, err := store.Get(ctx, "jti-1")
	if err != nil {
		t.Fatalf("Get() error = %v", err)
	}
	if userID != "user-1" {
		t.Errorf("Get() userID = %q, want %q", userID, "user-1")
	}

	if _, err := store.Get(ctx, "jti-missing"); err != ErrInvalidToken {
		t.Errorf("Get(missing) error = %v, want %v", err, ErrInvalidToken)
	}

	if err := store.Delete(ctx, "jti-1"); err != nil {
		t.Fatalf("Delete() error = %v", err)
	}

	if _, err := store.Get(ctx, "jti-1"); err != ErrInvalidToken {
		t.Errorf("Get(after delete) error = %v, want %v", err, ErrInvalidToken)
	}
}

func TestRedisStoreExpiresSessions(t *testing.T) {
	mr, store := newTestRedisStore(t)
	ctx := context.Background()

	if err := store.Put(ctx, "jti-1", "user-1", time.Second); err != nil {
		t.Fatalf("Put() error = %v", err)
	}

	mr.FastForward(2 * time.Second)

	if _, err := store.Get(ctx, "jti-1"); err != ErrInvalidToken {
		t.Errorf("Get(after expiry) error = %v, want %v", err, ErrInvalidToken)
	}
}

func TestMemoryStorePutGetDelete(t *testing.T) {
	store := NewMemoryRefreshSessionStore()
	ctx := context.Background()

	if err := store.Put(ctx, "jti-1", "user-1", time.Hour); err != nil {
		t.Fatalf("Put() error = %v", err)
	}

	userID, err := store.Get(ctx, "jti-1")
	if err != nil {
		t.Fatalf("Get() error = %v", err)
	}
	if userID != "user-1" {
		t.Errorf("Get() userID = %q, want %q", userID, "user-1")
	}

	if err := store.Delete(ctx, "jti-1"); err != nil {
		t.Fatalf("Delete() error = %v", err)
	}

	if _, err := store.Get(ctx, "jti-1"); err != ErrInvalidToken {
		t.Errorf("Get(after delete) error = %v, want %v", err, ErrInvalidToken)
	}
}

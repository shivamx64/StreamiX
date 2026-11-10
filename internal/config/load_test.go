package config

import (
	"reflect"
	"testing"
	"time"
)

func TestSplitList(t *testing.T) {
	got := splitList("http://localhost:3000, https://streamix.example ,, ")
	want := []string{"http://localhost:3000", "https://streamix.example"}

	if !reflect.DeepEqual(got, want) {
		t.Errorf("splitList() = %v, want %v", got, want)
	}
}

func TestLoadPlaybackTokenTTL(t *testing.T) {
	t.Setenv("DB_HOST", "localhost")
	t.Setenv("DB_PORT", "5432")
	t.Setenv("DB_USER", "streamix")
	t.Setenv("DB_PASSWORD", "streamix")
	t.Setenv("DB_NAME", "streamix")
	t.Setenv("JWT_SECRET", "test-secret")
	t.Setenv("PLAYBACK_TOKEN_TTL", "45m")

	cfg, err := Load()
	if err != nil {
		t.Fatalf("Load() error = %v", err)
	}

	if cfg.Auth.PlaybackTokenTTL != 45*time.Minute {
		t.Errorf(
			"PlaybackTokenTTL = %v, want %v",
			cfg.Auth.PlaybackTokenTTL,
			45*time.Minute,
		)
	}
}

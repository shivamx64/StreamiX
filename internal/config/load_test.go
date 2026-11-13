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

func TestLoadS3Storage(t *testing.T) {
	t.Setenv("DB_HOST", "localhost")
	t.Setenv("DB_PORT", "5432")
	t.Setenv("DB_USER", "streamix")
	t.Setenv("DB_PASSWORD", "streamix")
	t.Setenv("DB_NAME", "streamix")
	t.Setenv("JWT_SECRET", "test-secret")
	t.Setenv("STORAGE_DRIVER", "s3")
	t.Setenv("S3_ENDPOINT", "minio:9000")
	t.Setenv("S3_REGION", "eu-west-1")
	t.Setenv("S3_BUCKET", "streamix-media")
	t.Setenv("S3_ACCESS_KEY_ID", "access")
	t.Setenv("S3_SECRET_ACCESS_KEY", "secret")
	t.Setenv("S3_USE_SSL", "false")
	t.Setenv("S3_FORCE_PATH_STYLE", "true")

	cfg, err := Load()
	if err != nil {
		t.Fatalf("Load() error = %v", err)
	}

	want := S3Config{
		Endpoint:        "minio:9000",
		Region:          "eu-west-1",
		Bucket:          "streamix-media",
		AccessKeyID:     "access",
		SecretAccessKey: "secret",
		UseSSL:          false,
		ForcePathStyle:  true,
	}

	if cfg.Storage.Driver != "s3" {
		t.Errorf("Storage.Driver = %q, want %q", cfg.Storage.Driver, "s3")
	}

	if !reflect.DeepEqual(cfg.Storage.S3, want) {
		t.Errorf("Storage.S3 = %#v, want %#v", cfg.Storage.S3, want)
	}
}

func TestLoadRejectsInvalidS3Boolean(t *testing.T) {
	t.Setenv("DB_HOST", "localhost")
	t.Setenv("DB_PORT", "5432")
	t.Setenv("DB_USER", "streamix")
	t.Setenv("DB_PASSWORD", "streamix")
	t.Setenv("DB_NAME", "streamix")
	t.Setenv("JWT_SECRET", "test-secret")
	t.Setenv("S3_USE_SSL", "sometimes")

	if _, err := Load(); err == nil {
		t.Fatal("Load() error = nil, want invalid boolean error")
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

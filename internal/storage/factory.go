package storage

import (
	"context"
	"fmt"
)

// Config selects and configures a storage backend.
type Config struct {
	Driver    string
	LocalRoot string
	S3        S3Options
}

// New creates the configured storage backend.
func New(ctx context.Context, config Config) (Storage, error) {
	switch config.Driver {
	case "", "local":
		return NewLocalStorage(config.LocalRoot), nil
	case "s3":
		return NewS3Storage(ctx, config.S3)
	default:
		return nil, fmt.Errorf(
			"configuration error: unsupported STORAGE_DRIVER %q",
			config.Driver,
		)
	}
}

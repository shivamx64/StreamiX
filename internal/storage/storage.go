package storage

import (
	"context"
	"io"
)

// File represents a stored object.
type File struct {
	Key string
	Size int64
}

// Storage defines file storage operations.
type Storage interface {
	Save(
		ctx context.Context,
		key string,
		reader io.Reader,
	) (*File, error)

	Open(
		ctx context.Context,
		key string,
	) (io.ReadCloser, error)

	Delete(
		ctx context.Context,
		key string,
	) error
}
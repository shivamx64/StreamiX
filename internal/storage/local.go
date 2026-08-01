package storage

import (
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"
)

type LocalStorage struct {
	root string
}

// NewLocalStorage creates a local filesystem storage backend
func NewLocalStorage(root string) *LocalStorage {
	return &LocalStorage{
		root: root,
	}
}

func (s *LocalStorage) Save(
	ctx context.Context,
	key string,
	reader io.Reader,
) (*File, error) {

	path := filepath.Join(
		s.root,
		key,
	)

	if err := os.MkdirAll(
		filepath.Dir(path),
		0755,
	); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrSaveFailed, err)
	}

	file, err := os.Create(path)
	if err != nil {
		return nil, fmt.Errorf("%w: %v", ErrSaveFailed, err)
	}
	defer file.Close()

	size, err := io.Copy(file, reader)
	if err != nil {
		return nil, fmt.Errorf("%w: %v", ErrSaveFailed, err)
	}

	return &File{
		Key:  key,
		Size: size,
	}, nil
}

func (s *LocalStorage) Delete(
	ctx context.Context,
	key string,
) error {

	path := filepath.Join(
		s.root,
		key,
	)

	if err := os.Remove(path); err != nil {
		if os.IsNotExist(err) {
			return ErrFileNotFound
		}

		return fmt.Errorf("%w: %v", ErrDeleteFailed, err)
	}

	return nil
}
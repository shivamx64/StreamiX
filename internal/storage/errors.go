package storage

import "errors"

var (
	ErrFileNotFound = errors.New("file not found")
	ErrSaveFailed = errors.New("failed to sace file")
	ErrDeleteFailed = errors.New("failed to delete file")
)
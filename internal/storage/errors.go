package storage

import "errors"

var (
	ErrFileNotFound = errors.New("file not found")
	ErrSaveFailed   = errors.New("failed to save file")
	ErrOpenFailed   = errors.New("failed to open file")
	ErrDeleteFailed = errors.New("failed to delete file")
)
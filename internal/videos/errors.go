package videos

import "errors"

var (
	ErrNotFound = errors.New("video not found")
	ErrForbidden = errors.New("video does not belong to user")
	ErrInvalidVideo = errors.New("invalid video")
	ErrUploadFailed = errors.New("upload failed")
)
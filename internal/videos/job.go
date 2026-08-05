package videos

import "context"

// Job describes a transcoding task to be processed by a worker.
type Job struct {
	VideoID    string `json:"video_id"`
	UserID     string `json:"user_id"`
	StorageKey string `json:"storage_key"`
	Filename   string `json:"filename"`
}

// JobQueue publishes transcoding jobs.
type JobQueue interface {
	Enqueue(ctx context.Context, job Job) error
}

// JobQueueFunc adapts a function to the JobQueue interface.
type JobQueueFunc func(ctx context.Context, job Job) error

// Enqueue implements the JobQueue interface.
func (f JobQueueFunc) Enqueue(
	ctx context.Context,
	job Job,
) error {
	return f(ctx, job)
}
package processor

import (
	"context"
	"errors"
	"io"
	"log/slog"
	"testing"

	"github.com/shivamx64/streamix/internal/videos"
)

type stubRepository struct {
	transitionErr  error
	transitionFrom []videos.Status
	transitionTo   videos.Status
	completed      bool
	failed         bool
}

func (r *stubRepository) Create(ctx context.Context, video *videos.Video) error {
	return nil
}

func (r *stubRepository) FindByID(
	ctx context.Context,
	id string,
) (*videos.Video, error) {
	return nil, videos.ErrNotFound
}

func (r *stubRepository) ListByUser(
	ctx context.Context,
	userID string,
) ([]videos.Video, error) {
	return nil, nil
}

func (r *stubRepository) TransitionStatus(
	ctx context.Context,
	id string,
	from []videos.Status,
	to videos.Status,
) error {
	r.transitionFrom = from
	r.transitionTo = to

	return r.transitionErr
}

func (r *stubRepository) SetCompleted(
	ctx context.Context,
	id string,
	result videos.ProcessingResult,
) error {
	r.completed = true
	return nil
}

func (r *stubRepository) SetFailed(
	ctx context.Context,
	id string,
	processingError string,
) error {
	r.failed = true
	return nil
}

func (r *stubRepository) Delete(ctx context.Context, id string) error {
	return nil
}

func TestProcessSkipsVideoThatIsNotPending(t *testing.T) {
	repo := &stubRepository{
		transitionErr: videos.ErrInvalidTransition,
	}

	proc := New(
		repo,
		nil,
		nil,
		t.TempDir(),
		slog.New(slog.NewTextHandler(io.Discard, nil)),
	)

	permanent, err := proc.Process(
		context.Background(),
		videos.Job{VideoID: "video-id"},
	)
	if err != nil {
		t.Fatalf("Process() error = %v, want nil", err)
	}

	if !permanent {
		t.Error("Process() permanent = false, want true")
	}

	if repo.completed || repo.failed {
		t.Error("Process() updated a terminal video")
	}
}

func TestProcessPropagatesTransientTransitionFailure(t *testing.T) {
	repo := &stubRepository{
		transitionErr: errBoom,
	}

	proc := New(
		repo,
		nil,
		nil,
		t.TempDir(),
		slog.New(slog.NewTextHandler(io.Discard, nil)),
	)

	permanent, err := proc.Process(
		context.Background(),
		videos.Job{VideoID: "video-id"},
	)
	if !errors.Is(err, errBoom) {
		t.Fatalf("Process() error = %v, want errBoom", err)
	}

	if permanent {
		t.Error("Process() permanent = true, want false")
	}

	if repo.completed || repo.failed {
		t.Error("Process() changed status after transition failure")
	}
}

var errBoom = errors.New("boom")

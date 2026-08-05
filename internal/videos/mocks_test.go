package videos

import (
	"context"
	"errors"
	"io"

	"github.com/google/uuid"
	"github.com/shivamx64/streamix/internal/storage"
)

// mockRepository is a configurable in-memory Repository.
type mockRepository struct {
	createErr    error
	created      *Video
	findByIDErr  error
	findResult   *Video
	listResult   []Video
	listErr      error
	setStatuses  []Status
	setStatusErr error
	deleteErr    error
	deletedID    string
}

func (m *mockRepository) Create(ctx context.Context, video *Video) error {
	if m.created != nil {
		*m.created = *video
	}
	return m.createErr
}

func (m *mockRepository) FindByID(ctx context.Context, id string) (*Video, error) {
	return m.findResult, m.findByIDErr
}

func (m *mockRepository) ListByUser(ctx context.Context, userID string) ([]Video, error) {
	return m.listResult, m.listErr
}

func (m *mockRepository) SetStatus(ctx context.Context, id string, status Status) error {
	m.setStatuses = append(m.setStatuses, status)
	return m.setStatusErr
}

func (m *mockRepository) Delete(ctx context.Context, id string) error {
	m.deletedID = id
	return m.deleteErr
}

// mockStorage is a configurable in-memory Storage.
type mockStorage struct {
	saveFile   *storage.File
	saveErr    error
	savedKeys  []string
	deleteErr  error
	deletedKey string
}

func (m *mockStorage) Save(ctx context.Context, key string, reader io.Reader) (*storage.File, error) {
	m.savedKeys = append(m.savedKeys, key)

	if m.saveErr != nil {
		return nil, m.saveErr
	}

	file := m.saveFile
	if file == nil {
		file = &storage.File{}
	}

	file.Key = key

	// The video service derives Size from the returned file size.
	data, _ := io.ReadAll(reader)
	file.Size = int64(len(data))

	return file, nil
}

func (m *mockStorage) Open(ctx context.Context, key string) (io.ReadCloser, error) {
	return io.NopCloser(emptyReader{}), nil
}

func (m *mockStorage) Delete(ctx context.Context, key string) error {
	m.deletedKey = key

	if m.deleteErr != nil {
		return m.deleteErr
	}

	return nil
}

type emptyReader struct{}

func (emptyReader) Read([]byte) (int, error) {
	return 0, io.EOF
}

// mockQueue is a configurable JobQueue.
type mockQueue struct {
	enqueueErr error
	enqueued   []Job
}

func (m *mockQueue) Enqueue(ctx context.Context, job Job) error {
	m.enqueued = append(m.enqueued, job)
	return m.enqueueErr
}

func newVideoFixture() *Video {
	id := uuid.New()
	return &Video{
		ID:               id,
		UserID:           id,
		OriginalFilename: "clip.mp4",
		StorageKey:       id.String() + "/" + id.String() + "/clip.mp4",
		MimeType:         "video/mp4",
		Size:             1024,
		Status:           StatusUploaded,
	}
}

func mustUUID() uuid.UUID {
	return uuid.New()
}

var errBoom = errors.New("boom")
package videos

import (
	"context"
	"errors"
	"reflect"
	"strings"
	"testing"
)

func newTestService(
	repository Repository,
	storageBackend *mockStorage,
	jobQueue JobQueue,
) Service {
	return NewService(repository, storageBackend, jobQueue)
}

func TestUploadSuccess(t *testing.T) {
	ctx := context.Background()

	userID := mustUUIDString()

	events := []string{}

	repo := &mockRepository{events: &events}
	store := &mockStorage{}
	queue := &mockQueue{events: &events}

	service := newTestService(repo, store, queue)

	reader := strings.NewReader("video-bytes")

	video, err := service.Upload(
		ctx,
		userID,
		"my clip.mp4",
		"video/mp4",
		reader,
	)
	if err != nil {
		t.Fatalf("Upload() error = %v", err)
	}

	if video.OriginalFilename != "my clip.mp4" {
		t.Errorf("OriginalFilename = %q, want %q", video.OriginalFilename, "my clip.mp4")
	}

	if video.Status != StatusQueued {
		t.Errorf("Status = %q, want %q", video.Status, StatusQueued)
	}

	wantKey := userID + "/" + video.ID.String() + "/my clip.mp4"
	if video.StorageKey != wantKey {
		t.Errorf("StorageKey = %q, want %q", video.StorageKey, wantKey)
	}

	if len(store.savedKeys) != 1 || store.savedKeys[0] != wantKey {
		t.Errorf("storage.Save() keys = %v, want [%q]", store.savedKeys, wantKey)
	}

	if len(queue.enqueued) != 1 {
		t.Fatalf("queue.Enqueue() calls = %d, want 1", len(queue.enqueued))
	}

	enqueued := queue.enqueued[0]
	if enqueued.VideoID != video.ID.String() {
		t.Errorf("enqueued VideoID = %q, want %q", enqueued.VideoID, video.ID.String())
	}

	if enqueued.UserID != userID {
		t.Errorf("enqueued UserID = %q, want %q", enqueued.UserID, userID)
	}

	if enqueued.StorageKey != video.StorageKey {
		t.Errorf("enqueued StorageKey = %q, want %q", enqueued.StorageKey, video.StorageKey)
	}

	if len(repo.transitions) != 1 {
		t.Fatalf("TransitionStatus() calls = %v, want 1", repo.transitions)
	}

	transition := repo.transitions[0]
	if !reflect.DeepEqual(transition.from, []Status{StatusUploaded}) {
		t.Errorf("TransitionStatus() from = %v, want [%q]", transition.from, StatusUploaded)
	}

	if transition.to != StatusQueued {
		t.Errorf("TransitionStatus() to = %q, want %q", transition.to, StatusQueued)
	}

	// The status must be committed before the worker can observe the job.
	if want := []string{"transition", "enqueue"}; !reflect.DeepEqual(events, want) {
		t.Errorf("upload events = %v, want %v", events, want)
	}
}

func TestUploadRollsBackFileOnRepositoryFailure(t *testing.T) {
	ctx := context.Background()

	userID := mustUUIDString()

	repo := &mockRepository{createErr: errBoom}
	store := &mockStorage{}
	queue := &mockQueue{}

	service := newTestService(repo, store, queue)

	_, err := service.Upload(
		ctx,
		userID,
		"clip.mp4",
		"video/mp4",
		strings.NewReader("bytes"),
	)
	if !errors.Is(err, errBoom) {
		t.Fatalf("Upload() error = %v, want errBoom", err)
	}

	if store.deletedKey == "" {
		t.Error("storage.Delete() was not called to roll back the object")
	}

	if len(queue.enqueued) != 0 {
		t.Errorf("queue.Enqueue() called %d times after failed upload", len(queue.enqueued))
	}
}

func TestUploadRollsBackWhenQueueFails(t *testing.T) {
	ctx := context.Background()

	userID := mustUUIDString()

	created := &Video{}
	repo := &mockRepository{created: created}
	store := &mockStorage{}
	queue := &mockQueue{enqueueErr: errBoom}

	service := newTestService(repo, store, queue)

	video, err := service.Upload(
		ctx,
		userID,
		"clip.mp4",
		"video/mp4",
		strings.NewReader("bytes"),
	)
	if video != nil {
		t.Fatalf("Upload() video = %#v, want nil", video)
	}

	if !errors.Is(err, ErrQueueUnavailable) {
		t.Fatalf("Upload() error = %v, want ErrQueueUnavailable", err)
	}

	if !errors.Is(err, errBoom) {
		t.Fatalf("Upload() error = %v, want wrapped errBoom", err)
	}

	if repo.deletedID != created.ID.String() {
		t.Errorf("rollback deleted record %q, want %q", repo.deletedID, created.ID)
	}

	if store.deletedKey != created.StorageKey {
		t.Errorf("rollback deleted object %q, want %q", store.deletedKey, created.StorageKey)
	}
}

func TestUploadFailsWhenQueueUnavailable(t *testing.T) {
	ctx := context.Background()

	repo := &mockRepository{}
	store := &mockStorage{}

	service := newTestService(repo, store, nil)

	video, err := service.Upload(
		ctx,
		mustUUIDString(),
		"clip.mp4",
		"video/mp4",
		strings.NewReader("bytes"),
	)
	if video != nil {
		t.Fatalf("Upload() video = %#v, want nil", video)
	}

	if !errors.Is(err, ErrQueueUnavailable) {
		t.Fatalf("Upload() error = %v, want ErrQueueUnavailable", err)
	}

	if len(store.savedKeys) != 0 {
		t.Errorf("storage.Save() called %d times, want 0", len(store.savedKeys))
	}

	if repo.created != nil {
		t.Error("repository.Create() was called without a queue")
	}
}

func TestUploadRollsBackWhenQueueTransitionFails(t *testing.T) {
	ctx := context.Background()

	created := &Video{}
	repo := &mockRepository{
		created:       created,
		transitionErr: errBoom,
	}
	store := &mockStorage{}
	queue := &mockQueue{}

	service := newTestService(repo, store, queue)

	video, err := service.Upload(
		ctx,
		mustUUIDString(),
		"clip.mp4",
		"video/mp4",
		strings.NewReader("bytes"),
	)
	if video != nil {
		t.Fatalf("Upload() video = %#v, want nil", video)
	}

	if !errors.Is(err, errBoom) {
		t.Fatalf("Upload() error = %v, want errBoom", err)
	}

	if repo.deletedID != created.ID.String() {
		t.Errorf("rollback deleted record %q, want %q", repo.deletedID, created.ID)
	}

	if store.deletedKey != created.StorageKey {
		t.Errorf("rollback deleted object %q, want %q", store.deletedKey, created.StorageKey)
	}

	if len(queue.enqueued) != 0 {
		t.Errorf("queue.Enqueue() called %d times after transition failure", len(queue.enqueued))
	}
}

func TestUploadSanitizesDirectoryTraversal(t *testing.T) {
	ctx := context.Background()

	userID := mustUUIDString()

	repo := &mockRepository{}
	store := &mockStorage{}
	queue := &mockQueue{}

	service := newTestService(repo, store, queue)

	_, err := service.Upload(
		ctx,
		userID,
		"../../etc/passwd",
		"video/mp4",
		strings.NewReader("bytes"),
	)
	if err != nil {
		t.Fatalf("Upload() error = %v", err)
	}

	key := store.savedKeys[0]
	if !strings.HasSuffix(key, "/passwd") {
		t.Errorf("StorageKey = %q, want base name passwd only", key)
	}

	if strings.Contains(key, "..") {
		t.Errorf("StorageKey %q contains directory traversal", key)
	}
}

func TestListByUser(t *testing.T) {
	ctx := context.Background()

	userID := mustUUIDString()

	videos := []Video{
		{ID: mustUUID(), UserID: mustUUID()},
	}

	repo := &mockRepository{listResult: videos}
	service := newTestService(repo, &mockStorage{}, nil)

	result, err := service.ListByUser(ctx, userID)
	if err != nil {
		t.Fatalf("ListByUser() error = %v", err)
	}

	if len(result) != 1 {
		t.Fatalf("ListByUser() returned %d videos, want 1", len(result))
	}
}

func TestGetByIDOwnership(t *testing.T) {
	ctx := context.Background()

	ownerID := mustUUID()
	otherID := mustUUID()

	video := &Video{
		ID:     mustUUID(),
		UserID: ownerID,
	}

	repo := &mockRepository{findResult: video}

	service := newTestService(repo, &mockStorage{}, nil)

	// Owner can retrieve the video.
	got, err := service.GetByID(ctx, ownerID.String(), video.ID.String())
	if err != nil {
		t.Fatalf("GetByID(owner) error = %v", err)
	}

	if got.ID != video.ID {
		t.Errorf("GetByID(owner) ID = %v, want %v", got.ID, video.ID)
	}

	// Another user is forbidden.
	_, err = service.GetByID(ctx, otherID.String(), video.ID.String())
	if !errors.Is(err, ErrForbidden) {
		t.Fatalf("GetByID(other) error = %v, want ErrForbidden", err)
	}
}

func TestGetByIDNotFound(t *testing.T) {
	ctx := context.Background()

	repo := &mockRepository{findByIDErr: ErrNotFound}

	service := newTestService(repo, &mockStorage{}, nil)

	_, err := service.GetByID(ctx, mustUUIDString(), mustUUIDString())
	if !errors.Is(err, ErrNotFound) {
		t.Fatalf("GetByID() error = %v, want ErrNotFound", err)
	}
}

func TestDeleteRemovesFileAndRecord(t *testing.T) {
	ctx := context.Background()

	userID := mustUUID()

	video := newVideoFixture()
	video.UserID = userID

	repo := &mockRepository{findResult: video}
	store := &mockStorage{}

	service := newTestService(repo, store, nil)

	if err := service.Delete(ctx, userID.String(), video.ID.String()); err != nil {
		t.Fatalf("Delete() error = %v", err)
	}

	if store.deletedKey != video.StorageKey {
		t.Errorf("Delete() removed %q, want %q", store.deletedKey, video.StorageKey)
	}

	if repo.deletedID != video.ID.String() {
		t.Errorf("Delete() removed record %q, want %q", repo.deletedID, video.ID.String())
	}
}

func TestDeleteForbidsOtherUsers(t *testing.T) {
	ctx := context.Background()

	video := newVideoFixture()

	repo := &mockRepository{findResult: video}

	service := newTestService(repo, &mockStorage{}, nil)

	err := service.Delete(ctx, mustUUIDString(), video.ID.String())
	if !errors.Is(err, ErrForbidden) {
		t.Fatalf("Delete() error = %v, want ErrForbidden", err)
	}

	// The object must not be deleted.
	if repo.deletedID != "" {
		t.Errorf("Delete() removed record %q for a non-owner", repo.deletedID)
	}
}

func TestDeletePropagatesStorageFailure(t *testing.T) {
	ctx := context.Background()

	video := newVideoFixture()

	repo := &mockRepository{findResult: video}
	store := &mockStorage{deleteErr: errBoom}

	service := newTestService(repo, store, nil)

	err := service.Delete(ctx, video.UserID.String(), video.ID.String())
	if !errors.Is(err, errBoom) {
		t.Fatalf("Delete() error = %v, want errBoom", err)
	}

	if repo.deletedID != "" {
		t.Errorf("Delete() removed record %q despite storage failure", repo.deletedID)
	}
}

func mustUUIDString() string {
	return mustUUID().String()
}

package storage

import (
	"context"
	"errors"
	"io"
	"strings"
	"testing"

	"github.com/aws/aws-sdk-go-v2/feature/s3/transfermanager"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
)

type fakeS3Objects struct {
	getOutput   *s3.GetObjectOutput
	getErr      error
	deleteInput *s3.DeleteObjectInput
	deleteErr   error
}

func (f *fakeS3Objects) GetObject(
	ctx context.Context,
	params *s3.GetObjectInput,
	optFns ...func(*s3.Options),
) (*s3.GetObjectOutput, error) {
	return f.getOutput, f.getErr
}

func (f *fakeS3Objects) DeleteObject(
	ctx context.Context,
	params *s3.DeleteObjectInput,
	optFns ...func(*s3.Options),
) (*s3.DeleteObjectOutput, error) {
	f.deleteInput = params
	return &s3.DeleteObjectOutput{}, f.deleteErr
}

type fakeS3Uploader struct {
	input *transfermanager.UploadObjectInput
	data  []byte
	err   error
}

func (f *fakeS3Uploader) UploadObject(
	ctx context.Context,
	input *transfermanager.UploadObjectInput,
	optFns ...func(*transfermanager.Options),
) (*transfermanager.UploadObjectOutput, error) {
	f.input = input

	if f.err != nil {
		return nil, f.err
	}

	data, err := io.ReadAll(input.Body)
	if err != nil {
		return nil, err
	}

	f.data = data

	return &transfermanager.UploadObjectOutput{}, nil
}

func TestS3StorageSave(t *testing.T) {
	objects := &fakeS3Objects{}
	uploader := &fakeS3Uploader{}

	store := newS3Storage(objects, uploader, "media")

	saved, err := store.Save(
		context.Background(),
		"user/video.mp4",
		strings.NewReader("hello"),
	)
	if err != nil {
		t.Fatalf("Save() error = %v", err)
	}

	if saved.Key != "user/video.mp4" {
		t.Errorf("Save() key = %q, want %q", saved.Key, "user/video.mp4")
	}

	if saved.Size != 5 {
		t.Errorf("Save() size = %d, want 5", saved.Size)
	}

	if uploader.input == nil {
		t.Fatal("UploadObject() was not called")
	}

	if *uploader.input.Bucket != "media" {
		t.Errorf("upload bucket = %q, want %q", *uploader.input.Bucket, "media")
	}

	if *uploader.input.Key != "user/video.mp4" {
		t.Errorf("upload key = %q, want %q", *uploader.input.Key, "user/video.mp4")
	}

	if string(uploader.data) != "hello" {
		t.Errorf("uploaded data = %q, want %q", uploader.data, "hello")
	}
}

func TestS3StorageSaveError(t *testing.T) {
	store := newS3Storage(
		&fakeS3Objects{},
		&fakeS3Uploader{err: errors.New("boom")},
		"media",
	)

	_, err := store.Save(
		context.Background(),
		"key",
		strings.NewReader("data"),
	)
	if !errors.Is(err, ErrSaveFailed) {
		t.Fatalf("Save() error = %v, want ErrSaveFailed", err)
	}
}

func TestS3StorageOpen(t *testing.T) {
	objects := &fakeS3Objects{
		getOutput: &s3.GetObjectOutput{
			Body: io.NopCloser(strings.NewReader("content")),
		},
	}

	store := newS3Storage(objects, &fakeS3Uploader{}, "media")

	reader, err := store.Open(context.Background(), "key")
	if err != nil {
		t.Fatalf("Open() error = %v", err)
	}
	defer reader.Close()

	content, err := io.ReadAll(reader)
	if err != nil {
		t.Fatalf("ReadAll() error = %v", err)
	}

	if string(content) != "content" {
		t.Errorf("Open() content = %q, want %q", content, "content")
	}
}

func TestS3StorageOpenMissingObject(t *testing.T) {
	store := newS3Storage(
		&fakeS3Objects{getErr: &types.NoSuchKey{}},
		&fakeS3Uploader{},
		"media",
	)

	_, err := store.Open(context.Background(), "missing")
	if !errors.Is(err, ErrFileNotFound) {
		t.Fatalf("Open() error = %v, want ErrFileNotFound", err)
	}
}

func TestS3StorageOpenError(t *testing.T) {
	store := newS3Storage(
		&fakeS3Objects{getErr: errors.New("boom")},
		&fakeS3Uploader{},
		"media",
	)

	_, err := store.Open(context.Background(), "key")
	if !errors.Is(err, ErrOpenFailed) {
		t.Fatalf("Open() error = %v, want ErrOpenFailed", err)
	}
}

func TestS3StorageDelete(t *testing.T) {
	objects := &fakeS3Objects{}

	store := newS3Storage(objects, &fakeS3Uploader{}, "media")

	if err := store.Delete(context.Background(), "key"); err != nil {
		t.Fatalf("Delete() error = %v", err)
	}

	if objects.deleteInput == nil {
		t.Fatal("DeleteObject() was not called")
	}

	if *objects.deleteInput.Key != "key" {
		t.Errorf("delete key = %q, want %q", *objects.deleteInput.Key, "key")
	}
}

func TestS3StorageDeleteIsIdempotent(t *testing.T) {
	store := newS3Storage(
		&fakeS3Objects{deleteErr: &types.NoSuchKey{}},
		&fakeS3Uploader{},
		"media",
	)

	if err := store.Delete(context.Background(), "missing"); err != nil {
		t.Fatalf("Delete() error = %v, want nil", err)
	}
}

func TestS3StorageDeleteError(t *testing.T) {
	store := newS3Storage(
		&fakeS3Objects{deleteErr: errors.New("boom")},
		&fakeS3Uploader{},
		"media",
	)

	err := store.Delete(context.Background(), "key")
	if !errors.Is(err, ErrDeleteFailed) {
		t.Fatalf("Delete() error = %v, want ErrDeleteFailed", err)
	}
}

func TestS3Endpoint(t *testing.T) {
	tests := []struct {
		name     string
		endpoint string
		useSSL   bool
		want     string
	}{
		{name: "empty", want: ""},
		{name: "host and port", endpoint: "minio:9000", want: "http://minio:9000"},
		{name: "secure host", endpoint: "s3.example.com", useSSL: true, want: "https://s3.example.com"},
		{name: "explicit scheme", endpoint: "https://s3.example.com/", want: "https://s3.example.com"},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			got, err := s3Endpoint(test.endpoint, test.useSSL)
			if err != nil {
				t.Fatalf("s3Endpoint() error = %v", err)
			}

			if got != test.want {
				t.Errorf("s3Endpoint() = %q, want %q", got, test.want)
			}
		})
	}
}

func TestNewS3StorageRequiresBucket(t *testing.T) {
	_, err := NewS3Storage(context.Background(), S3Options{})
	if err == nil {
		t.Fatal("NewS3Storage() error = nil, want bucket validation error")
	}
}

func TestStorageFactoryLocal(t *testing.T) {
	store, err := New(
		context.Background(),
		Config{Driver: "local", LocalRoot: t.TempDir()},
	)
	if err != nil {
		t.Fatalf("New() error = %v", err)
	}

	if _, ok := store.(*LocalStorage); !ok {
		t.Errorf("New() type = %T, want *LocalStorage", store)
	}
}

func TestStorageFactoryRejectsUnknownDriver(t *testing.T) {
	_, err := New(context.Background(), Config{Driver: "ftp"})
	if err == nil {
		t.Fatal("New() error = nil, want unsupported driver error")
	}
}

package storage

import (
	"context"
	"errors"
	"io"
	"strings"
	"testing"
)

func TestLocalStorageSaveOpen(t *testing.T) {
	ctx := context.Background()

	store := NewLocalStorage(t.TempDir())

	saved, err := store.Save(ctx, "user/1/video.mp4", strings.NewReader("hello"))
	if err != nil {
		t.Fatalf("Save() error = %v", err)
	}

	if saved.Key != "user/1/video.mp4" {
		t.Errorf("Save() key = %q, want %q", saved.Key, "user/1/video.mp4")
	}

	if saved.Size != 5 {
		t.Errorf("Save() size = %d, want 5", saved.Size)
	}

	reader, err := store.Open(ctx, "user/1/video.mp4")
	if err != nil {
		t.Fatalf("Open() error = %v", err)
	}
	defer reader.Close()

	content, err := io.ReadAll(reader)
	if err != nil {
		t.Fatalf("ReadAll() error = %v", err)
	}

	if string(content) != "hello" {
		t.Errorf("Open() content = %q, want %q", content, "hello")
	}
}

func TestLocalStorageSaveCreatesNestedDirectories(t *testing.T) {
	ctx := context.Background()

	store := NewLocalStorage(t.TempDir())

	_, err := store.Save(ctx, "a/b/c/d/file.ts", strings.NewReader("x"))
	if err != nil {
		t.Fatalf("Save() nested path error = %v", err)
	}

	if _, err := store.Open(ctx, "a/b/c/d/file.ts"); err != nil {
		t.Errorf("Open() nested path error = %v", err)
	}
}

func TestLocalStorageOpenMissingFile(t *testing.T) {
	ctx := context.Background()

	store := NewLocalStorage(t.TempDir())

	_, err := store.Open(ctx, "does/not/exist.mp4")
	if !errors.Is(err, ErrFileNotFound) {
		t.Fatalf("Open() error = %v, want ErrFileNotFound", err)
	}
}

func TestLocalStorageDelete(t *testing.T) {
	ctx := context.Background()

	store := NewLocalStorage(t.TempDir())

	_, err := store.Save(ctx, "video.ts", strings.NewReader("data"))
	if err != nil {
		t.Fatalf("Save() error = %v", err)
	}

	if err := store.Delete(ctx, "video.ts"); err != nil {
		t.Fatalf("Delete() error = %v", err)
	}

	if _, err := store.Open(ctx, "video.ts"); !errors.Is(err, ErrFileNotFound) {
		t.Errorf("Open() after Delete() error = %v, want ErrFileNotFound", err)
	}
}

func TestLocalStorageDeleteMissingFile(t *testing.T) {
	ctx := context.Background()

	store := NewLocalStorage(t.TempDir())

	err := store.Delete(ctx, "missing.ts")
	if !errors.Is(err, ErrFileNotFound) {
		t.Fatalf("Delete() error = %v, want ErrFileNotFound", err)
	}
}

func TestLocalStorageIsolationBetweenInstances(t *testing.T) {
	ctx := context.Background()

	first := NewLocalStorage(t.TempDir())
	second := NewLocalStorage(t.TempDir())

	if _, err := first.Save(ctx, "key.ts", strings.NewReader("x")); err != nil {
		t.Fatalf("Save() error = %v", err)
	}

	if _, err := second.Open(ctx, "key.ts"); !errors.Is(err, ErrFileNotFound) {
		t.Errorf("second instance Open() error = %v, want ErrFileNotFound", err)
	}
}
package processor

import (
	"context"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"os"
	"path/filepath"

	"github.com/shivamx64/streamix/internal/storage"
	"github.com/shivamx64/streamix/internal/transcoder"
	"github.com/shivamx64/streamix/internal/videos"
)

// Permanent failures indicate a job that can never succeed and
// should not be retried.
var (
	ErrSourceNotFound = errors.New("video source file not found")
)

// Processor downloads, transcodes, and persists HLS outputs for jobs.
type Processor struct {
	repo       videos.Repository
	storage    storage.Storage
	transcoder *transcoder.Transcoder
	workRoot   string

	logger *slog.Logger
}

// New creates a Processor.
func New(
	repo videos.Repository,
	storageBackend storage.Storage,
	tx *transcoder.Transcoder,
	workRoot string,
	logger *slog.Logger,
) *Processor {
	return &Processor{
		repo:       repo,
		storage:    storageBackend,
		transcoder: tx,
		workRoot:   workRoot,
		logger:     logger,
	}
}

// Fail marks a video as failed.
func (p *Processor) Fail(
	ctx context.Context,
	videoID string,
) {
	if err := p.repo.SetStatus(
		ctx,
		videoID,
		videos.StatusFailed,
	); err != nil {
		p.logger.Error(
			"mark video failed",
			"video_id", videoID,
			"error", err,
		)
	}
}

// Process performs the full transcoding pipeline for a job.
//
// It returns permanent=true for failures that cannot be recovered by
// retrying (missing source, invalid media). All other failures are
// transient and the caller may retry the job.
func (p *Processor) Process(
	ctx context.Context,
	job videos.Job,
) (permanent bool, err error) {

	if err := p.repo.SetStatus(
		ctx,
		job.VideoID,
		videos.StatusProcessing,
	); err != nil {
		return false, fmt.Errorf("mark video processing: %w", err)
	}

	workDir, err := os.MkdirTemp(
		p.workRoot,
		"video-",
	)
	if err != nil {
		return false, fmt.Errorf("create working directory: %w", err)
	}
	defer os.RemoveAll(workDir)

	sourcePath := filepath.Join(
		workDir,
		filepath.Base(job.StorageKey),
	)

	if err := p.download(
		ctx,
		job.StorageKey,
		sourcePath,
	); err != nil {
		if errors.Is(err, storage.ErrFileNotFound) {
			p.Fail(ctx, job.VideoID)
			return true, ErrSourceNotFound
		}

		return false, fmt.Errorf("download source: %w", err)
	}

	probe, err := p.transcoder.Probe(ctx, sourcePath)
	if err != nil {
		// The uploaded object is not a valid video.
		p.Fail(ctx, job.VideoID)
		return true, fmt.Errorf("probe source: %w", err)
	}

	destDir := filepath.Join(workDir, "output")

	output, err := p.transcoder.Transcode(
		ctx,
		sourcePath,
		destDir,
		probe,
	)
	if err != nil {
		// Encoding failures may be transient (resources, codecs),
		// so let the caller decide whether to retry.
		return false, fmt.Errorf("transcode source: %w", err)
	}

	if err := p.uploadOutputs(
		ctx,
		job,
		output,
	); err != nil {
		return false, fmt.Errorf("upload outputs: %w", err)
	}

	if err := p.repo.SetStatus(
		ctx,
		job.VideoID,
		videos.StatusCompleted,
	); err != nil {
		return false, fmt.Errorf("mark video completed: %w", err)
	}

	p.logger.Info(
		"video processed",
		"video_id", job.VideoID,
		"duration", probe.DurationSeconds,
	)

	return false, nil
}

// download copies a storage object into a local file.
func (p *Processor) download(
	ctx context.Context,
	key string,
	dest string,
) error {

	reader, err := p.storage.Open(ctx, key)
	if err != nil {
		return err
	}
	defer reader.Close()

	file, err := os.Create(dest)
	if err != nil {
		return fmt.Errorf("create local file: %w", err)
	}
	defer file.Close()

	if _, err := io.Copy(file, reader); err != nil {
		return fmt.Errorf("copy source to disk: %w", err)
	}

	return nil
}

// uploadOutputs persists all HLS files and the thumbnail to storage.
func (p *Processor) uploadOutputs(
	ctx context.Context,
	job videos.Job,
	output *transcoder.Output,
) error {

	hlsBase := filepath.Join(
		job.UserID,
		job.VideoID,
		"hls",
	)

	err := filepath.WalkDir(
		output.Root,
		func(path string, entry os.DirEntry, err error) error {
			if err != nil {
				return err
			}

			if entry.IsDir() {
				return nil
			}

			// The thumbnail moves to its own key below.
			if filepath.Clean(path) == filepath.Clean(output.Thumbnail) {
				return nil
			}

			rel, err := filepath.Rel(output.Root, path)
			if err != nil {
				return err
			}

			return p.saveFile(
				ctx,
				path,
				filepath.Join(hlsBase, filepath.ToSlash(rel)),
			)
		},
	)
	if err != nil {
		return err
	}

	if err := p.saveFile(
		ctx,
		output.Thumbnail,
		filepath.Join(job.UserID, job.VideoID, "thumbnail.jpg"),
	); err != nil {
		return err
	}

	return nil
}

// saveFile copies a local file into storage under the given key.
func (p *Processor) saveFile(
	ctx context.Context,
	localPath string,
	key string,
) error {

	file, err := os.Open(localPath)
	if err != nil {
		return fmt.Errorf("open output file: %w", err)
	}
	defer file.Close()

	var size int64
	info, err := file.Stat()
	if err == nil {
		size = info.Size()
	}

	_, err = p.storage.Save(ctx, key, file)
	if err != nil {
		return fmt.Errorf("store output %s: %w", key, err)
	}

	p.logger.Debug(
		"output stored",
		"key", key,
		"size", size,
	)

	return nil
}
package transcoder

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
)

// Transcoder wraps ffmpeg and ffprobe executables.
type Transcoder struct {
	ffmpegPath  string
	ffprobePath string
}

// New creates a Transcoder using the provided executable paths.
// Empty paths fall back to executables on PATH.
func New(ffmpegPath, ffprobePath string) (*Transcoder, error) {
	if ffmpegPath == "" {
		ffmpegPath = "ffmpeg"
	}

	if ffprobePath == "" {
		ffprobePath = "ffprobe"
	}

	return &Transcoder{
		ffmpegPath:  ffmpegPath,
		ffprobePath: ffprobePath,
	}, nil
}

// Probe describes media characteristics of an input file.
type Probe struct {
	DurationSeconds float64
	Width           int
	Height          int
}

// probeResponse maps the subset of ffprobe output we consume.
type probeResponse struct {
	Format struct {
		Duration string `json:"duration"`
	} `json:"format"`
	Streams []struct {
		CodecType string `json:"codec_type"`
		Width     int    `json:"width"`
		Height    int    `json:"height"`
	} `json:"streams"`
}

// Probe reads metadata from the input media file.
func (t *Transcoder) Probe(
	ctx context.Context,
	input string,
) (*Probe, error) {

	cmd := exec.CommandContext(
		ctx,
		t.ffprobePath,
		"-v", "error",
		"-print_format", "json",
		"-show_format",
		"-show_streams",
		input,
	)

	var stdout bytes.Buffer
	cmd.Stdout = &stdout

	var stderr bytes.Buffer
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		return nil, fmt.Errorf(
			"run ffprobe: %w: %s",
			err,
			strings.TrimSpace(stderr.String()),
		)
	}

	var parsed probeResponse
	if err := json.Unmarshal(
		stdout.Bytes(),
		&parsed,
	); err != nil {
		return nil, fmt.Errorf("parse ffprobe output: %w", err)
	}

	duration, _ := strconv.ParseFloat(
		parsed.Format.Duration,
		64,
	)

	probe := &Probe{
		DurationSeconds: duration,
	}

	for _, stream := range parsed.Streams {
		if stream.CodecType != "video" {
			continue
		}

		probe.Width = stream.Width
		probe.Height = stream.Height

		break
	}

	if probe.Width == 0 || probe.Height == 0 {
		return nil, fmt.Errorf("no video stream found in %s", input)
	}

	return probe, nil
}

// Rendition describes a single HLS output variant.
type Rendition struct {
	Name          string
	VideoHeight   int
	VideoBitrateKb int
	AudioBitrateKb int
}

// DefaultRenditions are the standard HLS ladder. Renditions with a
// target height greater than the source height are skipped at runtime.
var DefaultRenditions = []Rendition{
	{
		Name:           "1080p",
		VideoHeight:    1080,
		VideoBitrateKb: 4000,
		AudioBitrateKb: 192,
	},
	{
		Name:           "720p",
		VideoHeight:    720,
		VideoBitrateKb: 2500,
		AudioBitrateKb: 128,
	},
	{
		Name:           "480p",
		VideoHeight:    480,
		VideoBitrateKb: 1000,
		AudioBitrateKb: 96,
	},
}

// Output describes the result of a transcode operation.
type Output struct {
	// Root is the directory containing the HLS files.
	Root string

	// MasterPlaylist is the absolute path to the master m3u8.
	MasterPlaylist string

	// Thumbnail is the absolute path to the generated poster image.
	Thumbnail string
}

// Transcode converts the input into adaptive HLS renditions and
// generates a thumbnail. All output is written beneath destDir.
func (t *Transcoder) Transcode(
	ctx context.Context,
	input string,
	destDir string,
	probe *Probe,
) (*Output, error) {

	if err := os.MkdirAll(
		destDir,
		0755,
	); err != nil {
		return nil, fmt.Errorf("create transcode directory: %w", err)
	}

	renditions := selectRenditions(
		DefaultRenditions,
		probe.Height,
	)

	for _, rendition := range renditions {
		if err := t.transcodeRendition(
			ctx,
			input,
			destDir,
			rendition,
		); err != nil {
			return nil, err
		}
	}

	master := filepath.Join(
		destDir,
		"master.m3u8",
	)

	if err := writeMasterPlaylist(
		master,
		renditions,
	); err != nil {
		return nil, err
	}

	thumbnail := filepath.Join(
		destDir,
		"thumbnail.jpg",
	)

	if err := t.generateThumbnail(
		ctx,
		input,
		thumbnail,
		probe.DurationSeconds,
	); err != nil {
		return nil, err
	}

	return &Output{
		Root:           destDir,
		MasterPlaylist: master,
		Thumbnail:      thumbnail,
	}, nil
}

// transcodeRendition encodes a single HLS variant below destDir.
func (t *Transcoder) transcodeRendition(
	ctx context.Context,
	input string,
	destDir string,
	rendition Rendition,
) error {

	renditionDir := filepath.Join(
		destDir,
		rendition.Name,
	)

	if err := os.MkdirAll(
		renditionDir,
		0755,
	); err != nil {
		return fmt.Errorf(
			"create rendition directory: %w",
			err,
		)
	}

	segmentFilename := filepath.Join(
		renditionDir,
		"segment_%03d.ts",
	)

	playlistFilename := filepath.Join(
		renditionDir,
		"index.m3u8",
	)

	args := []string{
		"-y",
		"-i", input,
		"-vf", fmt.Sprintf("scale=-2:%d", rendition.VideoHeight),
		"-pix_fmt", "yuv420p",
		"-c:v", "libx264",
		"-preset", "veryfast",
		"-profile:v", "main",
		"-crf", "23",
		"-maxrate", fmt.Sprintf("%dk", rendition.VideoBitrateKb),
		"-bufsize", fmt.Sprintf("%dk", rendition.VideoBitrateKb*2),
		"-c:a", "aac",
		"-b:a", fmt.Sprintf("%dk", rendition.AudioBitrateKb),
		"-movflags", "+faststart",
		"-hls_time", "6",
		"-hls_playlist_type", "vod",
		"-hls_list_size", "0",
		"-hls_segment_filename", segmentFilename,
		playlistFilename,
	}

	return t.runFFmpeg(ctx, args)
}

// generateThumbnail extracts a poster frame from the input.
func (t *Transcoder) generateThumbnail(
	ctx context.Context,
	input string,
	output string,
	durationSeconds float64,
) error {

	// Sample at the smaller of 1 second or 10% into the video.
	offset := 1.0

	if durationSeconds > 0 && durationSeconds/10 < offset {
		offset = durationSeconds / 10
	}

	args := []string{
		"-y",
		"-ss", strconv.FormatFloat(offset, 'f', 2, 64),
		"-i", input,
		"-frames:v", "1",
		"-vf", "scale=480:-2",
		"-q:v", "3",
		output,
	}

	return t.runFFmpeg(ctx, args)
}

// runFFmpeg executes ffmpeg and surfaces any failure.
func (t *Transcoder) runFFmpeg(
	ctx context.Context,
	args []string,
) error {

	cmd := exec.CommandContext(
		ctx,
		t.ffmpegPath,
		args...,
	)

	var stderr bytes.Buffer
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		return fmt.Errorf(
			"run ffmpeg: %w: %s",
			err,
			strings.TrimSpace(stderr.String()),
		)
	}

	return nil
}

// selectRenditions keeps only renditions smaller than the source.
func selectRenditions(
	all []Rendition,
	sourceHeight int,
) []Rendition {

	selected := make([]Rendition, 0, len(all))

	for _, rendition := range all {
		if rendition.VideoHeight > sourceHeight {
			continue
		}

		selected = append(selected, rendition)
	}

	// Always keep at least one rendition so playback is possible.
	if len(selected) == 0 {
		selected = []Rendition{{
			Name:           "240p",
			VideoHeight:    240,
			VideoBitrateKb: 400,
			AudioBitrateKb: 64,
		}}
	}

	return selected
}

// writeMasterPlaylist generates an EXT-X-STREAM-INF master playlist.
func writeMasterPlaylist(
	path string,
	renditions []Rendition,
) error {

	var sb strings.Builder

	sb.WriteString("#EXTM3U\n")
	sb.WriteString("#EXT-X-VERSION:3\n")

	for _, rendition := range renditions {
		bandwidth := (rendition.VideoBitrateKb + rendition.AudioBitrateKb) * 1000

		resolution := fmt.Sprintf(
			"%dx%d",
			widthForHeight(rendition.VideoHeight),
			rendition.VideoHeight,
		)

		sb.WriteString("#EXT-X-STREAM-INF:BANDWIDTH=")
		sb.WriteString(strconv.Itoa(bandwidth))
		sb.WriteString(",RESOLUTION=")
		sb.WriteString(resolution)
		sb.WriteString(",NAME=\"")
		sb.WriteString(rendition.Name)
		sb.WriteString("\"\n")

		sb.WriteString(rendition.Name)
		sb.WriteString("/index.m3u8\n")
	}

	return os.WriteFile(
		path,
		[]byte(sb.String()),
		0644,
	)
}

// widthForHeight returns the 16:9 width for a given height.
func widthForHeight(height int) int {
	return height * 16 / 9
}
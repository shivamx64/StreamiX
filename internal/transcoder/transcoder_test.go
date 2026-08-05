package transcoder

import (
	"context"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"
)

func TestSelectRenditions(t *testing.T) {
	tests := []struct {
		name         string
		sourceHeight int
		want         []string
	}{
		{
			name:         "1080p source keeps full ladder",
			sourceHeight: 1080,
			want:         []string{"1080p", "720p", "480p"},
		},
		{
			name:         "720p source drops 1080p",
			sourceHeight: 720,
			want:         []string{"720p", "480p"},
		},
		{
			name:         "grainy 1080p source is 480p",
			sourceHeight: 500,
			want:         []string{"480p"},
		},
		{
			name:         "tiny source falls back to 240p",
			sourceHeight: 100,
			want:         []string{"240p"},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := selectRenditions(DefaultRenditions, tt.sourceHeight)

			names := make([]string, 0, len(got))
			for _, rendition := range got {
				names = append(names, rendition.Name)
			}

			if strings.Join(names, ",") != strings.Join(tt.want, ",") {
				t.Errorf(
					"selectRenditions(%d) = %v, want %v",
					tt.sourceHeight,
					names,
					tt.want,
				)
			}
		})
	}
}

func TestWidthForHeight(t *testing.T) {
	if got := widthForHeight(720); got != 1280 {
		t.Errorf("widthForHeight(720) = %d, want 1280", got)
	}

	if got := widthForHeight(480); got != 853 {
		t.Errorf("widthForHeight(480) = %d, want 853", got)
	}
}

func TestWriteMasterPlaylist(t *testing.T) {
	path := filepath.Join(t.TempDir(), "master.m3u8")

	renditions := []Rendition{
		{
			Name:           "720p",
			VideoHeight:    720,
			VideoBitrateKb: 2500,
			AudioBitrateKb: 128,
		},
	}

	if err := writeMasterPlaylist(path, renditions); err != nil {
		t.Fatalf("writeMasterPlaylist() error = %v", err)
	}

	content, err := os.ReadFile(path)
	if err != nil {
		t.Fatalf("ReadFile() error = %v", err)
	}

	text := string(content)

	if !strings.HasPrefix(text, "#EXTM3U\n") {
		t.Errorf("master playlist missing #EXTM3U header")
	}

	want := "#EXT-X-STREAM-INF:BANDWIDTH=2628000,RESOLUTION=1280x720,NAME=\"720p\"\n720p/index.m3u8"
	if !strings.Contains(text, want) {
		t.Errorf("master playlist = %q, want it to contain %q", text, want)
	}
}

func TestTranscodeEndToEnd(t *testing.T) {
	if _, err := exec.LookPath("ffmpeg"); err != nil {
		t.Skip("ffmpeg not available")
	}

	ctx := context.Background()

	tx, err := New("", "")
	if err != nil {
		t.Fatalf("New() error = %v", err)
	}

	source := filepath.Join(t.TempDir(), "input.mp4")

	// Generate a small but real video with ffmpeg.
	cmd := exec.CommandContext(
		ctx,
		"ffmpeg",
		"-y",
		"-f", "lavfi",
		"-i", "testsrc=duration=2:size=320x240:rate=24",
		"-f", "lavfi",
		"-i", "sine=frequency=440:duration=2",
		"-c:v", "libx264",
		"-pix_fmt", "yuv420p",
		"-c:a", "aac",
		"-shortest",
		source,
	)
	if output, err := cmd.CombinedOutput(); err != nil {
		t.Fatalf("generate source video: %v: %s", err, output)
	}

	probe, err := tx.Probe(ctx, source)
	if err != nil {
		t.Fatalf("Probe() error = %v", err)
	}

	if probe.Width != 320 || probe.Height != 240 {
		t.Errorf("Probe() = %dx%d, want 320x240", probe.Width, probe.Height)
	}

	if probe.DurationSeconds < 1 || probe.DurationSeconds > 3 {
		t.Errorf("Probe() duration = %v, want ~2s", probe.DurationSeconds)
	}

	destDir := filepath.Join(t.TempDir(), "output")

	output, err := tx.Transcode(ctx, source, destDir, probe)
	if err != nil {
		t.Fatalf("Transcode() error = %v", err)
	}

	// A 240p source should only produce the 240p fallback rendition.
	if _, err := os.Stat(filepath.Join(destDir, "240p", "index.m3u8")); err != nil {
		t.Errorf("expected 240p rendition, got %v", err)
	}

	if _, err := os.Stat(output.MasterPlaylist); err != nil {
		t.Errorf("master playlist missing: %v", err)
	}

	if _, err := os.Stat(output.Thumbnail); err != nil {
		t.Errorf("thumbnail missing: %v", err)
	}

	// All generated files must live beneath destDir.
	err = filepath.WalkDir(destDir, func(path string, entry os.DirEntry, err error) error {
		if err != nil {
			return err
		}

		if !entry.IsDir() && filepath.Ext(path) == ".m3u8" {
			content, err := os.ReadFile(path)
			if err != nil {
				return err
			}

			// Playlists must only reference relative paths.
			for _, line := range strings.Split(string(content), "\n") {
				if strings.HasPrefix(line, "/") {
					t.Errorf("%s references absolute path %q", path, line)
				}
			}
		}

		return nil
	})
	if err != nil {
		t.Fatalf("WalkDir() error = %v", err)
	}
}

func TestProbeRejectsInvalidMedia(t *testing.T) {
	if _, err := exec.LookPath("ffprobe"); err != nil {
		t.Skip("ffprobe not available")
	}

	ctx := context.Background()

	tx, err := New("", "")
	if err != nil {
		t.Fatalf("New() error = %v", err)
	}

	// Write a text file where a video is expected.
	invalid := filepath.Join(t.TempDir(), "fake.mp4")
	if err := os.WriteFile(invalid, []byte("not a video"), 0644); err != nil {
		t.Fatalf("WriteFile() error = %v", err)
	}

	if _, err := tx.Probe(ctx, invalid); err == nil {
		t.Error("Probe() on invalid media expected error, got nil")
	}
}
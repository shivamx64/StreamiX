package videos

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Status represents the current processing state of a video.
type Status string

const (
	StatusUploaded   Status = "uploaded"
	StatusQueued     Status = "queued"
	StatusProcessing Status = "processing"
	StatusCompleted  Status = "completed"
	StatusFailed     Status = "failed"
)

// Rendition describes a single HLS output variant.
type Rendition struct {
	Name           string `json:"name"`
	Height         int    `json:"height"`
	VideoBitrateKb int    `json:"video_bitrate_kb"`
	AudioBitrateKb int    `json:"audio_bitrate_kb"`
}

// RenditionList is persisted as JSONB in PostgreSQL.
type RenditionList []Rendition

// Value implements driver.Valuer.
func (r RenditionList) Value() (driver.Value, error) {
	if r == nil {
		return "[]", nil
	}

	data, err := json.Marshal(r)
	if err != nil {
		return nil, err
	}

	return string(data), nil
}

// Scan implements sql.Scanner.
func (r *RenditionList) Scan(value any) error {
	if value == nil {
		*r = nil
		return nil
	}

	var data []byte

	switch v := value.(type) {
	case []byte:
		data = v
	case string:
		data = []byte(v)
	default:
		return fmt.Errorf("scan renditions: unsupported type %T", value)
	}

	if len(data) == 0 {
		*r = nil
		return nil
	}

	return json.Unmarshal(data, r)
}

// ProcessingResult contains the outputs of a successful transcode.
type ProcessingResult struct {
	DurationSeconds float64
	Width           int
	Height          int
	HLSMasterKey    string
	ThumbnailKey    string
	Renditions      RenditionList
	CompletedAt     time.Time
}

// Video represents a video uploaded by a user.
type Video struct {
	ID               uuid.UUID `gorm:"type:uuid;primaryKey"`
	UserID           uuid.UUID `gorm:"type:uuid;not null;index"`
	OriginalFilename string    `gorm:"not null"`
	StorageKey       string    `gorm:"not null;uniqueIndex"`
	MimeType         string    `gorm:"not null"`
	Size             int64     `gorm:"not null"`
	Status           Status    `gorm:"type:text;not null;default:'uploaded'"`
	DurationSeconds  float64   `gorm:"not null;default:0"`
	Width            int       `gorm:"not null;default:0"`
	Height           int       `gorm:"not null;default:0"`
	HLSMasterKey     string
	ThumbnailKey     string
	Renditions       RenditionList `gorm:"type:jsonb;not null;default:'[]'"`
	ProcessingError  string        `gorm:"type:text"`
	CompletedAt      *time.Time
	CreatedAt        time.Time
	UpdatedAt        time.Time
}

// BeforeCreate generates a UUID before inserting the record.
func (v *Video) BeforeCreate(tx *gorm.DB) error {
	if v.ID == uuid.Nil {
		v.ID = uuid.New()
	}

	return nil
}

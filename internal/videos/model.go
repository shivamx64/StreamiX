package videos

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Status represents the current processing state of a video.
type Status string

const (
	StatusUploaded  Status = "uploaded"
	StatusQueued    Status = "queued"
	StatusProcessing Status = "processing"
	StatusCompleted Status = "completed"
	StatusFailed    Status = "failed"
)

// Video represents a video uploaded by a user.
type Video struct {
	ID uuid.UUID `gorm:"type:uuid;primaryKey"`
	UserID uuid.UUID `gorm:"type:uuid;not null;index"`
	OriginalFilename string `gorm:"not null"`
	StorageKey       string `gorm:"not null;uniqueIndex"`
	MimeType string `gorm:"not null"`
	Size int64 `gorm:"not null"`
	Status Status `gorm:"type:text;not null;default:'uploaded'"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

// BeforeCreate generates a UUID before inserting the record.
func (v *Video) BeforeCreate(tx *gorm.DB) error {
	if v.ID == uuid.Nil {
		v.ID = uuid.New()
	}

	return nil
}
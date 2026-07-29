package users

import (
	"time"

	"github.com/google/uuid"
)

// User represents an application user.
type User struct {
	ID uuid.UUID	`gorm:"type:uuid;primarykey"`
	Email	string	`gorm:"uniqueIndex;not null"`
	PasswordHash	string `gorm:"not null"`
	CreatedAt	time.Time
	UpdatedAt	time.Time
}
package database

import (
	"fmt"

	"github.com/shivamx64/streamix/internal/users"
	"github.com/shivamx64/streamix/internal/videos"
	"gorm.io/gorm"
)

// Migrate runs all database schema migrations.
func Migrate(db *gorm.DB) error {
	if err := db.AutoMigrate(
		&users.User{},
		&videos.Video{},
	); err != nil {
		return fmt.Errorf("auto migrate database schema: %w", err)
	}
	return nil
}
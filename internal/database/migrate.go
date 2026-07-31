package database

import (
	"fmt"

	"github.com/shivamx64/streamix/internal/users"
	"gorm.io/gorm"
)

// Migrate runs all database schema migrations.
func Migrate(db *gorm.DB) error {
	if err := db.AutoMigrate(
		&users.User{},
	); err != nil {
		return fmt.Errorf("auto migrate users table: %w", err)
	}
	return nil
}
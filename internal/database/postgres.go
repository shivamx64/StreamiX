package database

import (
	"fmt"
	"log/slog"
	"time"

	"github.com/shivamx64/streamix/internal/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// New establishes a PostgreSQL connection and returns a configured GORM instance.
func New(cfg *config.Config, logger *slog.Logger) (*gorm.DB, error) {
	dsn := fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		cfg.Database.Host,
		cfg.Database.Port,
		cfg.Database.User,
		cfg.Database.Password,
		cfg.Database.Name,
		cfg.Database.SSLMode,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("open postgres connection: %w", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("retrieve sql.DB: %w", err)
	}

	sqlDB.SetMaxOpenConns(25)
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetConnMaxLifetime(time.Hour)

	if err := sqlDB.Ping(); err != nil {
		return nil, fmt.Errorf("ping postgres: %w", err)
	}

	logger.Info(
		"connected to PostgreSQL",
		"host", cfg.Database.Host,
		"database", cfg.Database.Name,
	)

	return db, nil
}
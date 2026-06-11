package database

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/shivamx64/streamix/internal/config"
)

func NewPostgres(cfg *config.Config) (*pgxpool.Pool, error) {
	return pgxpool.New(
		context.Background(),
		cfg.DatabaseURL,
	)
}
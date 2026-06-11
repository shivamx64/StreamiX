package container

import (
	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"

	"github.com/shivamx64/streamix/internal/config"
)

type Container struct {
	Config *config.Config
	Logger *zap.Logger
	DB     *pgxpool.Pool
}
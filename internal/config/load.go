package config

import (
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

// Load reads the application's configuration from environment variables,
// applies sensible defaults, validates required values,
// and returns a fully initialized Config.
func Load() (*Config, error) {
	// Load .env during local development.
	// In production, environment variables are expected to be provided
	// by Docker, Kubernetes, or the hosting platform.
	_ = godotenv.Load()

	dbHost, err := requireEnv("DB_HOST")
	if err != nil {
		return nil, err
	}

	dbUser, err := requireEnv("DB_USER")
	if err != nil {
		return nil, err
	}

	dbPassword, err := requireEnv("DB_PASSWORD")
	if err != nil {
		return nil, err
	}

	dbName, err := requireEnv("DB_NAME")
	if err != nil {
		return nil, err
	}

	dbPort, err := requireEnvAsInt("DB_PORT")
	if err != nil {
		return nil, err
	}

	httpPort, err := getEnvAsInt("HTTP_PORT", 8080)
	if err != nil {
		return nil, err
	}

	jwtSecret, err := requireEnv("JWT_SECRET")
	if err != nil {
		return nil, err
	}

	accessTokenTTL, err := time.ParseDuration(
		getEnv("JWT_ACCESS_TOKEN_TTL", "15m"),
	)
	if err != nil {
		return nil, fmt.Errorf(
			"configuration error: JWT_ACCESS_TOKEN_TTL must be a valid duration: %w",
			err,
		)
	}

	refreshTokenTTL, err := time.ParseDuration(
		getEnv("JWT_REFRESH_TOKEN_TTL", "168h"),
	)
	if err != nil {
		return nil, fmt.Errorf(
			"configuration error: JWT_REFRESH_TOKEN_TTL must be a valid duration: %w",
			err,
		)
	}

	redisDB, err := getEnvAsInt("REDIS_DB", 0)
	if err != nil {
		return nil, err
	}

	claimIdle, err := time.ParseDuration(
		getEnv("QUEUE_CLAIM_IDLE", "3s"),
	)
	if err != nil {
		return nil, fmt.Errorf(
			"configuration error: QUEUE_CLAIM_IDLE must be a valid duration: %w",
			err,
		)
	}

	cfg := &Config{
		App: AppConfig{
			Name:        getEnv("APP_NAME", "streamix-api"),
			Environment: getEnv("APP_ENV", "development"),
			Version:     getEnv("APP_VERSION", "dev"),
		},
		HTTP: HTTPConfig{
			Host: getEnv("HTTP_HOST", "0.0.0.0"),
			Port: httpPort,
		},
		Database: DatabaseConfig{
			Host:     dbHost,
			Port:     dbPort,
			User:     dbUser,
			Password: dbPassword,
			Name:     dbName,
			SSLMode:  getEnv("DB_SSLMODE", "disable"),
		},
		Auth: AuthConfig{
			JWTSecret:       jwtSecret,
			AccessTokenTTL:  accessTokenTTL,
			RefreshTokenTTL: refreshTokenTTL,
		},
		Storage: StorageConfig{
			Driver:    getEnv("STORAGE_DRIVER", "local"),
			LocalRoot: getEnv("LOCAL_STORAGE_ROOT", "storage"),
		},
		Queue: QueueConfig{
			Driver:        getEnv("QUEUE_DRIVER", "redis"),
			RedisAddr:     getEnv("REDIS_ADDR", "localhost:6379"),
			RedisPassword: getEnv("REDIS_PASSWORD", ""),
			RedisDB:       redisDB,
			Stream:        getEnv("QUEUE_STREAM", "video-transcode"),
			Group:         getEnv("QUEUE_GROUP", "transcode-workers"),
			ClaimIdle:     claimIdle,
		},
	}

	return cfg, nil
}

// getEnv returns the value of an environment variable.
// If it is not set, the provided default value is returned.
func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)

	if value == "" {
		return defaultValue
	}

	return value
}

// requireEnv returns the value of a required environment variable.
func requireEnv(key string) (string, error) {
	value := os.Getenv(key)

	if value == "" {
		return "", fmt.Errorf("configuration error: %s is required", key)
	}

	return value, nil
}

// getEnvAsInt returns an integer environment variable.
// If it is not set, the provided default value is returned.
func getEnvAsInt(key string, defaultValue int) (int, error) {
	value := os.Getenv(key)

	if value == "" {
		return defaultValue, nil
	}

	parsed, err := strconv.Atoi(value)
	if err != nil {
		return 0, fmt.Errorf("configuration error: %s must be a valid integer", key)
	}

	return parsed, nil
}

// requireEnvAsInt returns a required integer environment variable.
func requireEnvAsInt(key string) (int, error) {
	value := os.Getenv(key)

	if value == "" {
		return 0, fmt.Errorf("configuration error: %s is required", key)
	}

	parsed, err := strconv.Atoi(value)
	if err != nil {
		return 0, fmt.Errorf("configuration error: %s must be a valid integer", key)
	}

	return parsed, nil
}

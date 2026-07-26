package config

import (
	"fmt"
	"os"
	"strconv"

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
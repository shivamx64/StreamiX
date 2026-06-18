package config

import (
	"fmt"

	"github.com/spf13/viper"
)

func Load() (*Config, error) {
	viper.SetConfigFile(".env")

	viper.AutomaticEnv()

	_ = viper.ReadInConfig()

	cfg := &Config{
		AppEnv: viper.GetString("APP_ENV"),
		AppPort: viper.GetString("APP_PORT"),

		DatabaseURL: viper.GetString("DATABASE_URL"),

		JWTSecret: viper.GetString("JWT_SECRET"),

		AWSRegion: viper.GetString("AWS_REGION"),
		S3Bucket:  viper.GetString("S3_BUCKET"),

		RedisURL: viper.GetString("REDIS_URL"),
	}

	if cfg.AppPort == "" {
		cfg.AppPort = "8080"
	}

	if cfg.DatabaseURL == "" {
		return nil, fmt.Errorf("DATABASE_URL is required")
	}

	return cfg, nil
}
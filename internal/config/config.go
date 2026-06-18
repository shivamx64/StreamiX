package config

type Config struct {
	AppEnv  string
	AppPort string

	DatabaseURL string

	JWTSecret string

	AWSRegion string
	S3Bucket  string

	RedisURL string
}
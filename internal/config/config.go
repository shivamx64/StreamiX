package config

// Config represents the application's runtime configuration.
//
// It aggregates the configuration for all application components.
// Every package receives the configuration it needs through this
// struct instead of reading environment variables directly.

type Config struct {
	App      AppConfig
	HTTP     HTTPConfig
	Database DatabaseConfig
}

// AppConfig contains metatadata about the running application
type AppConfig struct{
	// Name is the application name used in logs and metrics.
	Name string

	// Environment indicates the current runtime application.
	Environment string

	// Version is the application version.
	// During local development this will typically be "dev",
	// while CI/CD can inject a Git tag or commit SHA.
	Version string
}

// HTTPConfig contains HTTP server configuration.
type HTTPConfig struct {
	// Host is the interface the server binds to.
	Host string

	// Port is the HTTP server port.
	Port int
}

// DatabaseConfig contains PostgreSQL connection settings.
type DatabaseConfig struct {
	Host string
	Port int

	User     string
	Password string

	Name string

	// SSLMode controls PostgreSQL SSL behavior.
	// Examples:
	//   disable
	//   require
	//   verify-full
	SSLMode string
}
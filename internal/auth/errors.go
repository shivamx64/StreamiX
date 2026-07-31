package auth

import "errors"

var (
	// ErrInvalidToken indicates that a JWT is malformed,
	// expired, has an invalid signature, or cannot be parsed.
	ErrInvalidToken = errors.New("invalid token")

	// ErrUnexpectedSigningAlgorithm indicates that the JWT
	// was signed using an unexpected signing algorithm.
	ErrUnexpectedSigningAlg = errors.New("unexpected signing algorithm")
)

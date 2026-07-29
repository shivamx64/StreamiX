package users

import "errors"

var (
	ErrNotFound = errors.New("user not found")
	ErrEmailExists = errors.New("email already registered")
)
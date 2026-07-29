package users

import "time"

// UserResponse represents user data returned by the API.
type UserResponse struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
}

package videos

import "time"

// VideoResponse represents video data returned by the API.
type VideoResponse struct {
	ID               string    `json:"id"`
	UserID           string    `json:"user_id"`
	OriginalFilename string    `json:"original_filename"`
	StorageKey       string    `json:"storage_key"`
	MimeType         string    `json:"mime_type"`
	Size             int64     `json:"size"`
	Status           Status    `json:"status"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

// VideoStatusResponse represents the processing status of a video.
type VideoStatusResponse struct {
	ID     string `json:"id"`
	Status Status `json:"status"`
}

// toResponse converts a Video model to its API response representation.
func toResponse(video *Video) VideoResponse {
	return VideoResponse{
		ID:               video.ID.String(),
		UserID:           video.UserID.String(),
		OriginalFilename: video.OriginalFilename,
		StorageKey:       video.StorageKey,
		MimeType:         video.MimeType,
		Size:             video.Size,
		Status:           video.Status,
		CreatedAt:        video.CreatedAt,
		UpdatedAt:        video.UpdatedAt,
	}
}

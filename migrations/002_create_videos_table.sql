CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    original_filename VARCHAR(255) NOT NULL,

    storage_key TEXT NOT NULL UNIQUE,

    mime_type VARCHAR(255) NOT NULL,

    size BIGINT NOT NULL DEFAULT 0,

    status TEXT NOT NULL DEFAULT 'uploaded',

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_videos_user_id ON videos (user_id);

CREATE INDEX idx_videos_status ON videos (status);

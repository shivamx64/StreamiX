ALTER TABLE videos
    ADD COLUMN duration_seconds DOUBLE PRECISION NOT NULL DEFAULT 0,
    ADD COLUMN width INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN height INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN hls_master_key TEXT,
    ADD COLUMN thumbnail_key TEXT,
    ADD COLUMN renditions JSONB NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN processing_error TEXT,
    ADD COLUMN completed_at TIMESTAMPTZ;

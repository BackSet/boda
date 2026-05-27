CREATE TABLE IF NOT EXISTS love_story_settings (
    id BIGINT PRIMARY KEY,
    enabled BOOLEAN NOT NULL DEFAULT FALSE,
    published BOOLEAN NOT NULL DEFAULT FALSE,
    section_title VARCHAR(160) NOT NULL DEFAULT 'Nuestra historia de amor',
    section_subtitle VARCHAR(280)
);

INSERT INTO love_story_settings (id, enabled, published, section_title, section_subtitle)
VALUES (1, FALSE, FALSE, 'Nuestra historia de amor', 'Momentos que nos trajeron hasta el altar')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS love_story_entries (
    id BIGSERIAL PRIMARY KEY,
    author VARCHAR(20) NOT NULL,
    event_date DATE NOT NULL,
    title VARCHAR(160),
    quote VARCHAR(1000) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_love_story_author CHECK (author IN ('PARTNER_A', 'PARTNER_B'))
);

CREATE INDEX IF NOT EXISTS idx_love_story_entries_sort
    ON love_story_entries (event_date ASC, sort_order ASC);

CREATE INDEX IF NOT EXISTS idx_love_story_entries_author
    ON love_story_entries (author, event_date ASC, sort_order ASC);

CREATE TABLE IF NOT EXISTS wedding_events (
    id BIGINT PRIMARY KEY,
    couple_display_name VARCHAR(120) NOT NULL,
    event_title VARCHAR(160) NOT NULL,
    event_date VARCHAR(120) NOT NULL,
    target_date_iso VARCHAR(40) NOT NULL,
    ceremony_address VARCHAR(220) NOT NULL,
    reception_address VARCHAR(220) NOT NULL,
    dress_code VARCHAR(280)
);

CREATE TABLE IF NOT EXISTS invitation_groups (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(120) NOT NULL UNIQUE,
    display_name VARCHAR(160) NOT NULL,
    contact_email VARCHAR(160),
    dietary_restrictions VARCHAR(500),
    message VARCHAR(1000),
    responded_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS invited_guests (
    id BIGSERIAL PRIMARY KEY,
    group_id BIGINT NOT NULL REFERENCES invitation_groups (id) ON DELETE CASCADE,
    full_name VARCHAR(140) NOT NULL,
    sort_order INTEGER NOT NULL,
    attending BOOLEAN,
    primary_guest BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_invited_guests_group_id ON invited_guests (group_id);

CREATE TABLE IF NOT EXISTS invitation_content_sections (
    id BIGSERIAL PRIMARY KEY,
    section_type VARCHAR(60) NOT NULL,
    title VARCHAR(160) NOT NULL,
    subtitle VARCHAR(280),
    body VARCHAR(2000),
    payload_json VARCHAR(5000),
    order_index INTEGER NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE
);

ALTER TABLE wedding_events
    ADD COLUMN IF NOT EXISTS ceremony_map_url VARCHAR(500),
    ADD COLUMN IF NOT EXISTS reception_map_url VARCHAR(500);

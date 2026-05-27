CREATE TABLE IF NOT EXISTS home_content_sections (
    id BIGSERIAL PRIMARY KEY,
    section_type VARCHAR(60) NOT NULL,
    title VARCHAR(160) NOT NULL,
    subtitle VARCHAR(280),
    body VARCHAR(2000),
    payload_json VARCHAR(5000),
    order_index INTEGER NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS bank_account_infos (
    id BIGSERIAL PRIMARY KEY,
    bank_name VARCHAR(120) NOT NULL,
    account_holder VARCHAR(160) NOT NULL,
    account_type VARCHAR(80) NOT NULL,
    account_number VARCHAR(120) NOT NULL,
    clabe_iban VARCHAR(120),
    account_alias VARCHAR(120),
    notes VARCHAR(600),
    order_index INTEGER NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE
);

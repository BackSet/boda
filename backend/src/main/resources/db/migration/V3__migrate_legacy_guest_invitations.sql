DO $$
DECLARE
    guest_row RECORD;
    new_group_id BIGINT;
    attending_count INTEGER;
    member_index INTEGER;
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'guest_invitations'
    ) THEN
        RETURN;
    END IF;

    IF EXISTS (SELECT 1 FROM invitation_groups LIMIT 1) THEN
        RETURN;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM wedding_events) THEN
        INSERT INTO wedding_events (
            id,
            couple_display_name,
            event_title,
            event_date,
            target_date_iso,
            ceremony_address,
            reception_address,
            dress_code
        )
        SELECT
            1,
            'Ana y Daniel',
            gi.event_title,
            gi.event_date,
            '2026-12-12T16:00:00',
            gi.ceremony_address,
            gi.reception_address,
            'Formal elegante · tonos pastel y neutros'
        FROM guest_invitations gi
        ORDER BY CASE WHEN gi.token = 'demo-token' THEN 0 ELSE 1 END, gi.id
        LIMIT 1;
    END IF;

    FOR guest_row IN
        SELECT *
        FROM guest_invitations
        ORDER BY id
    LOOP
        IF EXISTS (SELECT 1 FROM invitation_groups ig WHERE ig.token = guest_row.token) THEN
            CONTINUE;
        END IF;

        INSERT INTO invitation_groups (
            token,
            display_name,
            contact_email,
            dietary_restrictions,
            message,
            responded_at
        )
        VALUES (
            guest_row.token,
            guest_row.guest_name,
            guest_row.guest_email,
            guest_row.dietary_restrictions,
            guest_row.message,
            guest_row.responded_at
        )
        RETURNING id INTO new_group_id;

        attending_count := COALESCE(guest_row.guest_count, 0);

        INSERT INTO invited_guests (group_id, full_name, sort_order, attending, primary_guest)
        VALUES (
            new_group_id,
            guest_row.guest_name,
            1,
            CASE
                WHEN guest_row.attending IS NULL THEN NULL
                WHEN guest_row.attending = TRUE AND attending_count >= 1 THEN TRUE
                ELSE FALSE
            END,
            TRUE
        );

        FOR member_index IN 2..GREATEST(COALESCE(guest_row.max_guests, 1), 1) LOOP
            INSERT INTO invited_guests (group_id, full_name, sort_order, attending, primary_guest)
            VALUES (
                new_group_id,
                'Acompanante ' || member_index,
                member_index,
                CASE
                    WHEN guest_row.attending IS NULL THEN NULL
                    WHEN guest_row.attending = TRUE AND member_index <= attending_count THEN TRUE
                    ELSE FALSE
                END,
                FALSE
            );
        END LOOP;
    END LOOP;
END $$;

-- AVision: users, tickets, and votes — run after 000_schema.sql.
-- Safe to re-run: every step checks before it creates or changes anything.
-- Replaces avision_users.sql, which always drops reports.user_id and would wipe
-- user links if run a second time.

-- 1. Users ------------------------------------------------------------------
-- Same table as avision_users.sql. Until Auth0 lands, guests get a row with
-- auth0_sub = 'guest|<uuid>', so votes already have a real user to point at.
CREATE TABLE IF NOT EXISTS users (
    id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    auth0_sub      text        NOT NULL UNIQUE,      -- stable Auth0 ID, or 'guest|<uuid>'
    display_name   text,
    avatar_url     text,
    role           text        NOT NULL DEFAULT 'user'
                               CHECK (role IN ('user', 'facilities_staff')),
    created_at     timestamptz NOT NULL DEFAULT now(),
    last_login_at  timestamptz NOT NULL DEFAULT now()
);

-- 2. Point reports at users -------------------------------------------------
-- 000_schema.sql made reports.user_id text (the raw Auth0 ID). Swap it for a UUID
-- link to users, but only while it is still text and empty.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_schema = current_schema() AND table_name = 'reports'
                 AND column_name = 'user_id' AND data_type <> 'uuid') THEN
        IF EXISTS (SELECT 1 FROM reports WHERE user_id IS NOT NULL) THEN
            RAISE EXCEPTION 'reports.user_id has text values; migrate them by hand first';
        END IF;
        ALTER TABLE reports DROP COLUMN user_id;
    END IF;
END $$;

-- On TimescaleDB, reports had columnstore enabled, and it couldn't add a column with a
-- constraint to it, so reports.user_id and reports.ticket_id are plain uuids with no
-- foreign key. The backend is responsible for only writing IDs that exist.
ALTER TABLE reports ADD COLUMN IF NOT EXISTS user_id uuid;

-- 3. Tickets ----------------------------------------------------------------
-- One row per public issue. A regular table, not a hypertable, because rows are
-- updated in place (status, counts). title, description, and photo_url are here
-- for the base app, where tickets are created by hand instead of from a report.
CREATE TABLE IF NOT EXISTS tickets (
    id            uuid             PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at    timestamptz      NOT NULL DEFAULT now(),
    updated_at    timestamptz      NOT NULL DEFAULT now(),
    issue_type    text             NOT NULL,          -- same values as reports.issue_type
    owner         text             NOT NULL
                                   CHECK (owner IN ('gsu_facilities', 'city_of_atlanta', 'marta', 'gdot')),
    lat           double precision NOT NULL,
    lng           double precision NOT NULL,
    address       text,
    title         text             NOT NULL,
    description   text,
    photo_url     text,
    status        text             NOT NULL DEFAULT 'open'
                                   CHECK (status IN ('open', 'likely_fixed', 'fixed', 'merged')),
    merged_into   uuid             REFERENCES tickets(id),
    created_by    uuid             REFERENCES users(id),
    report_count  int              NOT NULL DEFAULT 1,
    last_seen_at  timestamptz      NOT NULL DEFAULT now()  -- last report or still-there vote
);
-- Upgrade a tickets table made from the earlier draft of this schema, which had
-- no created_by and no owner CHECK. (CREATE TABLE IF NOT EXISTS skips existing tables.)
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES users(id);
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint
                   WHERE conrelid = 'tickets'::regclass AND conname = 'tickets_owner_check') THEN
        ALTER TABLE tickets ADD CONSTRAINT tickets_owner_check
            CHECK (owner IN ('gsu_facilities', 'city_of_atlanta', 'marta', 'gdot'));
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS tickets_open_idx ON tickets (issue_type, status);
CREATE INDEX IF NOT EXISTS tickets_created_idx ON tickets (created_at DESC);

ALTER TABLE reports ADD COLUMN IF NOT EXISTS ticket_id uuid;  -- no FK, see step 2

-- 4. Votes ------------------------------------------------------------------
-- Each user's current vote per ticket; changing a vote replaces the row.
CREATE TABLE IF NOT EXISTS ticket_votes (
    ticket_id  uuid        NOT NULL REFERENCES tickets(id),
    user_id    uuid        NOT NULL REFERENCES users(id),
    vote       text        NOT NULL CHECK (vote IN ('still_there', 'fixed')),
    voted_at   timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (ticket_id, user_id)
);
CREATE INDEX IF NOT EXISTS ticket_votes_user_idx ON ticket_votes (user_id);

-- 5. Sanity checks -----------------------------------------------------------
-- SELECT table_name FROM information_schema.tables
--   WHERE table_schema = current_schema() ORDER BY 1;   -- expect reports, tickets, ticket_votes, users
-- SELECT column_name, data_type FROM information_schema.columns
--   WHERE table_name = 'reports' AND column_name IN ('user_id', 'ticket_id');  -- both uuid

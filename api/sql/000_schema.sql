-- AVision: base schema (plain PostgreSQL, no extensions needed)
-- Run once in Supabase's SQL Editor (or psql) against a fresh database, then 001 onward.
-- Safe to re-run.

-- 1. Reports -------------------------------------------------------------------
-- One row per photo submission, with the full AI output for it.
-- users and tickets are created in 001_tickets.sql, which also adds reports.ticket_id.
CREATE TABLE IF NOT EXISTS reports (
    id              uuid             PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at      timestamptz      NOT NULL DEFAULT now(),

    -- From Gemini's photo analysis
    issue_type      text             NOT NULL,          -- e.g. 'blocked_curb_ramp', 'pothole'
    barriers        text[]           NOT NULL DEFAULT '{}', -- e.g. {'wheelchair_path_blocked'}
    severity        text             NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
    confidence      real             CHECK (confidence BETWEEN 0 AND 1),
    description     text,

    -- Location
    lat             double precision NOT NULL,
    lng             double precision NOT NULL,
    address         text,

    -- Routing (decided by your Python code, not the model)
    owner           text             NOT NULL,          -- 'gsu_facilities', 'city_of_atlanta', 'marta', 'gdot'
    routing_reason  text,

    -- Output + bookkeeping
    photo_url       text,                               -- photos are stored outside the DB
    report          jsonb,                              -- generated email subject/body, phone script, contacts
    status          text             NOT NULL DEFAULT 'drafted'
                                     CHECK (status IN ('drafted', 'sent', 'acknowledged', 'fixed')),
    user_id         uuid                                -- users.id; NULL for anonymous reports
);

-- Fast filters for the map and the Facilities staff view
CREATE INDEX IF NOT EXISTS reports_time_idx       ON reports (created_at DESC);
CREATE INDEX IF NOT EXISTS reports_owner_time_idx ON reports (owner, created_at DESC);
CREATE INDEX IF NOT EXISTS reports_issue_time_idx ON reports (issue_type, created_at DESC);

-- Supabase serves every table in the public schema through its REST API. The backend
-- connects as postgres, which skips RLS, so turning it on with no policies only
-- shuts that public API out.
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- 2. Hotspots view ---------------------------------------------------------------
-- Weekly report counts per ~110 m grid cell (lat/lng rounded to 3 decimals).
-- Powers the hotspots map layer and "reported N times in 3 weeks".
-- A plain view, so it is always up to date and never needs refreshing.
-- Weeks start on Monday, the same as TimescaleDB's time_bucket('1 week', ...).
-- security_invoker makes the view follow the reports table's RLS instead of bypassing it.
CREATE OR REPLACE VIEW hotspots_weekly WITH (security_invoker = true) AS
SELECT
    date_trunc('week', created_at)    AS week,
    round(lat::numeric, 3)            AS cell_lat,
    round(lng::numeric, 3)            AS cell_lng,
    issue_type,
    count(*)                          AS report_count,
    avg(confidence)                   AS avg_confidence
FROM reports
GROUP BY week, cell_lat, cell_lng, issue_type;

-- 3. Sanity checks -----------------------------------------------------------
-- SELECT * FROM hotspots_weekly ORDER BY week DESC;
-- SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'reports';  -- expect true
-- Optional: is PostGIS available on your service?
-- SELECT name FROM pg_available_extensions WHERE name = 'postgis';

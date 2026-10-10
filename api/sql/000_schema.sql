-- AVision: Tiger Data schema
-- Run once in Tiger Console's SQL Editor (or psql) against your service.

-- 1. Reports hypertable --------------------------------------------------
-- Every report is a time-stamped event, so the table is partitioned by created_at.
-- Hypertables require any primary key to include the partition column,
-- hence PRIMARY KEY (id, created_at).
CREATE TABLE IF NOT EXISTS reports (
    id              uuid             NOT NULL DEFAULT gen_random_uuid(),
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
    photo_url       text,                               -- store photos outside the DB (free tier = 750 MiB)
    report          jsonb,                              -- generated email subject/body, phone script, contacts
    status          text             NOT NULL DEFAULT 'drafted'
                                     CHECK (status IN ('drafted', 'sent', 'acknowledged', 'fixed')),
    user_id         text,                               -- Auth0 "sub"; NULL for anonymous reports

    PRIMARY KEY (id, created_at)
) WITH (
    tsdb.hypertable,
    tsdb.partition_column = 'created_at',
    tsdb.chunk_interval   = '7 days'
);

-- Fast filters for the map and the Facilities staff view
CREATE INDEX IF NOT EXISTS reports_owner_time_idx ON reports (owner, created_at DESC);
CREATE INDEX IF NOT EXISTS reports_issue_time_idx ON reports (issue_type, created_at DESC);

-- 2. Hotspots continuous aggregate -----------------------------------------
-- Weekly report counts per ~110 m grid cell (lat/lng rounded to 3 decimals).
-- Powers the hotspots map layer and "reported N times in 3 weeks".
CREATE MATERIALIZED VIEW IF NOT EXISTS hotspots_weekly
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 week', created_at) AS week,
    round(lat::numeric, 3)            AS cell_lat,
    round(lng::numeric, 3)            AS cell_lng,
    issue_type,
    count(*)                          AS report_count,
    avg(confidence)                   AS avg_confidence
FROM reports
GROUP BY week, cell_lat, cell_lng, issue_type
WITH NO DATA;

-- Include brand-new reports in query results right away (real-time aggregation),
-- so a report submitted during the demo shows up on the hotspots layer instantly.
ALTER MATERIALIZED VIEW hotspots_weekly SET (timescaledb.materialized_only = false);

-- Re-materialize older buckets every minute in the background.
SELECT add_continuous_aggregate_policy(
    'hotspots_weekly',
    start_offset      => INTERVAL '2 months',
    end_offset        => INTERVAL '1 minute',
    schedule_interval => INTERVAL '1 minute'
);

-- 3. Sanity checks -----------------------------------------------------------
-- SELECT hypertable_name FROM timescaledb_information.hypertables;
-- SELECT view_name FROM timescaledb_information.continuous_aggregates;
-- Optional: is PostGIS available on your service?
-- SELECT name FROM pg_available_extensions WHERE name = 'postgis';

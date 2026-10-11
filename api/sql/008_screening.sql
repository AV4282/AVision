-- AVision: screening of new reports. Run after 007_ticket_reports.sql.
-- Safe to re-run. The API also runs this file by itself each time it starts
-- (db.ensure_schema), so nobody has to remember to.
--
-- When someone tries to post a report that plainly isn't one (a cartoon or meme
-- for a photo, a joke or abuse for the words), the report is refused and the
-- attempt is written down here. Five flagged attempts pause that person's
-- posting for a day (see db.flag_attempt).
--
-- users.flagged_count    flagged attempts since their last pause
-- users.suspended_until  they cannot post until this time; NULL or past = fine
ALTER TABLE users ADD COLUMN IF NOT EXISTS flagged_count   int NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS suspended_until timestamptz;

-- One row per flagged thing, so the same photo or the same words are only ever
-- counted once, and can be refused again without asking the AI again.
--   key   "photo:<file name>" or "text:<hash of the person and their words>"
--   what  'photo' or 'text'
CREATE TABLE IF NOT EXISTS flagged_attempts (
    key         text        PRIMARY KEY,
    user_id     uuid        REFERENCES users(id) ON DELETE SET NULL,
    what        text        NOT NULL,
    reason      text,
    flagged_at  timestamptz NOT NULL DEFAULT now()
);

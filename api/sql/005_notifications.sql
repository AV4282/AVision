-- AVision: notifications. Run after 004_more_photos.sql.
-- Safe to re-run. The API also runs this file by itself each time it starts
-- (db.ensure_schema), so nobody has to remember to.
--
-- One row each time something happens to a ticket that a person cares about:
--   * a ticket they posted: someone else voted on it, its status changed, or an
--     admin marked it fixed or removed it
--   * a ticket they voted on: it became likely fixed, was marked fixed, or was removed
-- Nobody gets a row for something they did themselves.
--
-- ticket_title is copied in, so the row still reads right after the ticket is
-- gone. A "removed" row has no ticket_id; every other row is deleted with its ticket.
CREATE TABLE IF NOT EXISTS notifications (
    id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,   -- who is told
    ticket_id    uuid        REFERENCES tickets(id) ON DELETE CASCADE,
    ticket_title text        NOT NULL,
    kind         text        NOT NULL,   -- still_there, marked_fixed, likely_fixed, fixed, reopened, reported, moved, rerouted, edited, removed
    yours        boolean     NOT NULL,   -- true: they posted the ticket. false: they voted on it
    actor_id     uuid,                   -- who did it. Never shown; only stops repeats
    created_at   timestamptz NOT NULL DEFAULT now(),
    read_at      timestamptz
);
CREATE INDEX IF NOT EXISTS notifications_user_idx ON notifications (user_id, created_at DESC);

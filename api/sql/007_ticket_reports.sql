-- AVision: who has sent a report about a ticket. Run after 006_georgia_tech.sql.
-- Safe to re-run. The API also runs this file by itself each time it starts
-- (db.ensure_schema), so nobody has to remember to.
--
-- One row per person per ticket, added when they use one of the "send" buttons
-- on a ticket's drafted message (email, Gmail, the department's web form, or
-- the phone number). AVision never sends anything itself, so this records that
-- the person went to send it.
--
-- tickets.report_count starts at 1 for the person who posted the ticket. Each
-- OTHER person's first row here adds one to it (see db.record_report), so the
-- count is how many different people have reported the issue.
CREATE TABLE IF NOT EXISTS ticket_reports (
    ticket_id  uuid        NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    user_id    uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sent_at    timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (ticket_id, user_id)
);

-- AVision: up to five photos on a ticket. Run after 003_onboarding.sql.
-- Safe to re-run. The API also runs this file by itself each time it starts
-- (db.ensure_schema), so nobody has to remember to.
--
-- tickets.photo_url stays the ticket's main photo: the one on the map, in lists,
-- and the one the report agent looks at. The photos after it go here, in order,
-- each a path from POST /uploads like "/uploads/3f2a....jpg". The API allows four,
-- which with the main photo makes five.
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS more_photos text[] NOT NULL DEFAULT '{}';

-- Profile pictures need no change: users.avatar_url (001_tickets.sql) already holds
-- either the picture from the person's sign-in provider (an https link) or one they
-- uploaded here (a path like the ones above).

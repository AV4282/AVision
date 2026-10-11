-- AVision: Georgia Tech as a place tickets can go. Run after 005_notifications.sql.
-- Safe to re-run. The API also runs this file by itself each time it starts
-- (db.ensure_schema), so nobody has to remember to.
--
-- tickets.owner is limited to a list of departments (001_tickets.sql). This adds
-- 'georgia_tech' to that list. Nothing already in the table changes.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint
                   WHERE conrelid = 'tickets'::regclass AND conname = 'tickets_owner_check'
                     AND pg_get_constraintdef(oid) LIKE '%georgia_tech%') THEN
        ALTER TABLE tickets DROP CONSTRAINT IF EXISTS tickets_owner_check;
        ALTER TABLE tickets ADD CONSTRAINT tickets_owner_check
            CHECK (owner IN ('gsu_facilities', 'georgia_tech', 'city_of_atlanta', 'marta', 'gdot'));
    END IF;
END $$;

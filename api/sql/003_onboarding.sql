-- AVision: onboarding answers on users — run after 001_tickets.sql.
-- The three questions from the design doc, asked once after a person first signs in:
--   Are you a student?  ->  is_student
--   If yes, what school do you go to?  ->  school
--   Do you take MARTA?  ->  takes_marta
-- NULL means "not answered". onboarded_at is when they last saved their answers;
-- NULL means they haven't, so the app asks. Guests never get asked.
-- Safe to re-run.

ALTER TABLE users ADD COLUMN IF NOT EXISTS is_student   boolean;
ALTER TABLE users ADD COLUMN IF NOT EXISTS school       text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS takes_marta  boolean;
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarded_at timestamptz;

DO $$
BEGIN
    -- A school only makes sense for a student, and is kept to a sensible length.
    IF NOT EXISTS (SELECT 1 FROM pg_constraint
                   WHERE conrelid = 'users'::regclass AND conname = 'users_school_check') THEN
        ALTER TABLE users ADD CONSTRAINT users_school_check
            CHECK (school IS NULL OR (is_student IS TRUE AND length(school) BETWEEN 1 AND 120));
    END IF;
END $$;

-- Sanity check:
-- SELECT column_name, data_type FROM information_schema.columns
--   WHERE table_name = 'users' AND column_name IN ('is_student', 'school', 'takes_marta', 'onboarded_at');

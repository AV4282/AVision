-- AVision: admin role on users — run after 003_onboarding.sql.
-- Admins can delete any ticket and mark tickets as fixed. Grant it with admin.py.
-- Safe to re-run.

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint
                   WHERE conrelid = 'users'::regclass AND conname = 'users_role_check'
                     AND pg_get_constraintdef(oid) LIKE '%admin%') THEN
        ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
        ALTER TABLE users ADD CONSTRAINT users_role_check
            CHECK (role IN ('user', 'facilities_staff', 'admin'));
    END IF;
END $$;

-- Sanity check:
-- SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conname = 'users_role_check';

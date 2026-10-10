-- AVision: demo tickets — run after 001_tickets.sql and 000_seed.sql.
-- Builds tickets from the seed reports (and links those reports to them), plus one
-- GDOT ticket, so every owner and every status shows up in the demo:
--   open (with still-there votes), likely_fixed (2 fixed votes), fixed (3 fixed votes).
-- Every ticket's description ends in "(seed)". Safe to re-run: it skips if they exist.
--
-- To remove the demo data later:
--   UPDATE reports SET ticket_id = NULL WHERE ticket_id IN (SELECT id FROM tickets WHERE description LIKE '%(seed)%');
--   DELETE FROM ticket_votes WHERE ticket_id IN (SELECT id FROM tickets WHERE description LIKE '%(seed)%');
--   DELETE FROM tickets WHERE description LIKE '%(seed)%';
--   DELETE FROM users WHERE auth0_sub LIKE 'seed|%';

DO $$
DECLARE
    v1 uuid;
    v2 uuid;
    v3 uuid;
    t  uuid;
BEGIN
    IF EXISTS (SELECT 1 FROM tickets WHERE description LIKE '%(seed)%') THEN
        RAISE NOTICE 'Seed tickets already exist; nothing to do.';
        RETURN;
    END IF;

    -- Three demo voters, so vote counts and statuses are real rows, not made-up numbers.
    INSERT INTO users (auth0_sub, display_name) VALUES
        ('seed|voter1', 'Demo voter 1'),
        ('seed|voter2', 'Demo voter 2'),
        ('seed|voter3', 'Demo voter 3')
    ON CONFLICT (auth0_sub) DO NOTHING;
    SELECT id INTO v1 FROM users WHERE auth0_sub = 'seed|voter1';
    SELECT id INTO v2 FROM users WHERE auth0_sub = 'seed|voter2';
    SELECT id INTO v3 FROM users WHERE auth0_sub = 'seed|voter3';

    -- 1. Blocked curb ramp (City): the 6-report cluster becomes one open ticket.
    INSERT INTO tickets (created_at, updated_at, issue_type, owner, lat, lng, address,
                         title, description, status, report_count, last_seen_at)
    SELECT coalesce(min(created_at), now() - INTERVAL '19 days'), coalesce(max(created_at), now()),
           'blocked_curb_ramp', 'city_of_atlanta', 33.7531, -84.3853,
           'Demo location near GSU downtown campus', 'Blocked curb ramp',
           'Scooters keep getting parked across this curb ramp, blocking the step-free route. (seed)',
           'open', greatest(count(*), 1), coalesce(max(created_at), now())
    FROM reports WHERE issue_type = 'blocked_curb_ramp' AND description LIKE '%(seed)%'
    RETURNING id INTO t;
    UPDATE reports SET ticket_id = t
    WHERE issue_type = 'blocked_curb_ramp' AND description LIKE '%(seed)%';
    INSERT INTO ticket_votes (ticket_id, user_id, vote, voted_at) VALUES
        (t, v1, 'still_there', now() - INTERVAL '1 day'),
        (t, v2, 'still_there', now() - INTERVAL '3 hours'),
        (t, v3, 'fixed',       now() - INTERVAL '5 days');

    -- 2. Broken elevator (GSU Facilities): open, one still-there vote.
    INSERT INTO tickets (created_at, updated_at, issue_type, owner, lat, lng, address,
                         title, description, status, last_seen_at)
    VALUES (now() - INTERVAL '2 days', now() - INTERVAL '6 hours', 'broken_elevator',
            'gsu_facilities', 33.7536, -84.3862, 'GSU building (demo)', 'Elevator out of service',
            'Out-of-service sign on the elevator at the building entrance; no other step-free way up. (seed)',
            'open', now() - INTERVAL '6 hours')
    RETURNING id INTO t;
    UPDATE reports SET ticket_id = t WHERE issue_type = 'broken_elevator' AND description LIKE '%(seed)%';
    INSERT INTO ticket_votes (ticket_id, user_id, vote, voted_at) VALUES
        (t, v1, 'still_there', now() - INTERVAL '6 hours');

    -- 3. Damaged sidewalk (City): likely fixed — 2 fixed votes, none still there.
    INSERT INTO tickets (created_at, updated_at, issue_type, owner, lat, lng, address,
                         title, description, status, last_seen_at)
    VALUES (now() - INTERVAL '4 days', now() - INTERVAL '1 day', 'damaged_sidewalk',
            'city_of_atlanta', 33.7548, -84.3880, 'Downtown sidewalk (demo)', 'Raised sidewalk panel',
            'Raised, cracked panel creates a trip hazard for canes and wheels. (seed)',
            'likely_fixed', now() - INTERVAL '4 days')
    RETURNING id INTO t;
    UPDATE reports SET ticket_id = t WHERE issue_type = 'damaged_sidewalk' AND description LIKE '%(seed)%';
    INSERT INTO ticket_votes (ticket_id, user_id, vote, voted_at) VALUES
        (t, v2, 'fixed', now() - INTERVAL '2 days'),
        (t, v3, 'fixed', now() - INTERVAL '1 day');

    -- 4. Broken escalator (MARTA): open, mixed votes.
    INSERT INTO tickets (created_at, updated_at, issue_type, owner, lat, lng, address,
                         title, description, status, last_seen_at)
    VALUES (now() - INTERVAL '8 days', now() - INTERVAL '2 days', 'broken_escalator',
            'marta', 33.7500, -84.3858, 'MARTA station (demo)', 'Escalator stopped',
            'Station entrance escalator has been stopped for over a week. (seed)',
            'open', now() - INTERVAL '2 days')
    RETURNING id INTO t;
    UPDATE reports SET ticket_id = t WHERE issue_type = 'broken_escalator' AND description LIKE '%(seed)%';
    INSERT INTO ticket_votes (ticket_id, user_id, vote, voted_at) VALUES
        (t, v1, 'still_there', now() - INTERVAL '2 days'),
        (t, v2, 'still_there', now() - INTERVAL '3 days'),
        (t, v3, 'fixed',       now() - INTERVAL '4 days');

    -- 5. Missing curb ramp (City): fixed — 3 fixed votes, updated recently.
    INSERT INTO tickets (created_at, updated_at, issue_type, owner, lat, lng, address,
                         title, description, status, last_seen_at)
    VALUES (now() - INTERVAL '12 days', now() - INTERVAL '2 days', 'missing_curb_cut',
            'city_of_atlanta', 33.7557, -84.3871, 'Downtown intersection (demo)', 'Missing curb ramp',
            'One corner of the crosswalk had no curb ramp; a new ramp has since been poured. (seed)',
            'fixed', now() - INTERVAL '12 days')
    RETURNING id INTO t;
    UPDATE reports SET ticket_id = t WHERE issue_type = 'missing_curb_cut' AND description LIKE '%(seed)%';
    INSERT INTO ticket_votes (ticket_id, user_id, vote, voted_at) VALUES
        (t, v1, 'fixed', now() - INTERVAL '3 days'),
        (t, v2, 'fixed', now() - INTERVAL '2 days'),
        (t, v3, 'fixed', now() - INTERVAL '2 days');

    -- 6. Missing crosswalk signal (GDOT): new today, no votes yet.
    INSERT INTO tickets (created_at, updated_at, issue_type, owner, lat, lng, address,
                         title, description, status, last_seen_at)
    VALUES (now() - INTERVAL '40 minutes', now() - INTERVAL '40 minutes', 'missing_crosswalk_signal',
            'gdot', 33.7535, -84.3810, 'State route crossing near campus (demo)', 'Missing accessible signal',
            'Crosswalk push button has no audible or vibrating signal for blind pedestrians. (seed)',
            'open', now() - INTERVAL '40 minutes');
END $$;

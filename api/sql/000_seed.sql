-- AVision: demo seed data
-- Run AFTER 000_schema.sql. Coordinates are APPROXIMATE points near GSU's
-- downtown campus; replace them with coordinates from your real photos on Saturday.
-- Every row is marked "(seed)" so you can delete them later:
--   DELETE FROM reports WHERE description LIKE '%(seed)%';

-- A repeat-report cluster: the same blocked curb ramp reported 6 times over ~3 weeks.
-- Jitter stays inside one grid cell, so the hotspots view counts them together.
INSERT INTO reports (created_at, issue_type, barriers, severity, confidence, description,
                     lat, lng, address, owner, routing_reason, status)
SELECT now() - make_interval(days => d),
       'blocked_curb_ramp',
       ARRAY['wheelchair_path_blocked'],
       'high',
       0.85,
       'Scooter parked across the curb ramp (seed)',
       33.7531 + (random() - 0.5) * 0.0002,
       -84.3853 + (random() - 0.5) * 0.0002,
       'Demo location near GSU downtown campus',
       'city_of_atlanta',
       'Public sidewalk outside GSU campus boundary',
       'sent'
FROM unnest(ARRAY[1, 3, 6, 10, 14, 19]) AS d;

-- A spread of other issues so the map isn't a single pin.
INSERT INTO reports (created_at, issue_type, barriers, severity, confidence, description,
                     lat, lng, address, owner, routing_reason, status)
VALUES
  (now() - INTERVAL '2 days',  'broken_elevator',  ARRAY['no_step_free_access'], 'high',   0.78,
   'Elevator out of service sign at building entrance (seed)',
   33.7536, -84.3862, 'GSU building (demo)', 'gsu_facilities', 'Inside GSU campus polygon', 'sent'),
  (now() - INTERVAL '4 days',  'damaged_sidewalk', ARRAY['trip_hazard'],          'medium', 0.81,
   'Raised, cracked sidewalk panel (seed)',
   33.7548, -84.3880, 'Downtown sidewalk (demo)', 'city_of_atlanta', 'Public sidewalk outside GSU campus boundary', 'drafted'),
  (now() - INTERVAL '5 days',  'illegal_dumping',  ARRAY[]::text[],             'low',    0.90,
   'Bagged trash dumped beside a planter (seed)',
   33.7519, -84.3841, 'Downtown sidewalk (demo)', 'city_of_atlanta', 'Public sidewalk outside GSU campus boundary', 'drafted'),
  (now() - INTERVAL '8 days',  'broken_escalator', ARRAY['no_step_free_access'], 'medium', 0.72,
   'Escalator stopped at station entrance (seed)',
   33.7500, -84.3858, 'MARTA station (demo)', 'marta', 'Within MARTA station buffer', 'acknowledged'),
  (now() - INTERVAL '12 days', 'missing_curb_cut', ARRAY['wheelchair_path_blocked'], 'high', 0.69,
   'Crosswalk with no curb ramp on one corner (seed)',
   33.7557, -84.3871, 'Downtown intersection (demo)', 'city_of_atlanta', 'Public sidewalk outside GSU campus boundary', 'fixed');

-- Check it worked: should show the curb ramp cell with 6 reports across ~3 weeks.
-- SELECT cell_lat, cell_lng, issue_type, sum(report_count) AS total
-- FROM hotspots_weekly
-- WHERE week > now() - INTERVAL '21 days'
-- GROUP BY 1, 2, 3 ORDER BY total DESC;

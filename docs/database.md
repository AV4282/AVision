# Database

A free Tiger Cloud service (TimescaleDB on PostgreSQL), database `tsdb`, in us-east-1 with 750 MiB of storage. Photos are kept on disk, not in the database; tickets store only their path.

⚠️ **Local dev and the live site use the same database.** Anything you create, vote on or delete while testing shows up on https://atlantamamdani.photo.

## Connecting

Put the connection string from the service's Connect page in the root `.env` (or `api/.env`):

```
DATABASE_URL="postgres://tsdbadmin:<password>@<host>:<port>/tsdb?sslmode=require"
```

The API (`api/db.py`) uses psycopg 3 with a pool of up to 5 connections, opened at startup so a bad connection string fails right away. Ask a teammate for the string; it's never committed.

## Tables

```
users ──< tickets ──< ticket_votes >── users
             │
          reports (ticket_id)
```

### `tickets`
One row per public issue. A regular table, because status and counts are updated in place.

| Column | Notes |
|---|---|
| `id` | uuid |
| `title`, `issue_type`, `description` | From the report form |
| `owner` | `gsu_facilities`, `city_of_atlanta`, `marta` or `gdot` |
| `lat`, `lng`, `address` | Where it is |
| `photo_url` | A path like `/uploads/<name>.jpg`, or null |
| `status` | `open`, `likely_fixed`, `fixed` or `merged` |
| `merged_into` | The ticket this one was merged into |
| `created_by` | The poster's `users.id`, or null for anonymous |
| `report_count`, `last_seen_at` | Times reported; last report or still-there vote |
| `created_at`, `updated_at` | |

### `ticket_votes`
Each user's current vote on a ticket. The primary key is `(ticket_id, user_id)`, so changing a vote replaces the row. `vote` is `still_there` or `fixed`.

A vote recomputes the ticket's status inside one transaction that locks the ticket row: when fixed votes reach `FIXED_VOTE_THRESHOLD` (default 2) and outnumber still-there votes, the ticket becomes `likely_fixed`; otherwise it's `open`.

### `users`
One row per person. No emails or passwords.

| Column | Notes |
|---|---|
| `id` | The AVision user ID. **Link data by this, never by the Auth0 ID** |
| `auth0_sub` | Unique: `google-oauth2\|…` when signed in, `guest\|…` for guests, `seed\|…` for demo voters |
| `display_name`, `avatar_url` | From Google at first sign-in; the name can be changed on the profile |
| `role` | `user`, `facilities_staff` or `admin`. Admins can delete any ticket and mark tickets fixed |
| `is_student`, `school`, `takes_marta`, `onboarded_at` | Onboarding answers; null means not answered. `school` is only allowed for students |
| `created_at`, `last_login_at` | |

When a guest signs in, their tickets, votes and reports move to the account and the guest row is deleted. If both voted on the same ticket, the account's vote wins.

**Admins:** run `python admin.py list`, `python admin.py grant "<name>"` or `python admin.py revoke "<name>"` from `api/`. The person must have signed in once. To make someone Facilities staff: `UPDATE users SET role = 'facilities_staff' WHERE display_name = '<name>';`

### `reports` and `hotspots_weekly`
`reports` is a TimescaleDB hypertable (one row per photo submission, in 7-day chunks) holding the full AI output for each report: barriers, severity, confidence, routing reason and the drafted message. `hotspots_weekly` is a continuous aggregate counting reports per week, per ~110 m grid cell and per issue type, refreshed every minute.

Right now these hold only the 11 seed reports. Posting a ticket from the app writes to `tickets`, not `reports`. `reports.user_id` and `reports.ticket_id` have no foreign keys, because TimescaleDB can't add a constrained column to a hypertable with columnstore enabled; the code only writes IDs that exist.

## Migrations

In `api/sql/`, run in order. The live service is already set up, so you need these only for a fresh database.

| File | Run with | Does |
|---|---|---|
| `000_schema.sql` | Tiger console SQL editor | `reports` and `hotspots_weekly`. Can't run inside a transaction |
| `000_seed.sql` | Tiger console SQL editor | 11 demo reports. Running it twice duplicates them |
| `001_tickets.sql` | `python migrate.py sql/001_tickets.sql` | `users`, `tickets`, `ticket_votes` |
| `002_seed_tickets.sql` | `python migrate.py sql/002_seed_tickets.sql` | 6 demo tickets with votes |
| `003_onboarding.sql` | `python migrate.py sql/003_onboarding.sql` | Onboarding columns on `users` |
| `004_admin.sql` | `python migrate.py sql/004_admin.sql` | Allows the `admin` role |

`001`–`004` are safe to re-run. Demo rows are marked "(seed)"; the SQL to remove them is at the top of `002_seed_tickets.sql`.

## Resetting test data

`api/reset_db.py` deletes all tickets, votes and guests and unlinks reports. It keeps signed-in accounts and the seed reports. **Because the database is shared, this clears the live site too.** It shows what it will delete, asks you to type `reset`, and saves every deleted row to `api/backups/` (gitignored) first.

```powershell
cd api
.venv\Scripts\python reset_db.py --dry-run     # show what would be deleted; changes nothing
.venv\Scripts\python reset_db.py               # reset (asks to confirm)
.venv\Scripts\python reset_db.py --seed        # reset, then add the 6 demo tickets
```

Other flags: `--accounts` (delete signed-in accounts too), `--reports` (delete reports too) and `--yes` (skip the prompt).

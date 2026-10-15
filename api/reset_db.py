"""
Reset the AVision database for development. Not for production use.

WARNING: local dev and the live site share one database (DATABASE_URL), so this
also clears what people see on https://atlantamamdani.photo.

By default it removes all tickets, votes and guest users, and unlinks reports from
tickets. Signed-in accounts (with their onboarding answers), the seed reports and
the hotspots view are kept. Every row it deletes is saved first to
api/backups/reset-<time>.json (gitignored).

Usage (from the api/ folder):
    python reset_db.py --dry-run         # show what would be deleted; change nothing
    python reset_db.py                   # reset, after you type "reset" to confirm
    python reset_db.py --accounts        # also delete signed-in accounts
    python reset_db.py --reports         # also delete reports (hotspots go empty)
    python reset_db.py --seed            # afterwards, add the demo tickets (sql/002)
    python reset_db.py --yes             # skip the confirmation (for scripts)

Photos are files, not rows: the API deletes photos no ticket uses about an hour
later (at startup and every 6 hours), on whichever server stored them.
"""

import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse

import psycopg
from dotenv import load_dotenv
from psycopg.rows import dict_row

HERE = Path(__file__).parent
load_dotenv(HERE / ".env")
load_dotenv(HERE / "sql" / ".env")
load_dotenv(HERE.parent / ".env")

BACKUP_DIR = HERE / "backups"
SEED_TICKETS = HERE / "sql" / "002_seed_tickets.sql"


def counts(conn):
    """How many rows each reset step would touch."""
    one = lambda query: conn.execute(query).fetchone()["n"]
    return {
        "tickets": one("SELECT count(*) AS n FROM tickets"),
        "votes": one("SELECT count(*) AS n FROM ticket_votes"),
        "guests": one("SELECT count(*) AS n FROM users WHERE auth0_sub LIKE 'guest|%'"),
        "accounts": one("SELECT count(*) AS n FROM users WHERE auth0_sub NOT LIKE 'guest|%'"),
        "reports": one("SELECT count(*) AS n FROM reports"),
        "linked reports": one(
            "SELECT count(*) AS n FROM reports WHERE ticket_id IS NOT NULL OR user_id IS NOT NULL"
        ),
    }


def back_up(conn, include_accounts, include_reports):
    """Save every row the reset will delete or change, and return the file's path."""
    users = "" if include_accounts else "WHERE auth0_sub LIKE 'guest|%'"
    reports = "" if include_reports else "WHERE ticket_id IS NOT NULL OR user_id IS NOT NULL"
    backup = {
        "taken_at": datetime.now().isoformat(),
        "users": conn.execute(f"SELECT * FROM users {users}").fetchall(),
        "tickets": conn.execute("SELECT * FROM tickets").fetchall(),
        "ticket_votes": conn.execute("SELECT * FROM ticket_votes").fetchall(),
        "reports": conn.execute(f"SELECT * FROM reports {reports}").fetchall(),
    }
    BACKUP_DIR.mkdir(exist_ok=True)
    ignore = BACKUP_DIR / ".gitignore"
    if not ignore.exists():
        ignore.write_text("*\n")  # backups hold real data; never commit them
    path = BACKUP_DIR / f"reset-{datetime.now():%Y%m%d-%H%M%S}.json"
    path.write_text(json.dumps(backup, default=str, indent=1), encoding="utf-8")
    return path


def reset(conn, include_accounts, include_reports):
    """Delete in one transaction: all of it happens, or none of it. Returns rows affected."""
    done = {}
    with conn.transaction():
        if include_reports:
            done["reports deleted"] = conn.execute("DELETE FROM reports").rowcount
        else:
            done["reports unlinked"] = conn.execute(
                """UPDATE reports SET ticket_id = NULL, user_id = NULL
                   WHERE ticket_id IS NOT NULL OR user_id IS NOT NULL"""
            ).rowcount
        done["votes deleted"] = conn.execute("DELETE FROM ticket_votes").rowcount
        done["tickets deleted"] = conn.execute("DELETE FROM tickets").rowcount
        done["guests deleted"] = conn.execute(
            "DELETE FROM users WHERE auth0_sub LIKE 'guest|%'"
        ).rowcount
        if include_accounts:
            done["accounts deleted"] = conn.execute("DELETE FROM users").rowcount
    return done


def main():
    parser = argparse.ArgumentParser(
        description="Reset the AVision database (dev only; shared with the live site).",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__.split("Usage", 1)[1].split("\n", 1)[1],
    )
    parser.add_argument("--dry-run", action="store_true", help="show what would be deleted, then stop")
    parser.add_argument("--accounts", action="store_true", help="also delete signed-in accounts")
    parser.add_argument("--reports", action="store_true", help="also delete all reports")
    parser.add_argument("--seed", action="store_true", help="add the demo tickets afterwards")
    parser.add_argument("--yes", action="store_true", help="don't ask for confirmation")
    args = parser.parse_args()

    url = os.environ.get("DATABASE_URL")
    if not url:
        sys.exit("DATABASE_URL isn't set. Put it in api/.env or api/sql/.env.")
    host = urlparse(url).hostname or "?"

    with psycopg.connect(url, row_factory=dict_row, autocommit=True, connect_timeout=10) as conn:
        before = counts(conn)
        print(f"Database: {host}")
        print("  (shared with the live site, https://atlantamamdani.photo)\n")
        print(f"  Will delete: {before['tickets']} tickets, {before['votes']} votes, {before['guests']} guests")
        if args.accounts:
            print(f"               {before['accounts']} signed-in accounts")
        if args.reports:
            print(f"               {before['reports']} reports (hotspots go empty)")
        else:
            print(f"  Will unlink: {before['linked reports']} reports (the reports themselves stay)")
        kept = [] if args.accounts else [f"{before['accounts']} signed-in accounts"]
        kept += [] if args.reports else [f"{before['reports']} reports"]
        if kept:
            print(f"  Will keep:   {', '.join(kept)}")
        if args.seed:
            print("  Then add:    the demo tickets from sql/002_seed_tickets.sql")

        if args.dry_run:
            print("\nDry run: nothing was changed.")
            return
        if not args.yes:
            answer = input('\nThis also changes the live site. Type "reset" to continue: ')
            if answer.strip().lower() != "reset":
                print("Cancelled. Nothing was changed.")
                return

        backup = back_up(conn, args.accounts, args.reports)
        print(f"\nBackup saved: {backup.relative_to(HERE)}")
        for what, n in reset(conn, args.accounts, args.reports).items():
            print(f"  {what}: {n}")

        if args.seed:
            with conn.transaction():
                conn.execute(SEED_TICKETS.read_text(encoding="utf-8"))
            print("  demo tickets added")

        after = counts(conn)
        print(
            f"\nNow: {after['tickets']} tickets, {after['votes']} votes, "
            f"{after['guests']} guests, {after['accounts']} accounts, {after['reports']} reports."
        )
        print("Browsers with an old guest ID get a new one automatically.")


if __name__ == "__main__":
    main()

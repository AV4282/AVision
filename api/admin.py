"""
Give or take away admin permissions.

Admins can delete any ticket (not just their own) and mark tickets as fixed.
Only signed-in accounts can be admins, so the person must have signed in on the
site at least once. Changes take effect on their next request; no sign-out needed.

Usage (from the api/ folder):
    python admin.py list                 # every signed-in account and its role
    python admin.py grant "Amari B."     # by display name (as shown on their profile)
    python admin.py grant <user id>      # or by AVision user ID, when names repeat
    python admin.py revoke "Amari B."    # back to a regular user

Needs sql/004_admin.sql applied first:  python migrate.py sql/004_admin.sql
"""

import argparse
import os
import sys
from pathlib import Path
from uuid import UUID

import psycopg
from dotenv import load_dotenv
from psycopg.rows import dict_row

HERE = Path(__file__).parent
load_dotenv(HERE / ".env")
load_dotenv(HERE / "sql" / ".env")
load_dotenv(HERE.parent / ".env")

# Guests and demo voters can't be admins; only real sign-ins.
SIGNED_IN = "auth0_sub NOT LIKE 'guest|%%' AND auth0_sub NOT LIKE 'seed|%%'"


def admin_role_ready(conn) -> bool:
    """Whether 004_admin.sql has been applied, so the database accepts role 'admin'."""
    row = conn.execute(
        """SELECT pg_get_constraintdef(oid) AS check FROM pg_constraint
           WHERE conrelid = 'users'::regclass AND conname = 'users_role_check'"""
    ).fetchone()
    return row is None or "admin" in row["check"]


def find_user(conn, who: str) -> dict:
    """The one signed-in account `who` names (a user ID or a display name), or exit explaining why not."""
    try:
        rows = conn.execute(
            f"SELECT id, display_name, role FROM users WHERE id = %s AND {SIGNED_IN}", (UUID(who),)
        ).fetchall()
    except ValueError:  # not a UUID, so treat it as a name
        rows = conn.execute(
            f"""SELECT id, display_name, role FROM users
                WHERE lower(display_name) = lower(%s) AND {SIGNED_IN}
                ORDER BY created_at""",
            (who.strip(),),
        ).fetchall()
    if not rows:
        sys.exit(f'No signed-in account matches "{who}". Run "python admin.py list" to see them all.')
    if len(rows) > 1:
        print(f'{len(rows)} accounts are called "{who}". Run again with the user ID of the right one:')
        print_users(rows)
        sys.exit(1)
    return rows[0]


def print_users(rows):
    for row in rows:
        print(f"  {row['role']:<17} {row['id']}  {row['display_name'] or '(no name)'}")


def main():
    parser = argparse.ArgumentParser(description="Give or take away admin permissions.")
    parser.add_argument("action", choices=["list", "grant", "revoke"])
    parser.add_argument("who", nargs="?", help="display name or AVision user ID")
    args = parser.parse_args()
    if args.action != "list" and not args.who:
        parser.error(f"say who to {args.action}, e.g.: python admin.py {args.action} \"Amari B.\"")

    with psycopg.connect(os.environ["DATABASE_URL"], connect_timeout=10, row_factory=dict_row) as conn:
        if args.action == "list":
            rows = conn.execute(
                f"""SELECT id, display_name, role FROM users WHERE {SIGNED_IN}
                    ORDER BY role = 'admin' DESC, lower(display_name)"""
            ).fetchall()
            print(f"{len(rows)} signed-in account(s):")
            print_users(rows)
            return

        if not admin_role_ready(conn):
            sys.exit("The database doesn't know the admin role yet. Run: python migrate.py sql/004_admin.sql")

        user = find_user(conn, args.who)
        name = user["display_name"] or str(user["id"])
        new_role = "admin" if args.action == "grant" else "user"
        if user["role"] == new_role:
            print(f"{name} is already {'an admin' if new_role == 'admin' else 'a regular user'}. Nothing changed.")
            return
        if args.action == "revoke" and user["role"] != "admin":
            sys.exit(f"{name} isn't an admin (their role is {user['role']}). Nothing changed.")

        conn.execute("UPDATE users SET role = %s WHERE id = %s", (new_role, user["id"]))
        conn.commit()
        print(f"{name} is now {'an admin' if new_role == 'admin' else 'a regular user'}.")


if __name__ == "__main__":
    main()

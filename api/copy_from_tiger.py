"""
Copy everything from the old Tiger Cloud database into the new one (Supabase).

Reads from TIGER_DATABASE_URL and writes to DATABASE_URL. It first creates the schema
on the new database (sql/000_schema.sql and the numbered migrations, not the seed
files), then copies every table's rows. Tiger is only read, never changed.

Usage (from api/):
    python copy_from_tiger.py --dry-run     # show row counts on both sides; changes nothing
    python copy_from_tiger.py               # copy (the new database's tables must be empty)
    python copy_from_tiger.py --replace     # empty the new database's tables first, then copy

The copy runs in one transaction: all of it lands, or none of it does.
"""

import argparse
import os
import sys
from pathlib import Path

import psycopg
from dotenv import load_dotenv
from psycopg import sql

HERE = Path(__file__).parent
load_dotenv(HERE / ".env")
load_dotenv(HERE / "sql" / ".env")
load_dotenv(HERE.parent / ".env")

SCHEMA_FILES = (
    "000_schema.sql",
    "001_tickets.sql",
    "003_onboarding.sql",
    "004_admin.sql",
    "004_more_photos.sql",
    "005_notifications.sql",
    "006_georgia_tech.sql",
    "007_ticket_reports.sql",
    "008_screening.sql",
)

# Parents before children, so every foreign key already has its row.
TABLES = (
    "users",
    "tickets",
    "ticket_votes",
    "ticket_reports",
    "notifications",
    "flagged_attempts",
    "reports",
)


def columns(conn, table):
    rows = conn.execute(
        """SELECT column_name FROM information_schema.columns
           WHERE table_schema = 'public' AND table_name = %s ORDER BY ordinal_position""",
        (table,),
    ).fetchall()
    return [r[0] for r in rows]


def count(conn, table):
    if not columns(conn, table):
        return None
    return conn.execute(sql.SQL("SELECT count(*) FROM {}").format(sql.Identifier(table))).fetchone()[0]


def copy_table(src, dst, table):
    """Stream one table across with COPY. Returns the number of rows copied."""
    cols = [c for c in columns(src, table) if c in set(columns(dst, table))]
    missing = set(columns(src, table)) - set(cols)
    if missing:
        sys.exit(f"{table}: the new database has no column(s) {', '.join(sorted(missing))}")

    # A ticket can point at the ticket it was merged into, which may come later in
    # the copy. Copy merged_into as NULL, then fill it in once every ticket is there.
    select = [
        sql.SQL("NULL::uuid") if (table, c) == ("tickets", "merged_into") else sql.Identifier(c)
        for c in cols
    ]
    out = sql.SQL("COPY (SELECT {} FROM {}) TO STDOUT").format(
        sql.SQL(", ").join(select), sql.Identifier(table)
    )
    into = sql.SQL("COPY {} ({}) FROM STDIN").format(
        sql.Identifier(table), sql.SQL(", ").join(map(sql.Identifier, cols))
    )
    with src.cursor().copy(out) as reader, dst.cursor().copy(into) as writer:
        for chunk in reader:
            writer.write(chunk)
    return count(dst, table)


def main():
    parser = argparse.ArgumentParser(
        description="Copy the Tiger Cloud database into DATABASE_URL.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__.split("Usage", 1)[1].split("\n", 1)[1],
    )
    parser.add_argument("--dry-run", action="store_true", help="show row counts, then stop")
    parser.add_argument("--replace", action="store_true", help="empty the new tables before copying")
    args = parser.parse_args()

    source, target = os.environ.get("TIGER_DATABASE_URL"), os.environ.get("DATABASE_URL")
    if not source or not target:
        sys.exit("Set both TIGER_DATABASE_URL (old) and DATABASE_URL (new) in .env.")
    if source == target:
        sys.exit("TIGER_DATABASE_URL and DATABASE_URL are the same database.")

    with (
        psycopg.connect(source, connect_timeout=15) as src,
        psycopg.connect(target, connect_timeout=15) as dst,
    ):
        src.read_only = True

        print(f"{'table':<18}{'tiger':>8}{'new':>8}")
        for table in TABLES:
            old, new = count(src, table), count(dst, table)
            print(f"{table:<18}{'-' if old is None else old:>8}{'-' if new is None else new:>8}")
        if args.dry_run:
            return

        with dst.transaction():
            for name in SCHEMA_FILES:
                dst.execute((HERE / "sql" / name).read_text(encoding="utf-8"))

            filled = [t for t in TABLES if count(dst, t)]
            if filled and not args.replace:
                sys.exit(f"The new database already has rows in {', '.join(filled)}. "
                         "Run with --replace to empty them first.")
            if args.replace:
                dst.execute(sql.SQL("TRUNCATE {}").format(
                    sql.SQL(", ").join(map(sql.Identifier, TABLES))))

            copied = {}
            for table in TABLES:
                if count(src, table) is not None:
                    copied[table] = copy_table(src, dst, table)

            merged = src.execute(
                "SELECT id, merged_into FROM tickets WHERE merged_into IS NOT NULL"
            ).fetchall()
            for ticket_id, merged_into in merged:
                dst.execute("UPDATE tickets SET merged_into = %s WHERE id = %s", (merged_into, ticket_id))

            # Supabase serves the public schema through its REST API. The backend connects
            # as postgres, which skips RLS, so RLS with no policies only shuts that API out.
            for table in TABLES:
                dst.execute(sql.SQL("ALTER TABLE {} ENABLE ROW LEVEL SECURITY").format(
                    sql.Identifier(table)))

            for table, n in copied.items():
                old = count(src, table)
                if n != old:
                    raise RuntimeError(f"{table}: copied {n} rows but Tiger has {old}; nothing was saved")

        print("\nCopied:")
        for table, n in copied.items():
            print(f"  {table:<18}{n:>6}")
        print(f"  merged_into links restored: {len(merged)}")


if __name__ == "__main__":
    main()

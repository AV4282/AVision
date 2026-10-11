"""
Run a SQL migration file against DATABASE_URL in one transaction.

Usage:  python migrate.py sql/001_tickets.sql

The whole file commits or nothing does. Not for 000_schema.sql: continuous
aggregates can't be created inside a transaction, so run that one in the Tiger console.
"""

import os
import sys
from pathlib import Path

import psycopg
from dotenv import load_dotenv

HERE = Path(__file__).parent
load_dotenv(HERE / ".env")
load_dotenv(HERE / "sql" / ".env")
load_dotenv(HERE.parent / ".env")

CHECKS = {
    "tables": """
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = current_schema() AND table_type = 'BASE TABLE'
        ORDER BY 1""",
    "reports link columns": """
        SELECT column_name, data_type FROM information_schema.columns
        WHERE table_schema = current_schema() AND table_name = 'reports'
          AND column_name IN ('user_id', 'ticket_id') ORDER BY 1""",
}


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    sql = Path(sys.argv[1]).read_text(encoding="utf-8")

    with psycopg.connect(os.environ["DATABASE_URL"], connect_timeout=10) as conn:
        conn.execute(sql)
        conn.commit()
        print(f"Applied {sys.argv[1]}")
        for name, query in CHECKS.items():
            rows = conn.execute(query).fetchall()
            print(f"{name}: {', '.join(' '.join(map(str, r)) for r in rows)}")


if __name__ == "__main__":
    main()

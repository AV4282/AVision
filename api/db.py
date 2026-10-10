"""
Database access for the ticket API.

One shared pool of up to 5 connections to Tiger Cloud (DATABASE_URL, sslmode=require).
Rows come back as dicts. Endpoints are plain `def`, so this uses the sync pool:
async psycopg needs a non-default event loop on Windows.
"""

import os
from pathlib import Path

from dotenv import load_dotenv
from psycopg import errors
from psycopg.rows import dict_row
from psycopg_pool import ConnectionPool

HERE = Path(__file__).parent
load_dotenv(HERE / ".env")
load_dotenv(HERE / "sql" / ".env")

pool = ConnectionPool(
    os.environ["DATABASE_URL"],
    min_size=1,
    max_size=5,
    kwargs={"row_factory": dict_row},
    open=False,  # opened in main.py's lifespan, so importing this module never connects
)


# 2 for the demo; the design doc's real rule is 3.
FIXED_VOTE_THRESHOLD = int(os.getenv("FIXED_VOTE_THRESHOLD", "2"))


class UnknownUser(Exception):
    """The caller's user ID has no row in users."""


class TicketMerged(Exception):
    """The ticket was merged into another and no longer takes votes."""


def ping():
    with pool.connection() as conn:
        return conn.execute("SELECT 1 AS ok").fetchone()["ok"] == 1


# What the app gets back about a signed-in person (POST /me and /me/onboarding).
MEMBER_COLUMNS = """id, display_name, avatar_url, role, created_at,
                    is_student, school, takes_marta, onboarded_at"""


def upsert_user(auth0_sub, display_name=None, avatar_url=None):
    """Find or create the user for a verified Auth0 ID, and record this sign-in.

    The first sign-in creates the row; every later one returns the same id.
    A missing name or picture keeps the stored one rather than erasing it.
    """
    with pool.connection() as conn:
        return conn.execute(
            """INSERT INTO users (auth0_sub, display_name, avatar_url)
               VALUES (%(sub)s, %(name)s, %(avatar)s)
               ON CONFLICT (auth0_sub) DO UPDATE
                   SET last_login_at = now(),
                       display_name  = coalesce(EXCLUDED.display_name, users.display_name),
                       avatar_url    = coalesce(EXCLUDED.avatar_url, users.avatar_url)
               RETURNING """ + MEMBER_COLUMNS,
            {"sub": auth0_sub, "name": display_name, "avatar": avatar_url},
        ).fetchone()


def save_onboarding(auth0_sub, is_student, school, takes_marta):
    """Store a signed-in person's onboarding answers. Returns their user, or None if unknown."""
    with pool.connection() as conn:
        return conn.execute(
            """UPDATE users
               SET is_student = %(student)s,
                   school = CASE WHEN %(student)s THEN %(school)s END,
                   takes_marta = %(marta)s,
                   onboarded_at = now()
               WHERE auth0_sub = %(sub)s
               RETURNING """ + MEMBER_COLUMNS,
            {"sub": auth0_sub, "student": is_student, "school": school, "marta": takes_marta},
        ).fetchone()


def photo_names_in_use():
    """File names of every photo a ticket points at (see photos.remove_unused)."""
    import photos  # local import: photos has no reason to load for every db use

    with pool.connection() as conn:
        rows = conn.execute(
            "SELECT photo_url FROM tickets WHERE photo_url IS NOT NULL"
        ).fetchall()
    return {name for row in rows if (name := photos.name_in(row["photo_url"]))}


def create_guest():
    """Make a user row for someone who hasn't signed in. Replaced by the Auth0 upsert later."""
    with pool.connection() as conn:
        return conn.execute(
            """INSERT INTO users (auth0_sub, display_name)
               VALUES ('guest|' || gen_random_uuid(), 'Guest')
               RETURNING id"""
        ).fetchone()["id"]


# Every ticket read goes through this, so list and detail return the same shape.
# my_vote is the caller's own vote, or NULL when there is no caller or no vote.
# created_by_me is true when the caller made the ticket (for the profile page).
TICKET_SELECT = """
SELECT t.id, t.created_at, t.updated_at, t.issue_type, t.owner, t.lat, t.lng,
       t.address, t.title, t.description, t.photo_url, t.status, t.report_count,
       t.last_seen_at,
       count(v.vote) FILTER (WHERE v.vote = 'still_there') AS still_there,
       count(v.vote) FILTER (WHERE v.vote = 'fixed')       AS fixed,
       (SELECT mv.vote FROM ticket_votes mv
         WHERE mv.ticket_id = t.id AND mv.user_id = %(user_id)s::uuid) AS my_vote,
       coalesce(t.created_by = %(user_id)s::uuid, false) AS created_by_me
FROM tickets t
LEFT JOIN ticket_votes v ON v.ticket_id = t.id
"""


def list_tickets(status=None, owner=None, user_id=None, limit=100):
    with pool.connection() as conn:
        return conn.execute(
            TICKET_SELECT
            + """
            WHERE t.status <> 'merged'
              AND (%(status)s::text IS NULL OR t.status = %(status)s)
              AND (%(owner)s::text  IS NULL OR t.owner  = %(owner)s)
            GROUP BY t.id
            ORDER BY t.created_at DESC
            LIMIT %(limit)s""",
            {"status": status, "owner": owner, "user_id": user_id, "limit": limit},
        ).fetchall()


def get_ticket(ticket_id, user_id=None, conn=None):
    query = TICKET_SELECT + " WHERE t.id = %(id)s GROUP BY t.id"
    params = {"id": ticket_id, "user_id": user_id}
    if conn is not None:
        return conn.execute(query, params).fetchone()
    with pool.connection() as conn:
        return conn.execute(query, params).fetchone()


def create_ticket(ticket, user_id=None):
    """Insert a ticket from a dict of TicketIn fields and return it in the read shape."""
    with pool.connection() as conn:
        try:
            ticket_id = conn.execute(
                """INSERT INTO tickets (title, issue_type, owner, lat, lng, address,
                                        description, photo_url, created_by)
                   VALUES (%(title)s, %(issue_type)s, %(owner)s, %(lat)s, %(lng)s, %(address)s,
                           %(description)s, %(photo_url)s, %(created_by)s)
                   RETURNING id""",
                {**ticket, "created_by": user_id},
            ).fetchone()["id"]
        except errors.ForeignKeyViolation:
            raise UnknownUser from None
        return get_ticket(ticket_id, user_id, conn)


def cast_vote(ticket_id, user_id, vote):
    """Record or change the user's vote, then recompute the ticket's status.

    Returns the updated ticket, or None if it doesn't exist. Runs in one transaction,
    and locks the ticket row so two votes at once can't compute the status from stale counts.
    """
    with pool.connection() as conn:
        row = conn.execute(
            "SELECT status FROM tickets WHERE id = %s FOR UPDATE", (ticket_id,)
        ).fetchone()
        if row is None:
            return None
        if row["status"] == "merged":
            raise TicketMerged

        try:
            conn.execute(
                """INSERT INTO ticket_votes (ticket_id, user_id, vote)
                   VALUES (%s, %s, %s)
                   ON CONFLICT (ticket_id, user_id)
                   DO UPDATE SET vote = EXCLUDED.vote, voted_at = now()""",
                (ticket_id, user_id, vote),
            )
        except errors.ForeignKeyViolation:
            raise UnknownUser from None

        # Enough fixed votes, outnumbering still-there votes -> likely fixed; otherwise open.
        # Another fixed vote leaves an already-fixed ticket fixed; a still-there vote reopens it.
        # A still-there vote also counts as a fresh sighting.
        conn.execute(
            """UPDATE tickets t SET
                   status = CASE WHEN t.status = 'fixed' AND %(vote)s = 'fixed' THEN 'fixed'
                                 WHEN v.fixed >= %(threshold)s AND v.fixed > v.still
                                 THEN 'likely_fixed' ELSE 'open' END,
                   last_seen_at = CASE WHEN %(vote)s = 'still_there' THEN now()
                                       ELSE t.last_seen_at END,
                   updated_at = now()
               FROM (SELECT count(*) FILTER (WHERE vote = 'fixed')       AS fixed,
                            count(*) FILTER (WHERE vote = 'still_there') AS still
                     FROM ticket_votes WHERE ticket_id = %(id)s) v
               WHERE t.id = %(id)s""",
            {"id": ticket_id, "vote": vote, "threshold": FIXED_VOTE_THRESHOLD},
        )
        return get_ticket(ticket_id, user_id, conn)

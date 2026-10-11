"""
Database access for the ticket API.

One shared pool of up to 5 connections to Tiger Cloud (DATABASE_URL, sslmode=require).
Rows come back as dicts. Endpoints are plain `def`, so this uses the sync pool:
async psycopg needs a non-default event loop on Windows.
"""

import logging
import os
from pathlib import Path

from dotenv import load_dotenv
from psycopg import errors
from psycopg.rows import dict_row
from psycopg_pool import ConnectionPool

HERE = Path(__file__).parent
load_dotenv(HERE / ".env")
load_dotenv(HERE / "sql" / ".env")
load_dotenv(HERE.parent / ".env")

pool = ConnectionPool(
    os.environ["DATABASE_URL"],
    min_size=1,
    max_size=5,
    kwargs={"row_factory": dict_row},
    open=False,  # opened in main.py's lifespan, so importing this module never connects
)


log = logging.getLogger("uvicorn.error")  # shows up in uvicorn's (and journalctl's) log

# A ticket's photos beyond the first live in tickets.more_photos (sql/004_more_photos.sql).
# True once that column is known to exist. Until then every query works without it,
# so the API runs the same before and after the column is added.
HAS_MORE_PHOTOS = False


# Notifications live in their own table (sql/005_notifications.sql). True once it
# is known to exist. Without it nobody is notified, and everything else still works.
HAS_NOTIFICATIONS = False

# tickets.owner only accepts 'georgia_tech' once sql/006_georgia_tech.sql has run.
# Until it is known to, nothing is routed to Georgia Tech (see main.py's lifespan).
HAS_GEORGIA_TECH = False


def ensure_schema():
    """Add what this version of the API needs to the database, if it isn't there yet.

    Called once at startup. Only ever adds (never changes or removes), and is
    safe to run every time. If it can't make a change (say the database user
    isn't allowed to), the API carries on without that feature: one photo per
    ticket, no notifications, or no Georgia Tech tickets.
    """
    global HAS_MORE_PHOTOS, HAS_NOTIFICATIONS, HAS_GEORGIA_TECH
    with pool.connection() as conn:
        for name in ("004_more_photos.sql", "005_notifications.sql", "006_georgia_tech.sql"):
            try:
                conn.execute((HERE / "sql" / name).read_text(encoding="utf-8"))
                conn.commit()
            except Exception:
                conn.rollback()
                log.exception("Could not apply sql/%s; carrying on without it", name)
        HAS_MORE_PHOTOS = (
            conn.execute(
                """SELECT 1 FROM information_schema.columns
                   WHERE table_schema = current_schema()
                     AND table_name = 'tickets' AND column_name = 'more_photos'"""
            ).fetchone()
            is not None
        )
        HAS_NOTIFICATIONS = (
            conn.execute(
                """SELECT 1 FROM information_schema.tables
                   WHERE table_schema = current_schema() AND table_name = 'notifications'"""
            ).fetchone()
            is not None
        )
        HAS_GEORGIA_TECH = (
            conn.execute(
                """SELECT 1 FROM pg_constraint
                   WHERE conrelid = 'tickets'::regclass AND conname = 'tickets_owner_check'
                     AND pg_get_constraintdef(oid) LIKE '%%georgia_tech%%'"""
            ).fetchone()
            is not None
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
    A missing picture keeps the stored one rather than erasing it, and a picture
    the person uploaded themselves (save_avatar) is never replaced. The name from
    Auth0 is only used until there is one stored, so a name the person chose on
    their profile (save_display_name) isn't replaced on their next sign-in.
    """
    with pool.connection() as conn:
        return conn.execute(
            """INSERT INTO users (auth0_sub, display_name, avatar_url)
               VALUES (%(sub)s, %(name)s, %(avatar)s)
               ON CONFLICT (auth0_sub) DO UPDATE
                   SET last_login_at = now(),
                       display_name  = coalesce(users.display_name, EXCLUDED.display_name),
                       -- A picture the person uploaded here ("/uploads/...") is theirs
                       -- to keep; only the one from their sign-in provider is refreshed.
                       avatar_url    = CASE WHEN users.avatar_url LIKE '/uploads/%%'
                                            THEN users.avatar_url
                                            ELSE coalesce(EXCLUDED.avatar_url, users.avatar_url) END
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


def save_display_name(auth0_sub, display_name):
    """Store the name a signed-in person chose. Returns their user, or None if unknown."""
    with pool.connection() as conn:
        return conn.execute(
            """UPDATE users SET display_name = %(name)s
               WHERE auth0_sub = %(sub)s
               RETURNING """ + MEMBER_COLUMNS,
            {"sub": auth0_sub, "name": display_name},
        ).fetchone()


def save_avatar(auth0_sub, path):
    """Store a signed-in person's uploaded profile picture (a path from photos.save_photo).

    Returns their user, or None if unknown.
    """
    with pool.connection() as conn:
        return conn.execute(
            """UPDATE users SET avatar_url = %(path)s
               WHERE auth0_sub = %(sub)s
               RETURNING """ + MEMBER_COLUMNS,
            {"sub": auth0_sub, "path": path},
        ).fetchone()


def user_id_for_sub(auth0_sub):
    """The AVision user ID for a verified Auth0 ID, creating the user if needed.

    Cheaper than upsert_user: it doesn't record a sign-in. Used on every signed-in request.
    """
    with pool.connection() as conn:
        return conn.execute(
            """INSERT INTO users (auth0_sub) VALUES (%s)
               ON CONFLICT (auth0_sub) DO UPDATE SET auth0_sub = EXCLUDED.auth0_sub
               RETURNING id""",
            (auth0_sub,),
        ).fetchone()["id"]


def is_guest(user_id):
    """True for a guest user, False for anyone else, None if there's no such user."""
    with pool.connection() as conn:
        row = conn.execute(
            "SELECT auth0_sub LIKE 'guest|%%' AS guest FROM users WHERE id = %s", (user_id,)
        ).fetchone()
    return None if row is None else row["guest"]


# Status after votes change outside cast_vote (e.g. merged in from a guest):
# the same rule, but a fixed or merged ticket stays as it is.
RECOMPUTE_STATUS = """
UPDATE tickets t SET
    status = CASE WHEN t.status IN ('fixed', 'merged') THEN t.status
                  WHEN v.fixed >= %(threshold)s AND v.fixed > v.still THEN 'likely_fixed'
                  ELSE 'open' END,
    updated_at = now()
FROM (SELECT ticket_id,
             count(*) FILTER (WHERE vote = 'fixed')       AS fixed,
             count(*) FILTER (WHERE vote = 'still_there') AS still
      FROM ticket_votes WHERE ticket_id = ANY(%(ids)s) GROUP BY ticket_id) v
WHERE t.id = v.ticket_id
"""


def claim_guest(member_id, guest_id):
    """Move a guest's tickets, votes and reports to a signed-in member, then remove the guest.

    Called when someone signs in on a browser where they used AVision as a guest.
    Where both voted on the same ticket, the member's own vote wins. Does nothing
    unless guest_id really is a guest. Returns how many tickets and votes moved.
    """
    with pool.connection() as conn:
        if not conn.execute(
            "SELECT 1 FROM users WHERE id = %s AND auth0_sub LIKE 'guest|%%' FOR UPDATE",
            (guest_id,),
        ).fetchone():
            return {"tickets": 0, "votes": 0}

        tickets = conn.execute(
            "UPDATE tickets SET created_by = %s WHERE created_by = %s", (member_id, guest_id)
        ).rowcount
        # The guest's vote is dropped wherever the member already voted on that ticket.
        dropped = [
            row["ticket_id"]
            for row in conn.execute(
                """DELETE FROM ticket_votes g
                   USING ticket_votes m
                   WHERE g.user_id = %s AND m.user_id = %s AND m.ticket_id = g.ticket_id
                   RETURNING g.ticket_id""",
                (guest_id, member_id),
            ).fetchall()
        ]
        votes = conn.execute(
            "UPDATE ticket_votes SET user_id = %s WHERE user_id = %s", (member_id, guest_id)
        ).rowcount
        conn.execute("UPDATE reports SET user_id = %s WHERE user_id = %s", (member_id, guest_id))
        if HAS_NOTIFICATIONS:
            # Before the guest goes, or their notifications would go with them.
            conn.execute(
                "UPDATE notifications SET user_id = %s WHERE user_id = %s", (member_id, guest_id)
            )
            conn.execute(
                "UPDATE notifications SET actor_id = %s WHERE actor_id = %s", (member_id, guest_id)
            )
            # What the guest did to the member's tickets is now their own doing.
            conn.execute(
                "DELETE FROM notifications WHERE user_id = %s AND actor_id = %s",
                (member_id, member_id),
            )
        if dropped:
            conn.execute(RECOMPUTE_STATUS, {"ids": dropped, "threshold": FIXED_VOTE_THRESHOLD})
        conn.execute("DELETE FROM users WHERE id = %s", (guest_id,))
        return {"tickets": tickets, "votes": votes}


class NotYours(Exception):
    """The caller didn't post this ticket, so they can't change it."""


def delete_ticket(ticket_id, user_id):
    """Delete a ticket its poster no longer wants, with its votes.

    Reports that point at it are kept but unlinked. Returns the ticket's photos
    (so the caller can delete the files), or raises LookupError / NotYours.
    """
    more = "more_photos" if HAS_MORE_PHOTOS else "'{}'::text[] AS more_photos"
    with pool.connection() as conn:
        row = conn.execute(
            f"SELECT created_by, photo_url, {more} FROM tickets WHERE id = %s FOR UPDATE",
            (ticket_id,),
        ).fetchone()
        if row is None:
            raise LookupError(ticket_id)
        if user_id is None or row["created_by"] != user_id:
            raise NotYours
        # Tell the people who voted on it, while the votes still say who they are.
        _notify(conn, _TELL_VOTERS, ticket_id, user_id, "removed", keep_link=False)
        conn.execute("DELETE FROM ticket_votes WHERE ticket_id = %s", (ticket_id,))
        conn.execute("UPDATE reports SET ticket_id = NULL WHERE ticket_id = %s", (ticket_id,))
        conn.execute("UPDATE tickets SET merged_into = NULL WHERE merged_into = %s", (ticket_id,))
        conn.execute("DELETE FROM tickets WHERE id = %s", (ticket_id,))
        return [url for url in (row["photo_url"], *row["more_photos"]) if url]


def photo_names_in_use():
    """File names of every stored photo something points at (see photos.remove_unused).

    That is each ticket's photos, and each person's uploaded profile picture.
    """
    import photos  # local import: photos has no reason to load for every db use

    more = "UNION ALL SELECT unnest(more_photos) FROM tickets" if HAS_MORE_PHOTOS else ""
    with pool.connection() as conn:
        rows = conn.execute(
            f"""SELECT photo_url AS url FROM tickets WHERE photo_url IS NOT NULL
                {more}
                UNION ALL SELECT avatar_url FROM users WHERE avatar_url LIKE '/uploads/%%'"""
        ).fetchall()
    return {name for row in rows if (name := photos.name_in(row["url"]))}


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
def ticket_select() -> str:
    """The SELECT every ticket read starts with.

    photo_urls is every photo, the main one first. Built when asked for, since
    it depends on whether the more_photos column exists yet.
    """
    photos_column = "array_prepend(t.photo_url, t.more_photos)" if HAS_MORE_PHOTOS else "ARRAY[t.photo_url]"
    return TICKET_SELECT.replace("{photo_urls}", f"array_remove({photos_column}, NULL)")


TICKET_SELECT = """
SELECT t.id, t.created_at, t.updated_at, t.issue_type, t.owner, t.lat, t.lng,
       t.address, t.title, t.description, t.photo_url, {photo_urls} AS photo_urls,
       t.status, t.report_count,
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
            ticket_select()
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
    query = ticket_select() + " WHERE t.id = %(id)s GROUP BY t.id"
    params = {"id": ticket_id, "user_id": user_id}
    if conn is not None:
        return conn.execute(query, params).fetchone()
    with pool.connection() as conn:
        return conn.execute(query, params).fetchone()


def create_ticket(ticket, user_id=None):
    """Insert a ticket from a dict of TicketIn fields and return it in the read shape.

    `more_photo_urls` (the photos after the first) are stored when the database
    has the column for them, and left out otherwise.
    """
    more_column, more_value = (", more_photos", ", %(more_photo_urls)s") if HAS_MORE_PHOTOS else ("", "")
    with pool.connection() as conn:
        try:
            ticket_id = conn.execute(
                f"""INSERT INTO tickets (title, issue_type, owner, lat, lng, address,
                                        description, photo_url, created_by{more_column})
                   VALUES (%(title)s, %(issue_type)s, %(owner)s, %(lat)s, %(lng)s, %(address)s,
                           %(description)s, %(photo_url)s, %(created_by)s{more_value})
                   RETURNING id""",
                {"more_photo_urls": [], **ticket, "created_by": user_id},
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
        status_before = row["status"]
        earlier = conn.execute(
            "SELECT vote FROM ticket_votes WHERE ticket_id = %s AND user_id = %s",
            (ticket_id, user_id),
        ).fetchone()

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
        status_now = conn.execute(
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
               WHERE t.id = %(id)s
               RETURNING t.status""",
            {"id": ticket_id, "vote": vote, "threshold": FIXED_VOTE_THRESHOLD},
        ).fetchone()["status"]

        # Pressing the same button again changes nothing, so it tells nobody.
        if earlier is None or earlier["vote"] != vote or status_now != status_before:
            if status_now == "likely_fixed" and status_before != "likely_fixed":
                kind = "likely_fixed"
                _notify(conn, _TELL_VOTERS, ticket_id, user_id, kind)
            elif status_now == "open" and status_before in ("likely_fixed", "fixed"):
                kind = "reopened"
            else:
                kind = "still_there" if vote == "still_there" else "marked_fixed"
            _notify(conn, _TELL_POSTER, ticket_id, user_id, kind)
        return get_ticket(ticket_id, user_id, conn)


# ---------- notifications ----------
# Both statements skip the person who did the thing, and skip a repeat of a
# notification that person already caused and the reader hasn't seen yet.
_NOT_A_REPEAT = """NOT EXISTS (
        SELECT 1 FROM notifications n
        WHERE n.user_id = {reader} AND n.ticket_id = t.id AND n.kind = %(kind)s
          AND n.actor_id IS NOT DISTINCT FROM %(actor)s::uuid AND n.read_at IS NULL)"""

# The person who posted the ticket.
_TELL_POSTER = """
INSERT INTO notifications (user_id, ticket_id, ticket_title, kind, yours, actor_id)
SELECT t.created_by, t.id, t.title, %(kind)s, true, %(actor)s::uuid
FROM tickets t
WHERE t.id = %(ticket)s AND t.created_by IS NOT NULL
  AND t.created_by IS DISTINCT FROM %(actor)s::uuid
  AND """ + _NOT_A_REPEAT.format(reader="t.created_by")

# Everyone who voted on it, apart from the poster (told above, or doing this themselves).
_TELL_VOTERS = """
INSERT INTO notifications (user_id, ticket_id, ticket_title, kind, yours, actor_id)
SELECT v.user_id, CASE WHEN %(keep_link)s THEN t.id END, t.title, %(kind)s, false, %(actor)s::uuid
FROM ticket_votes v JOIN tickets t ON t.id = v.ticket_id
WHERE t.id = %(ticket)s
  AND v.user_id IS DISTINCT FROM %(actor)s::uuid
  AND v.user_id IS DISTINCT FROM t.created_by
  AND """ + _NOT_A_REPEAT.format(reader="v.user_id")


def _notify(conn, statement, ticket_id, actor_id, kind, keep_link=True):
    """Add notifications inside the caller's transaction, without ever failing it.

    keep_link=False is for a ticket that is about to be deleted: the notification
    must not point at it, or it would be deleted along with the ticket.
    """
    if not HAS_NOTIFICATIONS:
        return
    try:
        with conn.transaction():  # a savepoint: a problem here undoes only this
            conn.execute(
                statement,
                {"ticket": ticket_id, "actor": actor_id, "kind": kind, "keep_link": keep_link},
            )
    except Exception:
        log.exception("Could not save a %s notification for ticket %s", kind, ticket_id)


def list_notifications(user_id, limit=30):
    """A person's newest notifications, and how many they haven't seen."""
    if not HAS_NOTIFICATIONS:
        return {"unread": 0, "items": []}
    with pool.connection() as conn:
        items = conn.execute(
            """SELECT id, kind, yours, ticket_id, ticket_title, created_at,
                      read_at IS NOT NULL AS read
               FROM notifications WHERE user_id = %s
               ORDER BY created_at DESC, id LIMIT %s""",
            (user_id, limit),
        ).fetchall()
        unread = conn.execute(
            "SELECT count(*) AS n FROM notifications WHERE user_id = %s AND read_at IS NULL",
            (user_id,),
        ).fetchone()["n"]
    return {"unread": unread, "items": items}


def mark_notifications_read(user_id, ids):
    """Mark these notifications as seen. Only the person's own ones are touched."""
    if not HAS_NOTIFICATIONS or not ids:
        return
    with pool.connection() as conn:
        conn.execute(
            """UPDATE notifications SET read_at = now()
               WHERE user_id = %s AND id = ANY(%s) AND read_at IS NULL""",
            (user_id, list(ids)),
        )

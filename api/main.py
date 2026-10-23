"""
AVision ticket API: create tickets, list them, vote on them, store their photos,
and run the report agent that fills in a ticket from a photo.

Run locally:    uvicorn main:app --reload --port 8000     (from the api/ folder)
Try it at:      http://localhost:8000/docs

Callers identify themselves in one of two ways (see caller() below):
  - Signed in: "Authorization: Bearer <Auth0 access token>". Tickets and votes are
    saved under their AVision user. POST /me records the sign-in.
  - Guest: an X-User-Id header holding the ID from POST /guests. Only guest IDs are
    accepted this way, so nobody can act as a signed-in person by sending their ID.
"""

import asyncio
import hashlib
import logging
import os
import re
import signal
import threading
import time
from collections import deque
from contextlib import asynccontextmanager
from datetime import datetime
from pathlib import Path
from typing import Annotated, Literal
from uuid import UUID

from fastapi import FastAPI, Header, HTTPException, Response, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

import db  # first: it loads api/.env, which the modules below read their settings from
import agent
import auth
import gemini
import geocode
import live
import photos
import routing

log = logging.getLogger("uvicorn.error")  # shows up in uvicorn's (and journalctl's) log

ALLOWED_ORIGINS = [
    o.strip() for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:8443").split(",")
]

# Same values as reports.owner and the CHECK on tickets.owner.
Owner = Literal["gsu_facilities", "georgia_tech", "city_of_atlanta", "marta", "gdot"]
Status = Literal["open", "likely_fixed", "fixed", "merged"]
Vote = Literal["still_there", "fixed"]
MAX_TICKET_PHOTOS = 5
# A stored photo's path, as POST /uploads returns it, e.g. "/uploads/3f2a....jpg".
PhotoPath = Annotated[str, Field(pattern=photos.PATH_PATTERN.pattern)]
# A photo's public link, for putting in a drafted message.
PhotoLink = Annotated[str, Field(max_length=1000, pattern=r"^https?://\S+$")]
UserIdHeader = Annotated[UUID | None, Header(alias="X-User-Id")]
AuthorizationHeader = Annotated[str | None, Header(alias="Authorization")]


PHOTO_CLEANUP_EVERY = 6 * 60 * 60  # seconds


def clean_up_photos():
    """Delete stored photos that no ticket uses (see photos.remove_unused)."""
    try:
        removed = photos.remove_unused(db.photo_names_in_use())
        if removed:
            log.info("Removed %d unused photo(s)", removed)
    except Exception:
        # Never let cleanup take the API down; it tries again next round.
        log.exception("Photo cleanup failed")


def photo_cleanup_loop(stop: threading.Event):
    while not stop.wait(PHOTO_CLEANUP_EVERY):
        clean_up_photos()


def end_live_streams_on_shutdown():
    """Make stopping the server end the open /events streams first.

    The server waits for requests in progress before it stops, and an /events
    stream never finishes by itself, so a restart would hang until it is killed.
    This runs live.hub.close() when the stop signal arrives, then hands the
    signal on to the server as before.
    """
    for name in ("SIGINT", "SIGTERM", "SIGBREAK"):  # SIGBREAK is Windows only
        number = getattr(signal, name, None)
        if number is None:
            continue
        before = signal.getsignal(number)

        def handler(signum, frame, before=before):
            live.hub.close()
            if callable(before):
                before(signum, frame)

        try:
            signal.signal(number, handler)
        except ValueError:
            pass  # not the main thread (some test runners); streams end when the process does


@asynccontextmanager
async def lifespan(_app):
    live.hub.start(asyncio.get_running_loop())
    end_live_streams_on_shutdown()
    db.pool.open(wait=True, timeout=15)  # fail at startup, not on the first request
    db.ensure_schema()  # add anything this version needs that the database doesn't have yet
    if not db.HAS_GEORGIA_TECH:
        # The database would refuse a Georgia Tech ticket, so don't route anything there.
        routing.UNAVAILABLE.add("georgia_tech")
    photos.prepare()  # same for the photo folder
    stop = threading.Event()
    # Once at startup (so each deploy tidies up), then every few hours.
    cleanup = threading.Thread(
        target=lambda: (clean_up_photos(), photo_cleanup_loop(stop)), daemon=True
    )
    cleanup.start()
    yield
    live.hub.close()
    stop.set()
    cleanup.join(timeout=5)
    db.pool.close()


app = FastAPI(title="AVision ticket API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["*"],
)


def _running_version() -> str | None:
    """The short id of the git commit this code was started from, or None if that can't be read."""
    try:
        git = Path(__file__).parent.parent / ".git"
        head = (git / "HEAD").read_text().strip()
        if not head.startswith("ref: "):
            return head[:7]
        ref = head[5:]
        if (git / ref).is_file():
            return (git / ref).read_text().strip()[:7]
        for line in (git / "packed-refs").read_text().splitlines():
            if line.endswith(" " + ref):
                return line[:7]
    except OSError:
        pass
    return None


VERSION = _running_version()


# AVision only takes reports in its own area (see routing.coverage). Set
# ALLOW_OUTSIDE_ATLANTA=1 in api/.env to switch the check off, e.g. for a demo elsewhere.
ALLOW_OUTSIDE = os.getenv("ALLOW_OUTSIDE_ATLANTA", "").strip().lower() in ("1", "true", "yes")


def require_covered(lat: float, lng: float):
    """Refuse a position outside the area AVision covers, with a message for the person."""
    if ALLOW_OUTSIDE:
        return
    area = routing.coverage(lat, lng)
    if not area["covered"]:
        raise HTTPException(422, area["reason"])


def require_owner_fits(owner: str, lat: float, lng: float):
    """Refuse a campus department for a spot off its campus (see routing.off_campus)."""
    why = routing.off_campus(owner, lat, lng)
    if why:
        raise HTTPException(422, f"{why} Move the pin onto campus or choose another department.")


# ---------- screening ----------
# A report that plainly isn't one (a cartoon for a photo, a joke or abuse for the
# words) is refused, and the attempt counts against the person: see
# gemini.SCREEN_RULES for what is flagged and db.flag_attempt for the counting.
# Every photo on the report is looked at, not only the main one. Admins are
# refused the same way but never get strikes or a pause.
# Only the AI can judge that, so when it isn't available nothing is flagged.
def _photo_key(photo: str | None) -> str | None:
    """The key for a stored photo, from its file name or from a path or link ending in it."""
    name = re.search(r"([0-9a-f]{32}\.jpg)$", photo or "")
    return f"photo:{name.group(1)}" if name else None


def _text_key(user_id, title: str | None, description: str | None) -> str | None:
    """One key per person per wording, so the same words tried again are known."""
    words = " ".join(f"{title or ''} | {description or ''}".lower().split())
    if not words.strip(" |"):
        return None
    return "text:" + hashlib.sha256(f"{user_id}|{words}".encode()).hexdigest()[:40]


def _more_photo_bytes(links) -> list[bytes]:
    """The photos these links point at on this server, in order, for the AI to screen. Others are skipped."""
    pictures = []
    for link in links or []:
        path = photos.find(photos.name_in(link) or "")
        if path is not None:
            pictures.append(path.read_bytes())
    return pictures


def require_good_standing(user_id):
    """Refuse someone whose posting is paused, saying until when. Admins are never paused."""
    if user_id and db.is_admin(user_id):
        return
    until = db.standing(user_id)["suspended_until"]
    if until is not None:
        raise HTTPException(
            403,
            {
                "code": "suspended",
                "message": "Posting is paused for this account because several reports were flagged "
                "as not real. Browsing and voting still work.",
                "suspended_until": until.isoformat(),
            },
        )


def _refuse_flagged(what: str, reason: str | None, user_id, keys: dict, which: list[int] = ()):
    """Count the attempt and refuse the report, telling the person why and where they stand.

    `which` is the numbers of the flagged photos, 1 being the main one. An
    admin's attempt is refused the same way but never counted: no strikes, no pause.
    """
    if user_id and db.is_admin(user_id):
        now = {"strikes": 0, "limit": db.FLAG_LIMIT, "suspended_until": None}
    else:
        now = db.flag_attempt(user_id, keys, reason)
    until = now["suspended_until"]
    raise HTTPException(
        422,
        {
            "code": "flagged",
            "what": what,
            "photos": list(which),
            "message": reason
            or ("That photo doesn't look like a real report." if what == "photo" else "That doesn't read like a real report."),
            "strikes": now["strikes"],
            "limit": now["limit"],
            "suspended_until": until.isoformat() if until else None,
        },
    )


def screen(
    result: dict,
    user_id,
    photo: str | None,
    title: str | None,
    description: str | None,
    more: list[str | None] = (),
):
    """Refuse what the AI flagged in `result` (from agent.py). Does nothing when all is fine.

    `photo` is the main photo and `more` the others, in the order the AI saw
    them. A None in either place is a photo that isn't held against the person
    (one that was on the ticket already): it is still refused, but not written down.
    """
    verdict = result.get("screening") or {}
    what = verdict.get("flagged") or "none"
    if what == "none":
        return
    names = [photo, *more]
    which = [n for n in verdict.get("photos") or [1] if 1 <= n <= len(names)] or [1]
    keys = {}
    if what in ("photo", "both"):
        for n in which:
            if _photo_key(names[n - 1]):
                keys[_photo_key(names[n - 1])] = "photo"
    if what in ("text", "both") and _text_key(user_id, title, description):
        keys[_text_key(user_id, title, description)] = "text"
    _refuse_flagged(what, verdict.get("reason"), user_id, keys, which if what != "text" else [])


def refuse_known_flagged(
    user_id, photo: str | None, title: str | None, description: str | None, more: list[str | None] = ()
):
    """Refuse a photo or wording that was flagged before, without asking the AI again."""
    names = [photo, *more]
    before = db.flagged_reason([*(_photo_key(name) for name in names), _text_key(user_id, title, description)])
    if before:
        which = [n for n, name in enumerate(names, 1) if _photo_key(name) == before.get("key")]
        _refuse_flagged(before["what"], before["reason"], user_id, {}, which)


# ---------- models ----------
class TicketIn(BaseModel):
    # Trim whitespace, so "   " counts as an empty title. Examples fill /docs "Try it out".
    model_config = ConfigDict(str_strip_whitespace=True)

    title: str = Field(min_length=1, max_length=120, examples=["Blocked curb ramp"])
    issue_type: str = Field(pattern=r"^[a-z][a-z0-9_]{1,40}$", examples=["blocked_curb_ramp"])
    owner: Owner = Field(examples=["city_of_atlanta"])
    lat: float = Field(ge=-90, le=90, examples=[33.7531])
    lng: float = Field(ge=-180, le=180, examples=[-84.3853])
    address: str | None = Field(default=None, max_length=200, examples=["Courtland St SE & Gilmer St SE"])
    description: str | None = Field(
        default=None, max_length=2000, examples=["Scooter parked across the curb ramp"]
    )
    # Only a path from POST /uploads, e.g. "/uploads/3f2a....jpg". Storing the path, not
    # a full link, keeps it working on every site; outside links aren't accepted.
    photo_url: str | None = Field(
        default=None, pattern=photos.PATH_PATTERN.pattern, examples=[None]
    )

    # The ticket's other photos, after the main one above: up to four more paths
    # from POST /uploads, which makes five photos in all.
    more_photo_urls: list[PhotoPath] = Field(default_factory=list, max_length=MAX_TICKET_PHOTOS - 1)

    @field_validator("address", "description", "photo_url", mode="before")
    @classmethod
    def blank_to_none(cls, value):
        return None if isinstance(value, str) and not value.strip() else value

    @model_validator(mode="after")
    def tidy_photos(self):
        """No photo listed twice, and the first one there is always the main photo."""
        seen = list(dict.fromkeys(url for url in (self.photo_url, *self.more_photo_urls) if url))
        self.photo_url = seen[0] if seen else None
        self.more_photo_urls = seen[1:]
        return self


class Ticket(BaseModel):
    id: UUID
    created_at: datetime
    updated_at: datetime
    issue_type: str
    owner: Owner
    lat: float
    lng: float
    address: str | None
    title: str
    description: str | None
    photo_url: str | None  # the main photo
    photo_urls: list[str]  # every photo, main one first; empty if the ticket has none
    status: Status
    report_count: int
    last_seen_at: datetime
    still_there: int
    fixed: int
    my_vote: Vote | None
    created_by_me: bool  # the caller posted this ticket (so they may delete it)


class VoteIn(BaseModel):
    vote: Vote


class Guest(BaseModel):
    id: UUID


class MeIn(BaseModel):
    """Display details from the person's Auth0 profile. Who they are comes from the token."""

    model_config = ConfigDict(str_strip_whitespace=True)

    display_name: str | None = Field(default=None, max_length=80, examples=["Amari B."])
    avatar_url: str | None = Field(default=None, max_length=1000, pattern=r"^https://\S+$")

    @field_validator("display_name", "avatar_url", mode="before")
    @classmethod
    def blank_to_none(cls, value):
        return None if isinstance(value, str) and not value.strip() else value


class Me(BaseModel):
    id: UUID  # the AVision user ID; use this, never the Auth0 ID, to link data
    display_name: str | None
    avatar_url: str | None
    role: Literal["user", "facilities_staff", "admin"]  # admin: granted with admin.py
    created_at: datetime
    # Onboarding answers; None = not answered. onboarded_at None = never saved, so ask.
    is_student: bool | None
    school: str | None
    takes_marta: bool | None
    onboarded_at: datetime | None


class OnboardingIn(BaseModel):
    """Answers to the onboarding questions. Any of them may be left unanswered (null)."""

    model_config = ConfigDict(str_strip_whitespace=True)

    is_student: bool | None = Field(default=None, examples=[True])
    school: str | None = Field(default=None, max_length=120, examples=["Georgia State University"])
    takes_marta: bool | None = Field(default=None, examples=[True])

    @field_validator("school", mode="before")
    @classmethod
    def blank_to_none(cls, value):
        return None if isinstance(value, str) and not value.strip() else value


class NameIn(BaseModel):
    """The name the person wants shown on their profile."""

    model_config = ConfigDict(str_strip_whitespace=True)

    display_name: str = Field(min_length=1, max_length=80, examples=["Amari B."])


class Photo(BaseModel):
    name: str  # file name, e.g. "3f2a....jpg"
    path: str  # where this API serves it, e.g. "/uploads/3f2a....jpg"
    # How many faces and license plates were blurred before the photo was stored.
    # None when the photo privacy service isn't in use on this server.
    faces_hidden: int | None = None
    plates_hidden: int | None = None


class AnalyzeIn(BaseModel):
    photo: str = Field(pattern=r"^[0-9a-f]{32}\.jpg$", examples=["3f2a9c0e5b7d4e1f8a6b2c4d6e8f0a1b.jpg"])
    lat: float = Field(ge=-90, le=90, examples=[33.7531])
    lng: float = Field(ge=-180, le=180, examples=[-84.3853])
    # The photo's public link, to put in the drafted report. Optional.
    photo_url: str | None = Field(default=None, max_length=1000, pattern=r"^https?://\S+$")
    # Links to the report's other photos, to list in the drafted report too.
    more_photo_urls: list[PhotoLink] = Field(default_factory=list, max_length=MAX_TICKET_PHOTOS - 1)


class DraftIn(BaseModel):
    """A ticket that is about to be posted, for POST /draft. Same fields as TicketIn where they overlap."""

    model_config = ConfigDict(str_strip_whitespace=True)

    title: str = Field(min_length=1, max_length=120, examples=["Blocked curb ramp"])
    issue_type: str = Field(pattern=r"^[a-z][a-z0-9_]{1,40}$", examples=["blocked_curb_ramp"])
    lat: float = Field(ge=-90, le=90, examples=[33.7531])
    lng: float = Field(ge=-180, le=180, examples=[-84.3853])
    address: str | None = Field(default=None, max_length=200, examples=["Courtland St SE & Gilmer St SE"])
    description: str | None = Field(default=None, max_length=2000, examples=["Scooter parked across the curb ramp"])
    # The `name` POST /uploads returned, when the ticket has a photo.
    photo: str | None = Field(default=None, pattern=r"^[0-9a-f]{32}\.jpg$", examples=[None])
    # The photo's public link, to put in the drafted report.
    photo_url: str | None = Field(default=None, max_length=1000, pattern=r"^https?://\S+$", examples=[None])
    # Links to the ticket's other photos, to list in the message too.
    more_photo_urls: list[PhotoLink] = Field(default_factory=list, max_length=MAX_TICKET_PHOTOS - 1)
    # The department the person picked by hand. Leave it out to have it chosen from the issue and the place.
    owner: Owner | None = Field(default=None, examples=[None])

    @field_validator("address", "description", "photo", "photo_url", mode="before")
    @classmethod
    def blank_to_none(cls, value):
        return None if isinstance(value, str) and not value.strip() else value


# ---------- routes ----------
def verified_sub(authorization: str | None) -> str:
    """The Auth0 ID from a valid "Bearer" token, or a 401 explaining what's wrong."""
    scheme, _, token = (authorization or "").partition(" ")
    if scheme.lower() != "bearer" or not token.strip():
        raise HTTPException(
            401, "Sign in first (send Authorization: Bearer <token>)",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        return auth.verify(token.strip())["sub"]
    except auth.InvalidToken as problem:
        raise HTTPException(
            401, str(problem), headers={"WWW-Authenticate": 'Bearer error="invalid_token"'}
        )


def caller(
    authorization: str | None, guest_id: UUID | None, *, required: bool = False, strict: bool = True
) -> UUID | None:
    """Who is making this request: their AVision user ID, or None for nobody.

    A valid sign-in token wins. Otherwise X-User-Id is used, but only for guests.
    With strict=False (for reading), a bad token or unknown guest just means
    "nobody", so a stale ID never stops someone from browsing.
    """
    if authorization:
        try:
            return db.user_id_for_sub(verified_sub(authorization))
        except HTTPException:
            if strict:
                raise
            return None
    if guest_id is not None:
        guest = db.is_guest(guest_id)
        if guest:
            return guest_id
        if strict:
            raise HTTPException(
                401,
                "Unknown X-User-Id; get a new one from POST /guests"
                if guest is None
                else "That ID belongs to a signed-in account. Sign in to act as it.",
            )
        return None
    if required:
        raise HTTPException(401, "Sign in, or send an X-User-Id header (get one from POST /guests)")
    return None


@app.get("/health")
def health():
    # photo_privacy: whether uploads go through the face and plate blurring service.
    # version: the commit this server is running, to tell whether a deploy has landed.
    # live: how many pages are listening for live updates right now (GET /events).
    return {
        "ok": db.ping(),
        "photo_privacy": bool(photos.PRIVACY_URL),
        "version": VERSION,
        "live": live.hub.listeners(),
    }


@app.post("/me", response_model=Me)
def sign_in(
    authorization: AuthorizationHeader = None,
    guest_id: UserIdHeader = None,
    body: MeIn | None = None,
):
    """Record a sign-in. Creates the user the first time; returns the same user after.

    Send the browser's guest ID as X-User-Id to move what that guest did (tickets,
    votes) to the account. The guest is then removed.
    """
    sub = verified_sub(authorization)
    details = body or MeIn()
    member = db.upsert_user(sub, details.display_name, details.avatar_url)
    if guest_id is not None and guest_id != member["id"]:
        moved = db.claim_guest(member["id"], guest_id)
        if moved["tickets"] or moved["votes"]:
            log.info("Moved %(tickets)d ticket(s) and %(votes)d vote(s) from a guest to an account", moved)
    return member


@app.post("/me/onboarding", response_model=Me)
def save_onboarding(body: OnboardingIn, authorization: AuthorizationHeader = None):
    """Save the signed-in person's onboarding answers (asked once, editable later).

    A school is kept only for students.
    """
    sub = verified_sub(authorization)
    school = body.school if body.is_student else None
    member = db.save_onboarding(sub, body.is_student, school, body.takes_marta)
    if member is None:
        # Signed in with Auth0, but POST /me never ran for them. Create them, then save.
        db.upsert_user(sub)
        member = db.save_onboarding(sub, body.is_student, school, body.takes_marta)
    return member


@app.post("/me/name", response_model=Me)
def save_name(body: NameIn, authorization: AuthorizationHeader = None):
    """Change the signed-in person's display name. Later sign-ins keep it."""
    sub = verified_sub(authorization)
    member = db.save_display_name(sub, body.display_name)
    if member is None:
        # Signed in with Auth0, but POST /me never ran for them. Create them, then save.
        db.upsert_user(sub)
        member = db.save_display_name(sub, body.display_name)
    return member


@app.post("/me/avatar", response_model=Me)
def save_avatar(file: UploadFile, authorization: AuthorizationHeader = None):
    """Set the signed-in person's profile picture (form field "file"; JPEG, PNG or WebP).

    The picture is cleaned like any upload (re-saved, so the phone's hidden
    details are dropped) and shrunk, but faces are not blurred: it is theirs.
    Later sign-ins keep it. The old picture's file is removed by the photo cleanup.
    """
    sub = verified_sub(authorization)
    data = file.file.read(photos.MAX_BYTES + 1)
    if len(data) > photos.MAX_BYTES:
        raise HTTPException(413, f"That picture is too large (limit {photos.MAX_BYTES // 1024 // 1024} MB)")
    if not data:
        raise HTTPException(400, "The picture file is empty")
    try:
        saved = photos.save_photo(data, profile_picture=True)
    except photos.BadPhoto as problem:
        raise HTTPException(400, str(problem))
    except photos.StorageFull:
        raise HTTPException(507, "Photo storage is full. Try again later.")
    path = f"/uploads/{saved.name}"
    member = db.save_avatar(sub, path)
    if member is None:
        # Signed in with Auth0, but POST /me never ran for them. Create them, then save.
        db.upsert_user(sub)
        member = db.save_avatar(sub, path)
    return member


@app.get("/coverage")
def coverage(lat: float, lng: float):
    """Whether AVision takes reports at a position, so the form can say so before anything is posted."""
    if not (-90 <= lat <= 90 and -180 <= lng <= 180):
        raise HTTPException(422, "That isn't a position on the map.")
    # `blocked` lists the departments that can't be chosen here: a campus one, off its campus.
    blocked = routing.blocked_here(lat, lng)
    if ALLOW_OUTSIDE:
        return {"covered": True, "reason": "Reports are being taken everywhere.", "blocked": blocked}
    return {**routing.coverage(lat, lng), "blocked": blocked}


@app.get("/campuses")
def campuses(response: Response):
    """The campus outlines. GSU Facilities and Georgia Tech only take tickets inside their own."""
    response.headers["Cache-Control"] = "public, max-age=3600"
    return {"campuses": routing.campus_outlines(), "slack_m": routing.CAMPUS_EDGE_SLACK_M}


@app.post("/guests", response_model=Guest, status_code=201)
def create_guest():
    """Create a guest user. The frontend saves the ID and sends it as X-User-Id."""
    return {"id": db.create_guest()}


@app.get("/tickets", response_model=list[Ticket])
def list_tickets(
    status: Status | None = None,
    owner: Owner | None = None,
    authorization: AuthorizationHeader = None,
    guest_id: UserIdHeader = None,
):
    user_id = caller(authorization, guest_id, strict=False)
    return db.list_tickets(status=status, owner=owner, user_id=user_id)


@app.get("/tickets/{ticket_id}", response_model=Ticket)
def get_ticket(
    ticket_id: UUID, authorization: AuthorizationHeader = None, guest_id: UserIdHeader = None
):
    ticket = db.get_ticket(ticket_id, caller(authorization, guest_id, strict=False))
    if ticket is None:
        raise HTTPException(404, "Ticket not found")
    return ticket


@app.post("/tickets", response_model=Ticket, status_code=201)
def create_ticket(
    body: TicketIn, authorization: AuthorizationHeader = None, guest_id: UserIdHeader = None
):
    """Anyone can create a ticket. The caller, if any, is recorded as its poster.

    Only inside the area AVision covers: the City of Atlanta and MARTA rail stations.
    """
    require_covered(body.lat, body.lng)
    if body.owner in routing.UNAVAILABLE:
        raise HTTPException(422, "That department isn't set up on this server yet. Choose another one.")
    require_owner_fits(body.owner, body.lat, body.lng)
    user_id = caller(authorization, guest_id)
    require_good_standing(user_id)
    refuse_known_flagged(
        user_id, body.photo_url, body.title, body.description, [photos.name_in(link) for link in body.more_photo_urls]
    )
    try:
        ticket = db.create_ticket(body.model_dump(), user_id)
    except db.UnknownUser:
        raise HTTPException(401, "Unknown X-User-Id; get a new one from POST /guests")
    live.publish("ticket_created", ticket["id"])
    return ticket


@app.delete("/tickets/{ticket_id}", status_code=204)
def delete_ticket(
    ticket_id: UUID, authorization: AuthorizationHeader = None, guest_id: UserIdHeader = None
):
    """Delete a ticket. Only the person who posted it can, or an admin. Its votes and photos go with it."""
    user_id = caller(authorization, guest_id, required=True)
    try:
        photo_urls = db.delete_ticket(ticket_id, user_id, admin=db.is_admin(user_id))
    except LookupError:
        raise HTTPException(404, "Ticket not found")
    except db.NotYours:
        raise HTTPException(403, "Only the person who posted this ticket can delete it")
    except db.TicketFixed:
        raise HTTPException(409, "This ticket is marked fixed, so it can no longer be changed. Only an admin can change it now.")
    live.publish("ticket_deleted", ticket_id)
    for photo_url in photo_urls:
        photos.delete(photos.name_in(photo_url))


@app.post("/tickets/{ticket_id}/reports", response_model=Ticket)
def report_sent(
    ticket_id: UUID, authorization: AuthorizationHeader = None, guest_id: UserIdHeader = None
):
    """Note that the caller went to send a report about this ticket. Returns the ticket.

    Called when they press one of the send buttons on the drafted message. Each
    person counts once per ticket, and the poster is already the first report,
    so calling this again (or as the poster) changes nothing.
    """
    try:
        ticket, counted = db.record_report(ticket_id, caller(authorization, guest_id, required=True))
    except db.UnknownUser:
        raise HTTPException(401, "Unknown X-User-Id; get a new one from POST /guests")
    if ticket is None:
        raise HTTPException(404, "Ticket not found")
    if counted:
        live.publish("ticket_changed", ticket_id)
    return ticket


class MoveIn(BaseModel):
    """Where to put a ticket instead, and optionally which department it should go to."""

    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    lat: float = Field(ge=-90, le=90, examples=[33.7531])
    lng: float = Field(ge=-180, le=180, examples=[-84.3853])
    # The address or landmark to show. Left out, the nearest address is looked up.
    address: str | None = Field(default=None, max_length=200, examples=["Courtland St SE & Gilmer St SE"])
    # The department the person picked. Left out, it only changes if the move calls for it.
    owner: Owner | None = Field(default=None, examples=[None])

    @field_validator("address", mode="before")
    @classmethod
    def blank_to_none(cls, value):
        return None if isinstance(value, str) and not value.strip() else value


def _new_place(before: dict, lat: float, lng: float, owner: str | None, address: str | None):
    """Check a ticket's new spot and department, and work out what they mean.

    Returns (the department to switch to, or None to keep it; the address to show).
    Raises the 422s for a spot outside the area or a department that can't take it.
    """
    moved = (before["lat"], before["lng"]) != (lat, lng)
    if moved:
        require_covered(lat, lng)
    new_owner = None
    if owner:
        if owner in routing.UNAVAILABLE:
            raise HTTPException(422, "That department isn't set up on this server yet. Choose another one.")
        require_owner_fits(owner, lat, lng)
        new_owner = owner
    elif moved:
        by_old_spot = routing.find_owner(before["lat"], before["lng"])["owner"]
        by_new_spot = routing.find_owner(lat, lng)["owner"]
        # Also when the pin leaves the campus of the ticket's department, which can't keep it then.
        left_campus = routing.off_campus(before["owner"], lat, lng) is not None
        if (before["owner"] == by_old_spot and by_new_spot != by_old_spot) or left_campus:
            new_owner = by_new_spot
    # A spot that didn't move keeps its address unless a new one was typed.
    return new_owner, address or (geocode.address_for(lat, lng) if moved else before["address"])


@app.post("/tickets/{ticket_id}/location", response_model=Ticket)
def move_ticket(
    ticket_id: UUID,
    body: MoveIn,
    authorization: AuthorizationHeader = None,
    guest_id: UserIdHeader = None,
):
    """Fix a ticket's location and/or its department. Only its poster can, or an admin.

    Send the ticket's current lat and lng to leave it where it is. A new spot has
    to be inside the area AVision covers.

    With `owner`, the ticket goes to that department. Without it, the department
    only changes when the move calls for it: the old spot was why the ticket went
    where it did (a campus, a MARTA station) and the new spot belongs to a
    different one. A department the AI or the person chose for another reason is
    left alone.
    """
    user_id = caller(authorization, guest_id, required=True)
    before = db.get_ticket(ticket_id)
    if before is None:
        raise HTTPException(404, "Ticket not found")
    new_owner, address = _new_place(before, body.lat, body.lng, body.owner, body.address)
    try:
        ticket = db.move_ticket(
            ticket_id,
            user_id,
            body.lat,
            body.lng,
            address,
            owner=new_owner,
            admin=db.is_admin(user_id),
        )
    except LookupError:
        raise HTTPException(404, "Ticket not found")
    except db.NotYours:
        raise HTTPException(403, "Only the person who posted this ticket can change it")
    except db.TicketMerged:
        raise HTTPException(409, "This ticket was merged into another; change that one")
    except db.TicketFixed:
        raise HTTPException(409, "This ticket is marked fixed, so it can no longer be changed. Only an admin can change it now.")
    live.publish("ticket_changed", ticket_id)
    return ticket


class EditIn(BaseModel):
    """What to change on a ticket. Send only the fields that are changing."""

    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    title: str | None = Field(default=None, min_length=1, max_length=120, examples=["Blocked curb ramp"])
    issue_type: str | None = Field(default=None, pattern=r"^[a-z][a-z0-9_]{1,40}$", examples=["blocked_curb_ramp"])
    # Send "" to clear it.
    description: str | None = Field(default=None, max_length=2000)
    # Every photo the ticket should have afterwards, the main one first: paths from
    # POST /uploads. Leave out to keep the photos as they are; send [] to remove them all.
    photos: list[PhotoPath] | None = Field(default=None, max_length=MAX_TICKET_PHOTOS)
    # A new spot (both, or neither), the address to show, and the department, as in /location.
    lat: float | None = Field(default=None, ge=-90, le=90)
    lng: float | None = Field(default=None, ge=-180, le=180)
    address: str | None = Field(default=None, max_length=200)
    owner: Owner | None = Field(default=None, examples=[None])

    @model_validator(mode="after")
    def tidy(self):
        if (self.lat is None) != (self.lng is None):
            raise ValueError("Send lat and lng together")
        if self.photos is not None:
            self.photos = list(dict.fromkeys(self.photos))  # the same photo twice is one photo
        return self


@app.post("/tickets/{ticket_id}/edit", response_model=Ticket)
def edit_ticket(
    ticket_id: UUID,
    body: EditIn,
    authorization: AuthorizationHeader = None,
    guest_id: UserIdHeader = None,
):
    """Change anything about a ticket: its title, type, details, photos, spot or department.

    Only its poster can, or an admin. Only the fields that are sent change. The
    spot and department follow the same rules as /location. New words and new
    photos are screened like a new report (see `screen`; the AI looks at every
    photo), so a ticket can't be turned into something that would have been refused.
    """
    user_id = caller(authorization, guest_id, required=True)
    before = db.get_ticket(ticket_id)
    allowed = db.may_change(ticket_id, user_id)
    if before is None or allowed is None:
        raise HTTPException(404, "Ticket not found")
    if not allowed:
        raise HTTPException(403, "Only the person who posted this ticket can change it")
    if before["status"] == "fixed" and not db.is_admin(user_id):
        raise HTTPException(409, "This ticket is marked fixed, so it can no longer be changed. Only an admin can change it now.")
    sent = body.model_fields_set
    changes: dict = {}

    # Where it is, and who it goes to.
    lat, lng = (body.lat, body.lng) if body.lat is not None else (before["lat"], before["lng"])
    if body.lat is not None or body.owner or (body.address and "address" in sent):
        new_owner, address = _new_place(before, lat, lng, body.owner, body.address if "address" in sent else None)
        changes.update(lat=lat, lng=lng, address=address)
        if new_owner:
            changes["owner"] = new_owner

    # The words.
    if "title" in sent and body.title is not None:
        changes["title"] = body.title
    if "issue_type" in sent and body.issue_type is not None:
        changes["issue_type"] = body.issue_type
    if "description" in sent:
        changes["description"] = body.description or None
    title = changes.get("title", before["title"])
    description = changes.get("description", before["description"])
    words_changed = any(
        field in changes and changes[field] != before[field] for field in ("title", "issue_type", "description")
    )

    # The photos. One that wasn't on the ticket has to be a stored upload.
    had = list(before["photo_urls"])
    added = []  # photos that weren't on the ticket before
    if body.photos is not None and body.photos != had:
        for photo in body.photos:
            if photo not in had and photos.find(photos.name_in(photo)) is None:
                raise HTTPException(422, "One of those photos isn't on the server any more. Add it again.")
        changes["photos"] = body.photos
        added = [photo for photo in body.photos if photo not in had]

    # New words or new photos are screened like a new report. Every photo goes to
    # the AI; only the new ones are held against the person if flagged.
    if words_changed or "photos" in changes:
        require_good_standing(user_id)
    if words_changed or added:
        now = changes["photos"] if "photos" in changes else had
        now = [photo for photo in now if photos.find(photos.name_in(photo) or "")]  # the ones on this server
        names = [photos.name_in(photo) if photo in added else None for photo in now]
        paths = [photos.find(photos.name_in(photo) or "") for photo in now]
        main, more = (names[0], names[1:]) if names else (None, [])
        refuse_known_flagged(user_id, main, title, description, more)
        if gemini.is_configured() and _analysis_slot() is None:
            result = agent.draft_for_ticket(
                title=title,
                issue_type=changes.get("issue_type", before["issue_type"]),
                description=description,
                address=changes.get("address", before["address"]),
                lat=lat,
                lng=lng,
                photo=paths[0].read_bytes() if paths and paths[0] else None,
                photo_links=[],
                owner=changes.get("owner", before["owner"]),
                more_photos=[path.read_bytes() for path in paths[1:] if path] if paths and paths[0] else None,
            )
            screen(
                result, user_id, main,
                title if words_changed else None, description if words_changed else None,
                more,
            )

    if not changes:
        return before
    try:
        ticket, dropped = db.edit_ticket(ticket_id, user_id, changes, admin=db.is_admin(user_id))
    except LookupError:
        raise HTTPException(404, "Ticket not found")
    except db.NotYours:
        raise HTTPException(403, "Only the person who posted this ticket can change it")
    except db.TicketMerged:
        raise HTTPException(409, "This ticket was merged into another; change that one")
    except db.TicketFixed:
        raise HTTPException(409, "This ticket is marked fixed, so it can no longer be changed. Only an admin can change it now.")
    # A photo that came off the ticket is deleted, unless something else still shows it.
    if dropped:
        in_use = db.photo_names_in_use()
        for photo in dropped:
            name = photos.name_in(photo)
            if name and name not in in_use:
                photos.delete(name)
    live.publish("ticket_changed", ticket_id)
    return ticket


@app.post("/tickets/{ticket_id}/close", response_model=Ticket)
def close_ticket(ticket_id: UUID, authorization: AuthorizationHeader = None):
    """Mark a ticket as fixed. Admins only. Returns the updated ticket.

    A later "still there" vote can still reopen it, as for any fixed ticket.
    """
    user_id = caller(authorization, None, required=True)
    if not db.is_admin(user_id):
        raise HTTPException(403, "Only admins can mark a ticket as fixed")
    try:
        ticket = db.close_ticket(ticket_id, user_id)
    except db.TicketMerged:
        raise HTTPException(409, "This ticket was merged into another; close that one")
    if ticket is None:
        raise HTTPException(404, "Ticket not found")
    live.publish("ticket_changed", ticket_id)
    return ticket


@app.post("/tickets/{ticket_id}/reset-counts", response_model=Ticket)
def reset_counts(ticket_id: UUID, authorization: AuthorizationHeader = None):
    """Wipe a ticket's counts. Admins only. Returns the updated ticket.

    Every vote is removed and the report count goes back to 1 (the poster's own).
    A likely-fixed ticket goes back to open; a fixed one stays fixed.
    """
    user_id = caller(authorization, None, required=True)
    if not db.is_admin(user_id):
        raise HTTPException(403, "Only admins can reset a ticket's counts")
    try:
        ticket = db.reset_counts(ticket_id, user_id)
    except db.TicketMerged:
        raise HTTPException(409, "This ticket was merged into another")
    if ticket is None:
        raise HTTPException(404, "Ticket not found")
    live.publish("ticket_changed", ticket_id)
    return ticket


@app.post("/tickets/{ticket_id}/votes", response_model=Ticket)
def vote(
    ticket_id: UUID,
    body: VoteIn,
    authorization: AuthorizationHeader = None,
    guest_id: UserIdHeader = None,
):
    """Cast or change the caller's vote. Returns the ticket with new counts and status.

    A ticket marked fixed is closed to votes (`409`), except an admin's.
    """
    user_id = caller(authorization, guest_id, required=True)
    try:
        ticket = db.cast_vote(ticket_id, user_id, body.vote, admin=db.is_admin(user_id))
    except db.UnknownUser:
        raise HTTPException(401, "Unknown X-User-Id; get a new one from POST /guests")
    except db.TicketMerged:
        raise HTTPException(409, "This ticket was merged into another; vote on that one")
    except db.TicketFixed:
        raise HTTPException(409, "This ticket is marked fixed, so voting is closed. Only an admin can reopen it.")
    if ticket is None:
        raise HTTPException(404, "Ticket not found")
    live.publish("ticket_changed", ticket_id)
    return ticket


# ---------- live updates ----------
@app.get("/events")
async def events():
    """A stream of ticket changes, for pages to stay up to date without reloading.

    Server-sent events. Each one is a line of JSON: {"type", "id"}, where type is
    ticket_created, ticket_changed or ticket_deleted and id is the ticket. Nothing
    about who did it. See live.py.
    """
    return StreamingResponse(
        live.hub.stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",  # no-transform: proxies must not buffer or compress it
            "X-Accel-Buffering": "no",
        },
    )


# ---------- notifications ----------
class Notification(BaseModel):
    id: UUID
    # still_there, marked_fixed, likely_fixed, fixed, reopened, reported, moved, rerouted or
    # removed (see sql/005_notifications.sql)
    kind: str
    # True when the reader posted the ticket, false when they only voted on it.
    yours: bool
    # None once the ticket is gone.
    ticket_id: UUID | None
    ticket_title: str
    created_at: datetime
    read: bool


class Notifications(BaseModel):
    unread: int
    items: list[Notification]


class ReadIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    ids: list[UUID] = Field(max_length=100)


@app.get("/notifications", response_model=Notifications)
def notifications(authorization: AuthorizationHeader = None, guest_id: UserIdHeader = None):
    """What happened to the caller's tickets, and to tickets they voted on. Newest first."""
    user_id = caller(authorization, guest_id, strict=False)
    if user_id is None:
        return {"unread": 0, "items": []}
    return db.list_notifications(user_id)


@app.post("/notifications/read", status_code=204)
def read_notifications(
    body: ReadIn, authorization: AuthorizationHeader = None, guest_id: UserIdHeader = None
):
    """Mark notifications as seen. Ones that aren't the caller's are left alone."""
    db.mark_notifications_read(caller(authorization, guest_id, required=True), body.ids)


class ClearIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    # The notifications to delete. Left out, all of the caller's are deleted.
    ids: list[UUID] | None = Field(default=None, max_length=100)


@app.post("/notifications/clear", status_code=204)
def clear_notifications(
    body: ClearIn | None = None,
    authorization: AuthorizationHeader = None,
    guest_id: UserIdHeader = None,
):
    """Delete the caller's notifications: the ones listed, or all of them.

    Ones that aren't the caller's are left alone. The tickets are not affected.
    """
    db.clear_notifications(
        caller(authorization, guest_id, required=True), body.ids if body else None
    )


@app.post("/uploads", response_model=Photo, status_code=201)
def upload_photo(file: UploadFile):
    """Store a ticket photo (form field "file"; JPEG, PNG or WebP).

    Faces and license plates are blurred before the photo is stored, when the
    photo privacy service is in use (see photos.py); the counts say how many.

    Returns where the photo is served. The web app sends `path` as the ticket's
    `photo_url`. A photo no ticket uses is deleted after an hour.
    """
    data = file.file.read(photos.MAX_BYTES + 1)
    if len(data) > photos.MAX_BYTES:
        raise HTTPException(413, f"That photo is too large (limit {photos.MAX_BYTES // 1024 // 1024} MB)")
    if not data:
        raise HTTPException(400, "The photo file is empty")
    try:
        saved = photos.save_photo(data)
    except photos.BadPhoto as problem:
        raise HTTPException(400, str(problem))
    except photos.StorageFull:
        raise HTTPException(507, "Photo storage is full. Post the ticket without a photo for now.")
    except photos.PrivacyUnavailable:
        raise HTTPException(
            503,
            "The photo couldn't be checked for faces and license plates just now, so it wasn't saved. "
            "Try again in a minute, or post without a photo.",
        )
    return {
        "name": saved.name,
        "path": f"/uploads/{saved.name}",
        "faces_hidden": saved.faces_hidden,
        "plates_hidden": saved.plates_hidden,
    }


@app.get("/uploads/{name}")
def get_photo(name: str):
    """Serve a stored photo. Names never change, so browsers may keep their copy."""
    path = photos.find(name)
    if path is None:
        raise HTTPException(404, "Photo not found")
    return FileResponse(
        path,
        media_type="image/jpeg",
        headers={
            "Cache-Control": "public, max-age=31536000, immutable",
            "X-Content-Type-Options": "nosniff",
        },
    )


# ---------- report agent ----------
# Each analysis costs money (Gemini and Foundry calls) and anyone can ask for one,
# so they are capped. The counts live in memory, which is fine for one server.
ANALYZE_PER_MINUTE = int(os.getenv("ANALYZE_PER_MINUTE", "20"))
ANALYZE_PER_DAY = int(os.getenv("ANALYZE_PER_DAY", "500"))
_recent_analyses: deque[float] = deque()
_analyses_lock = threading.Lock()


def _analysis_slot() -> str | None:
    """Count one use of the AI. Returns None if it may go ahead, or why not when a cap is reached."""
    now = time.time()
    with _analyses_lock:
        while _recent_analyses and now - _recent_analyses[0] > 86_400:
            _recent_analyses.popleft()
        last_minute = sum(1 for at in _recent_analyses if now - at < 60)
        if last_minute >= ANALYZE_PER_MINUTE:
            return "Lots of photos are being analyzed right now. Try again in a minute."
        if len(_recent_analyses) >= ANALYZE_PER_DAY:
            return "Photo analysis has reached today's limit. Fill in the form yourself for now."
        _recent_analyses.append(now)
        return None


def _take_analysis_slot():
    """Count one analysis, or refuse it when the per-minute or per-day cap is reached."""
    refused = _analysis_slot()
    if refused:
        raise HTTPException(429, refused)


@app.get("/analyze/status")
def analyze_status():
    """Whether photo analysis is set up, so the web app knows to offer it."""
    return {
        "available": gemini.is_configured(),
        "orchestrator": agent.foundry_mode() or "direct",
        "model": gemini.model_name(),
    }


@app.get("/screening/status")
def screening_status(authorization: AuthorizationHeader = None, guest_id: UserIdHeader = None):
    """Where the caller stands with screening: flagged attempts so far, the limit, and any pause."""
    now = db.standing(caller(authorization, guest_id, strict=False))
    until = now["suspended_until"]
    return {**now, "suspended_until": until.isoformat() if until else None}


@app.post("/analyze")
def analyze(
    body: AnalyzeIn, authorization: AuthorizationHeader = None, guest_id: UserIdHeader = None
):
    """Run the report agent on an uploaded photo (see agent.py).

    Send the `name` that POST /uploads returned, plus the position. Returns the
    findings, the owner with the reason it was picked, the owner's contact
    details, the address and a drafted report. Nothing is saved: the person
    reviews the result, then the web app creates the ticket as usual.
    """
    user_id = caller(authorization, guest_id, strict=False)
    require_good_standing(user_id)
    require_covered(body.lat, body.lng)
    path = photos.find(body.photo)
    if path is None:
        raise HTTPException(404, "Photo not found. Upload it first with POST /uploads.")
    more_names = [photos.name_in(link) for link in body.more_photo_urls]
    refuse_known_flagged(user_id, body.photo, None, None, more_names)
    if not gemini.is_configured():
        raise HTTPException(503, "Photo analysis isn't set up on this server yet.")
    _take_analysis_slot()
    try:
        result = agent.run(
            agent.Job(
                photo=path.read_bytes(),
                lat=body.lat,
                lng=body.lng,
                photo_links=[link for link in (body.photo_url, *body.more_photo_urls) if link],
                more_photos=_more_photo_bytes(body.more_photo_urls),
            )
        )
    except gemini.GeminiFailed as problem:
        raise HTTPException(502, str(problem))
    screen(result, user_id, body.photo, None, None, [name for name in more_names if name])
    return result


@app.post("/draft")
def draft(body: DraftIn, authorization: AuthorizationHeader = None, guest_id: UserIdHeader = None):
    """The department and a message to send it, for a ticket that is about to be posted.

    The web app calls this when someone presses "Post ticket", then shows the
    message for them to edit and send from their own email. Nothing is saved or
    sent here.

    Gemini picks the department from the issue and what the map says about the
    spot (unless `owner` says the person picked one), and writes the message.
    When Gemini isn't set up, is over its cap or fails, fixed map rules pick the
    department and the message is a plain fill-in one, so this always answers.
    """
    user_id = caller(authorization, guest_id, strict=False)
    require_good_standing(user_id)
    require_covered(body.lat, body.lng)
    if body.owner:
        require_owner_fits(body.owner, body.lat, body.lng)
    path = photos.find(body.photo) if body.photo else None
    # The other photos the AI can see are the ones on this server, in order.
    more_names = [name for name in (photos.name_in(link) for link in body.more_photo_urls) if name and photos.find(name)]
    refuse_known_flagged(user_id, body.photo if path else None, body.title, body.description, more_names)
    result = agent.draft_for_ticket(
        title=body.title,
        issue_type=body.issue_type,
        description=body.description,
        address=body.address,
        lat=body.lat,
        lng=body.lng,
        photo=path.read_bytes() if path else None,
        photo_links=[link for link in (body.photo_url, *body.more_photo_urls) if link],
        owner=body.owner,
        use_ai=gemini.is_configured() and _analysis_slot() is None,
        more_photos=_more_photo_bytes(body.more_photo_urls) if path else None,
    )
    # The report is screened before the person is handed a message to send.
    screen(result, user_id, body.photo if path else None, body.title, body.description, more_names if path else [])
    return result


class FollowUpIn(BaseModel):
    # The ticket photo's public link, to put in the message. Optional.
    photo_url: str | None = Field(default=None, max_length=1000, pattern=r"^https?://\S+$", examples=[None])
    # Links to the ticket's other photos, to list in the message too.
    more_photo_urls: list[PhotoLink] = Field(default_factory=list, max_length=MAX_TICKET_PHOTOS - 1)


@app.post("/tickets/{ticket_id}/follow-up")
def follow_up(ticket_id: UUID, body: FollowUpIn | None = None):
    """A follow-up message about a ticket that is still there, for its department.

    The web app offers this after someone votes "Still there", then shows the
    message for them to edit and send from their own email. Nothing is saved or
    sent here. Gemini writes it from the ticket; without Gemini a plain one is used.
    """
    ticket = db.get_ticket(ticket_id)
    if ticket is None:
        raise HTTPException(404, "Ticket not found")
    return agent.follow_up_for_ticket(
        ticket,
        photo_links=(
            [link for link in (body.photo_url, *body.more_photo_urls) if link]
            if body and ticket["photo_url"]
            else None
        ),
        use_ai=gemini.is_configured() and _analysis_slot() is None,
    )

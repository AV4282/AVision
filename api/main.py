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

import logging
import os
import threading
import time
from collections import deque
from contextlib import asynccontextmanager
from datetime import datetime
from pathlib import Path
from typing import Annotated, Literal
from uuid import UUID

from fastapi import FastAPI, Header, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, ConfigDict, Field, field_validator

import db  # first: it loads api/.env, which the modules below read their settings from
import agent
import auth
import gemini
import photos

log = logging.getLogger("uvicorn.error")  # shows up in uvicorn's (and journalctl's) log

ALLOWED_ORIGINS = [
    o.strip() for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:8443").split(",")
]

# Same values as reports.owner and the CHECK on tickets.owner.
Owner = Literal["gsu_facilities", "city_of_atlanta", "marta", "gdot"]
Status = Literal["open", "likely_fixed", "fixed", "merged"]
Vote = Literal["still_there", "fixed"]
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


@asynccontextmanager
async def lifespan(_app):
    db.pool.open(wait=True, timeout=15)  # fail at startup, not on the first request
    photos.prepare()  # same for the photo folder
    stop = threading.Event()
    # Once at startup (so each deploy tidies up), then every few hours.
    cleanup = threading.Thread(
        target=lambda: (clean_up_photos(), photo_cleanup_loop(stop)), daemon=True
    )
    cleanup.start()
    yield
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

    @field_validator("address", "description", "photo_url", mode="before")
    @classmethod
    def blank_to_none(cls, value):
        return None if isinstance(value, str) and not value.strip() else value


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
    photo_url: str | None
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
    role: Literal["user", "facilities_staff"]
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
    return {"ok": db.ping(), "photo_privacy": bool(photos.PRIVACY_URL), "version": VERSION}


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
    """Anyone can create a ticket. The caller, if any, is recorded as its poster."""
    try:
        return db.create_ticket(body.model_dump(), caller(authorization, guest_id))
    except db.UnknownUser:
        raise HTTPException(401, "Unknown X-User-Id; get a new one from POST /guests")


@app.delete("/tickets/{ticket_id}", status_code=204)
def delete_ticket(
    ticket_id: UUID, authorization: AuthorizationHeader = None, guest_id: UserIdHeader = None
):
    """Delete a ticket. Only the person who posted it can. Its votes and photo go with it."""
    user_id = caller(authorization, guest_id, required=True)
    try:
        photo_url = db.delete_ticket(ticket_id, user_id)
    except LookupError:
        raise HTTPException(404, "Ticket not found")
    except db.NotYours:
        raise HTTPException(403, "Only the person who posted this ticket can delete it")
    photos.delete(photos.name_in(photo_url))


@app.post("/tickets/{ticket_id}/votes", response_model=Ticket)
def vote(
    ticket_id: UUID,
    body: VoteIn,
    authorization: AuthorizationHeader = None,
    guest_id: UserIdHeader = None,
):
    """Cast or change the caller's vote. Returns the ticket with new counts and status."""
    try:
        ticket = db.cast_vote(ticket_id, caller(authorization, guest_id, required=True), body.vote)
    except db.UnknownUser:
        raise HTTPException(401, "Unknown X-User-Id; get a new one from POST /guests")
    except db.TicketMerged:
        raise HTTPException(409, "This ticket was merged into another; vote on that one")
    if ticket is None:
        raise HTTPException(404, "Ticket not found")
    return ticket


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
        "model": gemini.GEMINI_MODEL,
    }


@app.post("/analyze")
def analyze(body: AnalyzeIn):
    """Run the report agent on an uploaded photo (see agent.py).

    Send the `name` that POST /uploads returned, plus the position. Returns the
    findings, the owner with the reason it was picked, the owner's contact
    details, the address and a drafted report. Nothing is saved: the person
    reviews the result, then the web app creates the ticket as usual.
    """
    path = photos.find(body.photo)
    if path is None:
        raise HTTPException(404, "Photo not found. Upload it first with POST /uploads.")
    if not gemini.is_configured():
        raise HTTPException(503, "Photo analysis isn't set up on this server yet.")
    _take_analysis_slot()
    try:
        return agent.run(
            agent.Job(photo=path.read_bytes(), lat=body.lat, lng=body.lng, photo_url=body.photo_url)
        )
    except gemini.GeminiFailed as problem:
        raise HTTPException(502, str(problem))


@app.post("/draft")
def draft(body: DraftIn):
    """The department and a message to send it, for a ticket that is about to be posted.

    The web app calls this when someone presses "Post ticket", then shows the
    message for them to edit and send from their own email. Nothing is saved or
    sent here.

    Gemini picks the department from the issue and what the map says about the
    spot (unless `owner` says the person picked one), and writes the message.
    When Gemini isn't set up, is over its cap or fails, fixed map rules pick the
    department and the message is a plain fill-in one, so this always answers.
    """
    path = photos.find(body.photo) if body.photo else None
    return agent.draft_for_ticket(
        title=body.title,
        issue_type=body.issue_type,
        description=body.description,
        address=body.address,
        lat=body.lat,
        lng=body.lng,
        photo=path.read_bytes() if path else None,
        photo_url=body.photo_url if path else None,
        owner=body.owner,
        use_ai=gemini.is_configured() and _analysis_slot() is None,
    )


class FollowUpIn(BaseModel):
    # The ticket photo's public link, to put in the message. Optional.
    photo_url: str | None = Field(default=None, max_length=1000, pattern=r"^https?://\S+$", examples=[None])


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
        photo_url=body.photo_url if body and ticket["photo_url"] else None,
        use_ai=gemini.is_configured() and _analysis_slot() is None,
    )

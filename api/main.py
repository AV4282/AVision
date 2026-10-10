"""
AVision ticket API: create tickets, list them, vote on them, and store their photos.

Run locally:    uvicorn main:app --reload --port 8000     (from the api/ folder)
Try it at:      http://localhost:8000/docs

Callers identify themselves in one of two ways:
  - Signed in: "Authorization: Bearer <Auth0 access token>". POST /me checks the
    token and returns the person's AVision user (created on first sign-in).
  - Guest: an X-User-Id header holding the ID from POST /guests.
Tickets and votes still use X-User-Id; moving them to the signed-in user is next.
"""

import logging
import os
import threading
from contextlib import asynccontextmanager
from datetime import datetime
from typing import Annotated, Literal
from uuid import UUID

from fastapi import FastAPI, Header, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, ConfigDict, Field, field_validator

import db  # loads .env first, so auth below sees AUTH0_* settings
import auth
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
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


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


class Photo(BaseModel):
    name: str  # file name, e.g. "3f2a....jpg"
    path: str  # where this API serves it, e.g. "/uploads/3f2a....jpg"


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


def require_user(user_id: UUID | None) -> UUID:
    if user_id is None:
        raise HTTPException(401, "Send an X-User-Id header (get one from POST /guests)")
    return user_id


@app.get("/health")
def health():
    return {"ok": db.ping()}


@app.post("/me", response_model=Me)
def sign_in(authorization: AuthorizationHeader = None, body: MeIn | None = None):
    """Record a sign-in. Creates the user the first time; returns the same user after."""
    sub = verified_sub(authorization)
    details = body or MeIn()
    return db.upsert_user(sub, details.display_name, details.avatar_url)


@app.post("/guests", response_model=Guest, status_code=201)
def create_guest():
    """Create a guest user. The frontend saves the ID and sends it as X-User-Id."""
    return {"id": db.create_guest()}


@app.get("/tickets", response_model=list[Ticket])
def list_tickets(
    status: Status | None = None,
    owner: Owner | None = None,
    user_id: UserIdHeader = None,
):
    return db.list_tickets(status=status, owner=owner, user_id=user_id)


@app.get("/tickets/{ticket_id}", response_model=Ticket)
def get_ticket(ticket_id: UUID, user_id: UserIdHeader = None):
    ticket = db.get_ticket(ticket_id, user_id)
    if ticket is None:
        raise HTTPException(404, "Ticket not found")
    return ticket


@app.post("/tickets", response_model=Ticket, status_code=201)
def create_ticket(body: TicketIn, user_id: UserIdHeader = None):
    """Anyone can create a ticket; X-User-Id is optional and recorded as the creator."""
    try:
        return db.create_ticket(body.model_dump(), user_id)
    except db.UnknownUser:
        raise HTTPException(401, "Unknown X-User-Id; get a new one from POST /guests")


@app.post("/tickets/{ticket_id}/votes", response_model=Ticket)
def vote(ticket_id: UUID, body: VoteIn, user_id: UserIdHeader = None):
    """Cast or change the caller's vote. Returns the ticket with new counts and status."""
    try:
        ticket = db.cast_vote(ticket_id, require_user(user_id), body.vote)
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

    Returns where the photo is served. The web app sends `path` as the ticket's
    `photo_url`. A photo no ticket uses is deleted after an hour.
    """
    data = file.file.read(photos.MAX_BYTES + 1)
    if len(data) > photos.MAX_BYTES:
        raise HTTPException(413, f"That photo is too large (limit {photos.MAX_BYTES // 1024 // 1024} MB)")
    if not data:
        raise HTTPException(400, "The photo file is empty")
    try:
        name = photos.save_photo(data)
    except photos.BadPhoto as problem:
        raise HTTPException(400, str(problem))
    except photos.StorageFull:
        raise HTTPException(507, "Photo storage is full. Post the ticket without a photo for now.")
    return {"name": name, "path": f"/uploads/{name}"}


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

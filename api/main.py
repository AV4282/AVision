"""
AVision ticket API: create tickets, list them, and vote on them.

Run locally:    uvicorn main:app --reload --port 8000     (from the api/ folder)
Try it at:      http://localhost:8000/docs

Until Auth0 lands, callers identify themselves with an X-User-Id header holding
the ID from POST /guests. Later the backend reads it from the verified token
instead, and nothing else here changes.
"""

import os
from contextlib import asynccontextmanager
from datetime import datetime
from typing import Annotated, Literal
from uuid import UUID

from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field, field_validator

import db

ALLOWED_ORIGINS = [
    o.strip() for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:8443").split(",")
]

# Same values as reports.owner and the CHECK on tickets.owner.
Owner = Literal["gsu_facilities", "city_of_atlanta", "marta", "gdot"]
Status = Literal["open", "likely_fixed", "fixed", "merged"]
Vote = Literal["still_there", "fixed"]
UserIdHeader = Annotated[UUID | None, Header(alias="X-User-Id")]


@asynccontextmanager
async def lifespan(_app):
    db.pool.open(wait=True, timeout=15)  # fail at startup, not on the first request
    yield
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
    # Only real web links, so a bad value can't render as a broken image.
    photo_url: str | None = Field(
        default=None, max_length=1000, pattern=r"^https?://\S+$", examples=[None]
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


# ---------- routes ----------
def require_user(user_id: UUID | None) -> UUID:
    if user_id is None:
        raise HTTPException(401, "Send an X-User-Id header (get one from POST /guests)")
    return user_id


@app.get("/health")
def health():
    return {"ok": db.ping()}


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

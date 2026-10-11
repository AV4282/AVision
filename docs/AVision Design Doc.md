# AVision Design Doc

Oct 9, 2026 · Updated Oct 11, 2026 to match what was built · @Amari

## Overview

AVision turns a photo of a street or campus problem into a mapped ticket and a ready-to-send report, routed to whoever actually owns the fix. It was built for the Social Good track at Hacklanta '26 (Oct 9–11, Georgia State University), covering the City of Atlanta with a GSU and Georgia Tech focus. It is live at https://atlantamamdani.photo.

**Core demo flow:**

1. A user uploads a photo of an issue, such as a blocked curb ramp or a broken elevator. Faces and license plates are blurred on our server before the photo is stored.
2. In one request, Gemini describes the issue and any possible accessibility barriers, with a confidence score, and screens out photos and text that plainly aren't real reports.
3. The location comes from the device, an address search or a pin dropped on a map. Gemini picks the owner from GSU Facilities, Georgia Tech, the City of Atlanta (ATL311) or MARTA, using facts our code works out about the spot, and explains why.
4. The user reviews and posts a public ticket. AVision then opens a drafted email in the user's own inbox, with a phone script, for them to send.
5. Other users vote on whether the issue is still there. A "Still there" vote offers a follow-up message to the department.

AVision never submits reports automatically. It always describes findings as "possible barriers," never as legal violations.

## Architecture

&#91;embedded content: AVision architecture · web app, backend, sponsor services\]

The web app (React) talks to one ticket API (FastAPI). Uploads go through a separate photo privacy service that blurs faces and plates with local models, then are stored on disk. Gemini sees and writes, a Foundry agent steers each report, and Python supplies the facts: map facts about the spot, and contact details from `contacts.json`. The model never invents a contact.

## Tech stack

Each sponsor tool still has one clear job. The main changes from the plan: Vite instead of Next.js, local models instead of Gemini for privacy blurring, free OpenStreetMap services instead of Google Geocoding, and a Porkbun domain.

| Layer | Pick | Why |
| --- | --- | --- |
| Frontend | Vite + React 19 + TypeScript, Tailwind CSS v4 | Fast to build; mobile-first; dark mode |
| Map | Leaflet 1.x via react-leaflet + OpenStreetMap tiles | No API key; custom pins by owner and status; official GIS reference layers |
| Photo location | Browser geolocation, address search, or a dropped pin | Phones often strip GPS from photos, and the API strips it on purpose |
| Backend | Python FastAPI | Foundry's agent SDK is Python-first |
| Agent orchestration | Microsoft Foundry Agent Service (`gpt-5-mini`) | Steers each report through four tools; runs alongside the work, with a time cap |
| Vision + writing | Gemini API (`google-genai`, response schema) | One request per report: screening, photo analysis, choosing the department, drafting; Gemini prize |
| Routing | Gemini choice from Python map facts (`shapely`); fixed map rules as backup | The model only picks from listed departments, with a reason the user sees |
| Contacts | `contacts.json` | The only source of contact details; checked against each department's website |
| Geocoding | Photon for address search, Nominatim for reverse lookups (both OpenStreetMap) | Free, no key; Nominatim's one-request-a-second limit is respected |
| Photo privacy | YuNet face model (OpenCV) + DETR plate model (Hugging Face `transformers`), Pillow blur | Runs on our server, so unblurred photos never reach the AI |
| Database | Tiger Data (TimescaleDB on Tiger Cloud, free service) | Reports are time-series events; Tiger Data prize |
| Auth | Auth0 | Google sign-in (no passwords stored); guests can still report and vote; admin role; Auth0 prize |
| Hosting | Vultr server with Caddy; auto-deploy with GitHub Actions | Vultr prize |
| Domain | Porkbun (`atlantamamdani.photo`) | Real demo URL |

## Database

The database is a free Tiger Cloud service (TimescaleDB on PostgreSQL). Every table below is live. Migrations `004`–`008` also run by themselves each time the API starts, so a fresh server never misses one.

**Service:** free tier, shared compute, 750 MiB storage, us-east-1, database `tsdb`. A service that hits its storage limit becomes read-only, so photos are stored on the server's disk and only their paths are saved. Local development and the live site share this one database.

| Object | Type | Status | Holds |
| --- | --- | --- | --- |
| `reports` | Hypertable, partitioned by `created_at` (7-day chunks) | Live, seed data only | One row per photo submission with the full AI output. Holds the 11 seed reports; the app writes tickets directly |
| `hotspots_weekly` | Continuous aggregate, real-time mode, refreshed every minute | Live | Report counts per week, per \~110 m grid cell, per issue type |
| `users` | Regular table | Live | One row per person: AVision UUID, unique `auth0_sub` (signed-in, `guest\|…` or `seed\|…`), display name, avatar, role (`user`, `facilities_staff` or `admin`), onboarding answers. No password or email |
| `tickets` | Regular table | Live | One row per public issue: title, description, owner, location, main photo plus up to four more, status, poster, report count |
| `ticket_votes` | Regular table | Live | Each user's current "still there" or "fixed" vote on a ticket |
| `ticket_reports` | Regular table | Live | Who went to send a report about a ticket; each person counts once toward `report_count` |
| `notifications` | Regular table | Live | Votes and status changes on your tickets, and on tickets you voted on |
| Screening counts | Columns on `users` | Live | Flagged attempts and any posting pause |

**Files:** migrations `api/sql/000`–`008`, run with `migrate.py` (the two `000` files in the Tiger console). `db.py` holds every query. `reset_db.py` clears test data with a backup first, and `admin.py` grants admin.

**Connection:** `DATABASE_URL` in `.env` (never committed), with `sslmode=require`. Python uses `psycopg` 3 with a pool of up to 5 connections.

**Grid cells:** hotspots round lat/lng to 3 decimals. Duplicate grouping (see Future expansions) would use a PostGIS radius search if the service offers it.

### User accounts

Users sign in with Google through Auth0, so AVision stores no passwords. Each person gets an AVision UUID linked to their Auth0 ID. Signing in is optional: guests get a guest ID that the browser keeps.

1. The user signs in with Google through Auth0, and the frontend receives a token.
2. The frontend sends the token with each API request, and the backend verifies it against the Auth0 tenant.
3. On sign-in, the backend upserts into `users` on `auth0_sub`: the first login creates the row, and every later login returns the same UUID. Anything the person did as a guest in that browser moves to their account.
4. The backend attaches that UUID to tickets and votes. A guest ID is only accepted for guests, so no one can act as a signed-in person.

Signed-in users answer optional onboarding questions, and can change their display name and profile picture. Admins, granted with `python admin.py grant "<name>"`, can delete any ticket and mark tickets fixed.

## Map (Leaflet)

The map uses stable Leaflet 1.x through `react-leaflet` v5 (React 19), with free OpenStreetMap tiles. It lives in `web/src/components/avision-map/` and loads on demand.

**Install:** `npm install leaflet react-leaflet` (plus `@types/leaflet`).

### Setup gotchas

1. **Server rendering:** not an issue, since the app is a Vite single-page app with no server rendering.
2. **CSS:** import `leaflet/dist/leaflet.css` and give the map container an explicit height, or the tiles scatter.
3. **Marker icons:** bundlers break Leaflet's default pin images, so markers are custom `divIcon`s with the owner's color and letter, plus a separate status badge.

### Features to Leaflet components

| AVision feature | Leaflet piece |
| --- | --- |
| Ticket pins by owner and status | `Marker` with a custom `divIcon`; keyboard-selectable |
| Ticket details and voting | Side panel or popup outside the map, opened by selecting a pin |
| Filters by department | Custom Filters menu, with a "Show all" button beside it; starts from the user's onboarding answers |
| Reference layers | `GeoJSON` layers: GDOT state routes, the official city boundary, GSU buildings, neighborhoods and MARTA stations, each toggled from a Layers menu |
| Area views | GSU + MARTA, GSU, Georgia Tech and all of Atlanta |
| Drop-a-pin | A separate picker map in the report form; `useMapEvents({ click })` sets the location |

GIS sources and processing are recorded in `docs/map-geography.md` and `docs/map.md`.

### OpenStreetMap tile rules

The free tiles are fine for a demo under the [OSM Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/):

- Keep the "© OpenStreetMap contributors" credit visible on the map, not hidden under UI.
- Use the HTTPS URL `https://tile.openstreetmap.org/{z}/{x}/{y}.png`.
- No offline or "download this area" features, and no scripts that pan the map to preload tiles.
- Keep the tile URL in config so the provider can be swapped if tiles are throttled.

Source: [Leaflet](https://leafletjs.com/)

## Image privacy

Every uploaded photo has faces and license plates blurred before it is stored or shown, because tickets and the map are public. The plan was for Gemini to find them. Instead, local models on our own server do it: YuNet finds faces, a DETR model finds plates, and Pillow blurs them. So Gemini only ever sees the blurred copy, and no model returns an edited image.

### Upload pipeline

1. **Check:** the ticket API accepts only JPEG, PNG and WebP, up to 12 MB and 50 megapixels.
2. **Fix rotation:** `ImageOps.exif_transpose()` runs first, so sideways phone photos are blurred in the right place.
3. **Shrink:** to at most 1600 px on a side.
4. **Detect and blur:** the photo goes to the photo privacy service (`photo-privacy/`), which finds faces at four scales and plates in one pass. Each box is padded (30% for faces, 15% for plates) and given a strong blur scaled to its size.
5. **Store only the blurred copy:** saved as a fresh JPEG under a random name, which drops GPS, the phone model and the timestamp. The original is never written to disk.

The report prompt also tells Gemini not to describe people; "a man in a red jacket" on a public ticket would be its own privacy leak.

### When detection fails

- **Fail closed:** if the privacy service is set up but can't check a photo, the upload is refused with a plain message and nothing is stored.
- **User review:** the form shows the stored, blurred version and says how many faces and plates were hidden.
- **Measured:** on 40 WIDER FACE photos, it blurred every face 50 px and wider, and 191 of 197 faces between 20 and 50 px. Tiny background faces are the weak spot.

**Demo moment:** upload a photo with a passerby and a parked car, and the preview shows both blurred before anything is posted.

## Planned features

What was built against the plan. The map, the visible routing explanation and the generated report all made it.

| Feature | Priority | What it does | Status |
| --- | --- | --- | --- |
| Photo analysis | Must | Gemini tags issue type, possible barriers, severity and confidence | ✅ Built |
| Privacy blurring | Must | Faces and plates blurred before anything is stored | ✅ Built, with local models instead of Gemini |
| Location capture | Must | Browser location, address search or a dropped pin | ✅ Built (photo GPS isn't read; the API strips it) |
| Owner routing + explanation | Must | Gemini picks the department from map facts and shows why; map rules as backup | ✅ Built |
| Report drafting | Must | Email, phone script and send buttons, with contacts from `contacts.json` | ✅ Built |
| Issue map | Must | Pins by owner and status, with filters and reference layers | ✅ Built |
| Confirm before saving | Must | User reviews the AI result before anything is posted | ✅ Built |
| 911 banner | Must | Emergencies are sent to 911, never into a ticket | ✅ Built |
| Public tickets | Should | Each confirmed issue is posted as a ticket others can see | ✅ Built |
| "Still there?" voting | Should | Votes drive ticket status; "Still there" offers a follow-up message | ✅ Built |
| Sign-in + my reports | Should | Optional Auth0 login, profile, onboarding; anonymous reporting stays available | ✅ Built |
| Custom domain + hosting | Should | Porkbun domain pointed at a Vultr deploy | ✅ Built |

**Added beyond the plan:** Georgia Tech as a department, admins, notifications, live updates without reloading, screening that pauses repeat abusers, moving a ticket, up to five photos per ticket, profile pictures, help and privacy dialogs, and dark mode.

### Future expansions

| Feature | What it would do |
| --- | --- |
| Duplicate grouping | New reports of the same issue within about 30 m join the existing ticket instead of creating a new one |
| MARTA outage check | Marks a station elevator or escalator report "already reported" when MARTA already lists the outage |

## Ticket system

Every posted report becomes a public ticket. Other users then vote on whether the issue is still there, and those votes move the ticket toward "fixed." Each ticket counts how many different people went to send a report about it.

&#91;embedded content: ticket lifecycle · 4 states\]

Votes move a ticket between Open and Likely fixed. Only an admin marks it Fixed, and a later still-there vote can reopen it. The Merged state exists in the schema, but merging isn't built.

### Grouping duplicate reports

Today each report creates its own ticket; automatic grouping is a future expansion. When someone uses a send button on a ticket's drafted message, they're recorded once in `ticket_reports`, and `report_count` counts those people.

### Voting rules

- Signed-in users and guests can vote, one vote each per ticket; a guest's votes move to their account when they sign in. Changing a vote replaces the old one.
- Options are **still there** or **fixed**.
- 2 or more fixed votes that outnumber still-there votes make a ticket **likely fixed**; otherwise it's **open**. The threshold is `FIXED_VOTE_THRESHOLD`.
- **Fixed** is set by an admin.

### Schema changes

The tickets as built (from `001_tickets.sql` plus later migrations):

```sql
CREATE TABLE tickets (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now(),
    issue_type    text NOT NULL,
    owner         text NOT NULL
                  CHECK (owner IN ('gsu_facilities', 'georgia_tech', 'city_of_atlanta', 'marta', 'gdot')),
    lat           double precision NOT NULL,
    lng           double precision NOT NULL,
    address       text,
    title         text NOT NULL,
    description   text,
    photo_url     text,                              -- "/uploads/<name>.jpg"
    more_photos   text[] NOT NULL DEFAULT '{}',      -- up to four more
    status        text NOT NULL DEFAULT 'open'
                  CHECK (status IN ('open', 'likely_fixed', 'fixed', 'merged')),
    merged_into   uuid REFERENCES tickets(id),
    created_by    uuid REFERENCES users(id),
    report_count  int NOT NULL DEFAULT 1,
    last_seen_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE ticket_votes (
    ticket_id  uuid NOT NULL REFERENCES tickets(id),
    user_id    uuid NOT NULL REFERENCES users(id),
    vote       text NOT NULL CHECK (vote IN ('still_there', 'fixed')),
    voted_at   timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (ticket_id, user_id)
);
```

`tickets` and `ticket_votes` are regular tables, not hypertables, because their rows are updated in place.

### API endpoints

The main routes. The full list is in `docs/api.md` and at `/docs` on a running API.

| Method | Route | Does |
| --- | --- | --- |
| POST | `/uploads` | Stores a photo, with faces and plates blurred |
| POST | `/analyze` | Runs the report agent on a photo. Saves nothing |
| POST | `/draft` | Picks the department and writes the message for a ticket about to be posted |
| GET | `/tickets?status=&owner=` | Tickets for the map and the issues list |
| GET | `/tickets/{id}` | One ticket with its vote counts |
| POST | `/tickets` | Creates a ticket |
| DELETE | `/tickets/{id}` | Deletes a ticket (its poster or an admin) |
| POST | `/tickets/{id}/votes` | Casts or changes the caller's vote |
| POST | `/tickets/{id}/follow-up` | Writes a follow-up message after a "Still there" vote |
| POST | `/tickets/{id}/reports` | Records that the caller went to send a report |
| POST | `/tickets/{id}/location` | Moves a ticket or changes its department (its poster or an admin) |
| POST | `/tickets/{id}/close` | Marks a ticket fixed (admins only) |
| GET | `/events` | Live stream of ticket changes |
| GET | `/notifications` | What happened to your tickets and the ones you voted on |
| GET | `/coverage` | Whether AVision takes reports at a spot (inside the City of Atlanta) |

### Onboarding Questions
Asked once after a first sign-in, all optional and editable from the profile. The answers also choose which departments' tickets the map shows first.

- Are you a student?
- If yes, what school do you go to?
- Do you take MARTA?

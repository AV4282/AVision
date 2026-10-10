# AVision Design Doc

Oct 9, 2026 · @Amari

## Overview

AVision turns a photo of a street or campus problem into a mapped ticket and a ready-to-send report, routed to whoever actually owns the fix. It targets the Social Good track at Hacklanta '26 (Oct 9–11, Georgia State University), with an Atlanta and GSU-first scope.

**Core demo flow:**

1. A user uploads a photo of an issue, such as a blocked curb ramp or a broken elevator.
2. Gemini flags the issue and any possible accessibility barriers, with a confidence score.
3. The location is placed on the map and routed to an owner: GSU Facilities, City of Atlanta (ATL311), MARTA, or GDOT.
4. The user confirms, and AVision posts a public ticket and drafts an email and phone script for the owner.
5. Other users vote on whether the issue is still there, and duplicate tickets are grouped into one.

AVision never submits reports automatically. It always describes findings as "possible barriers," never as legal violations.

## Architecture

&#91;embedded content: AVision architecture · web app, backend, sponsor services\]

The Foundry agent orchestrates, Gemini sees and writes, and the routing step is plain Python so the owner and contacts are never invented.

## Tech stack

The stack is chosen so each sponsor tool has one clear job and most picks replace something, not add to it.

| Layer | Pick | Why |
| --- | --- | --- |
| Frontend | Next.js (or Vite + React), Tailwind | Fast to build; mobile-first upload page |
| Map | Leaflet 1.x via react-leaflet + OpenStreetMap tiles | No API key; pins colored by owner, hotspots layer |
| Photo location | `exifr` + browser geolocation + drop-a-pin fallback | Phones often strip GPS from photos |
| Backend | Python FastAPI | Foundry's agent SDK is Python-first |
| Agent orchestration | Microsoft Foundry Agent Service | Calls the tools below in order |
| Vision + writing | Gemini API (`google-genai`, response schema) | Photo analysis, barrier detection, face and plate detection for privacy blurring, report drafting; Gemini prize |
| Routing | Python + `shapely` point-in-polygon | Deterministic: the model never guesses the owner |
| Contacts | `contacts.json` | The model can only return contacts from this file |
| Geocoding | Google Geocoding API (Nominatim as fallback) | Address lookup; more accurate downtown |
| Database | Tiger Data (TimescaleDB on Tiger Cloud, free service) | Reports are time-series events; Tiger Data prize |
| Voice | ElevenLabs text-to-speech | Read-aloud reports for low-vision users; ElevenLabs prize |
| Auth | Auth0 | Google sign-in (no passwords stored), one vote per user, Facilities staff role; Auth0 prize |
| Hosting | Vultr (promo MAJORLEAGUEHACKING); laptop + tunnel as backup | Vultr prize |
| Domain | GoDaddy Registry (promo MLHHL2694) | Real demo URL; GoDaddy prize |

## Database

The database is a free Tiger Cloud service (TimescaleDB on PostgreSQL), set up and seeded with 11 demo reports. The `reports` hypertable and `hotspots_weekly` view are live, the `users` table is ready to add with `avision_users.sql`, and the ticket tables are designed below and not created yet.

**Service:** free tier, shared compute, 750 MiB storage, us-east-1, database `tsdb`. A service that hits its storage limit becomes read-only, so photos are stored outside the database and only `photo_url` is saved.

| Object | Type | Status | Holds |
| --- | --- | --- | --- |
| `reports` | Hypertable, partitioned by `created_at` (7-day chunks) | Live | One row per photo submission: issue type, barriers, severity, confidence, lat/lng, owner, routing reason, generated report (JSON), status, and `user_id` (UUID linking to `users`; empty for anonymous reports) |
| `hotspots_weekly` | Continuous aggregate, real-time mode, refreshed every minute | Live | Report counts per week, per \~110 m grid cell, per issue type |
| `users` | Regular table | Ready to run (`avision_users.sql`) | One row per person: AVision UUID, unique Auth0 ID (`auth0_sub`), display name, avatar URL, role (`user` or `facilities_staff`), timestamps. No password or email |
| `tickets` | Regular table | Planned | One row per public issue; groups duplicate reports |
| `ticket_votes` | Regular table | Planned | Each user's current "still there" or "fixed" vote on a ticket, keyed by user UUID |

**Files:** `avision_schema.sql` (v2, safe to re-run), `avision_seed.sql` (rows marked "(seed)"), `avision_diagnose.sql`, `avision_users.sql` (users table migration), and `db.py` with `insert_report`, `repeat_count`, `hotspots`, and `list_reports`.

**Connection:** `DATABASE_URL` in `.env` (never committed), with `sslmode=require`. Python uses `psycopg` 3 with a pool of up to 5 connections.

**Grid cells:** hotspots round lat/lng to 3 decimals, so two photos a few meters apart can fall in neighboring cells. A PostGIS radius search fixes this if the service offers PostGIS.

### User accounts

Users sign in with Google through Auth0, so AVision stores no passwords; each person gets an AVision UUID linked to their Auth0 ID (for Google, a string like `google-oauth2|1048…`, not a UUID).

1. The user signs in with Google through Auth0, and the frontend receives a token.
2. The frontend sends the token with each API request; the backend verifies it against the Auth0 domain.
3. On sign-in, the backend upserts into `users` on `auth0_sub`: the first login creates the row, every later login returns the same UUID.
4. The backend attaches that UUID to reports and votes. The frontend never sends a user ID itself, so no one can vote as someone else.

To demo the staff view, set a teammate's `role` to `facilities_staff`. `db.py`'s `insert_report` must receive the UUID from step 3, not the raw Auth0 ID.

## Map (Leaflet)

The map uses stable Leaflet 1.x through `react-leaflet`, with free OpenStreetMap tiles: no API key, mobile pinch-zoom, about 42 KB gzipped. Leaflet 2.0 is still an alpha (2.0.0-alpha.1, August 2025) and `react-leaflet` targets 1.x, so it is out of scope for this weekend.

**Install:** `npm install leaflet react-leaflet` (plus `@types/leaflet` for TypeScript). `react-leaflet` v5 expects React 19; on React 18, use `react-leaflet@4`.

### Setup gotchas

1. **Server rendering:** Leaflet reads `window`, so load the map with `dynamic(() => import('./MapView'), { ssr: false })` in Next.js.
2. **CSS:** import `leaflet/dist/leaflet.css` and give the map container an explicit height, or tiles scatter and the map shows as a blank strip.
3. **Marker icons:** bundlers break Leaflet's default pin images; use `CircleMarker` instead, which also gives owner colors.

### Features to Leaflet components

| AVision feature | Leaflet piece |
| --- | --- |
| Ticket pins colored by owner | `CircleMarker`, one color per owner (GSU, City, MARTA, GDOT); fixed tickets faded |
| Ticket details and voting | `Popup` with photo, status, and Still there / Fixed buttons |
| Hotspots layer | `Circle` sized by `report_count` from `GET /hotspots` |
| Drop-a-pin fallback | `useMapEvents({ click })` sets the report location |
| GSU boundary | `GeoJSON` layer of the campus polygon; doubles as a visual routing explanation |
| Layer toggles | `LayersControl` for hotspots and the campus outline |
| Overlapping pins | Optional `react-leaflet-cluster` plugin, only if needed |

### OpenStreetMap tile rules

The free tiles are fine for a demo under the [OSM Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/):

- Keep the "© OpenStreetMap contributors" credit visible on the map, not hidden under UI.
- Use the HTTPS URL `https://tile.openstreetmap.org/{z}/{x}/{y}.png`.
- No offline or "download this area" features, and no scripts that pan the map to preload tiles.
- Keep the tile URL in config so the provider can be swapped if tiles are throttled during judging.

Source: [Leaflet](https://leafletjs.com/)

## Image privacy

Every uploaded photo has faces and license plates blurred before it is stored or shown, because tickets and the map are public. Gemini finds them and returns bounding boxes; Python (Pillow) does the blurring. Gemini never returns an edited image, since a regenerated photo could quietly change the evidence itself.

### Upload pipeline

1. **Fix rotation:** run `ImageOps.exif_transpose()` first. Phones store rotation in metadata, and without this the boxes land in the wrong place on sideways photos.
2. **Read GPS, then strip metadata:** keep the coordinates for the map, then save the image with no metadata (it also holds the phone model and exact timestamp).
3. **Detect:** the same Gemini call as photo analysis returns a `privacy_boxes` list in its response schema, so each photo needs only one call. Boxes use Gemini's `box_2d` format, `[ymin, xmin, ymax, xmax]` normalized to 0–1000; convert with `x / 1000 × width` and `y / 1000 × height`.
4. **Blur:** pad each box by 15–20%, then pixelate it or apply a strong blur scaled to the box size. A light blur on a small face can stay readable.
5. **Store only the blurred copy:** the original stays in memory for the request and is never written to disk or the database.

The prompt also tells Gemini not to describe people in its text output; "a man in a red jacket" on a public ticket is its own privacy leak.

### When detection fails

- **Fail closed:** if the Gemini call errors or times out, the photo is not published, and the ticket shows "photo pending privacy check."
- **User review:** the confirm screen shows the blurred preview, and the user can tap or drag to blur anything that was missed.
- **Stretch:** a local face detector such as MediaPipe as a second pass; blur everything either tool finds.

**Priority:** must-have, about 1–2 hours on Saturday alongside photo analysis. **Demo moment:** upload a photo with a passerby and a parked car, and the preview shows both blurred before anything is posted.

Source: [Gemini API: image understanding](https://ai.google.dev/gemini-api/docs/image-understanding)

## Planned features

The map, the visible routing explanation, and the generated report are never cut; everything else is cut in reverse priority if the team falls behind.

| Feature | Priority | What it does | Prize tie-in |
| --- | --- | --- | --- |
| Photo analysis | Must | Gemini tags issue type, possible accessibility barriers, severity, and confidence, and finds faces and license plates; Pillow blurs them before anything is stored | Gemini |
| Location capture | Must | Reads photo GPS; falls back to browser location or a dropped pin | — |
| Owner routing + explanation | Must | Point-in-polygon picks GSU, City, MARTA, or GDOT and shows why | Foundry |
| Report drafting | Must | Email, phone script, and ATL311 copy-paste text from `contacts.json` | Gemini |
| Issue map | Must | Pins colored by owner, from `reports` / tickets | — |
| Confirm before saving | Must | User reviews the AI result before anything is posted | — |
| 911 banner | Must | Emergencies are sent to 911, never into a ticket | — |
| Public tickets | Should | Each confirmed issue is posted as a ticket others can see | Tiger Data |
| "Still there?" voting | Should | Users vote still there or fixed; votes drive ticket status | Tiger Data, Auth0 |
| Duplicate grouping | Should | New reports of the same issue nearby join the existing ticket | Tiger Data |
| Hotspots layer | Should | "Reported 6 times in 3 weeks" from the continuous aggregate | Tiger Data |
| Read-aloud reports | Should | ElevenLabs reads findings and routing before the user confirms | ElevenLabs |
| Sign-in + my reports | Should | Optional Auth0 login; anonymous reporting stays available | Auth0 |
| Facilities staff view | Stretch | Auth0 role sees GSU tickets as a work queue | Auth0 |
| Voice input | Stretch | Describe the issue by speaking | ElevenLabs |
| MARTA outage check | Stretch | Marks a station elevator report "already reported" if MARTA lists it | — |
| Custom domain + hosting | Should | GoDaddy domain pointed at a Vultr deploy | GoDaddy, Vultr |

**Cut order if behind:** MARTA outage check, voice input, Facilities staff view, manual ticket merging, Vultr deploy (demo from a laptop).

## Ticket system

Every confirmed report becomes part of a public ticket: a new ticket if the issue is new, or an existing one if someone already reported it. Other users then vote on whether the issue is still there, and those votes move the ticket toward "fixed." A report is one person's photo; a ticket is the issue itself.

&#91;embedded content: ticket lifecycle · 4 states\]

A ticket reaches Fixed only after votes and a quiet week agree; a single still-there vote or new report sends it back to Open.

### Grouping duplicate reports

- **Automatic:** when a report is confirmed, the backend looks for an open ticket with the same `issue_type` within about 30 m. If one exists, the report joins it and the ticket's `report_count` goes up. Otherwise a new ticket is created.
- **Ask the reporter:** a near miss (same spot but a different issue type, or the same type 30–75 m away) shows "Is this the same issue?" with the existing ticket's photo. A yes joins that ticket.
- **Community merge:** a signed-in user can flag a ticket as a duplicate of another. The merge happens once two more users agree, or immediately if a Facilities staff user does it. The merged ticket's reports and votes move to the surviving ticket, and its status becomes `merged`.
- **Distance in SQL:** without PostGIS, use a flat approximation that is accurate at these short distances: `111320 * sqrt((lat2 - lat1)^2 + (cos(radians(lat1)) * (lng2 - lng1))^2)` meters.

### Voting rules

- Voting requires Auth0 sign-in, so each user has one vote per ticket. Changing a vote replaces the old one.
- Options are **still there** or **fixed**. Filing a new report on a ticket counts as a "still there" signal.
- Status follows the lifecycle above: 3+ fixed votes that outnumber still-there votes move a ticket to likely fixed, 7 days with no still-there signal makes it fixed, and a new report within 30 days reopens it. These thresholds live in config so they can be lowered for the demo (for example, 2 votes instead of 3).
- Stretch: only allow votes from users within about 500 m of the ticket, using browser location, to discourage drive-by votes.

### Schema changes

```sql
CREATE TABLE tickets (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now(),
    issue_type    text NOT NULL,
    owner         text NOT NULL,
    lat           double precision NOT NULL,
    lng           double precision NOT NULL,
    address       text,
    status        text NOT NULL DEFAULT 'open'
                  CHECK (status IN ('open', 'likely_fixed', 'fixed', 'merged')),
    merged_into   uuid REFERENCES tickets(id),
    report_count  int NOT NULL DEFAULT 1,
    last_seen_at  timestamptz NOT NULL DEFAULT now()  -- last report or still-there vote
);
CREATE INDEX tickets_open_idx ON tickets (issue_type, status);

ALTER TABLE reports ADD COLUMN ticket_id uuid REFERENCES tickets(id);

CREATE TABLE ticket_votes (
    ticket_id  uuid NOT NULL REFERENCES tickets(id),
    user_id    uuid NOT NULL REFERENCES users(id),
    vote       text NOT NULL CHECK (vote IN ('still_there', 'fixed')),
    voted_at   timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (ticket_id, user_id)
);
```

`tickets` and `ticket_votes` are regular tables, not hypertables, because their rows are updated in place. Stretch for the Tiger Data pitch: a `vote_events` hypertable that keeps every vote change, for a "confidence over time" sparkline on each ticket.

### API endpoints

| Method | Route | Does |
| --- | --- | --- |
| POST | `/reports` | Saves a confirmed report and joins or creates its ticket |
| GET | `/tickets?status=&owner=` | Tickets for the map and the feed |
| GET | `/tickets/{id}` | One ticket with its reports, photos, and vote counts |
| POST | `/tickets/{id}/votes` | Casts or changes the signed-in user's vote |
| POST | `/tickets/{id}/merge` | Flags or confirms a duplicate of another ticket |

## Open questions

- [ ] Does the Google prize accept an AI Studio key, or does it need Vertex AI on a Google Cloud project? (Ask the sponsor rep.)
- [ ] Does the Foundry setup count for any Microsoft prize, or is it there only for orchestration?
- [ ] Is PostGIS available on the Tiger service? (`avision_diagnose.sql` checks.)
- [ ] Vote thresholds for the demo: 2 or 3 "fixed" votes to reach `likely_fixed`?
- [ ] Can anonymous users vote, or only signed-in users? (Current design: signed-in only.)
- [ ] Where are photos stored: local disk, Vultr object storage, or Azure Blob?
- [ ] Who owns each role: frontend, backend, agent, data and pitch?

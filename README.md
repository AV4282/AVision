# AVision

AVision turns a photo of a street or campus accessibility problem into a public ticket, routed to whoever owns the fix: **GSU Facilities**, the **City of Atlanta** (ATL311), **MARTA** or **GDOT**. Other people vote on whether the issue is still there, and their votes move the ticket toward "fixed."

Built for the Social Good track at Hacklanta '26 (Oct 9–11, Georgia State University), with an Atlanta and GSU-first scope. AVision never submits reports on its own, and it describes findings as "possible barriers," never as legal violations.

The full plan is in [docs/AVision Design Doc.md](docs/AVision%20Design%20Doc.md).

## Current state

**Working now: the base ticket flow.** People can report an issue, browse tickets on the map and in a list, and vote on them, all stored in Tiger Data.

| Area | Status |
|---|---|
| Create a ticket (form with issue type, owner, location, details, photo) | ✅ Working |
| Photo upload | ✅ Working. The photo is shrunk, stripped of location data and stored by the ticket API. Faces and plates are not blurred yet (see photo privacy service below) |
| View tickets (issues list with status tabs, search, sort, live counts) | ✅ Working |
| Ticket details and "Still there / Fixed" voting | ✅ Working from the map, the issues list and the profile; votes set the status (2 fixed votes → likely fixed) |
| 911 banner on the report form | ✅ Working |
| Database (reports, hotspots, users, tickets, votes) on Tiger Cloud | ✅ Live, with demo data |
| Photo privacy service (blurs faces and plates) | ✅ Works on its own; not yet connected to the app |
| Map | 🟡 Placeholder artwork; pins are placed by ticket ID, not real coordinates. A real Leaflet map is ready in `leafletreact-map/` |
| Sign-in | 🟡 Google sign-in through Auth0 works: your name shows on the sidebar and profile, and signing in is optional. Tickets and votes are still saved under the browser's guest ID, not the account |
| Profile page | 🟡 Placeholder content |
| Report agent: photo analysis, owner routing, report drafting | ✅ Built. "Fill in the form from this photo" appears once `GEMINI_API_KEY` is set on the server; see [Report agent](#report-agent) |

Also not wired up yet: the map's search box and Filters button.

**Live site:** https://atlantamamdani.photo. Once the first-time setup in [deploy/README.md](deploy/README.md) is done, it updates by itself after a push to `main`.

## What's in this repo

```
api/               Ticket API (Python, FastAPI) and database migrations   ← main backend
web/               Main web app (React, Vite, Tailwind)                    ← main frontend
photo-privacy/     Photo privacy API: blurs faces and plates, reads text
leafletreact-map/  React Leaflet map component, ready to drop into web/
web-next/          Earlier Next.js app with landing page, onboarding and Auth0 sign-in
deploy/            What the live server runs, and how pushes to main update it
docs/              Design doc and photo privacy API docs
```

`web/` and `web-next/` are separate apps. `web/` is the one connected to the ticket API and the one that is live. Sign-in has been moved into it; `web-next/` is kept for its onboarding questions (student, school, MARTA), which have not been moved yet.

## Run it locally

You need **Python 3.13+**, **Node 22+**, and the Tiger Cloud connection string (ask a teammate; it's never committed).

### 1. Ticket API (port 8000)

```powershell
cd api
python -m venv .venv
.venv\Scripts\Activate.ps1          # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
```

Create `api/.env` (or `api/sql/.env`; both are read) with the connection string. See `api/sql/.env.example`:

```
DATABASE_URL="postgres://tsdbadmin:<password>@<host>:<port>/tsdb?sslmode=require"
```

Then start it:

```powershell
uvicorn main:app --reload --port 8000
```

Check http://localhost:8000/health (should say `{"ok": true}`) and try the endpoints at http://localhost:8000/docs.

If PowerShell blocks `Activate.ps1`, skip it and run `.venv\Scripts\python -m uvicorn main:app --reload --port 8000`.

### 2. Web app (port 8443)

In a second terminal:

```powershell
cd web
npm install
npm run dev
```

Open http://localhost:8443. Requests to `/api/...` are forwarded to the ticket API on port 8000, so start the API first. (`npm run dev` from the repo root does the same thing.)

**Sign-in** uses the Auth0 Domain and Client ID in `web/src/auth0-config.ts`. Both are public values, so they are committed and there is nothing to set up per machine. In the Auth0 dashboard, the application must be a **Single Page Application**, with `http://localhost:8443` and `https://atlantamamdani.photo` in Allowed Callback URLs, Allowed Logout URLs and Allowed Web Origins.

### 3. Optional: photo privacy API

It also defaults to port 8000, so give it another port when running both:

```powershell
cd photo-privacy
pip install -r requirements.txt     # use its own virtual environment; it installs PyTorch
uvicorn photo-cleanse:app --port 8001 --env-file .env
```

See [docs/Image-Privacy-API.md](docs/Image-Privacy-API.md) for its settings.

### 4. Optional: the Next.js app with sign-in

```powershell
npm run dev:next                    # from the repo root, or: cd web-next; npm install; npm run dev
```

Opens on http://localhost:3000. See [web-next/README.md](web-next/README.md) for the Auth0 setup.

## Database

A free Tiger Cloud service (TimescaleDB on PostgreSQL), database `tsdb`. The connection string lives only in `.env` files, which are gitignored.

| Table | What it holds |
|---|---|
| `reports` | One row per photo submission (time-series hypertable). Linked to a ticket by `ticket_id` |
| `hotspots_weekly` | Weekly report counts per ~110 m grid cell (continuous aggregate) |
| `users` | One row per person. Guests use `auth0_sub = 'guest|…'` until Auth0 is added |
| `tickets` | One row per public issue; duplicate reports are grouped onto one ticket |
| `ticket_votes` | Each user's current vote ("still there" or "fixed") per ticket |

**Migrations** are in `api/sql/`, run in order. The service is already set up, so you only need these for a fresh database:

| File | How to run | Notes |
|---|---|---|
| `000_schema.sql` | Tiger console SQL editor | Creates `reports` and `hotspots_weekly`; can't run inside a transaction |
| `000_seed.sql` | Tiger console SQL editor | 11 demo reports. Check you get 11 rows; running it twice duplicates them |
| `001_tickets.sql` | `python migrate.py sql/001_tickets.sql` | Users, tickets and votes. Safe to re-run |
| `002_seed_tickets.sql` | `python migrate.py sql/002_seed_tickets.sql` | 6 demo tickets built from the seed reports. Safe to re-run |

All demo rows are marked "(seed)", and `002_seed_tickets.sql` has the SQL to remove them at the top.

## Ticket API

| Method | Route | Does |
|---|---|---|
| GET | `/health` | Checks the database connection |
| POST | `/guests` | Creates a guest user and returns its ID |
| GET | `/tickets?status=&owner=` | Lists tickets, newest first, with vote counts |
| GET | `/tickets/{id}` | One ticket |
| POST | `/tickets` | Creates a ticket |
| POST | `/tickets/{id}/votes` | Casts or changes the caller's vote: `{"vote": "still_there" \| "fixed"}` |
| POST | `/uploads` | Stores a ticket photo (form field `file`; JPEG, PNG or WebP, up to 12 MB) and returns its path |
| GET | `/uploads/{name}` | Serves a stored photo |
| GET | `/analyze/status` | Says whether photo analysis is set up |
| POST | `/analyze` | Runs the report agent on an uploaded photo: `{"photo": "<name>.jpg", "lat": ..., "lng": ...}`. Saves nothing |

Callers identify themselves with an `X-User-Id` header holding their guest ID; the web app handles this automatically. When Auth0 is added, the user will come from the sign-in token instead.

**Photos:** a ticket stores a link to its photo (`photo_url`). The web app uploads the picture to `/uploads` first, then creates the ticket with the link it gets back. The API re-saves every photo as a JPEG of at most 1600 px, which removes the GPS position and other hidden details, and refuses files that are not images. Photos are saved in `api/uploads/` locally (ignored by git) and in `/var/lib/avision/uploads` on the server. Because everyone shares one database, a photo uploaded while running locally only shows on that machine; upload on the live site for photos everyone can see.

<a id="report-agent"></a>
**Report agent** (`api/agent.py`): in the report form, "Fill in the form from this photo" sends the photo and position to `/analyze`. Four tools run in order:

1. **Analyze the photo** (Gemini): issue type, title, details, possible barriers, priority, confidence.
2. **Find the owner** (plain Python, `api/routing.py`): within 100 m of a MARTA rail station → MARTA; inside the GSU campus outline → GSU Facilities; on an interstate, US or state route → GDOT; otherwise the City of Atlanta. The reason is shown to the person.
3. **Look up the address** (OpenStreetMap).
4. **Draft the report** (Gemini): a message and a phone script.

A Microsoft Foundry agent decides which tool to call next; if Foundry isn't set up or fails, the server runs the same steps itself. The person reviews the filled-in form before posting, and after posting gets the drafted message to send themselves. AVision never sends anything.

Owner contact details come only from `api/data/contacts.json` (copied from each owner's website, with the source and date). The AI is told not to write contact details, and anything that looks like one in its text is removed. **Check `contacts.json` before the demo**, and note the GSU outline from OpenStreetMap is generous: it includes Woodruff Park and the city streets between campus buildings.

Settings go in `api/.env`; the full list is in `api/sql/.env.example`. To test every part with the real services: `python check_agent.py` (from `api/`).

**Vote rules:** 2 or more fixed votes that outnumber still-there votes make a ticket **Likely fixed** (set `FIXED_VOTE_THRESHOLD` to change the 2). A still-there vote reopens it. The design doc's "7 quiet days → Fixed" rule isn't built yet.

**Owners** are stored as `gsu_facilities`, `city_of_atlanta`, `marta` and `gdot`. **Statuses** are `open`, `likely_fixed`, `fixed` and `merged`.

## Planned features

From the design doc. The map, the visible routing explanation and the generated report are never cut.

| Feature | Priority | What it does |
|---|---|---|
| Photo analysis | Must | Built, except the privacy part: Gemini tags the issue type, possible barriers, severity and confidence. Still to do: find faces and plates and blur them before anything is stored |
| Location capture | Must | Reads GPS from the photo, then falls back to browser location or a dropped pin |
| Owner routing + explanation | Must | Built: map rules pick GSU, City, MARTA or GDOT and show why |
| Report drafting | Must | Built: message and phone script, using only contacts from `contacts.json` |
| Issue map | Must | Real Leaflet map with pins colored by owner (component ready in `leafletreact-map/`) |
| Confirm before saving | Must | Built: the agent only fills in the form; the user reviews it and posts |
| Duplicate grouping | Should | New reports of the same issue within ~30 m join the existing ticket |
| Hotspots layer | Should | "Reported 6 times in 3 weeks," from `hotspots_weekly` |
| Read-aloud reports | Should | ElevenLabs reads findings aloud for low-vision users |
| Sign-in + my reports | Should | Google sign-in is in. Still to do: link the account to its row in `users`, so tickets and votes follow the person; anonymous reporting stays available |
| Custom domain + hosting | Should | atlantamamdani.photo (Porkbun) points at a Vultr server. Setup and auto-deploy are in [deploy/README.md](deploy/README.md) |
| Facilities staff view | Stretch | GSU staff see GSU tickets as a work queue |
| Voice input | Stretch | Describe the issue by speaking |
| MARTA outage check | Stretch | Marks a station elevator report "already reported" if MARTA lists it |

**Cut order if we fall behind:** MARTA outage check, voice input, Facilities staff view, manual ticket merging, Vultr deploy (demo from a laptop).

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React 19 + Vite + Tailwind CSS v4 (`web/`) |
| Backend | Python FastAPI (`api/`), psycopg 3 with a connection pool |
| Database | Tiger Data (TimescaleDB on Tiger Cloud) |
| Map | Leaflet + react-leaflet + OpenStreetMap tiles |
| Photo privacy | Local face and plate detection + Pillow blurring; Gemini reads text |
| Sign-in | Auth0 (`@auth0/auth0-react`), Google accounts |
| Hosting | Vultr server with Caddy, domain from Porkbun, auto-deploy with GitHub Actions |
| Report agent | Microsoft Foundry Agent Service (orchestration), Gemini (photo analysis and drafting), `shapely` (owner routing) |
| Planned | ElevenLabs (voice) |

## Notes for contributors

- **Never commit `.env` files.** The root `.gitignore` covers them; commit `.env.example` templates instead.
- **Tailwind class names:** Tailwind v4 is loaded, so a custom class that matches a Tailwind utility gets restyled. For example, a class named `fixed` becomes `position: fixed`. Prefix custom classes (`vote-fixed`, `status-fixed`).
- **Connection resets on Windows:** on some Windows machines, scripts that open a new connection per request occasionally fail with "connection reset." Browsers aren't affected; in scripts, reuse one connection (keep-alive).

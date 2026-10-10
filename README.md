# AVision

AVision turns a photo of a street or campus accessibility problem into a public ticket, routed to whoever owns the fix: **GSU Facilities**, the **City of Atlanta** (ATL311), **MARTA** or **GDOT**. Other people vote on whether the issue is still there, and their votes move the ticket toward "fixed."

Built for the Social Good track at Hacklanta '26 (Oct 9–11, Georgia State University), with an Atlanta and GSU-first scope. AVision never submits reports on its own, and it describes findings as "possible barriers," never as legal violations.

The full plan is in [docs/AVision Design Doc.md](docs/AVision%20Design%20Doc.md).

## Current state

**Working now:** people can report an issue with a photo, see it on a real map, vote on whether it's still there, and sign in with Google so their tickets and votes follow them. Everything is stored in Tiger Data and live at https://atlantamamdani.photo. **The main gap: photos are published without faces and plates blurred** (the photo privacy service isn't connected yet).

| Area | Status |
|---|---|
| Create a ticket (form with issue type, owner, location, details, photo) | ✅ Working. Location comes from the device ("Use my location") or a picked address suggestion; without either, the ticket goes on the GSU campus default |
| Photo upload | ✅ Working. The photo is shrunk, stripped of location data and stored by the ticket API. 🔴 Faces and plates are **not** blurred yet |
| View tickets (issues list with status tabs, search, sort, live counts) | ✅ Working |
| Map | ✅ React Leaflet map in `web/`, plotting tickets at their real coordinates with selection, search, GDOT roads, the official city boundary, GSU building references and OpenStreetMap attribution. [Geographic provenance](docs/map-geography.md) |
| Ticket details and "Still there / Fixed" voting | ✅ Working from the map, the issues list and the profile; votes set the status (2 fixed votes → likely fixed) |
| Delete your own ticket | ✅ "Delete my ticket" in the ticket details, with a confirmation. Only the poster can; its votes and photo go with it |
| Sign-in | ✅ Optional Google sign-in through Auth0. The API checks the sign-in token, and tickets and votes are saved under the account. Anything you did as a guest in that browser moves to your account when you sign in |
| Onboarding questions | ✅ Asked once after a first sign-in (student? which school? take MARTA?), all optional and skippable; saved to the account and editable from **Edit profile** |
| Profile page | ✅ Your tickets and votes, impact counts with a milestone bar, your role badge (Community member or Facilities staff), your answers and when you joined |
| 911 banner on the report form | ✅ Working |
| Report agent: photo analysis, owner routing, report drafting | ✅ Built. "Fill in the form from this photo" appears once `GEMINI_API_KEY` is set on the server; see [Report agent](#report-agent) |
| Database (reports, hotspots, users, tickets, votes) on Tiger Cloud | ✅ Live |
| Photo privacy service (blurs faces and plates) | 🟡 Works on its own in `photo-privacy/`; not connected to the app yet |

In the issues list, click a row or its title to open the ticket, or use its arrow button to view the location on the map.

**Live site:** https://atlantamamdani.photo. Once the first-time setup in [deploy/README.md](deploy/README.md) is done, it updates by itself after a push to `main`.

## What's in this repo

```
api/               Ticket API (Python, FastAPI) and database migrations   ← main backend
web/               Main web app (React, Vite, Tailwind)                    ← main frontend
photo-privacy/     Photo privacy API: blurs faces and plates, reads text
leafletreact-map/  Map integration documentation (implementation lives in web/src/components/avision-map/)
web-next/          Earlier Next.js app (landing page, onboarding, Auth0); kept for reference only
deploy/            What the live server runs, and how pushes to main update it
docs/              Design doc, map geography sources, photo privacy API docs
Avision_Pedestrian_Perspective/  Example street-level photos (with source credits) for demos
```

`web/` and `web-next/` are separate apps. `web/` is the one connected to the ticket API and the one that is live. Its sign-in and onboarding questions have both been moved into `web/`, so `web-next/` isn't used any more.

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

**Photos go to the live server, even in local dev.** Local and live share one database, so `/api/uploads` is forwarded to https://atlantamamdani.photo, and every ticket's photo lives in one place. Photos you attach while testing are therefore stored on the live server. To keep them on your own API instead, start Vite with `PHOTO_PROXY_TARGET=local`, but those photos will show as broken for everyone else. Tickets store only the photo's path (`/uploads/<name>.jpg`), and the API deletes photos that no ticket uses once they're an hour old.

**Sign-in** uses the Auth0 Domain, Client ID and API identifier (audience) in `web/src/auth0-config.ts`. All three are public values, so they are committed and there is nothing to set up per machine. The Auth0 tenant needs:

- An **Application** of type **Single Page Application**, with `http://localhost:8443` and `https://atlantamamdani.photo` in Allowed Callback URLs, Allowed Logout URLs and Allowed Web Origins.
- An **API** with identifier `https://api.avision` (RS256). On its **Application Access** tab, user access must be allowed for the application above, or sign-in fails with "Client … is not authorized to access resource server".

On `localhost`, Auth0 shows a one-time "Authorize App" screen; the live site doesn't. The ticket API reads `AUTH0_DOMAIN` and `AUTH0_AUDIENCE` (defaults match the values above).

### 3. Optional: photo privacy API

It also defaults to port 8000, so give it another port when running both:

```powershell
cd photo-privacy
pip install -r requirements.txt     # use its own virtual environment; it installs PyTorch
uvicorn photo-cleanse:app --port 8001 --env-file .env
```

See [docs/Image-Privacy-API.md](docs/Image-Privacy-API.md) for its settings.

### 4. Optional: the old Next.js app

```powershell
npm run dev:next                    # from the repo root, or: cd web-next; npm install; npm run dev
```

Opens on http://localhost:3000. Reference only; everything it did is now in `web/`.

### After pulling

Teammates add Python packages often. If the API fails to start with `ModuleNotFoundError`, run `pip install -r requirements.txt` in `api/` (with the venv active) and restart it. For `web/`, run `npm install`.

## Database

A free Tiger Cloud service (TimescaleDB on PostgreSQL), database `tsdb`. The connection string lives only in `.env` files, which are gitignored.

⚠️ **Local dev and the live site use the same database.** Anything you create, vote on or delete while testing locally shows up on https://atlantamamdani.photo too.

| Table | What it holds |
|---|---|
| `reports` | One row per photo submission (time-series hypertable). Linked to a ticket by `ticket_id` |
| `hotspots_weekly` | Weekly report counts per ~110 m grid cell (continuous aggregate) |
| `users` | One row per person: signed-in people by their Auth0 ID (`google-oauth2|…`), guests as `guest|…`, demo voters as `seed|…`. Also holds `role` (`user` or `facilities_staff`) and the onboarding answers (`is_student`, `school`, `takes_marta`, `onboarded_at`). No emails or passwords |
| `tickets` | One row per public issue, with its poster in `created_by`; duplicate reports are grouped onto one ticket |
| `ticket_votes` | Each user's current vote ("still there" or "fixed") per ticket |

To make someone Facilities staff: `UPDATE users SET role = 'facilities_staff' WHERE display_name = '<their name>';` in the Tiger console.

**Migrations** are in `api/sql/`, run in order. The service is already set up, so you only need these for a fresh database:

| File | How to run | Notes |
|---|---|---|
| `000_schema.sql` | Tiger console SQL editor | Creates `reports` and `hotspots_weekly`; can't run inside a transaction |
| `000_seed.sql` | Tiger console SQL editor | 11 demo reports. Check you get 11 rows; running it twice duplicates them |
| `001_tickets.sql` | `python migrate.py sql/001_tickets.sql` | Users, tickets and votes. Safe to re-run |
| `002_seed_tickets.sql` | `python migrate.py sql/002_seed_tickets.sql` | 6 demo tickets built from the seed reports. Safe to re-run |
| `003_onboarding.sql` | `python migrate.py sql/003_onboarding.sql` | Onboarding answer columns on `users`. Safe to re-run |

All demo rows are marked "(seed)", and `002_seed_tickets.sql` has the SQL to remove them at the top.

**Resetting for testing** (`api/reset_db.py`, dev only). It deletes all tickets, votes and guests and unlinks reports, keeping signed-in accounts and the seed reports. Because the database is shared, **this also clears the live site**, so it shows what it will delete, asks you to type `reset`, and saves every deleted row to `api/backups/` (gitignored) first.

```powershell
cd api
.venv\Scripts\python reset_db.py --dry-run     # see what would be deleted; changes nothing
.venv\Scripts\python reset_db.py               # reset (asks to confirm)
.venv\Scripts\python reset_db.py --seed        # reset, then add the 6 demo tickets
```

Also `--accounts` (delete signed-in accounts too), `--reports` (delete reports too) and `--yes` (no prompt).

## Ticket API

| Method | Route | Does |
|---|---|---|
| GET | `/health` | Checks the database connection |
| POST | `/guests` | Creates a guest user and returns its ID |
| POST | `/me` | Records a sign-in (needs `Authorization: Bearer <Auth0 access token>`) and returns the person's user, including onboarding answers |
| POST | `/me/onboarding` | Saves the signed-in person's answers: `{"is_student": true, "school": "...", "takes_marta": false}`; each may be `null` |
| GET | `/tickets?status=&owner=` | Lists tickets, newest first, with vote counts |
| GET | `/tickets/{id}` | One ticket |
| POST | `/tickets` | Creates a ticket |
| DELETE | `/tickets/{id}` | Deletes a ticket, with its votes and photo. Only the person who posted it can |
| POST | `/tickets/{id}/votes` | Casts or changes the caller's vote: `{"vote": "still_there" \| "fixed"}` |
| POST | `/uploads` | Stores a ticket photo (form field `file`; JPEG, PNG or WebP, up to 12 MB) and returns its path |
| GET | `/uploads/{name}` | Serves a stored photo |
| GET | `/analyze/status` | Says whether photo analysis is set up |
| POST | `/analyze` | Runs the report agent on an uploaded photo: `{"photo": "<name>.jpg", "lat": ..., "lng": ...}`. Saves nothing |

**Who is asking:** signed-in callers send `Authorization: Bearer <Auth0 access token>`, and their tickets and votes are saved under their account. Everyone else sends `X-User-Id` with a guest ID from `POST /guests`; only guest IDs are accepted that way. When someone signs in, the web app sends its guest ID to `POST /me` once, and that guest's tickets and votes move to the account. The web app handles all of this automatically.

**Photos:** the web app shrinks the picture, uploads it to `/uploads`, then creates the ticket with the path it gets back (`/uploads/<name>.jpg`); `photo_url` stores only that path, and the app builds the full link when it shows the photo. The API re-saves every photo as a JPEG of at most 1600 px, which removes the GPS position and other hidden details, and refuses files that are not images. Photos live in `/var/lib/avision/uploads` on the server (and `api/uploads/`, gitignored, for an API run locally). In local dev, Vite sends `/api/uploads` to the live server, so every ticket's photo is in one place (see [Web app](#2-web-app-port-8443)). A photo is deleted with its ticket, and the API also removes any photo no ticket uses once it's an hour old (at startup and every 6 hours). **Faces and plates are not blurred yet.**

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
| Photo analysis | Must | Built, except the privacy part: Gemini tags the issue type, possible barriers, severity and confidence. **Still to do:** find faces and plates and blur them before anything is stored (`photo-privacy/` does this on its own; it needs connecting) |
| Location capture | Must | Partly built: browser location and address suggestions. Still to do: read GPS from the photo before the API strips it, and drop a pin on the map |
| Owner routing + explanation | Must | Built (`api/routing.py`): MARTA station, GSU campus, state route or City, with the reason shown |
| Report drafting | Must | Built: message and phone script, using only contacts from `api/data/contacts.json` |
| Issue map | Must | Built: Leaflet map in `web/` with pins colored by owner |
| Confirm before saving | Must | Built: the agent only fills in the form; the person reviews it and posts |
| Duplicate grouping | Should | New reports of the same issue within ~30 m join the existing ticket |
| Hotspots layer | Should | "Reported 6 times in 3 weeks," from `hotspots_weekly` |
| Read-aloud reports | Should | ElevenLabs reads findings aloud for low-vision users |
| Sign-in + my reports | Should | Built: Google sign-in, tickets and votes saved to the account, guest activity claimed on sign-in, profile with your tickets and votes, onboarding questions. Anonymous reporting stays available |
| Delete your own ticket | Should | Built: the poster can delete a ticket, with its votes and photo |
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
- **The database is shared with the live site.** Test data you create is public; clean up with `api/reset_db.py` (it also clears the live site). A separate dev database would remove this risk.
- **Use the AVision user ID, never the Auth0 ID, to link data.** The API turns a verified sign-in into a `users.id`; store that in `created_by`, `user_id` and similar columns.
- **Check merges in `api/main.py`.** A merge once dropped `import auth`, which broke sign-in. If the API won't start after a merge, look at its imports first.
- **Tailwind class names:** Tailwind v4 is loaded, so a custom class that matches a Tailwind utility gets restyled. For example, a class named `fixed` becomes `position: fixed`. Prefix custom classes (`vote-fixed`, `status-fixed`).
- **Connection resets on Windows:** on some Windows machines, scripts that open a new connection per request occasionally fail with "connection reset." Browsers aren't affected; in scripts, reuse one connection (keep-alive).

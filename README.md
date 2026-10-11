# AVision

AVision turns a photo of a street or campus accessibility problem into a public ticket, routed to whoever owns the fix: **GSU Facilities**, the **City of Atlanta** (ATL311) or **MARTA**. Other people vote on whether the issue is still there, and their votes move the ticket toward "fixed."

Built for the Social Good track at Hacklanta '26 (Oct 9–11, Georgia State University), with an Atlanta and GSU-first scope. AVision never sends reports on its own, and it describes findings as "possible barriers," never as legal violations.

**Live site:** https://atlantamamdani.photo · Design doc: [docs/AVision Design Doc.md](docs/AVision%20Design%20Doc.md)

## Features

- **Report an issue:** photo, issue type, location (device location or an address suggestion; GSU campus by default) and details. A 911 banner sends emergencies elsewhere.
- **Photo privacy:** every upload is shrunk, stripped of GPS and other metadata, and has faces and license plates blurred before it is stored.
- **Report agent:** "Fill in the form from this photo" uses Gemini to describe the issue, pick the department and explain why, look up the address, and draft a message and phone script.
- **Message to the department:** every posted ticket opens an editable email draft, with a button that opens it in your own email. AVision never sends it.
- **Map:** tickets at their real coordinates, with GDOT roads, the city boundary, GSU buildings and MARTA stations ([sources](docs/map-geography.md)).
- **Issues list:** status tabs, search, sort and live counts.
- **Voting:** "Still there" or "Fixed" on any ticket. 2+ fixed votes that outnumber still-there votes make it **Likely fixed**; a still-there vote reopens it.
- **Accounts (optional):** Google sign-in through Auth0, onboarding questions, editable display name, and a profile with your tickets, votes and impact. Guest activity moves to your account when you sign in. You can delete your own tickets.

## Repo layout

```
api/            Ticket API (Python, FastAPI), report agent, database migrations
web/            Web app (React, Vite, Tailwind); the live site
photo-privacy/  Photo privacy service: blurs faces and plates
deploy/         Live server setup and auto-deploy (see deploy/README.md)
docs/           Design doc, map sources, photo privacy API
leafletreact-map/                Map integration notes (code is in web/src/components/avision-map/)
Avision_Pedestrian_Perspective/  Example photos for demos, with credits
```

## Run it locally

You need **Python 3.13+**, **Node 22+** and the Tiger Cloud connection string (ask a teammate; it's never committed).

**1. Ticket API (port 8000)**

```powershell
cd api
python -m venv .venv
.venv\Scripts\Activate.ps1          # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Put `DATABASE_URL="postgres://..."` in a `.env` file at the repo root first (`api/.env` also works); every other setting (Gemini, Foundry, Auth0, photo privacy) is listed in `.env.example`. Check http://localhost:8000/health, and try the endpoints at http://localhost:8000/docs. If PowerShell blocks `Activate.ps1`, run `.venv\Scripts\python -m uvicorn main:app --reload --port 8000`.

**2. Web app (port 8443)**

```powershell
cd web
npm install
npm run dev
```

Open http://localhost:8443; `/api/...` is forwarded to port 8000. Photo uploads go to the **live** server even in local dev, so every ticket's photo is in one place (`PHOTO_PROXY_TARGET=local` keeps them on your own API). Auth0 settings are public values committed in `web/src/auth0-config.ts`.

**3. Photo privacy service (optional, port 8001)**

```powershell
cd photo-privacy
pip install -r requirements.txt     # its own venv; installs PyTorch
uvicorn photo-cleanse:app --port 8001 --env-file .env
```

Then add `PHOTO_PRIVACY_URL="http://127.0.0.1:8001"` to the root `.env`. Without it, photos are stored unblurred.

After pulling, rerun `pip install -r requirements.txt` (API) or `npm install` (web) if something fails to start.

## Ticket API

Signed-in callers send `Authorization: Bearer <Auth0 token>`; guests send `X-User-Id` with an ID from `POST /guests`. The web app handles both.

| Method | Route | Does |
|---|---|---|
| GET | `/health` | Checks the database connection |
| POST | `/guests` | Creates a guest user |
| POST | `/me` | Records a sign-in and returns the user; moves guest activity to the account |
| POST | `/me/onboarding` | Saves onboarding answers (`is_student`, `school`, `takes_marta`) |
| POST | `/me/name` | Changes the display name |
| GET | `/tickets?status=&owner=` | Lists tickets with vote counts |
| GET | `/tickets/{id}` | One ticket |
| POST | `/tickets` | Creates a ticket |
| DELETE | `/tickets/{id}` | Deletes your own ticket, with its votes and photo |
| POST | `/tickets/{id}/votes` | Casts or changes your vote (`still_there` or `fixed`) |
| POST | `/uploads` | Stores a photo (JPEG, PNG or WebP, up to 12 MB), blurred and stripped of metadata |
| GET | `/uploads/{name}` | Serves a stored photo |
| GET | `/analyze/status` | Whether photo analysis is set up |
| POST | `/analyze` | Runs the report agent on an uploaded photo. Saves nothing |
| POST | `/draft` | Picks the department and writes the message for a ticket about to be posted. Saves and sends nothing |

**Report agent** (`api/agent.py`): a Microsoft Foundry agent calls four tools in order (analyze the photo, choose the department, look up the address, draft the report); if Foundry is unavailable, the server runs the same steps itself. Gemini picks the department from what the photo shows and map facts about the spot. If Gemini is unavailable, map rules in `api/routing.py` decide instead: near a MARTA station → MARTA, inside the GSU campus → GSU Facilities, otherwise the City. Contact details come only from `api/data/contacts.json`. Run `python check_agent.py` from `api/` to test it against the real services.

**Values:** owners are `gsu_facilities`, `city_of_atlanta`, `marta` and `gdot` (GDOT can only be picked by hand). Statuses are `open`, `likely_fixed`, `fixed` and `merged`.

## Database

Tiger Data (TimescaleDB on Tiger Cloud), database `tsdb`. ⚠️ **Local dev and the live site share it**, so test data is public.

| Table | Holds |
|---|---|
| `reports` | Photo submissions (time-series hypertable), linked to a ticket |
| `hotspots_weekly` | Weekly report counts per ~110 m grid cell (continuous aggregate) |
| `users` | Signed-in users (Auth0 ID), guests and demo voters; role and onboarding answers. No emails or passwords |
| `tickets` | Public issues, with the poster in `created_by` |
| `ticket_votes` | Each user's current vote per ticket |

Migrations are in `api/sql/` (`000_*` in the Tiger console, the rest with `python migrate.py sql/<file>`). Demo rows are marked "(seed)". To make someone Facilities staff: `UPDATE users SET role = 'facilities_staff' WHERE display_name = '<name>';`

`api/reset_db.py` deletes test tickets, votes and guests (**this clears the live site too**). It previews first, asks you to type `reset`, and backs up every row to `api/backups/`. Flags: `--dry-run`, `--seed`, `--accounts`, `--reports`, `--yes`.

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Backend | Python FastAPI, psycopg 3 |
| Database | Tiger Data (TimescaleDB) |
| Map | Leaflet, react-leaflet, OpenStreetMap tiles |
| AI | Microsoft Foundry Agent Service, Gemini, `shapely` for map facts |
| Photo privacy | Local face and plate detection, Pillow blurring |
| Sign-in | Auth0 with Google |
| Hosting | Vultr with Caddy, Porkbun domain, GitHub Actions auto-deploy |

## Notes for contributors

- **Never commit `.env` files**; commit `.env.example` templates instead.
- **Link data by the AVision user ID** (`users.id`), never the Auth0 ID.
- **Check `api/main.py` imports after a merge.** A merge once dropped `import auth` and broke sign-in.
- **Prefix custom CSS classes.** Tailwind v4 restyles classes that match its utilities (`fixed` becomes `position: fixed`).
- **Windows connection resets:** in scripts, reuse one database connection instead of opening one per request.

# AVision

AVision turns a photo of a street or campus accessibility problem into a public ticket, routed to whoever owns the fix: **GSU Facilities**, the **City of Atlanta** (ATL311) or **MARTA**. Other people vote on whether the issue is still there, and their votes move the ticket toward "fixed."

Built for the Social Good track at Hacklanta '26 (Oct 9–11, Georgia State University), with an Atlanta and GSU-first scope. AVision never sends reports on its own, and it describes findings as "possible barriers," never as legal violations.

The full plan is in [docs/AVision Design Doc.md](docs/AVision%20Design%20Doc.md).

## Current state

**Working now:** people can report an issue with a photo, see it on a real map, vote on whether it's still there, and sign in with Google so their tickets and votes follow them. Everything is stored in Tiger Data and live at https://atlantamamdani.photo. Faces and license plates are blurred before a photo is stored, when the server runs the photo privacy service (it needs a server with about 2 GB of memory; the end of each deploy log says whether it is on).

| Area | Status |
|---|---|
| Create a ticket (form with issue type, owner, location, details, photo) | ✅ Working. Location comes from the device ("Use my location") or a picked address suggestion; without either, the ticket goes on the GSU campus default |
| Photo upload | ✅ Working. The photo is shrunk, stripped of location data, sent through the photo privacy service to blur faces and license plates, then stored by the ticket API. The form shows the stored version and says what was hidden |
| View tickets (issues list with status tabs, search, sort, live counts) | ✅ Working |
| Map | ✅ React Leaflet map in `web/`, plotting tickets at their real coordinates with selection, search, GDOT roads, the official city boundary, GSU building references and OpenStreetMap attribution. [Geographic provenance](docs/map-geography.md) |
| Ticket details and "Still there / Fixed" voting | ✅ Working from the map, the issues list and the profile; votes set the status (2 fixed votes → likely fixed) |
| Delete your own ticket | ✅ "Delete my ticket" in the ticket details, with a confirmation. Only the poster can; its votes and photo go with it |
| Sign-in | ✅ Optional Google sign-in through Auth0. The API checks the sign-in token, and tickets and votes are saved under the account. Anything you did as a guest in that browser moves to your account when you sign in |
| Onboarding questions | ✅ Asked once after a first sign-in (student? which school? take MARTA?), all optional and skippable; saved to the account and editable from **Edit profile**, where you can also change your display name (it stays changed on later sign-ins) |
| Profile page | ✅ Your tickets and votes, impact counts with a milestone bar, your role badge (Community member or Facilities staff), your answers and when you joined |
| 911 banner on the report form | ✅ Working |
| Report agent: photo analysis, choosing the department, report drafting | ✅ Built. "Fill in the form from this photo" appears once `GEMINI_API_KEY` is set on the server; see [Report agent](#report-agent) |
| Message to the department | ✅ Every posted ticket opens a drafted email, editable, with a button that opens it in the person's own email addressed to the department (GSU Facilities, ATL311 or MARTA Customer Service). AVision never sends it |
| Database (reports, hotspots, users, tickets, votes) on Tiger Cloud | ✅ Live |
| Photo privacy service (blurs faces and plates) | ✅ Connected: the ticket API sends every upload through it when `PHOTO_PRIVACY_URL` is set, and refuses the photo if it can't be checked. `deploy.sh` sets it up on the server when there is enough memory |

In the issues list, click a row or its title to open the ticket, or use its arrow button to view the location on the map.

**Live site:** https://atlantamamdani.photo. Once the first-time setup in [deploy/README.md](deploy/README.md) is done, it updates by itself after a push to `main`.

## What's in this repo

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
| GET | `/analyze/status` | Says whether photo analysis is set up |
| POST | `/analyze` | Runs the report agent on an uploaded photo: `{"photo": "<name>.jpg", "lat": ..., "lng": ...}`. Saves nothing |
| POST | `/draft` | For a ticket about to be posted (`title`, `issue_type`, `lat`, `lng`, optional `address`, `description`, `photo`, `owner`): picks the department and writes the message to send it. Saves and sends nothing |

**Who is asking:** signed-in callers send `Authorization: Bearer <Auth0 access token>`, and their tickets and votes are saved under their account. Everyone else sends `X-User-Id` with a guest ID from `POST /guests`; only guest IDs are accepted that way. When someone signs in, the web app sends its guest ID to `POST /me` once, and that guest's tickets and votes move to the account. The web app handles all of this automatically.

**Photos:** the web app shrinks the picture, uploads it to `/uploads`, then creates the ticket with the path it gets back (`/uploads/<name>.jpg`); `photo_url` stores only that path, and the app builds the full link when it shows the photo. The API re-saves every photo as a JPEG of at most 1600 px, which removes the GPS position and other hidden details, and refuses files that are not images. Photos live in `/var/lib/avision/uploads` on the server (and `api/uploads/`, gitignored, for an API run locally). In local dev, Vite sends `/api/uploads` to the live server, so every ticket's photo is in one place (see [Web app](#2-web-app-port-8443)). A photo is deleted with its ticket, and the API also removes any photo no ticket uses once it's an hour old (at startup and every 6 hours).

**Faces and license plates:** when `PHOTO_PRIVACY_URL` is set, the API sends each cleaned photo to the photo privacy service (`photo-privacy/`) and stores only what comes back, so the saved file, the one the public and Gemini see, has them blurred. If the service can't be reached, the upload is refused with a plain message; a photo is never stored unchecked. The web app uploads a photo as soon as it is chosen, shows the stored version, and says how many faces and plates were hidden. On the live server `deploy.sh` installs and starts the service by itself when the server has at least about 2 GB of memory, and otherwise leaves photos unblurred and says so at the end of the deploy.

<a id="report-agent"></a>
**Report agent** (`api/agent.py`): in the report form, "Fill in the form from this photo" sends the photo and position to `/analyze`. The work is one address lookup, some map math and **one Gemini request** that looks at the photo, picks the department and writes the message, which keeps a report to about 10 seconds and one request of the Gemini allowance. A Microsoft Foundry agent steers the report through four tools that hand it the results:

1. **Analyze the photo** (Gemini): issue type, title, details, possible barriers, priority, confidence.
2. **Choose the department** (Gemini, in the same request): Gemini is given what the map says about the spot (the nearest MARTA station and how far, whether it is inside the GSU campus outline, whether it is inside the city) and picks one of the departments in `api/data/contacts.json` that has an email address: GSU Facilities, the City of Atlanta (ATL311) or MARTA. It cannot answer with anything else. The reason is shown to the person. If Gemini can't be asked, fixed map rules pick instead (`api/routing.py`): within 100 m of a MARTA rail station → MARTA; inside the GSU campus outline → GSU Facilities; otherwise the City of Atlanta.
3. **Look up the address** (OpenStreetMap).
4. **Draft the report** (Gemini): a message and a phone script.

The Foundry agent decides which tool to call next and stops after the first if the photo shows nothing to report. The work starts at the same moment as the agent, so the agent adds little time; if it isn't set up, fails, or is still going 12 seconds after the report is ready (`FOUNDRY_GRACE_SECONDS`), the report is returned without it and the agent is left out for a minute. Gemini gets up to 45 seconds to answer (`GEMINI_TIMEOUT_SECONDS`). The result's `orchestrator` field says which happened. The person reviews the filled-in form before posting.

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

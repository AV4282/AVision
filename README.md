# AVision

AVision turns a photo of a street or campus accessibility problem into a public ticket, routed to whoever owns the fix: **GSU Facilities**, **Georgia Tech**, the **City of Atlanta** (ATL311) or **MARTA**. Other people vote on whether the issue is still there, and their votes move the ticket toward "fixed."

Built for the Social Good track at Hacklanta '26 (Oct 9–11, Georgia State University), with an Atlanta and GSU-first scope. AVision never sends reports on its own, and it describes findings as "possible barriers," never as legal violations.

**Live site:** https://atlantamamdani.photo

**Docs:** [Ticket API](docs/api.md) · [Report agent](docs/report-agent.md) · [Image privacy](docs/image-privacy.md) · [Map](docs/map.md) · [Database](docs/database.md) · [Deploy](deploy/README.md) · [Design doc](docs/AVision%20Design%20Doc.md)

## Features

- **Report an issue** with a photo, issue type and details. Set the location from your device, an address or a pin dropped on a map. A 911 banner sends emergencies elsewhere.
- **Fill in the form from a photo:** the AI (Claude, with Gemini as the backup) describes the issue, picks the department and explains why, and drafts a message and phone script.
- **Screening:** a photo or wording that plainly isn't a real report (a cartoon, a joke, abuse) is turned away before anything is posted. Five flagged attempts pause that person's posting for a day.
- **Campus departments stay on campus:** GSU Facilities and Georgia Tech can only be chosen for a pin inside their own campus outline, which the pin map shows.
- **Send it yourself:** every posted ticket opens an editable email to the department. AVision never sends it.
- **Photo privacy:** faces and license plates are blurred, and GPS and other hidden details removed, before a photo is stored.
- **Map** of every ticket, with MARTA stations, GDOT roads, the city boundary and GSU buildings, in Soft, Street or Dark style. It opens on the departments that match your profile (your school, MARTA if you ride it).
- **Issues list** with status tabs, search and sort.
- **Community voting:** "Fixed" votes move a ticket toward **Likely fixed** and "Still there" votes keep it open. A "Still there" vote also offers a follow-up message to the department.
- **Notifications and live updates:** you're told when your ticket, or one you voted on, is changed, moved, fixed or removed, and the map and lists update as it happens.
- **Edit a ticket:** its poster can move the pin or change the department after posting.
- **Optional Google sign-in:** your tickets and votes follow you, with a profile showing your impact. Guest activity carries over when you sign in, and you can delete your own tickets.
- **Admins** can delete any ticket and mark tickets as fixed. Grant it with `python admin.py grant "<name>"` from `api/` ([Database](docs/database.md#users)).

## Repo layout

```
api/            Ticket API (Python, FastAPI), report agent, database migrations
web/            Web app (React, Vite, Tailwind)
photo-privacy/  Photo privacy service: blurs faces and plates
deploy/         Live server setup and auto-deploy
docs/           Reference docs and the design doc
Avision_Pedestrian_Perspective/  Example photos for demos, with credits
```

## Run it locally

You need **Python 3.13+**, **Node 22+** and a `.env` file at the repo root with at least `DATABASE_URL` (ask a teammate; it's never committed). Every setting is listed in [.env.example](.env.example).

```powershell
# Terminal 1: ticket API on http://localhost:8000 (endpoints at /docs)
cd api
python -m venv .venv
.venv\Scripts\Activate.ps1          # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Terminal 2: web app on http://localhost:8443
cd web
npm install
npm run dev
```

⚠️ **Local dev and the live site share one database**, so anything you create while testing is public. To clear test data, see [Database](docs/database.md#resetting-test-data).

Optional: run the photo privacy service to blur photos locally ([Image privacy](docs/image-privacy.md#the-privacy-service)), and run `python check_agent.py` from `api/` to test the AI setup ([Report agent](docs/report-agent.md#testing)).

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, Leaflet with OpenStreetMap tiles |
| Backend | Python FastAPI, psycopg 3 |
| Database | Tiger Data (TimescaleDB) |
| AI | Claude (Anthropic), with Gemini as the backup |
| Photo privacy | Local face and plate detection, Pillow blurring |
| Sign-in | Auth0 with Google |
| Hosting | Vultr with Caddy, Porkbun domain, GitHub Actions auto-deploy |

## Notes for contributors

- **Never commit `.env` files**; commit `.env.example` instead.
- **Check `api/main.py` imports after a merge.** A merge once dropped `import auth` and broke sign-in.
- **Prefix custom CSS classes.** Tailwind v4 restyles classes that match its utilities (`fixed` becomes `position: fixed`).
- **Windows connection resets:** in scripts, reuse one database connection instead of opening one per request.

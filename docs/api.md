# Ticket API

The FastAPI backend in `api/`. Locally it runs on http://localhost:8000; interactive docs with "Try it out" are at `/docs`. The web app reaches it through `/api/...` (Vite forwards this in dev, Caddy on the live server).

Related: [report agent](report-agent.md) · [image privacy](image-privacy.md) · [database](database.md)

## Who is calling

Every request is either signed in, a guest or anonymous.

| Caller | Sends | Notes |
|---|---|---|
| Signed in | `Authorization: Bearer <Auth0 access token>` | The token must be signed by our Auth0 tenant, meant for audience `https://api.avision`, and not expired. The API maps it to an AVision user ID |
| Guest | `X-User-Id: <id from POST /guests>` | Only guest IDs are accepted this way, so nobody can act as a signed-in account by sending its ID |
| Anonymous | Nothing | Can read tickets and create them, but can't vote or delete |

When reading (`GET /tickets`), a bad token or an unknown guest ID is treated as anonymous rather than refused. Writes return `401` instead.

## Endpoints

### Accounts

| Method | Route | Body | Returns |
|---|---|---|---|
| POST | `/guests` | none | `201 {"id": "<uuid>"}` |
| POST | `/me` | optional `{display_name, avatar_url}` | The user (see below). Creates them on first sign-in. Send `X-User-Id` too, to move that guest's tickets and votes to the account |
| POST | `/me/onboarding` | `{is_student, school, takes_marta}`, each may be `null` | The user. `school` is kept only when `is_student` is true |
| POST | `/me/name` | `{display_name}` (1–80 characters) | The user. Later sign-ins keep this name instead of the Google one |

A user looks like `{id, display_name, avatar_url, role, created_at, is_student, school, takes_marta, onboarded_at}`. `role` is `user`, `facilities_staff` or `admin`. If `onboarded_at` is `null`, the app asks the onboarding questions.

### Tickets

| Method | Route | Who | Does |
|---|---|---|---|
| GET | `/tickets?status=&owner=` | Anyone | Up to 100 tickets, newest first. Merged tickets are left out |
| GET | `/tickets/{id}` | Anyone | One ticket, or `404` |
| POST | `/tickets` | Anyone | Creates a ticket (`201`). The caller, if any, is recorded as its poster |
| DELETE | `/tickets/{id}` | Poster or admin | Deletes it with its votes and photo (`204`). Anyone else gets `403`. A ticket marked `fixed` can only be deleted, edited or moved by an admin (`409` for its poster) |
| POST | `/tickets/{id}/edit` | Poster or admin | Changes anything about a ticket. Send only what is changing: `title`, `issue_type`, `description` (`""` clears it), `photos` (every photo it should have afterwards, main one first, as `/uploads/...` paths; up to 5), `lat` + `lng`, `address`, `owner`. New words and a new main photo are screened like a new report (`422` with `code: "flagged"`). A campus department needs a spot on its campus. Photos taken off are deleted. Returns the updated ticket |
| POST | `/tickets/{id}/location` | Poster or admin | The older, narrower version of `/edit`: `{lat, lng, address?, owner?}` only |
| POST | `/tickets/{id}/reports` | Guest or signed in | Counts the caller as having sent a report about the ticket (once each). Returns the updated ticket |
| GET | `/coverage?lat=&lng=` | Anyone | Whether reports are taken at a spot, and `blocked`: the departments that can't take it (a campus department, off its campus) |
| GET | `/campuses` | Anyone | The GSU and Georgia Tech campus outlines the pin map draws |
| GET | `/screening/status` | Guest or signed in | The caller's flagged attempts, the limit, and when a pause on posting ends |
| POST | `/tickets/{id}/reset-counts` | Admin only | Wipes the ticket's votes and sets its report count back to 1. A likely-fixed ticket goes back to open. Returns the updated ticket |
| POST | `/tickets/{id}/close` | Admin only | Marks it `fixed` and returns it. Only an admin's still-there vote can reopen it. `403` for non-admins, `409` if merged |
| POST | `/tickets/{id}/votes` | Guest or signed in | `{"vote": "still_there" \| "fixed"}`. Changing your vote replaces it. Returns the updated ticket; a merged ticket returns `409`, and so does a ticket marked `fixed` unless the voter is an admin (an admin's still-there vote reopens it) |

Creating a ticket:

```json
{
  "title": "Blocked curb ramp",               // 1–120 characters
  "issue_type": "blocked_curb_ramp",          // lowercase_with_underscores
  "owner": "city_of_atlanta",                 // gsu_facilities | city_of_atlanta | marta | gdot
  "lat": 33.7531, "lng": -84.3853,
  "address": "Courtland St SE & Gilmer St SE", // optional, up to 200
  "description": "Scooter parked across it",   // optional, up to 2000
  "photo_url": "/uploads/3f2a….jpg"            // optional; only a path from POST /uploads
}
```

A ticket comes back with those fields plus `id`, `created_at`, `updated_at`, `status`, `report_count`, `last_seen_at`, the vote counts `still_there` and `fixed`, the caller's own `my_vote`, and `created_by_me`.

**Status:** `open`, `likely_fixed`, `fixed` or `merged`. A vote recomputes it: when fixed votes reach `FIXED_VOTE_THRESHOLD` (default 2) and outnumber still-there votes, the ticket becomes `likely_fixed`; otherwise it's `open`. A still-there vote also updates `last_seen_at`.

### Photos

| Method | Route | Does |
|---|---|---|
| POST | `/uploads` | Multipart form field `file` (JPEG, PNG or WebP, up to 12 MB). Returns `201 {name, path, faces_hidden, plates_hidden}` |
| GET | `/uploads/{name}` | Serves the stored JPEG, cached for a year (names never change) |

Upload first, then send `path` as the ticket's `photo_url`. The face and plate counts are `null` when the privacy service isn't in use. A photo that no ticket uses is deleted after an hour. See [image privacy](image-privacy.md) for what happens to the file.

### Report agent

| Method | Route | Body | Does |
|---|---|---|---|
| GET | `/analyze/status` | none | `{available, orchestrator, model}`; `orchestrator` is `foundry_agent`, `foundry_model` or `direct` |
| POST | `/analyze` | `{photo: "<name>.jpg", lat, lng, photo_url?}` | Runs the agent on an uploaded photo. Returns `{analysis, owner, contact, address, report, summary, orchestrator, tool_calls}` |
| POST | `/draft` | `{title, issue_type, lat, lng, address?, description?, photo?, photo_url?, owner?}` | Picks the department (unless `owner` is given) and writes the message. Returns `{owner, contact, address, report, written_by}` |
| POST | `/tickets/{id}/follow-up` | optional `{photo_url}` | Writes a follow-up message to the ticket's department, offered after a "Still there" vote. Same shape as `/draft`, plus `timings`. `404` if the ticket doesn't exist |

None of these saves or sends anything. `/analyze` needs Gemini; `/draft` and `/follow-up` always answer, falling back to map rules and a plain template when they can't use AI. The [report agent](report-agent.md) doc covers how they work.

AI use is capped at `ANALYZE_PER_MINUTE` (default 20) and `ANALYZE_PER_DAY` (default 500) for the whole server. Over the cap, `/analyze` returns `429`, and `/draft` and `/follow-up` quietly use a plain template.

### Health

`GET /health` returns `{"ok": true, "photo_privacy": true, "version": "e9a23fa"}`. `photo_privacy` says whether uploads go through the blurring service; `version` is the git commit the server is running, to check whether a deploy has landed.

## Errors

Errors are JSON `{"detail": "<plain sentence>"}`, written to be shown to the person as-is.

| Code | When |
|---|---|
| 400 | The photo is empty, unreadable or too many pixels |
| 401 | Not signed in when required, a bad token, or an unknown guest ID |
| 403 | Deleting someone else's ticket, or closing one without being an admin |
| 404 | No such ticket or photo |
| 409 | Voting on or closing a merged ticket |
| 413 | Photo over 12 MB |
| 422 | A field failed validation (FastAPI's standard shape) |
| 429 | AI usage cap reached |
| 502 | Gemini failed during `/analyze` |
| 503 | Photo analysis isn't set up, or the privacy service couldn't check the photo |
| 507 | The server's disk is nearly full |

## Settings

Read from `.env` at the repo root, `api/.env` or `api/sql/.env`; the full list is in `.env.example`.

| Setting | Default | Does |
|---|---|---|
| `DATABASE_URL` | required | Tiger Cloud connection string |
| `ALLOWED_ORIGINS` | `http://localhost:8443` | Sites allowed to call the API from a browser, comma-separated |
| `AUTH0_DOMAIN`, `AUTH0_AUDIENCE` | match `web/src/auth0-config.ts` | Where sign-in tokens come from |
| `FIXED_VOTE_THRESHOLD` | `2` | Fixed votes needed for `likely_fixed` |
| `UPLOAD_DIR`, `UPLOAD_MAX_MB` | `api/uploads/`, `12` | Photo storage |
| `PHOTO_PRIVACY_URL` | unset | See [image privacy](image-privacy.md) |
| `ANALYZE_PER_MINUTE`, `ANALYZE_PER_DAY` | `20`, `500` | AI usage caps |
| `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `FOUNDRY_*`, `AZURE_*` | unset | See [report agent](report-agent.md) |
| `FLAG_LIMIT`, `SUSPENSION_HOURS` | `5`, `24` | Screening: flagged attempts before posting is paused, and for how long |

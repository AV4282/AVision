# Report agent

Turns a photo and a map position into a filled-in report: what the problem is, which department should fix it and why, the street address, and a message to send. Code: `api/agent.py`, with `gemini.py`, `claude.py`, `routing.py` and `geocode.py`.

**Which AI:** Claude is asked first when `ANTHROPIC_API_KEY` is set, and Gemini is the backup if Claude fails. With only one key set, that one does everything. Both get the same instructions and must answer in the same fixed shape. In the results, `decided_by: "gemini"` and `written_by: "gemini"` mean "the AI", whichever one answered.

AVision never sends anything. The person reviews every result and sends the message from their own email.

## Where it's used

| In the app | Endpoint | What runs |
|---|---|---|
| "Fill in the form from this photo" | `POST /analyze` | The work below. Takes a few seconds |
| "Post ticket" | `POST /draft` | The same work from what the person typed, plus the photo if there is one |
| Follow-up after a "Still there" vote | `POST /tickets/{id}/follow-up` | The AI writes a follow-up to the ticket's department; without it, a plain template |

If the photo was already analyzed and the form wasn't changed, posting reuses that draft instead of calling `/draft`.

## The work

Each report takes an address lookup, some map math and **one AI request**:

1. **Address:** the nearest street address, from OpenStreetMap Nominatim (at most one request a second).
2. **Map facts** (`routing.py`): the nearest MARTA station and its distance, whether the spot is inside the GSU or Georgia Tech campus outline, and whether it's inside city limits.
3. **One AI request** that does four things at once:
   - **Screens the report:** says whether the photo or the wording plainly isn't a real report (see Screening below).
   - **Looks at the photo:** `is_reportable`, `issue_type`, `title`, `description`, up to three `possible_barriers`, `severity` (low, medium or high) and `confidence` (0–1).
   - **Chooses the department** from the map facts and the departments in `api/data/contacts.json` that have an email (GSU Facilities, Georgia Tech, City of Atlanta or MARTA), with a one-sentence reason. Any other answer is refused. A campus department is only on the list when the spot is on its campus.
   - **Writes the report:** a subject, a 60–120 word message and a short phone script.

Python then adds the location and a closing line under the message, so those facts are always correct. The message has no photo links: once the ticket is posted, the web app adds one link, to the ticket's own page (`/?ticket=<id>`), where all the photos are. Identical requests are answered from memory (the last 200 are kept).

## Screening

A report that plainly isn't one is refused before anything is posted: a cartoon, drawing, meme, screenshot or selfie for the photo, or a joke, nonsense or abuse for the words. A real photo that shows no problem is not flagged.

- `/analyze`, `/draft` and `POST /tickets` answer `422` with `{code: "flagged", what, message, strikes, limit}`. The web app closes the form and shows the reason.
- Each new flagged photo or wording counts once against the person (signed-in account, or guest by browser). The fifth (`FLAG_LIMIT`) pauses their posting for a day (`SUSPENSION_HOURS`); while paused those endpoints answer `403` with `code: "suspended"`. Browsing and voting still work.
- A photo or wording that was flagged before is refused again without asking the AI and without a new strike.
- Only the AI can judge this, so when no AI can be reached nothing is flagged.

## Campus departments

GSU Facilities and Georgia Tech only take tickets inside their own campus outline (`api/data/gsu_campus.geojson`, `georgia_tech_campus.geojson`), with 30 m of slack at the edge. This holds whoever chooses: the person, the AI or the map rules. `GET /coverage` lists the departments blocked at a spot and `GET /campuses` returns the outlines the pin map draws. Moving a ticket's pin off its department's campus hands it to the department for the new spot. MARTA, the city and GDOT have no such limit.

## The Foundry agent (optional, off on the live site)

**Not in use on the live site.** Since 2026-10-11 the Foundry settings are left out of the server's `.env`, so every report runs in `direct` mode. The code is still there and works like this when the settings are present.

A Microsoft Foundry agent steers each `/analyze` report through four tools: `analyze_photo`, `find_owner`, `look_up_address` and `draft_report`. It decides which to call next and stops after the first if the photo shows nothing to report. Each tool waits for the work above and hands the agent a short summary.

The work starts the moment the request arrives, at the same time as the agent, so the agent adds little time:

- **If the agent finishes in time**, the result's `orchestrator` is `foundry_agent` (or `foundry_model`) and `tool_calls` lists what it called.
- **If it isn't set up, fails, or is still going 12 seconds after the report is ready** (`FOUNDRY_GRACE_SECONDS`), the report is returned without it, as `direct`. After a failure the agent is left out for a minute, so one bad spell doesn't slow every report.

Limits: 6 turns of up to 30 seconds each, model `gpt-5-mini` by default.

## Fallbacks

| If… | Then… |
|---|---|
| The first AI fails | The backup AI is asked, if its key is set. One that timed out is left out for a minute |
| No AI can answer during `/analyze` | `502` with a plain message; the person fills in the form themselves |
| No AI can answer, or AI use is capped, during `/draft` | Map rules pick the department and a plain template writes the message (`written_by: "template"`) |
| The person picked a department by hand | That choice is used; the AI only writes the message |

**Map rules** (`routing.find_owner`), checked in order:

1. Within 100 m of a MARTA rail station → MARTA
2. Inside the GSU campus outline → GSU Facilities
3. Inside the Georgia Tech campus outline → Georgia Tech
4. Anywhere else → City of Atlanta (ATL311)

MARTA comes before GSU because Georgia State station sits inside the campus outline. The code also has a state-route → GDOT rule, but it only runs while GDOT can be chosen automatically, which needs a GDOT email in `contacts.json`. For now, GDOT can only be picked by hand in the form.

## Safety rules

Written into the prompts and enforced again in code:

- **Findings are "possible" issues or barriers**, never legal violations.
- **No contact details from the AI.** Phone numbers, emails and links come only from `contacts.json`. Anything in the AI's text that looks like one is removed.
- **No descriptions of people**, and no reading out plates, faces or names.
- **The Foundry agent only steers.** Its tools take no input, so it can't pass in or change a department, contact or address.

`contacts.json` was copied from each department's own website on 2026-10-10. When a contact changes, fix that file, never the code.

## Settings

| Setting | Default | Does |
|---|---|---|
| `ANTHROPIC_API_KEY` | unset | Claude. When set, Claude is asked first and Gemini is the backup. The account needs credit |
| `CLAUDE_MODEL` | `claude-haiku-4-5-20251001` | The fast model; a larger one is slower and costs more |
| `CLAUDE_TIMEOUT_SECONDS` | `30` | How long to wait for Claude |
| `AI_PROVIDER` | unset | `gemini` or `claude` to choose which is asked first when both keys are set |
| `GEMINI_API_KEY` | unset | Gemini. With neither key set there is no AI and the "fill in from photo" button is hidden |
| `GEMINI_MODEL` | `gemini-3.8-flash` | |
| `GEMINI_THINKING_LEVEL` | `low` | How hard Gemini thinks; `low` is quickest, `""` uses the model's default |
| `GEMINI_TIMEOUT_SECONDS` | `45` | How long to wait for Gemini |
| `FOUNDRY_PROJECT_ENDPOINT`, `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET` | unset | Full Foundry Agent Service, signed in as the server |
| `FOUNDRY_OPENAI_URL`, `FOUNDRY_API_KEY` | unset | Backup: the Foundry model with a key, when a server login can't be made |
| `FOUNDRY_MODEL`, `FOUNDRY_REASONING_EFFORT` | `gpt-5-mini`, unset | `low` makes gpt-5 models faster |
| `FOUNDRY_GRACE_SECONDS` | `12` | How long to wait for the agent once the report is ready |
| `ANALYZE_PER_MINUTE`, `ANALYZE_PER_DAY` | `20`, `500` | Server-wide caps on AI use |
| `FLAG_LIMIT`, `SUSPENSION_HOURS` | `5`, `24` | Screening: flagged attempts before posting is paused, and for how long |

**Gemini allowance:** when Gemini is the one asked, each report uses one Gemini request, and the free tier allows 20 a day.

## Testing

From `api/`:

```powershell
.venv\Scripts\python check_agent.py
```

It says which AI is asked first, then tests the AI, the routing data, address lookup, the privacy service and Foundry (when its settings are present), and never prints key values. It uses two AI requests a run. When the AI fails, the exact error goes to the server log (`journalctl -u avision-api` on the live server). A `503 UNAVAILABLE` from Google means the model is overloaded, not that the key is wrong.

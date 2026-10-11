# Report agent

Turns a photo and a map position into a filled-in report: what the problem is, which department should fix it and why, the street address, and a message to send. Code: `api/agent.py`, with `gemini.py`, `routing.py` and `geocode.py`.

AVision never sends anything. The person reviews every result and sends the message from their own email.

## Where it's used

| In the app | Endpoint | What runs |
|---|---|---|
| "Fill in the form from this photo" | `POST /analyze` | The work below, with the Foundry agent steering if it keeps up. Takes about 10 seconds |
| "Post ticket" | `POST /draft` | The same work from what the person typed, plus the photo if there is one. No Foundry agent |
| Follow-up after a "Still there" vote | `POST /tickets/{id}/follow-up` | Gemini writes a follow-up to the ticket's department; without Gemini, a plain template |

If the photo was already analyzed and the form wasn't changed, posting reuses that draft instead of calling `/draft`.

## The work

Each report takes an address lookup, some map math and **one Gemini request**:

1. **Address:** the nearest street address, from OpenStreetMap Nominatim (at most one request a second).
2. **Map facts** (`routing.py`): the nearest MARTA station and its distance, whether the spot is inside the GSU campus outline, and whether it's inside city limits.
3. **One Gemini request** that does three things at once:
   - **Looks at the photo:** `is_reportable`, `issue_type`, `title`, `description`, up to three `possible_barriers`, `severity` (low, medium or high) and `confidence` (0–1).
   - **Chooses the department** from the map facts and the departments in `api/data/contacts.json` that have an email (GSU Facilities, City of Atlanta or MARTA), with a one-sentence reason. Any other answer is refused.
   - **Writes the report:** a subject, a 60–120 word message and a short phone script.

Python then adds the location, photo link and a signature line under the message, so those facts are always correct. Identical requests are answered from memory (the last 200 are kept).

## The Foundry agent

A Microsoft Foundry agent steers each `/analyze` report through four tools: `analyze_photo`, `find_owner`, `look_up_address` and `draft_report`. It decides which to call next and stops after the first if the photo shows nothing to report. Each tool waits for the work above and hands the agent a short summary.

The work starts the moment the request arrives, at the same time as the agent, so the agent adds little time:

- **If the agent finishes in time**, the result's `orchestrator` is `foundry_agent` (or `foundry_model`) and `tool_calls` lists what it called.
- **If it isn't set up, fails, or is still going 12 seconds after the report is ready** (`FOUNDRY_GRACE_SECONDS`), the report is returned without it, as `direct`. After a failure the agent is left out for a minute, so one bad spell doesn't slow every report.

Limits: 6 turns of up to 30 seconds each, model `gpt-5-mini` by default.

## Fallbacks

| If… | Then… |
|---|---|
| Gemini fails during `/analyze` | `502` with a plain message; the person fills in the form themselves |
| Gemini fails or is capped during `/draft` | Map rules pick the department and a plain template writes the message (`written_by: "template"`) |
| The person picked a department by hand | That choice is used; Gemini only writes the message |

**Map rules** (`routing.find_owner`), checked in order:

1. Within 100 m of a MARTA rail station → MARTA
2. Inside the GSU downtown campus outline → GSU Facilities
3. Anywhere else → City of Atlanta (ATL311)

MARTA comes before GSU because Georgia State station sits inside the campus outline. The code also has a state-route → GDOT rule, but it only runs while GDOT can be chosen automatically, which needs a GDOT email in `contacts.json`. For now, GDOT can only be picked by hand in the form.

## Safety rules

Written into the prompts and enforced again in code:

- **Findings are "possible" issues or barriers**, never legal violations.
- **No contact details from the AI.** Phone numbers, emails and links come only from `contacts.json`. Anything in Gemini's text that looks like one is removed.
- **No descriptions of people**, and no reading out plates, faces or names.
- **The Foundry agent only steers.** Its tools take no input, so it can't pass in or change a department, contact or address.

`contacts.json` was copied from each department's own website on 2026-10-10. When a contact changes, fix that file, never the code.

## Settings

| Setting | Default | Does |
|---|---|---|
| `GEMINI_API_KEY` | unset | Required for any AI; without it the "fill in from photo" button is hidden |
| `GEMINI_MODEL` | `gemini-3.8-flash` | |
| `GEMINI_THINKING_LEVEL` | `low` | How hard Gemini thinks; `low` is quickest, `""` uses the model's default |
| `GEMINI_TIMEOUT_SECONDS` | `45` | How long to wait for Gemini |
| `FOUNDRY_PROJECT_ENDPOINT`, `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET` | unset | Full Foundry Agent Service, signed in as the server |
| `FOUNDRY_OPENAI_URL`, `FOUNDRY_API_KEY` | unset | Backup: the Foundry model with a key, when a server login can't be made |
| `FOUNDRY_MODEL`, `FOUNDRY_REASONING_EFFORT` | `gpt-5-mini`, unset | `low` makes gpt-5 models faster |
| `FOUNDRY_GRACE_SECONDS` | `12` | How long to wait for the agent once the report is ready |
| `ANALYZE_PER_MINUTE`, `ANALYZE_PER_DAY` | `20`, `500` | Server-wide caps on AI use |

**Gemini allowance:** each report uses one Gemini request, and the free tier allows 20 a day. Turn on billing for the key's project in Google AI Studio before a demo.

## Testing

From `api/`:

```powershell
.venv\Scripts\python check_agent.py
```

It tests Gemini, the routing data, address lookup, the privacy service and Foundry, and never prints key values. It uses two Gemini requests a run. When Gemini fails, the exact error goes to the server log (`journalctl -u avision-api` on the live server). A `503 UNAVAILABLE` from Google means the model is overloaded, not that the key is wrong.

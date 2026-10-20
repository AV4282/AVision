# Privacy Policy review

**WIP placeholder/example only. Do not merge or publish this page as a finished privacy policy.** Confirm the pending facts, correct and complete the wording, and obtain final approval before replacing the visible draft notice. The existing deployment workflow can publish the page when merged into `main`.

Draft revision: October 20, 2026. Implements [issue #10](https://github.com/AV4282/AVision/issues/10) on `privacy-policy-page`.

The October 20 wording pass shortens explanations, removes repeated provider descriptions and AI failover mechanics, and replaces technical terms with everyday wording. Public uploads/locations, conditional blurring, AI recipients, ad cookies and choices, guest identifiers, and retention/deletion limits remain disclosed. Detailed operational and publication checks stay in this review note.

The age eligibility section leaves the minimum age and any parental-consent requirements pending legal review. The user chose to skip age estimation. No age cutoff, age collection, age verification, or parental-consent flow has been implemented.

The final clarity/accuracy pass split dense AI and advertising paragraphs, clarified the browser guest ID, and explicitly distinguished ticket deletion from removal of every related record. `api/db.py: delete_ticket` unlinks legacy reports and generates removal notifications, and `api/sql/005_notifications.sql` preserves the removal notice/title without a ticket link. The advertising link now points directly to Google's Partner Ad Settings, following [Google's official explanation](https://support.google.com/My-Ad-Center-Help/answer/12155656?hl=en). Advertising partners and consent settings remain pending. Public health/AI status was rechecked and still reported revision `36a16f1`, photo protection enabled, Claude as primary, and direct orchestration.

The prepared PR description uses `Closes #10`. Opening a review PR does not approve publication. The existing `.github/workflows/deploy.yml` deploys qualifying pushes to `main`, so the team must resolve publication blockers before merging this change into `main`.

The user confirmed the name **AVision**, serving the USA with a Georgia focus. No privacy contact or separate legal entity is confirmed. `/privacy` is an accessible draft, not an approved or effective legal policy. Do not deploy this branch before team review.

## Implementation evidence

| Disclosure | Code checked |
| --- | --- |
| Public ticket text, exact coordinates, addresses, photos, status and vote counts | `api/main.py`: `list_tickets`, `get_ticket`, `Ticket`; `api/db.py`: `TICKET_SELECT` |
| Uploads are accessible before posting, public cache lifetime is one year | `api/main.py`: `upload_photo`, `get_photo` |
| EXIF is dropped by JPEG re-encoding; ICC color profile is preserved | `api/photos.py`: `save_photo` |
| Face/plate blurring depends on configuration, fails closed when enabled, skips avatars | `api/photos.py`: `PRIVACY_URL`, `save_photo`, `_hide_faces_and_plates` |
| Location permission is requested on an explicit action; address and pin alternatives exist | `web/src/ReportForm.tsx`: `useMyLocation`; `web/src/ReportLocationPicker.tsx`; `web/src/geocode.ts` |
| Auth0/Google profile, local token cache, optional onboarding answers | `web/src/auth.tsx`; `api/main.py`: `sign_in`, `save_onboarding`; `api/db.py`: `upsert_user`, `save_onboarding` |
| Guest IDs and activity transfer | `web/src/api.ts`: `getGuestId`, `recordSignIn`; `api/db.py`: `claim_guest` |
| Claude/Gemini provider selection and fallback; screening; optional Foundry tool context | `api/gemini.py`: `providers`, `_ask`, `report_from_photo`; `api/claude.py`: `ask`; `api/agent.py`: `_run_with_foundry`, `_call_tool`; `api/main.py`: `screen` |
| User sends email; opening Gmail includes the editable message in the URL | `web/src/ReportReady.tsx`: `mailto`, `gmail` |
| Report-name preference adds a name locally, not an anonymity control | `web/src/report-preferences.ts`; `web/src/ReportReady.tsx` |
| Supabase database and Vultr server | `api/db.py`; `deploy/README.md`; `deploy/Caddyfile` |
| OSM tiles, Nominatim coordinates, Photon search text, Google Fonts, Unsplash placeholder | `web/src/ReportLocationPicker.tsx`; `web/src/components/avision-map/AvisionMap.tsx`; `api/geocode.py`; `web/src/geocode.ts`; `web/src/index.css`; `web/src/api.ts` |
| AdSense script loads sitewide; ad-unit settings alone do not disable the script | `web/index.html`; `web/src/AdSlot.tsx` |
| Ticket deletion, fixed-ticket restrictions, periodic unused-photo cleanup after one-hour grace | `api/db.py`: `delete_ticket`; `api/main.py`: `delete_ticket`, `photo_cleanup_loop`; `api/photos.py`: `remove_unused`, `UNUSED_GRACE_SECONDS` |
| No account deletion/export endpoint or automatic account/ticket expiry | Reviewed `api/main.py`, `api/db.py`, SQL migrations |

The initial review checked source code. The read-only status checks below also verify a limited set of live configuration facts. Provider contracts, account data-use settings, backups and log settings remain unverified. No live reports, photos, accounts, or database records were created or changed for testing.

## Provider and photo privacy settings checked October 20, 2026

Public status responses were read without authentication, report submission, uploads or AI calls. The live page HTML was also read. The HTML check completed at `2026-10-20T20:45:51Z`; the two status requests completed immediately beforehand.

| Setting | Evidence | Confirmed scope |
| --- | --- | --- |
| Live API revision | `GET https://atlantamamdani.photo/api/health`: `version: "36a16f1"`, `ok: true` | Matches this branch's base revision and the reviewed status-handler code. No database rows were read by us. |
| Ticket photo protection | Same response: `photo_privacy: true`; `api/main.py` returns `bool(photos.PRIVACY_URL)` | The live API is configured to send new ticket photos through protection. This flag does **not** test the protection service's current health or detection accuracy. |
| Photo handling | `api/photos.py`: `save_photo`, `_hide_faces_and_plates` | Re-encoding strips EXIF/GPS. Configured protection runs before file storage and failures reject uploads. Avatars skip blurring. No real or synthetic photos were sent to production to test these paths. |
| Primary report AI | `GET https://atlantamamdani.photo/api/analyze/status`: `available: true`, `model: "claude-haiku-4-5-20251001"`; `gemini.model_name()` | Claude is the configured primary provider. This verifies configuration, not a successful model call, billing status, or contractual data use. |
| Microsoft Foundry | Same response: `orchestrator: "direct"`; handler returns `agent.foundry_mode() or "direct"` | No Foundry orchestration is configured on the live ticket API at the time checked. This is not just a per-request fallback result. |
| Gemini | `api/gemini.py`: `providers`, `_ask`; `photo-privacy/photo-cleanse.py`: `GEMINI_KEY`, `extract_text` | Supported as a report-provider backup and, separately, as optional text extraction in the photo service. Public ticket-API status reveals only the primary provider, so neither Gemini configuration is confirmed live. |
| AdSense | Public live HTML contains the `pagead2.googlesyndication.com/pagead/js/adsbygoogle.js` script | Script loading is confirmed. Actual ad serving, ad partners, personalization, consent and privacy-signal settings are not. |
| Supabase/Vultr | `api/db.py`, `deploy/README.md`, deployment units | Confirmed as the documented setup, not independently verified live account settings. Connected Supabase metadata could not be matched to AVision. The example `us-east-1` connection string is not evidence of the live region. |
| Local private configuration | Checked the expected root/API/web/photo-service `.env` paths and only the presence of relevant process variables | No private configuration was found in this checkout or those process variables. Example files are templates and were not treated as live settings. No keys, passwords or private connection strings were printed. |

The photo service's code detects faces and plates locally. Its committed service unit supplies no Gemini key and does not load the ticket API's `.env`. However, the installed unit/environment and private photo-service health endpoint were not inspected, so the draft does not promise that the photo service can never send a processed image to Gemini.

Still pending: Gemini availability in both processes; photo-service runtime health, thresholds and optional text extraction; provider retention/training agreements and settings; live hosting identity and regions; backup/log retention; and AdSense partners/controls. Public status cannot establish these. No hosting, database, AI, advertising or photo-processing settings were changed.

## Verification

- `npm run typecheck`, `npm run build`, formatting checks for the new React components, and `git diff --check` pass. Vite reports config-loader compatibility and bundle-size warnings.
- Playwright verified `/privacy`, `/privacy/`, section deep-link refresh, keyboard skip navigation, keyboard theme switching, and policy links from the welcome screen and Privacy & security dialog.
- Policy reflow and light/dark themes were checked at 1440px, 390px and 320px. Shared footers on map, issues and profile views remain clickable above mobile navigation at those widths in both themes.
- Main text, links, footer text and the draft notice pass 4.5:1 contrast checks in both themes. Keyboard focus outlines are visible, and 200% content scaling at a 1280px viewport does not cause horizontal overflow.
- Browser checks intercepted API calls and blocked external ads/map tiles. They did not exercise real sign-in, production providers, uploads or the live database. Screenshots and verification scripts are under ignored `output/playwright/privacy-policy/`.

## Before publication

- Confirm the operator's legal identity and a monitored privacy contact. Add a working private request channel and a process for access, correction, deletion and any applicable appeals, including verification and response deadlines.
- Confirm retention/deletion schedules for accounts, activity, moderation records, logs, backups, caches and each provider. The one-hour grace period is eligibility for periodic cleanup, not a deletion deadline.
- Confirm deployed photo protection, AI providers, storage regions, provider data-use/training settings and contractual terms. Do not promise anonymization, US-only storage, no training, no sale/sharing, or universal legal compliance without evidence.
- Review actual AdSense settings and ad partners, required disclosures, applicable consent/opt-out controls and treatment of privacy signals. The current app does not implement an advertising consent or privacy-signal handler. A disclosure alone does not implement those controls. The standalone policy avoids Auth0/API initialization, but the existing HTML still loads AdSense and the existing CSS loads Google Fonts.
- Have qualified counsel confirm applicable Georgia/federal law and any other state obligations arising from actual users and business activity. Assess children's privacy/COPPA and the intended age audience before adopting an age policy. Georgia focus alone does not establish which laws apply.
- Approve the final wording, replace the draft notice and pending details, set the effective/revision date, and decide how material changes will be communicated before deployment.

## Sources consulted

- [FTC privacy and security guidance](https://www.ftc.gov/business-guidance/privacy-security): privacy promises must match actual practice.
- [Georgia Attorney General: protecting privacy online](https://consumer.georgia.gov/protecting-your-privacy-online): public information, browser settings and third-party tracking.
- [Google AdSense required policy content](https://support.google.com/adsense/answer/1348695?hl=en) and [AdSense cookies](https://support.google.com/adsense/answer/7549925?hl=en): advertising disclosures and user choices.
- [FTC COPPA FAQs](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions): applicability depends on audience and actual knowledge, not merely an age disclaimer.
- [California Attorney General: CCPA](https://oag.ca.gov/privacy/ccpa): applicability and rights require factual assessment, not a blanket claim in a Georgia-focused draft.

These sources inform review. This change does not certify compliance with every law.

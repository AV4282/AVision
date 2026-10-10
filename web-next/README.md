# AVision website

The AVision front end, built with React (Next.js). Right now it holds the landing page, the sign-up questions, and sign-in with Auth0.

> Moved here from `web/`, which now holds the main Vite app connected to the ticket API. This folder keeps the landing page, onboarding, and Auth0 sign-in so they can be ported into `web/`. Run it from this folder, or with `npm run dev:next` from the repo root.

## Run it

```
npm install
npm run dev
```

Open http://localhost:3000.

## How sign-up flows

1. Everyone lands on the home page (`/`). Nothing is asked there.
2. Pressing **Sign up** creates the account with Auth0.
3. Right after, the person lands on the questions at `/onboarding`, then goes to the home page.

**Log in** goes to Auth0 and back to the home page. If that account has not answered the questions in this browser, it is sent to them once. Signed-out visitors can never open the questions.

## Sign-in (Auth0)

The pages load without this, but nobody can sign up or see the questions. Until it is set up, the Log in and Sign up links show a message saying what is missing.

1. In the Auth0 dashboard, create an application of type **Regular Web Application**.
2. In its Settings, set **Allowed Callback URLs** to `http://localhost:3000/auth/callback` and **Allowed Logout URLs** to `http://localhost:3000`, then save.
3. Copy `.env.example` to `.env.local` and fill in the Domain, Client ID and Client Secret from that same Settings page.
4. Fill in `AUTH0_SECRET` with the output of `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
5. Restart `npm run dev`.

`AUTH0_DOMAIN` is the bare domain, like `your-tenant.us.auth0.com`, with no `https://`. Never commit `.env.local`. When the site goes online, add the live address to both URL lists in Auth0 and set `APP_BASE_URL` to it.

To know who is signed in:

```tsx
"use client";
import { useUser } from "@auth0/nextjs-auth0/client";

const { user } = useUser(); // null when signed out
```

On the server, use `auth0.getSession()` from `lib/auth0.ts`. It is `null` when Auth0 is not set up, so check for that first.

## The sign-up questions

Three questions, one per screen:

1. Are you a student?
2. What school do you go to? (only asked if they said yes; Georgia State is one tap, anyone else types theirs)
3. Do you take MARTA?

The answers are saved in the browser under the `avision.prefs` key:

```json
{ "onboarded": true, "userId": "auth0|abc123", "isStudent": true, "school": "Georgia State University", "takesMarta": true }
```

Any screen can read them:

```tsx
"use client";
import { usePrefs } from "@/lib/prefs";

const prefs = usePrefs(); // null until the page has loaded in the browser
```

`userId` is the Auth0 ID of the account that answered. Nothing is sent to a server yet, so the answers stay in that one browser. When there is a backend for user profiles, send them from `answerMarta` in `app/onboarding/Onboarding.tsx`.

## Where things are

| File | What it is |
|---|---|
| `app/onboarding/Onboarding.tsx` | The questions and their logic. Supported schools are the `SCHOOLS` array at the top. Add Georgia Tech there. |
| `app/onboarding/onboarding.module.css` | Onboarding layout and styles. |
| `app/globals.css` | Colours and fonts used across the site. |
| `app/page.tsx` | The landing page. Its "Your answers" block is a placeholder for the real signed-in home. |
| `app/Paving.tsx` | The dotted backdrop shared by both pages. |
| `lib/prefs.ts` | Saves and reads the onboarding answers. |
| `lib/auth0.ts` | The Auth0 client. |
| `proxy.ts` | Runs before each request so Auth0 can serve `/auth/login`, `/auth/logout`, `/auth/callback` and `/auth/profile`. |
| `app/Account.tsx` | The Log in / Sign up / Log out links in the top corner. |

`AGENTS.md` is written by Next.js for AI coding tools. It is safe to leave alone.

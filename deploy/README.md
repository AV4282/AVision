# Deploying AVision

The live site is https://atlantamamdani.photo, on one Vultr server (64.177.49.129).

Once the first-time setup below is done, every push to `main` that touches `web/`, `api/` or `deploy/` updates the site by itself, in about two minutes. Watch it in the repo's **Actions** tab: a green check means the new version is live, and a red X shows the step that failed. While a deploy runs, and if it fails, visitors keep seeing the previous version.

## What runs on the server

| Piece | What it is |
|---|---|
| Caddy | Web server. Serves the built web app from `web/dist`, sends `/api/...` to the ticket API, and handles HTTPS. Settings: `deploy/Caddyfile` |
| `avision-api` | The ticket API (`api/`), kept running by systemd. Settings: `deploy/avision-api.service` |
| `/opt/avision` | A copy of this repo |
| `/var/lib/avision/uploads` | Photos people attach to tickets. Not in the repo, and not touched by deploys |

`deploy/deploy.sh` does the update: pull, build the web app, install the API's packages, restart the API, apply the web server settings, then check that the site and the API answer.

Two things on the server are not in this repo: `api/.env`, which holds the database connection string, and the uploaded photos. The photos exist only on this server, so copy `/var/lib/avision/uploads` somewhere first if the server is ever replaced.

## First-time setup

Do this once. Log in with `ssh root@64.177.49.129`.

**1. Install the tools** (skip any that are already there):

```bash
apt update && apt install -y git caddy python3-venv curl
curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt install -y nodejs
ufw allow 80,443/tcp
```

**2. Get the code.** If `/opt/avision` already exists:

```bash
cd /opt/avision && git pull
```

If it does not, clone it. The repo is private, so GitHub asks for a username and password. The password is a fine-grained access token with read-only **Contents** access to this repo (GitHub > Settings > Developer settings > Personal access tokens).

```bash
git config --global credential.helper store
git clone https://github.com/VincePaul723/Hacklanta2026-Grex-Aureus.git /opt/avision
```

**3. Add the database connection string.** Same line as in your local `api/.env`:

```bash
nano /opt/avision/api/.env
```

```
DATABASE_URL="postgres://tsdbadmin:<password>@<host>:<port>/tsdb?sslmode=require"
```

Save with Ctrl+O, Enter, then Ctrl+X.

**4. Run the first deploy:**

```bash
bash /opt/avision/deploy/deploy.sh
```

It should end with `Live: https://atlantamamdani.photo`.

**5. Let GitHub run deploys:**

```bash
bash /opt/avision/deploy/make-deploy-key.sh
```

It prints a key. On GitHub, open the repo > **Settings** > **Secrets and variables** > **Actions** > **New repository secret**. Name it `DEPLOY_SSH_KEY` and paste the key. The key can only start `deploy.sh`; it cannot do anything else on the server.

**6. Try it:** Actions tab > **Deploy website** > **Run workflow**.

## Report agent settings

The "fill in the form from this photo" feature needs keys in `/opt/avision/api/.env`, next to `DATABASE_URL`. The full list with examples is in `api/sql/.env.example`.

- `GEMINI_API_KEY` turns the feature on.
- The Foundry settings make a Microsoft Foundry agent run the steps. Without them the server runs the same steps itself.

After changing the file:

```bash
systemctl restart avision-api
cd /opt/avision/api && UPLOAD_DIR=/var/lib/avision/uploads .venv/bin/python check_agent.py
```

`check_agent.py` tests Gemini, the routing data, the address lookup and Foundry with the real services, and prints PASS or FAIL for each with the reason.

## Day to day

- **Deploy by hand:** log in to the server and type `deploy`.
- **API logs:** `journalctl -u avision-api -n 50`
- **Web server logs:** `journalctl -u caddy -n 50`
- **Change the database connection:** edit `/opt/avision/api/.env`, then `systemctl restart avision-api`.

## When a deploy fails

The last lines of the red run in the Actions tab say what went wrong. The common ones:

| Message | Fix |
|---|---|
| `Could not pull from GitHub` ... `Authentication failed` | The access token on the server expired. Make a new one (step 2), then on the server run `git -C /opt/avision pull` and enter it |
| `api/.env is missing` | Do step 3 |
| `The ticket API did not start` | Usually a wrong `DATABASE_URL`. The log lines above the message show the real error |
| `The DEPLOY_SSH_KEY secret is not set` or `Permission denied (publickey)` | Do step 5 again. It prints the same key |
| A build error from `npm` or `vite` | The code does not build. Fix it and push again. The live site is untouched |

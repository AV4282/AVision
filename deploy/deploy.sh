#!/bin/bash
# Updates the live site (https://atlantamamdani.photo) to the latest code on main.
#
# Runs on the Vultr server as root. GitHub Actions starts it after every push
# to main (.github/workflows/deploy.yml). To run it by hand, log in to the
# server and type:
#
#     bash /opt/avision/deploy/deploy.sh
#
# It is safe to run as often as you like. If a step fails it stops there, and
# the site keeps showing the last version that built.
#
# What it does, in order:
#   1. Pulls the latest code.
#   2. Builds the web app (web/) into web/dist.
#   3. Sets up the photo privacy service (photo-privacy/), which blurs faces and
#      license plates, if this server has the memory for it.
#   4. Installs the ticket API's packages (api/) and restarts it.
#   5. Applies the web server settings (deploy/Caddyfile).
#   6. Checks that the site and the API answer.
#
# First-time server setup is in deploy/README.md.

set -euo pipefail

APP=/opt/avision
SITE=atlantamamdani.photo
API_SERVICE=avision-api
PRIVACY_SERVICE=avision-privacy
PRIVACY_URL=http://127.0.0.1:8001
PRIVACY_MIN_MEMORY_MB=1800 # the service peaks at about 1.1 GB, next to everything else
PRIVACY_MIN_DISK_MB=4000   # its packages and models take about 2.5 GB
# Tells the ticket API where the privacy service is. Present only while the service runs.
PRIVACY_SETTING=/etc/systemd/system/$API_SERVICE.service.d/photo-privacy.conf
LOCK=/run/avision-deploy.lock

step() { printf '\n== %s\n' "$*"; }
note() { printf 'Note: %s\n' "$*"; }
die() {
  printf '\nDEPLOY FAILED: %s\n' "$*" >&2
  exit 1
}

build_web() {
  step "Building the web app"
  cd "$APP/web"
  # Build leftovers from when this folder held the Next.js app. Tailwind reads
  # every file here that git does not ignore, so they must not linger.
  rm -rf .next next-env.d.ts
  npm ci --no-audit --no-fund
  # Build into a spare folder and swap it in at the end, so visitors never get
  # a half-built site and a failed build leaves the current one alone.
  # (The .tmp- names are in web/.gitignore, so Tailwind does not scan them.)
  rm -rf .tmp-dist-new
  npm run build -- --outDir .tmp-dist-new --emptyOutDir
  [ -f .tmp-dist-new/index.html ] || die "The web build finished without an index.html."
  rm -rf .tmp-dist-old
  if [ -d dist ]; then mv dist .tmp-dist-old; fi
  mv .tmp-dist-new dist
  rm -rf .tmp-dist-old
}

# Makes sure the current folder has a Python environment in .venv.
make_venv() {
  [ -x .venv/bin/pip ] && return 0
  rm -rf .venv
  if ! python3 -m venv .venv 2>/dev/null; then
    # Ubuntu ships Python without the venv module.
    rm -rf .venv
    DEBIAN_FRONTEND=noninteractive apt-get install -y python3-venv >/dev/null || return 1
    python3 -m venv .venv || return 1
  fi
}

# The services run as their own user, which has no login and owns nothing but
# its data folders.
make_service_user() {
  id avision >/dev/null 2>&1 ||
    useradd --system --no-create-home --shell /usr/sbin/nologin avision
}

# Installs and starts the photo privacy service. Prints why and returns 1 if
# this server can't run it or it doesn't come up. Each step checks itself,
# because a function called from "if" doesn't stop on errors by itself.
start_privacy() {
  cd "$APP/photo-privacy" || return 1

  local memory disk
  memory=$(awk '/^MemTotal:/ {print int($2 / 1024)}' /proc/meminfo)
  if [ "$memory" -lt "$PRIVACY_MIN_MEMORY_MB" ]; then
    echo "This server has $memory MB of memory. Blurring needs a server with 2 GB or more."
    return 1
  fi
  disk=$(df -Pm "$APP" | awk 'NR == 2 {print $4}')
  if [ ! -d .venv ] && [ "$disk" -lt "$PRIVACY_MIN_DISK_MB" ]; then
    echo "This server has $disk MB of free disk. Installing the blurring service needs $PRIVACY_MIN_DISK_MB MB."
    return 1
  fi

  # Installing takes a few minutes, so it is only redone when the list of packages changes.
  local wanted installed=.venv/.installed-requirements
  wanted=$(sha256sum <requirements.txt)
  if [ ! -x .venv/bin/uvicorn ] || [ "$(cat "$installed" 2>/dev/null)" != "$wanted" ]; then
    echo "Installing its packages. The first time takes about five minutes."
    make_venv || { echo "Could not create its Python environment."; return 1; }
    .venv/bin/pip install --quiet --disable-pip-version-check -r requirements.txt ||
      { echo "Could not install its packages."; return 1; }
    echo "$wanted" >"$installed"
  fi

  make_service_user || return 1
  local unit=/etc/systemd/system/$PRIVACY_SERVICE.service
  # Restarting reloads the models, and photo uploads are refused meanwhile, so
  # restart only when the service's own files changed.
  local running=/run/$PRIVACY_SERVICE.version version
  version=$(cat photo-cleanse.py requirements.txt "$APP/deploy/$PRIVACY_SERVICE.service" | sha256sum)
  if ! cmp -s "$APP/deploy/$PRIVACY_SERVICE.service" "$unit"; then
    cp "$APP/deploy/$PRIVACY_SERVICE.service" "$unit" || return 1
    systemctl daemon-reload
  fi
  systemctl enable --quiet "$PRIVACY_SERVICE"
  if ! systemctl is-active --quiet "$PRIVACY_SERVICE" || [ "$(cat "$running" 2>/dev/null)" != "$version" ]; then
    echo "Starting it. The first start downloads its two models (about 320 MB)."
    systemctl restart "$PRIVACY_SERVICE" || true
  fi

  # Up to five minutes: loading the models takes a while, and longer the first time.
  local _ restarts
  for _ in $(seq 1 100); do
    if curl -fsS -m 5 "$PRIVACY_URL/health" 2>/dev/null | grep -q '"ok": *true'; then
      echo "$version" >"$running"
      echo "Photo privacy service is up."
      return 0
    fi
    # Stop waiting early if it has given up, or keeps crashing and restarting.
    restarts=$(systemctl show -p NRestarts --value "$PRIVACY_SERVICE" 2>/dev/null || echo 0)
    if systemctl is-failed --quiet "$PRIVACY_SERVICE" || [ "${restarts:-0}" -ge 3 ]; then
      break
    fi
    sleep 3
  done
  journalctl -u "$PRIVACY_SERVICE" -n 20 --no-pager >&2 || true
  echo "The photo privacy service did not start. Its last log lines are above."
  return 1
}

update_privacy() {
  step "Updating the photo privacy service"
  # A problem here never stops a deploy. The site carries on without blurring,
  # exactly as it ran before this service existed, and says so below.
  if start_privacy; then
    mkdir -p "$(dirname "$PRIVACY_SETTING")"
    if ! grep -qsF "PHOTO_PRIVACY_URL=$PRIVACY_URL" "$PRIVACY_SETTING"; then
      printf '[Service]\nEnvironment=PHOTO_PRIVACY_URL=%s\n' "$PRIVACY_URL" >"$PRIVACY_SETTING"
      systemctl daemon-reload
    fi
    return 0
  fi
  note "Faces and license plates in new photos are NOT being blurred on this server."
  if [ -e "$PRIVACY_SETTING" ]; then
    rm -f "$PRIVACY_SETTING"
    systemctl daemon-reload
  fi
  # Leave nothing half-running that would only use memory.
  systemctl disable --now --quiet "$PRIVACY_SERVICE" 2>/dev/null || true
}

update_api() {
  step "Updating the ticket API"
  cd "$APP/api"

  make_venv
  .venv/bin/pip install --quiet --disable-pip-version-check -r requirements.txt

  # The API may read the database password and nothing else of note. Nobody
  # else on the server can read that file.
  make_service_user
  local env_file
  for env_file in .env sql/.env; do
    if [ -f "$env_file" ]; then
      chown root:avision "$env_file"
      chmod 640 "$env_file"
    fi
  done

  local unit=/etc/systemd/system/$API_SERVICE.service
  if ! cmp -s "$APP/deploy/$API_SERVICE.service" "$unit"; then
    cp "$APP/deploy/$API_SERVICE.service" "$unit"
    systemctl daemon-reload
  fi
  systemctl enable --quiet "$API_SERVICE"
  systemctl restart "$API_SERVICE"

  # The API connects to the database as it starts, which takes a few seconds.
  local _
  for _ in $(seq 1 30); do
    if curl -fsS -m 5 http://127.0.0.1:8000/health 2>/dev/null | grep -q '"ok": *true'; then
      echo "Ticket API is up."
      return
    fi
    sleep 1
  done
  journalctl -u "$API_SERVICE" -n 30 --no-pager >&2 || true
  die "The ticket API did not start. Its last log lines are above. The usual cause is a wrong DATABASE_URL in api/.env."
}

update_web_server() {
  step "Updating the web server"
  if ! cmp -s "$APP/deploy/Caddyfile" /etc/caddy/Caddyfile; then
    caddy validate --adapter caddyfile --config "$APP/deploy/Caddyfile" >/dev/null 2>&1 ||
      die "deploy/Caddyfile has a mistake. To see it: caddy validate --adapter caddyfile --config $APP/deploy/Caddyfile"
    cp "$APP/deploy/Caddyfile" /etc/caddy/Caddyfile
    systemctl reload caddy 2>/dev/null || systemctl restart caddy
    echo "New web server settings applied."
  fi
  systemctl is-active --quiet caddy || systemctl start caddy

  # The site used to be a Next.js app kept running by pm2. It is not needed now.
  if command -v pm2 >/dev/null && pm2 describe avision >/dev/null 2>&1; then
    pm2 delete avision >/dev/null
    pm2 save --force >/dev/null
    echo "Stopped the old Next.js site."
  fi

  # Typing "deploy" on the server runs this script.
  printf '#!/bin/bash\nexec bash %s/deploy/deploy.sh\n' "$APP" >/usr/local/bin/deploy
  chmod 755 /usr/local/bin/deploy
}

# Asks this server for a page of the live site, over HTTPS, without leaving the server.
fetch() { curl -fsS -m 15 --resolve "$SITE:443:127.0.0.1" "https://$SITE$1"; }

check_site() {
  step "Checking the live site"
  local _
  for _ in $(seq 1 10); do
    if fetch / 2>/dev/null | grep -q 'id="root"'; then
      fetch /api/health | grep -q '"ok": *true' ||
        die "The site is up, but https://$SITE/api/health is not answering."
      return
    fi
    sleep 2
  done
  die "https://$SITE is not answering. Check the web server: systemctl status caddy"
}

main() {
  [ "$(id -u)" = 0 ] || die "Run this as root."
  [ -d "$APP/.git" ] || die "$APP is missing. See deploy/README.md for the first-time setup."
  local tool
  for tool in git node npm caddy python3 curl flock; do
    command -v "$tool" >/dev/null || die "'$tool' is not installed on this server. See deploy/README.md."
  done

  # Checked first, so a server that is not set up fails in a second, not after the build.
  [ -f "$APP/api/.env" ] || [ -f "$APP/api/sql/.env" ] ||
    die "api/.env is missing. It needs the DATABASE_URL line. See deploy/README.md."

  case "${1:-}" in
    "")
      # One deploy at a time: a second one waits here for the first to finish.
      # (--close keeps the lock from leaking into anything this script starts.)
      local status=0
      flock --timeout 900 --conflict-exit-code 75 --close "$LOCK" bash "$APP/deploy/deploy.sh" locked || status=$?
      [ "$status" != 75 ] || die "Another deploy has been running for 15 minutes."
      exit "$status"
      ;;
    locked)
      step "Getting the latest code"
      GIT_TERMINAL_PROMPT=0 git -C "$APP" pull --ff-only ||
        die "Could not pull from GitHub. If it says 'Authentication failed', the access token on this server has expired. See deploy/README.md."
      # Start over, so the newest copy of this script does the rest.
      exec bash "$APP/deploy/deploy.sh" pulled
      ;;
    pulled) ;;
    *) die "Run this script with no arguments." ;;
  esac

  build_web
  update_privacy
  update_api
  update_web_server
  check_site

  cd "$APP"
  if grep -q 'AUTH0_DOMAIN = ""' web/src/auth0-config.ts 2>/dev/null &&
    ! grep -qs '^VITE_AUTH0_DOMAIN=.' web/.env web/.env.local web/.env.production web/.env.production.local; then
    note "Sign-in is off, because web/src/auth0-config.ts is empty."
  fi
  if grep -qs 'AUTH0_CLIENT_SECRET' web/.env.local; then
    note "web/.env.local on this server still holds the old Next.js sign-in secrets. Nothing uses them now. Remove them with: rm $APP/web/.env.local"
  fi

  if [ ! -e "$PRIVACY_SETTING" ]; then
    note "Photo blurring is off (see the photo privacy step above). Photos are stored as uploaded."
  fi

  printf '\nLive: https://%s (version %s)\n' "$SITE" "$(git rev-parse --short HEAD)"
}

# Bash reads a script as it runs it. Keeping everything in main() and exiting on
# this line means a pull that changes this file cannot confuse a running deploy.
main "$@"; exit

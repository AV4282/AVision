#!/bin/bash
# One-time setup, run on the server as root:
#
#     bash /opt/avision/deploy/make-deploy-key.sh
#
# Creates the key GitHub Actions uses to update the site, and prints it so you
# can save it as the repo secret DEPLOY_SSH_KEY. The key can do one thing only:
# start deploy.sh. It cannot open a shell or run any other command.
#
# Running it again prints the same key; it does not make a second one.

set -euo pipefail

KEY=/root/.ssh/github_deploy
ALLOWED=/root/.ssh/authorized_keys

[ "$(id -u)" = 0 ] || { echo "Run this as root." >&2; exit 1; }

mkdir -p /root/.ssh
chmod 700 /root/.ssh
if [ ! -f "$KEY" ]; then
  ssh-keygen -q -t ed25519 -N "" -C "avision-github-deploy" -f "$KEY"
fi
[ -f "$KEY.pub" ] || ssh-keygen -y -f "$KEY" >"$KEY.pub"

# Allow the key to log in, limited to the deploy script. Any earlier line for
# this key is replaced; every other line in the file is kept as it is.
public_key=$(cut -d' ' -f2 "$KEY.pub")
updated=$(mktemp)
if [ -f "$ALLOWED" ]; then
  grep -vF "$public_key" "$ALLOWED" >"$updated" || true
  # Make sure the last line ends properly before adding ours.
  if [ -s "$updated" ] && [ -n "$(tail -c1 "$updated")" ]; then echo >>"$updated"; fi
fi
echo "restrict,command=\"bash /opt/avision/deploy/deploy.sh\" $(cat "$KEY.pub")" >>"$updated"
install -m 600 "$updated" "$ALLOWED"
rm -f "$updated"

cat <<'TEXT'

Copy everything between the two dashed lines, including the BEGIN and END lines.
On GitHub: the repo > Settings > Secrets and variables > Actions >
New repository secret. Name it DEPLOY_SSH_KEY and paste it as the secret.
Do not paste it anywhere else.

------------------------------------------------------------
TEXT
cat "$KEY"
echo "------------------------------------------------------------"

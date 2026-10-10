"""
Sign-in checks for the ticket API.

The web app signs people in with Auth0 and sends an access token on each request:
    Authorization: Bearer <token>
This module checks that token: it must be signed by our Auth0 tenant (using the
tenant's public keys), be meant for this API (the audience), and not be expired.
Only then do we trust its "sub", the person's stable Auth0 ID.

Settings (both have defaults that match web/src/auth0-config.ts):
  AUTH0_DOMAIN    our tenant, e.g. dev-xxxx.us.auth0.com
  AUTH0_AUDIENCE  the API identifier set in Auth0 > Applications > APIs
"""

import os

import jwt

AUTH0_DOMAIN = (
    os.getenv("AUTH0_DOMAIN", "dev-6hygidjjfzbshz7n.us.auth0.com")
    .strip()
    .removeprefix("https://")
    .rstrip("/")
)
AUTH0_AUDIENCE = os.getenv("AUTH0_AUDIENCE", "https://api.avision").strip()
ISSUER = f"https://{AUTH0_DOMAIN}/"

# Downloads the tenant's public keys once and keeps them; it fetches again only
# when a token names a key it hasn't seen (Auth0 rotating its keys).
_keys = jwt.PyJWKClient(f"{ISSUER}.well-known/jwks.json", cache_keys=True, timeout=10)


class InvalidToken(Exception):
    """The token can't be trusted. The message is safe to show the caller."""


def verify(token: str) -> dict:
    """Check an Auth0 access token and return its claims (the person is claims["sub"])."""
    try:
        key = _keys.get_signing_key_from_jwt(token)
        claims = jwt.decode(
            token,
            key.key,
            algorithms=["RS256"],  # never accept "none" or a shared-secret algorithm
            audience=AUTH0_AUDIENCE,
            issuer=ISSUER,
            options={"require": ["exp", "iat", "sub"]},
            leeway=30,  # allow a little clock drift between machines
        )
    except jwt.ExpiredSignatureError:
        raise InvalidToken("Your sign-in has expired. Please sign in again.") from None
    except jwt.PyJWKClientConnectionError:
        raise InvalidToken("Couldn't reach Auth0 to check your sign-in. Try again.") from None
    except jwt.PyJWTError:
        raise InvalidToken("Your sign-in couldn't be verified. Please sign in again.") from None

    sub = claims.get("sub")
    if not isinstance(sub, str) or not sub or sub.startswith(("guest|", "seed|")):
        # guest| and seed| are our own prefixes for people without an Auth0 account.
        raise InvalidToken("Your sign-in couldn't be verified. Please sign in again.")
    return claims

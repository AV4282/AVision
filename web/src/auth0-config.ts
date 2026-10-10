// Auth0 settings for sign-in. Both values come from the Auth0 dashboard:
// Applications > (our app) > Settings > Domain and Client ID.
//
// Both are public identifiers. They are visible in the browser on every
// sign-in, so they are safe to commit. This app has no client secret, and one
// must never be added here.
//
// To override them on one machine without editing this file, set
// VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID in web/.env.local.

export const AUTH0_DOMAIN = "dev-6hygidjjfzbshz7n.us.auth0.com"
export const AUTH0_CLIENT_ID = "9QIZKKwPizY2dQT1jgGJ5vYDnKndEYnm"

// The ticket API's identifier, from Auth0 > Applications > APIs. Sign-in asks for
// an access token for this API, which the ticket API checks (api/auth.py).
// Also a public value. Override with VITE_AUTH0_AUDIENCE in web/.env.local.
export const AUTH0_AUDIENCE = "https://api.avision"

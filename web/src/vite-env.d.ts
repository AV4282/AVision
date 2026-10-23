/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Full URL of the ticket API for a deployed build. Defaults to "/api". */
  readonly VITE_API_URL?: string
  /** Optional overrides for src/auth0-config.ts. */
  readonly VITE_AUTH0_DOMAIN?: string
  readonly VITE_AUTH0_CLIENT_ID?: string
  readonly VITE_AUTH0_AUDIENCE?: string
  /** Google AdSense: the publisher id ("ca-pub-...") turns ads on; the slot id shows the ad unit. */
  readonly VITE_ADSENSE_CLIENT?: string
  readonly VITE_ADSENSE_SLOT_ISSUES?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

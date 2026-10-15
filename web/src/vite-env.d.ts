/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Full URL of the ticket API for a deployed build. Defaults to "/api". */
  readonly VITE_API_URL?: string
  /** Optional overrides for src/auth0-config.ts. */
  readonly VITE_AUTH0_DOMAIN?: string
  readonly VITE_AUTH0_CLIENT_ID?: string
  readonly VITE_AUTH0_AUDIENCE?: string
  /** Google AdSense: the publisher id ("ca-pub-...") turns ads on; each slot id shows one ad unit. */
  readonly VITE_ADSENSE_CLIENT?: string
  readonly VITE_ADSENSE_SLOT_SIDEBAR?: string
  readonly VITE_ADSENSE_SLOT_ISSUES?: string
  readonly VITE_ADSENSE_SLOT_PROFILE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

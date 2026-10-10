// Sign-in with Auth0. Everything the rest of the app needs is in useAccount().
//
// Signing in is optional: guests can still browse, report and vote. A signed-in
// person gets their name on the sidebar and profile. Their tickets and votes
// are still saved under the browser's guest ID (see api.ts) until the ticket
// API learns to read the Auth0 account.

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react"
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from "./auth0-config"

const domain = (import.meta.env.VITE_AUTH0_DOMAIN || AUTH0_DOMAIN)
  .trim()
  .replace(/^https?:\/\//, "")
  .replace(/\/+$/, "")
const clientId = (import.meta.env.VITE_AUTH0_CLIENT_ID || AUTH0_CLIENT_ID).trim()

export type Account = {
  /** Stable Auth0 ID, e.g. "google-oauth2|1234". Matches users.auth0_sub. */
  id: string
  name: string
  email: string | null
  initials: string
}

type AuthState = {
  /** False until both Auth0 values are filled in (see auth0-config.ts). */
  configured: boolean
  /** False while we check whether this browser is already signed in. */
  ready: boolean
  /** The signed-in person, or null for a guest. */
  account: Account | null
  /** True from the click on "Continue with Google" until the browser leaves. */
  signingIn: boolean
  /** Why the last sign-in attempt failed, in plain words. */
  error: string | null
  signIn: () => void
  signOut: () => void
}

const GUEST_STATE: AuthState = {
  configured: false,
  ready: true,
  account: null,
  signingIn: false,
  error: null,
  signIn: () => {},
  signOut: () => {},
}

const AuthContext = createContext<AuthState>(GUEST_STATE)

export function useAccount(): AuthState {
  return useContext(AuthContext)
}

function initialsOf(name: string): string {
  const words = name.split(/[\s@._-]+/).filter(Boolean)
  const letters =
    words.length > 1 ? words[0][0] + words[words.length - 1][0] : name.slice(0, 2)
  return letters.toUpperCase() || "?"
}

/** Turns Auth0's state into the small AuthState the app uses. */
function Auth0Bridge({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated, user, error, loginWithRedirect, logout } =
    useAuth0()
  const [signingIn, setSigningIn] = useState(false)
  const [startError, setStartError] = useState<string | null>(null)

  // A failed or cancelled sign-in comes back as ?error=... in the address bar.
  // Clear it, so reloading the page doesn't show the same error again.
  useEffect(() => {
    if (error && window.location.search.includes("error=")) {
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [error])

  const state = useMemo<AuthState>(() => {
    const name = user?.name || user?.nickname || user?.email || "Signed in"
    return {
      configured: true,
      ready: !isLoading,
      account:
        isAuthenticated && user?.sub
          ? {
              id: user.sub,
              name,
              email: user.email ?? null,
              initials: initialsOf(name),
            }
          : null,
      signingIn,
      error:
        startError ??
        (error ? "Sign-in didn’t finish. Please try again." : null),
      signIn: () => {
        setSigningIn(true)
        setStartError(null)
        // Straight to Google, skipping Auth0's own login page.
        loginWithRedirect({
          authorizationParams: { connection: "google-oauth2" },
        }).catch(() => {
          setSigningIn(false)
          setStartError("Couldn’t reach the sign-in service. Please try again.")
        })
      },
      signOut: () => {
        void logout({ logoutParams: { returnTo: window.location.origin } })
      },
    }
  }, [
    isLoading,
    isAuthenticated,
    user,
    error,
    signingIn,
    startError,
    loginWithRedirect,
    logout,
  ])

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  // No Auth0 values yet: the app still works, with everyone as a guest.
  if (!domain || !clientId) return <>{children}</>

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: window.location.origin }}
      // Remember the sign-in across page reloads. The default (memory) relies on
      // a hidden check with Auth0 that browsers block for third-party cookies,
      // and that never works with Auth0's shared Google test keys.
      cacheLocation="localstorage"
    >
      <Auth0Bridge>{children}</Auth0Bridge>
    </Auth0Provider>
  )
}

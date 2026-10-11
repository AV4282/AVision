// Sign-in with Auth0. Everything the rest of the app needs is in useAccount().
//
// Signing in is optional: guests can still browse, report and vote. After a
// sign-in, the app gets an access token for the ticket API and sends it to
// POST /me, which checks it and returns the person's AVision user (member).
// Tickets and votes are still saved under the browser's guest ID (see api.ts)
// until they move to the signed-in user.

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react"
import {
  ApiError,
  recordSignIn,
  saveDisplayName,
  uploadAvatar,
  saveOnboarding,
  setAccessTokenSource,
  type Member,
  type OnboardingAnswers,
} from "./api"
import { AUTH0_AUDIENCE, AUTH0_CLIENT_ID, AUTH0_DOMAIN } from "./auth0-config"

const domain = (import.meta.env.VITE_AUTH0_DOMAIN || AUTH0_DOMAIN)
  .trim()
  .replace(/^https?:\/\//, "")
  .replace(/\/+$/, "")
const clientId = (import.meta.env.VITE_AUTH0_CLIENT_ID || AUTH0_CLIENT_ID).trim()
const audience = (import.meta.env.VITE_AUTH0_AUDIENCE || AUTH0_AUDIENCE).trim()

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
  /** Their AVision user, once the ticket API has confirmed the sign-in. */
  member: Member | null
  /** Why the ticket API couldn't confirm the sign-in, in plain words. */
  memberError: string | null
  /** True from the click on "Continue with Google" until the browser leaves. */
  signingIn: boolean
  /** Why the last sign-in attempt failed, in plain words. */
  error: string | null
  signIn: () => void
  signOut: () => void
  /** Saves the onboarding answers to the signed-in person's account. Throws on failure. */
  saveOnboarding: (answers: OnboardingAnswers) => Promise<void>
  /** Changes the signed-in person's display name. Throws on failure. */
  saveName: (name: string) => Promise<void>
  /** Sets the signed-in person's profile picture. Throws on failure. */
  savePicture: (file: File) => Promise<void>
}

const GUEST_STATE: AuthState = {
  configured: false,
  ready: true,
  account: null,
  member: null,
  memberError: null,
  signingIn: false,
  error: null,
  signIn: () => {},
  signOut: () => {},
  saveOnboarding: async () => {
    throw new Error("Sign in to save your answers.")
  },
  saveName: async () => {
    throw new Error("Sign in to change your name.")
  },
  savePicture: async () => {
    throw new Error("Sign in to add a profile picture.")
  },
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

function memberErrorMessage(err: unknown): string {
  // Auth0 couldn't hand out a token without a fresh sign-in, e.g. for a session
  // started before the app asked for API access.
  const code = (err as { error?: string } | null)?.error
  if (code === "login_required" || code === "consent_required" || code === "missing_refresh_token") {
    return "Please sign in again to connect your account."
  }
  if (err instanceof ApiError) return err.message
  return "Couldn’t connect your account to AVision. Try again later."
}

/** Turns Auth0's state into the small AuthState the app uses. */
function Auth0Bridge({ children }: { children: ReactNode }) {
  const {
    isLoading,
    isAuthenticated,
    user,
    error,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0()
  const [signingIn, setSigningIn] = useState(false)
  const [startError, setStartError] = useState<string | null>(null)
  const [member, setMember] = useState<Member | null>(null)
  const [memberError, setMemberError] = useState<string | null>(null)

  // Once signed in, prove it to the ticket API and get the AVision user back.
  const sub = isAuthenticated ? user?.sub : undefined
  const displayName = user?.name || user?.nickname
  const picture = user?.picture
  useEffect(() => {
    setMember(null)
    setMemberError(null)
    setAccessTokenSource(null)
    if (!sub) return
    let cancelled = false
    getAccessTokenSilently({ timeoutInSeconds: 10 })
      .then((token) => {
        if (!token) throw new Error("Auth0 returned no access token")
        return recordSignIn(token, { displayName, avatarUrl: picture })
      })
      .then((result) => {
        if (cancelled) return
        // From now on, tickets and votes are saved under this account.
        setAccessTokenSource(
          async () => (await getAccessTokenSilently({ timeoutInSeconds: 10 })) || null,
        )
        setMember(result)
      })
      .catch((err: unknown) => {
        if (!cancelled) setMemberError(memberErrorMessage(err))
      })
    return () => {
      cancelled = true
      setAccessTokenSource(null)
    }
  }, [sub, displayName, picture, getAccessTokenSilently])

  // A failed or cancelled sign-in comes back as ?error=... in the address bar.
  // Clear it, so reloading the page doesn't show the same error again.
  useEffect(() => {
    if (error && window.location.search.includes("error=")) {
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [error])

  const state = useMemo<AuthState>(() => {
    // A name saved on the profile wins over the one from Google.
    const name =
      member?.displayName || user?.name || user?.nickname || user?.email || "Signed in"
    const freshToken = async () => {
      const token = await getAccessTokenSilently({ timeoutInSeconds: 10 }).catch(
        (err: unknown) => {
          throw new Error(memberErrorMessage(err))
        },
      )
      if (!token) throw new Error("Please sign in again to save your changes.")
      return token
    }
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
      member,
      memberError,
      signingIn,
      error:
        startError ??
        (error
          ? // Auth0's own reason (its error_description), e.g. a setup problem
            // in the dashboard, so it can be fixed without guessing.
            `Sign-in didn’t finish${error.message ? `: ${error.message}` : "."} Please try again.`
          : null),
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
      saveOnboarding: async (answers) => {
        setMember(await saveOnboarding(await freshToken(), answers))
      },
      saveName: async (name) => {
        setMember(await saveDisplayName(await freshToken(), name))
      },
      savePicture: async (file) => {
        setMember(await uploadAvatar(await freshToken(), file))
      },
    }
  }, [
    isLoading,
    isAuthenticated,
    user,
    error,
    member,
    memberError,
    signingIn,
    startError,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
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
      authorizationParams={{
        redirect_uri: window.location.origin,
        // Ask for an access token the ticket API accepts (checked in api/auth.py).
        ...(audience ? { audience } : {}),
      }}
      // Remember the sign-in across page reloads. The default (memory) relies on
      // a hidden check with Auth0 that browsers block for third-party cookies,
      // and that never works with Auth0's shared Google test keys.
      cacheLocation="localstorage"
    >
      <Auth0Bridge>{children}</Auth0Bridge>
    </Auth0Provider>
  )
}

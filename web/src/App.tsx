import { createPortal } from "react-dom"
import {
  Fragment,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react"
import {
  ArrowRight,
  Bell,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Eye,
  HelpCircle,
  Info,
  Home,
  List,
  LogIn,
  LogOut,
  Map,
  Maximize2,
  MapPin,
  Menu,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  ThumbsUp,
  User,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  RefreshCw,
} from "lucide-react"
import {
  clearNotices,
  closeTicket,
  resetCounts,
  serverVersion,
  deleteTicket,
  followUpReport,
  campusOutlines,
  getTicket,
  linkedTicket,
  listNotices,
  listTickets,
  markNoticesRead,
  OWNERS,
  schoolOwner,
  photoLink,
  PLACEHOLDER_PHOTO,
  vote,
  watchLive,
  type Member,
  type Notice,
  type ScreeningProblem,
  type Owner,
  type Status,
  type Ticket,
  type VoteChoice,
} from "./api"
import { useAccount } from "./auth"
import PhotoViewer from "./PhotoViewer"
import MoreInfoDialog from "./MoreInfoDialog"
import MoveTicket from "./MoveTicket"
import Backdrop from "./Backdrop"
import AdSlot, { AD_SLOTS } from "./AdSlot"
import ReportForm from "./ReportForm"
import ScreeningNotice from "./ScreeningNotice"
import OnboardingQuestions from "./OnboardingQuestions"
import ReportReady, { type ReportToSend } from "./ReportReady"
import { ThemeToggle } from "./theme"
import PrivacyDialog from "./PrivacyDialog"
import NotificationPreferencesDialog from "./NotificationPreferencesDialog"
import { useNotificationPreferences } from "./notification-preferences"
import ResourcesDialog from "./ResourcesDialog"
import Brand from "./Brand"
import SiteFooter from "./SiteFooter"

import { mapOwner, mapStatus, ticketMarker } from "./ticket-map"
import { WELCOME_PHOTOS } from "./welcome-photos"
import type { AvisionMapCampus, AvisionMapOwner, AvisionMapStatus } from "./components/avision-map/types"
const AvisionMap = lazy(() => import("./components/avision-map/AvisionMap"))
type View = "onboarding" | "map" | "issues" | "profile"

type TicketsState = {
  tickets: Ticket[]
  loading: boolean
  error: string | null
  reload: () => void
  /** Swap in a fresh copy of one ticket, e.g. after a vote. */
  replaceTicket: (ticket: Ticket) => void
  /** Put a just-created ticket at the top, matching the API's newest-first order. */
  addTicket: (ticket: Ticket) => void
  /** Take in a ticket the server says changed: updated in place, or added at the top if new. */
  upsertTicket: (ticket: Ticket) => void
  /** Drop a ticket that was just deleted. */
  removeTicket: (id: string) => void
}

/** Loads tickets from the API once, with a reload for retries and later refreshes. */
function useTickets(): TicketsState {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    listTickets()
      .then((rows) => {
        if (cancelled) return
        setTickets(rows)
        setError(null)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Could not load tickets")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [version])

  const reload = useCallback(() => setVersion((v) => v + 1), [])
  const replaceTicket = useCallback((updated: Ticket) => {
    setTickets((current) =>
      current.map((ticket) => (ticket.id === updated.id ? updated : ticket)),
    )
  }, [])
  const addTicket = useCallback((created: Ticket) => {
    setTickets((current) => [
      created,
      ...current.filter((ticket) => ticket.id !== created.id),
    ])
  }, [])
  const upsertTicket = useCallback((fresh: Ticket) => {
    setTickets((current) =>
      current.some((ticket) => ticket.id === fresh.id)
        ? current.map((ticket) => (ticket.id === fresh.id ? fresh : ticket))
        : [fresh, ...current],
    )
  }, [])
  const removeTicket = useCallback((id: string) => {
    setTickets((current) => current.filter((ticket) => ticket.id !== id))
  }, [])
  return { tickets, loading, error, reload, replaceTicket, addTicket, upsertTicket, removeTicket }
}

// Several changes to one ticket in a row (two people voting at once) are
// fetched once, this long after the first.
const LIVE_SETTLE_MS = 150

/**
 * Keeps the tickets up to date while the page is open: the server says which
 * ticket changed (see watchLive), and this fetches that one ticket as the
 * viewer sees it. After a dropped connection, everything is reloaded.
 *
 * Returns whether the live connection is up, and a number that goes up each
 * time the bell should check for news (a change to a ticket the viewer posted
 * or voted on).
 */
// How often to ask the server which version it is running, besides right
// after the live connection comes back (a deploy restarts the server, so that
// happens within seconds of an update).
const VERSION_CHECK_MS = 5 * 60_000
// How long the "updated" notice shows before the page refreshes itself.
const REFRESH_AFTER_MS = 10_000

/**
 * Tells the person when the developers have pushed an update, and refreshes
 * the page to get it. The refresh waits while a form or box is open, so
 * nothing half-written is lost, and anyone can press Refresh now or Later.
 */
function useUpdateNotice(connected: boolean): { updated: boolean; refresh: () => void; later: () => void } {
  const [updated, setUpdated] = useState(false)
  const loadedVersion = useRef<string | null>(null)
  const dismissed = useRef(false)

  const check = useCallback(async () => {
    const now = await serverVersion()
    if (!now) return
    if (loadedVersion.current === null) loadedVersion.current = now
    else if (now !== loadedVersion.current && !dismissed.current) setUpdated(true)
  }, [])

  useEffect(() => {
    check()
    const timer = window.setInterval(check, VERSION_CHECK_MS)
    const onShow = () => {
      if (document.visibilityState === "visible") check()
    }
    document.addEventListener("visibilitychange", onShow)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener("visibilitychange", onShow)
    }
  }, [check])

  // The live connection coming back is usually the server restarting after a deploy.
  const wasConnected = useRef(connected)
  useEffect(() => {
    if (connected && !wasConnected.current) check()
    wasConnected.current = connected
  }, [connected, check])

  const refresh = useCallback(() => window.location.reload(), [])
  const later = useCallback(() => {
    dismissed.current = true
    setUpdated(false)
  }, [])

  // Refresh on its own after a moment, once nothing is open on top of the page.
  useEffect(() => {
    if (!updated) return
    const started = Date.now()
    const timer = window.setInterval(() => {
      const busy = document.querySelector(".modal-backdrop, dialog[open], .photo-viewer")
      if (Date.now() - started >= REFRESH_AFTER_MS && !busy) window.location.reload()
    }, 1000)
    return () => window.clearInterval(timer)
  }, [updated])

  return { updated, refresh, later }
}

function UpdateNotice({ onRefresh, onLater }: { onRefresh: () => void; onLater: () => void }) {
  return (
    <div className="update-notice" role="status" aria-live="polite">
      <RefreshCw size={16} aria-hidden="true" />
      <span>AVision was updated. The page will refresh in a moment to get the latest.</span>
      <button type="button" className="primary-button" onClick={onRefresh}>
        Refresh now
      </button>
      <button type="button" className="text-button" onClick={onLater}>
        Later
      </button>
    </div>
  )
}

function useLiveTickets(state: TicketsState): { connected: boolean; bellNudge: number } {
  const [connected, setConnected] = useState(false)
  const [bellNudge, setBellNudge] = useState(0)
  const ticketsNow = useRef(state.tickets)
  ticketsNow.current = state.tickets
  const { upsertTicket, removeTicket, reload } = state

  useEffect(() => {
    // Timers by ticket ID. (A plain object: "Map" in this file is the map icon.)
    const waiting: Record<string, number> = {}
    const stop = watchLive({
      onEvent(event) {
        const known = ticketsNow.current.find((ticket) => ticket.id === event.id)
        const concernsMe = !!known && (known.mine || known.myVote !== null)
        if (concernsMe) setBellNudge((count) => count + 1)
        window.clearTimeout(waiting[event.id])
        delete waiting[event.id]
        if (event.type === "ticket_deleted") {
          removeTicket(event.id)
          return
        }
        waiting[event.id] = window.setTimeout(() => {
          delete waiting[event.id]
          getTicket(event.id)
            .then((fresh) => {
              if (!fresh) return removeTicket(event.id)
              upsertTicket(fresh)
              // A ticket this page hadn't loaded yet can still be the viewer's own.
              if (!concernsMe && (fresh.mine || fresh.myVote !== null)) setBellNudge((count) => count + 1)
            })
            .catch(() => {}) // shown as it was; the next change or reload fixes it
        }, LIVE_SETTLE_MS)
      },
      onReconnect() {
        reload()
        setBellNudge((count) => count + 1)
      },
      onStatus: setConnected,
    })
    return () => {
      stop()
      Object.values(waiting).forEach((timer) => window.clearTimeout(timer))
    }
  }, [upsertTicket, removeTicket, reload])

  return { connected, bellNudge }
}

/** Loading, error, and empty states shared by the map and the issues list. */
function TicketsNotice({
  state,
  emptyTitle,
  emptyText,
}: {
  state: TicketsState
  emptyTitle: string
  emptyText: string
}) {
  if (state.loading && state.tickets.length === 0) {
    return (
      <div className="empty-state" role="status">
        <Clock3 size={24} />
        <h3>Loading issues…</h3>
      </div>
    )
  }
  if (state.error) {
    return (
      <div className="empty-state" role="alert">
        <X size={24} />
        <h3>Couldn’t load issues</h3>
        <p>{state.error}</p>
        <button className="text-button" onClick={state.reload}>
          Try again
        </button>
      </div>
    )
  }
  if (state.tickets.length === 0) {
    return (
      <div className="empty-state">
        <MapPin size={24} />
        <h3>{emptyTitle}</h3>
        <p>{emptyText}</p>
      </div>
    )
  }
  return null
}

const ownerColors: Record<Ticket["owner"], string> = {
  "City of Atlanta": "owner-city",
  "GSU Facilities": "owner-gsu",
  "Georgia Tech": "owner-gt",
  MARTA: "owner-marta",
  GDOT: "owner-gdot",
}

/**
 * What goes inside an avatar circle: the person's profile picture when they
 * have one (uploaded here, or from their Google account), otherwise their
 * initials. Falls back to the initials if the picture won't load.
 */
/**
 * What kind of member someone is, as shown under their name: "Admin" for an
 * admin (granted with api/admin.py), otherwise "Community member". One place,
 * so the sidebar and the profile always agree.
 */
function memberLabel(signedIn: boolean, member: Member | null): string {
  if (!signedIn) return "Not signed in"
  if (member?.role === "admin") return "Admin"
  if (member?.role === "facilities_staff") return "Facilities staff"
  return "Community member"
}

function AvatarFace({ member, initials }: { member: Member | null; initials: string }) {
  const picture = photoLink(member?.avatarUrl ?? null)
  const [broken, setBroken] = useState<string | null>(null)
  if (!picture || broken === picture) return <>{initials}</>
  return (
    <img
      className="avatar-photo"
      src={picture}
      alt=""
      // Google's picture links refuse requests that say which site they came from.
      referrerPolicy="no-referrer"
      onError={() => setBroken(picture)}
    />
  )
}

function StatusPill({ status }: { status: Status }) {
  return (
    // Prefixed so a status never becomes a Tailwind utility class ("fixed" = position: fixed).
    <span
      className={`status-pill status-${status.toLowerCase().replace(" ", "-")}`}
    >
      <span aria-hidden="true">
        {status === "Open" ? "!" : status === "Fixed" ? "✓" : "◷"}
      </span>
      {status}
    </span>
  )
}

// How long each photo stays before the next one fades in.
const WELCOME_PHOTO_SECONDS = 8

/**
 * The slow slideshow behind the welcome text. One photo at a time, each fading
 * into the next while drifting slightly. Purely decoration, so screen readers
 * skip the pictures; the credit line under them is real text.
 */
function WelcomePhotos() {
  const [index, setIndex] = useState(0)
  const count = WELCOME_PHOTOS.length
  useEffect(() => {
    // People who asked their device for less motion keep the first photo.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const timer = window.setInterval(
      () => setIndex((shown) => (shown + 1) % count),
      WELCOME_PHOTO_SECONDS * 1000,
    )
    return () => window.clearInterval(timer)
  }, [count])
  const photo = WELCOME_PHOTOS[index]

  return (
    <>
      <div className="story-photos" aria-hidden="true">
        {WELCOME_PHOTOS.map((each, position) => {
          // Only the photo on screen and its neighbours are loaded: the next one
          // so it is ready to fade in, the last one so it can fade out.
          const near =
            position === index ||
            position === (index + 1) % count ||
            position === (index + count - 1) % count
          return near ? (
            <img
              key={each.file}
              src={`${import.meta.env.BASE_URL}welcome/${each.file}`}
              className={position === index ? "shown" : undefined}
              alt=""
              decoding="async"
            />
          ) : null
        })}
      </div>
      <p className="story-photo-credit">
        {photo.label} · Photo:{" "}
        <a href={photo.link} target="_blank" rel="noreferrer">
          {photo.by}
        </a>
        ,{" "}
        {"termsLink" in photo ? (
          <a href={photo.termsLink} target="_blank" rel="noreferrer">
            {photo.terms}
          </a>
        ) : (
          photo.terms
        )}
      </p>
    </>
  )
}

/** What the sample ticket card on the welcome screen shows. */
type StoryExample = {
  /** Changes when the card shows something else, so its little story replays. */
  key: string
  photo: string
  alt: string
  /** The tag on the photo. */
  tag: string
  label: string
  headline: string
  place: string
  /** The real ticket behind the card, when it is showing one. */
  ticketId?: string
}

/**
 * Real tickets for the welcome screen's cards: the newest ones that have a
 * photo and aren't fixed yet, from different departments when possible. They
 * come from the same live list as the map, so a ticket posted right now shows
 * up here on its own.
 */
function liveExamples(tickets: Ticket[], count: number): StoryExample[] {
  const candidates = tickets.filter((ticket) => ticket.images.length > 0 && ticket.status !== "Fixed")
  const picked: Ticket[] = []
  for (const ticket of candidates) {
    if (picked.length === count) break
    if (!picked.some((each) => each.owner === ticket.owner)) picked.push(ticket)
  }
  // Not enough different departments: fill up with the next newest.
  for (const ticket of candidates) {
    if (picked.length === count) break
    if (!picked.includes(ticket)) picked.push(ticket)
  }
  return picked.map((ticket) => ({
    key: ticket.id,
    photo: ticket.image,
    alt: `Photo of: ${ticket.title}`,
    tag: ticket.status,
    label: `ROUTED TO ${ticket.owner.toUpperCase()}`,
    headline: ticket.title,
    place: `${ticket.address} · ${ticket.firstReported.toLowerCase()}`,
    ticketId: ticket.id,
  }))
}

function Onboarding({
  tickets,
  onContinue,
  onOpenTicket,
}: {
  /** The live ticket list, for the sample cards. Empty until it has loaded. */
  tickets: Ticket[]
  onContinue: () => void
  /** Goes into the app as a guest with this ticket open on the map. */
  onOpenTicket: (ticketId: string) => void
}) {
  const auth = useAccount()
  const [step, setStep] = useState(0)

  const panels = [
    {
      eyebrow: "See it. Share it. Fix it.",
      title: "A more accessible city starts with you.",
      body: "Turn everyday accessibility barriers into mapped, trackable tickets—and help your community follow them through to a fix.",
      // Shown only when there is no real ticket to show (none yet, or the
      // server can't be reached).
      example: {
        key: "sample-1",
        photo: PLACEHOLDER_PHOTO,
        alt: "City sidewalk beside a street",
        tag: "Possible barrier",
        label: "ROUTED TO",
        headline: "City of Atlanta",
        place: "Courtland St NE",
      } as StoryExample,
    },
    {
      eyebrow: "One photo is enough",
      title: "Report barriers in a few simple steps.",
      body: "Upload a photo, confirm the location, and review the possible barrier. AVision routes your ticket to the right public agency.",
      example: {
        key: "sample-2",
        photo: `${import.meta.env.BASE_URL}welcome/gsu-library-plaza.jpg`,
        alt: "A brick plaza between buildings on Georgia State's campus",
        tag: "Possible hazard",
        label: "ROUTED TO",
        headline: "GSU Facilities",
        place: "Library Plaza",
      } as StoryExample,
    },
  ]
  const panel = panels[step]
  // Each introduction shows a real ticket from the map when there is one, and
  // its made-up sample otherwise.
  const live = useMemo(() => liveExamples(tickets, panels.length), [tickets, panels.length])
  const example = live[step] ?? panel.example
  // After the card first changes (another introduction, or a newer ticket
  // arriving), it swaps in quickly instead of replaying its slow first entrance.
  const [swapped, setSwapped] = useState(false)
  const firstCard = useRef(example.key)
  useEffect(() => {
    if (example.key !== firstCard.current) setSwapped(true)
  }, [example.key])
  const showStep = (next: number) => {
    setSwapped(true)
    setStep(next)
  }
  const openExample = example.ticketId ? () => onOpenTicket(example.ticketId!) : undefined

  return (
    <main className="onboarding-shell">
      <header className="onboarding-header">
        <Brand />
        <div className="onboarding-actions">
          <ThemeToggle />
          <button className="text-button" onClick={onContinue}>
            Explore as guest <ArrowRight size={16} />
          </button>
        </div>
      </header>

      <section className="onboarding-grid">
        <div className="onboarding-story">
          <WelcomePhotos />
          <div className="story-glow one" />
          <div className="story-glow two" />
          <div className="story-map-lines" />
          {/* The key replays the entrance animation when the panel changes. */}
          <div className="story-content" key={step}>
            <p className="eyebrow light">{panel.eyebrow}</p>
            {/* Each word is its own piece so the title can come in word by word.
                Screen readers get the whole sentence at once. */}
            <h1>
              <span className="sr-only">{panel.title}</span>
              <span aria-hidden="true">
                {panel.title.split(" ").map((word, index) => (
                  <Fragment key={index}>
                    <span
                      className="story-word"
                      style={{ animationDelay: `${320 + index * 65}ms` }}
                    >
                      {word}
                    </span>{" "}
                  </Fragment>
                ))}
              </span>
            </h1>
            <p className="story-copy">{panel.body}</p>
          </div>
          {/* Each introduction has its own ticket card: a real one from the map
              when there is one. The keys make the photo scan, the tag and the
              routing play again whenever the card shows a different ticket. */}
          <div
            className={`story-ticket-card${swapped ? " swapped" : ""}${openExample ? " live" : ""}`}
            {...(openExample
              ? {
                  role: "button",
                  tabIndex: 0,
                  "aria-label": `Live ticket: ${example.headline}. Open it on the map.`,
                  onClick: openExample,
                  onKeyDown: (event: ReactKeyboardEvent) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      openExample()
                    }
                  },
                }
              : {})}
          >
            <div className="mini-photo" key={`photo-${example.key}`}>
              <img src={example.photo} alt={example.alt} />
              <span className="ai-badge">
                {openExample ? <i className="live-dot" aria-hidden="true" /> : <Sparkles size={12} />}{" "}
                {example.tag}
              </span>
            </div>
            <div key={`text-${example.key}`}>
              <span className="mini-label">
                {openExample && <em>LIVE</em>}
                {example.label}
              </span>
              <strong>{example.headline}</strong>
              <span className="mini-address">
                <MapPin size={13} /> <span>{example.place}</span>
              </span>
            </div>
            <CheckCircle2 className="mini-check" size={22} key={`check-${example.key}`} />
          </div>
          <div className="story-controls">
            <div className="story-dots">
              {panels.map((_, index) => (
                <button
                  aria-label={`Show introduction ${index + 1}`}
                  className={index === step ? "story-dot active" : "story-dot"}
                  key={index}
                  onClick={() => showStep(index)}
                />
              ))}
            </div>
            <button
              className="circle-control"
              onClick={() => showStep(step === panels.length - 1 ? 0 : step + 1)}
              aria-label="Next introduction"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="auth-panel">
          <div className="auth-card">
            <div className="auth-icon">
              <ShieldCheck size={27} />
            </div>
            <p className="eyebrow">WELCOME TO AVISION</p>
            <h2>Make your block easier to navigate.</h2>
            <p className="auth-copy">
              Sign in to post tickets, vote on reported issues, and track
              progress in your neighborhood.
            </p>
            <button
              className="google-button"
              onClick={auth.signIn}
              disabled={!auth.configured || auth.signingIn}
            >
              <span className="google-g">G</span>
              {auth.signingIn ? "Opening Google…" : "Continue with Google"}
              <ArrowRight size={17} />
            </button>
            {auth.error && (
              <p className="auth-message auth-error" role="alert">
                {auth.error}
              </p>
            )}
            {!auth.configured && (
              <p className="auth-message">
                Sign-in isn’t set up yet. You can continue without an account.
              </p>
            )}
            <p className="privacy-note">
              <ShieldCheck size={14} />
              Secure sign-in powered by Auth0. We never store your password.
            </p>
            <div className="auth-divider">
              <span />
              <small>OR</small>
              <span />
            </div>
            <button className="guest-button" onClick={onContinue}>
              Continue without an account
            </button>
            <p className="guest-help">
              You can browse and report without an account. Voting requires sign-in.
            </p>
          </div>
          <SiteFooter />
        </div>
      </section>
    </main>
  )
}

function Sidebar({
  view,
  setView,
  open,
  onClose,
  openCount,
  onReport,
  onResources,
  onMoreInfo,
}: {
  view: View
  setView: (view: View) => void
  open: boolean
  onClose: () => void
  openCount: number
  onReport: () => void
  onResources: (opener: HTMLButtonElement) => void
  /** Opens "More information" (where the map's data comes from). */
  onMoreInfo: (opener: HTMLButtonElement) => void
}) {
  const { account, member, signOut } = useAccount()
  const navigate = (next: View) => {
    setView(next)
    onClose()
  }
  // The small menu that opens from the account row at the bottom.
  const [accountMenu, setAccountMenu] = useState(false)
  const accountArea = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!accountMenu) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAccountMenu(false)
    }
    const onPress = (event: MouseEvent) => {
      if (!accountArea.current?.contains(event.target as Node)) setAccountMenu(false)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("mousedown", onPress)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("mousedown", onPress)
    }
  }, [accountMenu])

  return (
    <>
      {open && (
        <button
          className="mobile-overlay"
          onClick={onClose}
          aria-label="Close menu"
        />
      )}
      <aside className={open ? "sidebar open" : "sidebar"}>
        <div className="sidebar-top">
          <Brand compact />
          <button
            className="mobile-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>
        <nav className="main-nav" aria-label="Main navigation">
          <button
            className={view === "map" ? "nav-item active" : "nav-item"}
            onClick={() => navigate("map")}
          >
            <Map size={19} /> Map view
          </button>
          <button
            className={view === "issues" ? "nav-item active" : "nav-item"}
            onClick={() => navigate("issues")}
          >
            <List size={19} /> Issues
            {openCount > 0 && <span className="nav-count">{openCount}</span>}
          </button>
          <button
            className={view === "profile" ? "nav-item active" : "nav-item"}
            onClick={() => navigate("profile")}
          >
            <User size={19} /> My profile
          </button>
        </nav>
        <div className="report-card">
          <strong>Spot a barrier?</strong>
          <p>Upload a photo and we’ll help route it.</p>
          <button
            onClick={() => {
              onClose()
              onReport()
            }}
          >
            <Plus size={16} /> Report an issue
          </button>
        </div>
        <AdSlot slot={AD_SLOTS.sidebar} format="rectangle" className="ad-sidebar" />
        <nav className="support-nav">
          <button
            type="button"
            data-resources-opener
            aria-haspopup="dialog"
            onClick={(event) => {
              onClose()
              onResources(event.currentTarget)
            }}
          >
            <HelpCircle size={18} /> Help & resources
          </button>
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={(event) => {
              onClose()
              onMoreInfo(event.currentTarget)
            }}
          >
            <Info size={18} /> More information
          </button>
        </nav>
        <div className="sidebar-account" ref={accountArea}>
          {accountMenu && (
            <div className="account-menu" role="menu" aria-label="Account">
              <button
                role="menuitem"
                onClick={() => {
                  setAccountMenu(false)
                  navigate("profile")
                }}
              >
                <User size={16} /> My profile
              </button>
              {account ? (
                <button
                  role="menuitem"
                  className="leaving"
                  onClick={() => {
                    setAccountMenu(false)
                    signOut()
                  }}
                >
                  <LogOut size={16} /> Sign out
                </button>
              ) : (
                <button
                  role="menuitem"
                  onClick={() => {
                    setAccountMenu(false)
                    navigate("onboarding") // the welcome screen, where sign-in is
                  }}
                >
                  <LogIn size={16} /> Sign in
                </button>
              )}
            </div>
          )}
          <button
            className="sidebar-user"
            onClick={() => setAccountMenu((shown) => !shown)}
            aria-haspopup="menu"
            aria-expanded={accountMenu}
            aria-label={`Account menu for ${account?.name ?? "Guest"}`}
          >
            <span className="avatar">
              <AvatarFace member={member} initials={account?.initials ?? "G"} />
            </span>
            <span className="who">
              <strong>{account?.name ?? "Guest"}</strong>
              <small>{memberLabel(!!account, member)}</small>
            </span>
            <ChevronDown size={16} className={accountMenu ? "turned" : undefined} />
          </button>
        </div>
      </aside>
    </>
  )
}

// How often the bell asks the server for news while the page is in view.
const NOTICE_CHECK_MS = 30_000

function noticeText(notice: Notice): string {
  switch (notice.kind) {
    case "still_there":
      return "Someone confirmed your ticket is still there."
    case "marked_fixed":
      return "Someone marked your ticket as fixed."
    case "likely_fixed":
      return notice.yours
        ? "Your ticket is now marked likely fixed."
        : "A ticket you voted on is now marked likely fixed."
    case "fixed":
      return notice.yours
        ? "Your ticket was marked fixed by an admin."
        : "A ticket you voted on was marked fixed by an admin."
    case "reported":
      return "Someone else sent a report about your ticket."
    case "moved":
      return notice.yours
        ? "Your ticket was moved to a new spot by an admin."
        : "A ticket you voted on was moved to a new spot on the map."
    case "rerouted":
      return notice.yours
        ? "Your ticket was sent to a different department by an admin."
        : "A ticket you voted on was sent to a different department."
    case "edited":
      return notice.yours
        ? "Your ticket's details or photos were changed by an admin."
        : "A ticket you voted on had its details or photos changed."
    case "reopened":
      return "Your ticket was reopened. Someone says it is still there."
    case "removed":
      return notice.yours
        ? "Your ticket was removed by an admin."
        : "A ticket you voted on was removed."
    default: // a kind added to the server after this page was loaded
      return notice.yours ? "Your ticket was updated." : "A ticket you voted on was updated."
  }
}

/**
 * The bell in the header. Lists what happened to tickets the viewer posted or
 * voted on, with a count of the ones they haven't seen. Works for guests too:
 * their tickets and votes belong to this browser.
 */
function NotificationBell({
  onOpenTicket,
  onNews,
  nudge,
}: {
  onOpenTicket: (ticketId: string) => void
  /** Called when something new arrives, so the page can refresh its tickets. */
  onNews: () => void
  /** Goes up when a live update says there may be news, so the bell checks right away. */
  nudge: number
}) {
  const { account, member } = useAccount()
  const { inApp, myReports } = useNotificationPreferences(account?.id ?? null)
  const [notices, setNotices] = useState<Notice[]>([])
  const [unread, setUnread] = useState(0)
  const [open, setOpen] = useState(false)
  // The ones that were new when the list was opened. They keep their "new" look until it closes.
  const [fresh, setFresh] = useState<ReadonlySet<string>>(new Set())
  const wrap = useRef<HTMLDivElement>(null)
  const lastUnread = useRef(0)
  const refreshNotices = useRef<() => void>(() => {})
  const news = useRef(onNews)
  news.current = onNews
  const visibleNotices = inApp ? notices.filter((notice) => myReports || !notice.yours) : []
  const visibleUnread = !inApp ? 0 : myReports ? unread : visibleNotices.filter((notice) => !notice.read).length

  // Check now, on a timer, and whenever the person comes back to the page.
  // Signing in changes whose notifications these are, so that checks again too.
  // Preferences hide notices in the bell; polling still refreshes ticket status.
  const memberId = member?.id
  const accountId = account?.id
  useEffect(() => {
    let cancelled = false
    setNotices([])
    setUnread(0)
    lastUnread.current = 0
    const check = () => {
      listNotices()
        .then((found) => {
          if (cancelled) return
          setNotices(found.items)
          setUnread(found.unread)
          if (found.unread > lastUnread.current) news.current()
          lastUnread.current = found.unread
        })
        .catch(() => {}) // no news is fine; the next check tries again
    }
    refreshNotices.current = check
    check()
    const whenSeen = () => {
      if (document.visibilityState === "visible") check()
    }
    const timer = window.setInterval(whenSeen, NOTICE_CHECK_MS)
    document.addEventListener("visibilitychange", whenSeen)
    window.addEventListener("focus", whenSeen)
    return () => {
      cancelled = true
      refreshNotices.current = () => {}
      window.clearInterval(timer)
      document.removeEventListener("visibilitychange", whenSeen)
      window.removeEventListener("focus", whenSeen)
    }
  }, [accountId, memberId])

  useEffect(() => {
    if (nudge > 0) refreshNotices.current()
  }, [nudge])

  const close = useCallback(() => {
    setOpen(false)
    setFresh(new Set())
  }, [])

  useEffect(close, [close, accountId, memberId, inApp, myReports])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close()
    }
    const onPress = (event: MouseEvent) => {
      if (!wrap.current?.contains(event.target as Node)) close()
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("mousedown", onPress)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("mousedown", onPress)
    }
  }, [open, close])

  function toggle() {
    if (open) {
      close()
      return
    }
    // Opening the list is seeing it: the count clears here and on the server.
    const unseen = visibleNotices.filter((notice) => !notice.read).map((notice) => notice.id)
    setFresh(new Set(unseen))
    setOpen(true)
    if (unseen.length > 0) {
      setUnread((count) => Math.max(0, count - unseen.length))
      lastUnread.current = Math.max(0, lastUnread.current - unseen.length)
      setNotices((list) => list.map((notice) => unseen.includes(notice.id) ? { ...notice, read: true } : notice))
      markNoticesRead(unseen).catch(() => {})
    }
  }

  // Clearing takes effect on screen at once. If the server didn't get it, the
  // next check brings back whatever is still there.
  const checkAgain = () => refreshNotices.current()

  // "Clear all" clears what is listed. Notifications hidden by the person's
  // preferences are not on screen, so they are left alone.
  function clearAll() {
    const gone = new Set(visibleNotices.map((notice) => notice.id))
    const goneUnread = visibleNotices.filter((notice) => !notice.read).length
    const nothingHidden = gone.size === notices.length
    setNotices((list) => list.filter((notice) => !gone.has(notice.id)))
    setFresh(new Set())
    setUnread((count) => Math.max(0, count - goneUnread))
    lastUnread.current = Math.max(0, lastUnread.current - goneUnread)
    // With nothing hidden, the server is told "all", which also covers older
    // ones beyond the list shown here.
    clearNotices(nothingHidden ? undefined : [...gone]).then(checkAgain, checkAgain)
  }

  function clearOne(notice: Notice) {
    setNotices((list) => list.filter((each) => each.id !== notice.id))
    if (!notice.read) {
      setUnread((count) => Math.max(0, count - 1))
      lastUnread.current = Math.max(0, lastUnread.current - 1)
    }
    clearNotices([notice.id]).then(checkAgain, checkAgain)
  }

  return (
    <div className="notice-wrap" ref={wrap}>
      <button
        className="icon-button"
        onClick={toggle}
        aria-label={visibleUnread > 0 ? `Notifications, ${visibleUnread} new` : "Notifications"}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Bell size={19} />
        {visibleUnread > 0 && (
          <span className="notice-count" aria-hidden="true">
            {visibleUnread > 9 ? "9+" : visibleUnread}
          </span>
        )}
      </button>
      {open && (
        <section className="notice-panel" aria-label="Notifications">
          <div className="notice-head">
            <h2>Notifications</h2>
            {visibleNotices.length > 0 && (
              <button type="button" className="notice-clear" onClick={clearAll}>
                Clear all
              </button>
            )}
          </div>
          {!inApp ? (
            <p className="notice-empty">In-app notifications are off in this browser. Turn them on in My profile → Notification preferences.</p>
          ) : visibleNotices.length === 0 ? (
            <p className="notice-empty">
              {myReports
                ? "Nothing yet. You’ll see it here when someone votes on a ticket you posted, or when a ticket you voted on is marked fixed or removed."
                : "Nothing yet. Updates to tickets you posted are hidden. You’ll see updates here when a ticket you voted on is marked fixed or removed."}
            </p>
          ) : (
            <ul>
              {visibleNotices.map((notice) => {
                const isNew = fresh.has(notice.id) || !notice.read
                const body = (
                  <>
                    <strong>{notice.ticketTitle}</strong>
                    <span>{noticeText(notice)}</span>
                    <small>
                      {isNew && <em>New</em>}
                      {notice.time}
                    </small>
                  </>
                )
                const ticketId = notice.ticketId
                return (
                  <li key={notice.id} className={isNew ? "new" : undefined}>
                    {ticketId ? (
                      <button
                        type="button"
                        className="notice-row"
                        onClick={() => {
                          close()
                          onOpenTicket(ticketId)
                        }}
                      >
                        {body}
                      </button>
                    ) : (
                      <div className="notice-row">{body}</div>
                    )}
                    <button
                      type="button"
                      className="notice-dismiss"
                      onClick={() => clearOne(notice)}
                      aria-label={`Clear this notification about ${notice.ticketTitle}`}
                      title="Clear"
                    >
                      <X size={14} />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      )}
    </div>
  )
}

function AppHeader({
  title,
  subtitle,
  onMenu,
  setView,
  onOpenTicket,
  onNews,
  bellNudge,
}: {
  title: string
  subtitle: string
  onMenu: (opener: HTMLButtonElement) => void
  setView: (view: View) => void
  onOpenTicket: (ticketId: string) => void
  onNews: () => void
  bellNudge: number
}) {
  const { account, member } = useAccount()
  return (
    <header className="app-header">
      <div className="header-title">
        <button className="menu-button" data-menu-opener onClick={(event) => onMenu(event.currentTarget)} aria-label="Open menu">
          <Menu size={21} />
        </button>
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="header-actions">
        <ThemeToggle />
        <NotificationBell onOpenTicket={onOpenTicket} onNews={onNews} nudge={bellNudge} />
        <button
          className="header-avatar"
          onClick={() => setView("profile")}
          aria-label="My profile"
        >
          <AvatarFace member={member} initials={account?.initials ?? "G"} />
        </button>
      </div>
    </header>
  )
}

function TicketDetail({
  ticket,
  onClose,
  onTicketChange,
  onViewFull,
  onDeleted,
}: {
  ticket: Ticket
  onClose: () => void
  onTicketChange: (ticket: Ticket) => void
  /** Opens the ticket on its own. Left out where the ticket is already open that way. */
  onViewFull?: () => void
  /** Called after the poster deletes this ticket. */
  onDeleted: (id: string) => void
}) {
  const [pending, setPending] = useState<VoteChoice | null>(null)
  const [voteError, setVoteError] = useState<string | null>(null)
  // Deleting asks once more first, right where the button was.
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  // Admins (granted with api/admin.py) can delete any ticket and mark it fixed.
  const isAdmin = useAccount().member?.role === "admin"
  // A ticket marked fixed takes no more votes, except an admin's (which can reopen it).
  const votingClosed = ticket.status === "Fixed" && !isAdmin
  const [closing, setClosing] = useState(false)
  const [closeError, setCloseError] = useState<string | null>(null)

  async function markFixed() {
    if (closing) return
    setClosing(true)
    setCloseError(null)
    try {
      onTicketChange(await closeTicket(ticket.id))
    } catch (err) {
      setCloseError(err instanceof Error ? err.message : "Couldn’t mark the ticket as fixed")
    } finally {
      setClosing(false)
    }
  }

  // Admins can wipe the counts: every vote, and the report count back to 1.
  const [confirmingReset, setConfirmingReset] = useState(false)
  const [resetting, setResetting] = useState(false)
  async function wipeCounts() {
    if (resetting) return
    setResetting(true)
    setCloseError(null)
    try {
      onTicketChange(await resetCounts(ticket.id))
      setConfirmingReset(false)
      setMoveNote("Counts reset. Votes are cleared and the report count is back to 1.")
    } catch (err) {
      setCloseError(err instanceof Error ? err.message : "Couldn’t reset the counts")
    } finally {
      setResetting(false)
    }
  }

  // Editing the ticket after posting: its words, photos, spot or department. `moveNote` says how it went.
  const [moving, setMoving] = useState(false)
  const [moveNote, setMoveNote] = useState<string | null>(null)

  async function removeTicket() {
    if (deleting) return
    setDeleting(true)
    setDeleteError(null)
    try {
      await deleteTicket(ticket.id)
      onDeleted(ticket.id)
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Couldn’t delete the ticket")
      setDeleting(false)
    }
  }
  const [viewingPhoto, setViewingPhoto] = useState(false)
  // Tickets without a photo show a stock picture, which isn't worth enlarging.
  const hasPhoto = ticket.images.length > 0
  // A ticket can have up to five photos; this is the one showing.
  const [photoIndex, setPhotoIndex] = useState(0)
  // With several photos, the arrows on the photo (and the arrow keys, and a
  // swipe) go to the one before or after, and round again at either end.
  const severalPhotos = ticket.images.length > 1
  const photoCount = ticket.images.length
  const stepPhoto = useCallback(
    (by: -1 | 1) => setPhotoIndex((now) => (Math.min(now, photoCount - 1) + by + photoCount) % photoCount),
    [photoCount],
  )
  const photoTouch = useRef<number | null>(null)
  const justSwiped = useRef(false)
  const shownPhoto = ticket.images[Math.min(photoIndex, ticket.images.length - 1)] ?? ticket.image
  const photoAlt = hasPhoto
    ? `Photo ${ticket.images.length > 1 ? `${photoIndex + 1} of ${ticket.images.length} ` : ""}of: ${ticket.title}`
    : "City sidewalk beside a street"

  // After a "Still there" vote: offer to write a follow-up to the department.
  // "asking" shows the question, "writing" while the message is drafted, and
  // `followUp` holds the finished message for the send box.
  const [followUpStep, setFollowUpStep] = useState<"idle" | "asking" | "writing">("idle")
  const [followUp, setFollowUp] = useState<ReportToSend | null>(null)
  const [followUpError, setFollowUpError] = useState<string | null>(null)

  async function writeFollowUp() {
    if (followUpStep === "writing") return
    setFollowUpStep("writing")
    setFollowUpError(null)
    try {
      const drafted = await followUpReport(ticket)
      setFollowUp({
        contact: drafted.contact,
        report: drafted.report,
        reason: null,
        kind: "followUp",
        ticketId: ticket.id,
      })
      setFollowUpStep("idle")
    } catch (err) {
      setFollowUpError(err instanceof Error ? err.message : "Couldn’t write the follow-up")
      setFollowUpStep("asking")
    }
  }

  // Counts and status come back from the server, so the UI never guesses them.
  async function castVote(choice: VoteChoice) {
    if (pending) return
    if (ticket.myVote === choice) {
      // Already voted "Still there": pressing it again brings the follow-up offer back.
      if (choice === "still_there" && followUpStep === "idle") setFollowUpStep("asking")
      return
    }
    setPending(choice)
    setVoteError(null)
    try {
      onTicketChange(await vote(ticket.id, choice))
      setFollowUpStep(choice === "still_there" ? "asking" : "idle")
      setFollowUpError(null)
    } catch (err) {
      setVoteError(
        err instanceof Error ? err.message : "Your vote didn’t go through",
      )
    } finally {
      setPending(null)
    }
  }

  return (
    <aside
      className="ticket-detail"
      aria-label={`Ticket details: ${ticket.title}`}
    >
      <div className="detail-handle" />
      <button
        className="detail-close"
        onClick={onClose}
        aria-label="Close ticket details"
      >
        <X size={18} />
      </button>
      <div
        className="detail-photo"
        onTouchStart={(event) => {
          photoTouch.current = event.touches[0].clientX
        }}
        onTouchEnd={(event) => {
          const moved = photoTouch.current === null ? 0 : event.changedTouches[0].clientX - photoTouch.current
          photoTouch.current = null
          if (severalPhotos && Math.abs(moved) > 45) {
            stepPhoto(moved > 0 ? -1 : 1)
            // Some phones follow a swipe with a tap. Ignore one for a moment, so it doesn't open the photo.
            justSwiped.current = true
            window.setTimeout(() => {
              justSwiped.current = false
            }, 350)
          }
        }}
        onKeyDown={(event) => {
          if (!severalPhotos || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return
          event.preventDefault()
          stepPhoto(event.key === "ArrowLeft" ? -1 : 1)
        }}
      >
        <img src={shownPhoto} alt={photoAlt} />
        <div className="photo-count">
          <Camera size={14} /> {ticket.reports}{" "}
          {ticket.reports === 1 ? "report" : "reports"}
        </div>
        {/* Covers the whole photo, so a click or tap anywhere on it opens it. */}
        {hasPhoto && (
          <button
            type="button"
            className="photo-open"
            onClick={() => {
              if (!justSwiped.current) setViewingPhoto(true)
            }}
          >
            <span>
              <Maximize2 size={13} /> View photo
            </span>
          </button>
        )}
        {/* Several photos: arrows at the sides go through them, round and round. */}
        {severalPhotos && (
          <>
            <button
              type="button"
              className="photo-step previous"
              onClick={() => stepPhoto(-1)}
              aria-label="Previous photo"
            >
              <ChevronLeft size={20} />
            </button>
            <button type="button" className="photo-step next" onClick={() => stepPhoto(1)} aria-label="Next photo">
              <ChevronRight size={20} />
            </button>
            <span className="photo-position" aria-live="polite">
              {photoIndex + 1} / {ticket.images.length}
            </span>
          </>
        )}
      </div>
      {ticket.images.length > 1 && (
        <div className="detail-thumbs" role="group" aria-label="This ticket’s photos">
          {ticket.images.map((image, index) => (
            <button
              type="button"
              key={image}
              className={index === photoIndex ? "selected" : ""}
              aria-pressed={index === photoIndex}
              aria-label={`Show photo ${index + 1} of ${ticket.images.length}`}
              onClick={() => setPhotoIndex(index)}
            >
              <img src={image} alt="" />
            </button>
          ))}
        </div>
      )}
      {viewingPhoto && (
        <PhotoViewer
          src={shownPhoto}
          alt={photoAlt}
          onClose={() => setViewingPhoto(false)}
          onStep={severalPhotos ? stepPhoto : undefined}
          position={severalPhotos ? `${photoIndex + 1} / ${ticket.images.length}` : undefined}
        />
      )}
      <div className="detail-body">
        <div className="detail-meta">
          <StatusPill status={ticket.status} />
          <span>{ticket.code}</span>
        </div>
        <h2>{ticket.title}</h2>
        <p className="detail-address">
          <MapPin size={16} /> {ticket.address}
        </p>
        {ticket.description && (
          <p className="detail-description">{ticket.description}</p>
        )}
        <div className="route-card">
          <div className={`owner-mark ${ownerColors[ticket.owner]}`}>
            <Home size={17} />
          </div>
          <div>
            <span>ROUTED TO</span>
            <strong>{ticket.owner}</strong>
          </div>
          <CheckCircle2 size={19} />
        </div>
        <div className="vote-section">
          <div>
            <h3>{votingClosed ? "This issue is marked fixed" : "Is this issue still here?"}</h3>
            <p>
              {votingClosed
                ? "Voting is closed. Only an admin can reopen it."
                : "Your vote helps keep this ticket accurate."}
            </p>
          </div>
          <div className="vote-buttons" aria-busy={pending !== null}>
            <button
              className={ticket.myVote === "still_there" ? "selected" : ""}
              aria-pressed={ticket.myVote === "still_there"}
              disabled={pending !== null || votingClosed}
              onClick={() => castVote("still_there")}
            >
              <Eye size={17} />{" "}
              {pending === "still_there" ? "Saving…" : "Still there"}
              <span>{ticket.stillThere}</span>
            </button>
            <button
              className={ticket.myVote === "fixed" ? "selected vote-fixed" : ""}
              aria-pressed={ticket.myVote === "fixed"}
              disabled={pending !== null || votingClosed}
              onClick={() => castVote("fixed")}
            >
              <Check size={17} /> {pending === "fixed" ? "Saving…" : "Fixed"}
              <span>{ticket.fixed}</span>
            </button>
          </div>
          {voteError && (
            <p className="vote-error" role="alert">
              {voteError}
            </p>
          )}
          {followUpStep !== "idle" && (
            <div className="follow-up-offer" role="group" aria-label="Send a follow-up">
              <p>
                <strong>Thanks. Want to follow up with {ticket.owner}?</strong> AVision
                writes the email from this ticket and you send it yourself.
              </p>
              <div>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => setFollowUpStep("idle")}
                  disabled={followUpStep === "writing"}
                >
                  Not now
                </button>
                <button
                  type="button"
                  className="primary-button"
                  onClick={writeFollowUp}
                  disabled={followUpStep === "writing"}
                >
                  <Send size={14} />
                  {followUpStep === "writing" ? "Writing it…" : "Write follow-up"}
                </button>
              </div>
              {followUpError && (
                <p className="vote-error" role="alert">
                  {followUpError}
                </p>
              )}
            </div>
          )}
          {/* On top of everything, wherever this ticket is shown (side panel or its own box). */}
          {followUp &&
            createPortal(
              <ReportReady {...followUp} onClose={() => setFollowUp(null)} />,
              document.body,
            )}
        </div>
        {onViewFull && (
          <button className="view-ticket-button" onClick={onViewFull}>
            View full ticket <ArrowRight size={16} />
          </button>
        )}
        <p className="reported-time">
          <Clock3 size={14} /> First reported{" "}
          {ticket.firstReported.toLowerCase()} · Updated{" "}
          {ticket.time.toLowerCase()}
        </p>
        {/* A fixed ticket is kept as it is: only an admin can still change or delete it. */}
        {ticket.mine && !isAdmin && ticket.status === "Fixed" && (
          <p className="ticket-locked" role="note">
            <CheckCircle2 size={14} aria-hidden="true" /> This ticket is marked fixed, so it can no longer be edited
            or deleted.
          </p>
        )}
        {(isAdmin || (ticket.mine && ticket.status !== "Fixed")) && (
          <div className="delete-ticket">
            {!confirmingDelete ? (
              <div className="ticket-actions">
                <button
                  type="button"
                  className="move-ticket-button"
                  onClick={() => {
                    setMoveNote(null)
                    setMoving(true)
                  }}
                >
                  <MapPin size={15} /> Edit ticket
                </button>
                <button
                  type="button"
                  className="delete-ticket-button"
                  onClick={() => setConfirmingDelete(true)}
                >
                  <Trash2 size={15} /> {ticket.mine ? "Delete my ticket" : "Delete ticket"}
                </button>
                {isAdmin && ticket.status !== "Fixed" && (
                  <button
                    type="button"
                    className="mark-fixed-button"
                    onClick={markFixed}
                    disabled={closing}
                  >
                    <CheckCircle2 size={15} /> {closing ? "Marking as fixed…" : "Mark as fixed"}
                  </button>
                )}
                {isAdmin && (
                  <button
                    type="button"
                    className="reset-counts-button"
                    onClick={() => {
                      setMoveNote(null)
                      setConfirmingReset(true)
                    }}
                  >
                    <RotateCcw size={15} /> Reset counts
                  </button>
                )}
              </div>
            ) : (
              <div className="delete-confirm" role="group" aria-label="Confirm delete">
                <p>Delete this ticket for everyone? Its votes and photo go too.</p>
                <div>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => setConfirmingDelete(false)}
                    disabled={deleting}
                  >
                    Keep it
                  </button>
                  <button
                    type="button"
                    className="delete-ticket-button danger"
                    onClick={removeTicket}
                    disabled={deleting}
                    autoFocus
                  >
                    <Trash2 size={15} /> {deleting ? "Deleting…" : "Yes, delete"}
                  </button>
                </div>
              </div>
            )}
            {confirmingReset && (
              <div className="delete-confirm" role="group" aria-label="Confirm reset">
                <p>
                  Reset this ticket’s counts? Every “Still there” and “Fixed” vote is removed and the report
                  count goes back to 1.
                </p>
                <div>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => setConfirmingReset(false)}
                    disabled={resetting}
                  >
                    Keep them
                  </button>
                  <button
                    type="button"
                    className="delete-ticket-button danger"
                    onClick={wipeCounts}
                    disabled={resetting}
                    autoFocus
                  >
                    <RotateCcw size={15} /> {resetting ? "Resetting…" : "Yes, reset"}
                  </button>
                </div>
              </div>
            )}
            {moveNote && (
              <p className="move-note" role="status">
                <Check size={14} aria-hidden="true" /> {moveNote}
              </p>
            )}
            {/* On top of everything, wherever this ticket is shown. */}
            {moving &&
              createPortal(
                <MoveTicket
                  ticket={ticket}
                  onClose={() => setMoving(false)}
                  onMoved={(updated) => {
                    setMoving(false)
                    setMoveNote(
                      updated.owner !== ticket.owner
                        ? `Ticket updated. It is now routed to ${updated.owner}.`
                        : "Ticket updated.",
                    )
                    onTicketChange(updated)
                  }}
                />,
                document.body,
              )}
            {deleteError && (
              <p className="vote-error" role="alert">
                {deleteError}
              </p>
            )}
            {closeError && (
              <p className="vote-error" role="alert">
                {closeError}
              </p>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}

/** A ticket opened on top of the page, to read it and vote. */
function TicketModal({
  ticket,
  onClose,
  onTicketChange,
  onDeleted,
}: {
  ticket: Ticket
  onClose: () => void
  onTicketChange: (ticket: Ticket) => void
  onDeleted: (id: string) => void
}) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  // Keyboard and screen reader users land in the ticket, and go back to the
  // row they opened it from when it closes.
  useEffect(() => {
    const opener = document.activeElement
    dialogRef.current?.focus()
    return () => {
      if (opener instanceof HTMLElement) opener.focus()
    }
  }, [])

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className="ticket-modal"
        role="dialog"
        aria-modal="true"
        aria-label={ticket.title}
        tabIndex={-1}
        ref={dialogRef}
      >
        <TicketDetail
          ticket={ticket}
          onClose={onClose}
          onTicketChange={onTicketChange}
          onDeleted={onDeleted}
        />
      </div>
    </div>
  )
}

/** The departments shown on the map to start with, for everyone. */
const DEFAULT_OWNERS: readonly Owner[] = ["City of Atlanta", "GDOT"]

/** The departments a person's onboarding answers add to the defaults (their campus, MARTA if they ride it), or [] for none. */
function ownersFromProfile(member: Member | null): Owner[] {
  const picks: Owner[] = []
  const campus = member?.isStudent ? schoolOwner(member.school) : null
  if (campus) picks.push(campus)
  if (member?.takesMarta) picks.push("MARTA")
  return picks.filter((owner) => !DEFAULT_OWNERS.includes(owner))
}

type OwnerFilter = {
  shown: readonly Owner[]
  /** The person's own change in Filters. Remembered for their next visit. */
  setShown: (owners: Owner[]) => void
  /** Which statuses are shown: open, likely fixed, fixed. Remembered the same way. */
  statuses: readonly Status[]
  setStatuses: (statuses: Status[]) => void
  /** Switches a ticket's department and status on so it can be seen, for this visit only. */
  reveal: (ticket: Ticket) => void
  /** Why the filter is set as it is, while it is still the profile's own choice. */
  note: string | null
}

/**
 * Which departments' tickets the map shows. It starts with the City of Atlanta
 * and GDOT, plus what the onboarding answers point to (a GSU student who rides
 * MARTA also sees GSU Facilities and MARTA), and the person can switch the others on.
 *
 * Lives in App, not the map page, so a choice survives a visit to another page.
 */
// The map filter a person last chose, kept in this browser under their own
// name (or "guest"). It is stored with the profile answers it was chosen
// under: if those have changed since, it no longer applies.
const FILTER_KEY = "avision.mapFilter."
const STATUSES: Status[] = ["Open", "Likely fixed", "Fixed"]

type KeptFilter = { shown: Owner[]; statuses: Status[] }

function rememberedFilter(person: string, profileKey: string): KeptFilter | null {
  try {
    const kept = JSON.parse(localStorage.getItem(FILTER_KEY + person) ?? "null") as {
      shown?: unknown
      statuses?: unknown
      profile?: unknown
    } | null
    if (!kept || kept.profile !== profileKey || !Array.isArray(kept.shown)) return null
    const listed = (values: unknown) => (Array.isArray(values) ? (values as unknown[]) : null)
    return {
      shown: OWNERS.filter((owner) => listed(kept.shown)!.includes(owner)),
      // Kept before statuses could be filtered: all of them.
      statuses: listed(kept.statuses) ? STATUSES.filter((status) => listed(kept.statuses)!.includes(status)) : STATUSES,
    }
  } catch {
    return null // storage is blocked or holds something else: start from the profile
  }
}

function rememberFilter(person: string, profileKey: string, shown: readonly Owner[], statuses: readonly Status[]) {
  try {
    localStorage.setItem(FILTER_KEY + person, JSON.stringify({ shown, statuses, profile: profileKey }))
  } catch {
    // not kept this time; the filter still works for this visit
  }
}

function useOwnerFilter(
  member: Member | null,
  tickets: Ticket[],
  selectedId: string | null,
): OwnerFilter {
  const addedByProfile = useMemo(() => ownersFromProfile(member), [member?.isStudent, member?.school, member?.takesMarta])
  // In the same order as everywhere else.
  const fromProfile = useMemo(
    () => OWNERS.filter((owner) => DEFAULT_OWNERS.includes(owner) || addedByProfile.includes(owner)),
    [addedByProfile],
  )
  // The profile only sets the filter the first time. After that, whatever the
  // person switches on or off is remembered in this browser, per person, and
  // comes back on every visit. New profile answers start it over from the profile.
  const person = member?.id ?? "guest"
  const profileKey = fromProfile.join("|")
  const [shown, setShownNow] = useState<readonly Owner[]>(
    () => rememberedFilter(person, profileKey)?.shown ?? fromProfile,
  )
  const [statuses, setStatusesNow] = useState<readonly Status[]>(
    () => rememberedFilter(person, profileKey)?.statuses ?? STATUSES,
  )
  useEffect(() => {
    const kept = rememberedFilter(person, profileKey)
    setShownNow(kept?.shown ?? fromProfile)
    setStatusesNow(kept?.statuses ?? STATUSES)
  }, [person, profileKey])

  // A change made in the map's Filters is the person's own choice, so it is kept.
  const now = useRef({ shown, statuses })
  now.current = { shown, statuses }
  const setShown = useCallback(
    (owners: readonly Owner[]) => {
      setShownNow(owners)
      rememberFilter(person, profileKey, owners, now.current.statuses)
    },
    [person, profileKey],
  )
  const setStatuses = useCallback(
    (wanted: readonly Status[]) => {
      setStatusesNow(wanted)
      rememberFilter(person, profileKey, now.current.shown, wanted)
    },
    [person, profileKey],
  )

  // Shown for this visit only: it isn't the person changing their filter, so it isn't remembered.
  const reveal = useCallback((ticket: Ticket) => {
    setShownNow((owners) => (owners.includes(ticket.owner) ? owners : [...owners, ticket.owner]))
    setStatusesNow((wanted) => (wanted.includes(ticket.status) ? wanted : [...wanted, ticket.status]))
  }, [])

  // A ticket picked from a list, or one just posted, has to be on the map:
  // switch its department and status on. Once per pick, so they can be switched off again.
  const revealed = useRef<string | null>(null)
  useEffect(() => {
    if (!selectedId || revealed.current === selectedId) return
    const picked = tickets.find((ticket) => ticket.id === selectedId)
    if (!picked) return // not loaded yet; this runs again when it is
    revealed.current = selectedId
    reveal(picked)
  }, [selectedId, tickets, reveal])

  const untouched =
    addedByProfile.length > 0 &&
    fromProfile.length === shown.length &&
    fromProfile.every((owner) => shown.includes(owner))
  return { shown, setShown, statuses, setStatuses, reveal, note: untouched ? "picked from your profile" : null }
}

function MapView({
  state,
  filter,
  selectedId,
  onSelect,
  onOpen,
}: {
  state: TicketsState
  filter: OwnerFilter
  selectedId: string | null
  onSelect: (id: string) => void
  onOpen: (id: string) => void
}) {
  const [showDetail, setShowDetail] = useState(true)
  const mapPage = useRef<HTMLElement>(null)
  // Only the tickets of the departments and statuses switched on in the map's Filters.
  const tickets = useMemo(
    () =>
      state.tickets.filter(
        (ticket) => filter.shown.includes(ticket.owner) && filter.statuses.includes(ticket.status),
      ),
    [state.tickets, filter.shown, filter.statuses],
  )
  const selected =
    tickets.find((ticket) => ticket.id === selectedId) ?? tickets[0] ?? null

  const markers = useMemo(() => tickets.map(ticketMarker), [tickets])
  const shownOwners = useMemo(() => filter.shown.map(mapOwner), [filter.shown])
  const ownerCounts = useMemo(() => {
    const counts: Partial<Record<AvisionMapOwner, number>> = {}
    for (const ticket of state.tickets) {
      const owner = mapOwner(ticket.owner)
      counts[owner] = (counts[owner] ?? 0) + 1
    }
    return counts
  }, [state.tickets])
  // The campus outlines, offered under the map's Layers.
  const [campuses, setCampuses] = useState<AvisionMapCampus[]>([])
  useEffect(() => {
    let current = true
    campusOutlines().then((found) => {
      if (!current) return
      setCampuses(
        found.map((campus) => ({
          id: mapOwner(campus.owner),
          label: `${campus.owner === "GSU Facilities" ? "GSU" : campus.owner} campus outline`,
          color: campus.owner === "Georgia Tech" ? "#8F713D" : "#0039A6",
          geometry: campus.geometry,
        })),
      )
    })
    return () => {
      current = false
    }
  }, [])
  const shownStatuses = useMemo(() => filter.statuses.map(mapStatus), [filter.statuses])
  const statusCounts = useMemo(() => {
    const counts: Partial<Record<AvisionMapStatus, number>> = {}
    for (const ticket of state.tickets) {
      const status = mapStatus(ticket.status)
      counts[status] = (counts[status] ?? 0) + 1
    }
    return counts
  }, [state.tickets])
  const hiddenByFilter = state.tickets.length > 0 && tickets.length === 0
  // Votes refresh ticket data without recentering a map the user has panned.
  const focusPoint = useMemo(
    () =>
      selected ? { latitude: selected.lat, longitude: selected.lng } : null,
    [selected?.id, selected?.lat, selected?.lng],
  )
  useEffect(() => {
    if (selectedId) setShowDetail(true)
  }, [selectedId])

  useEffect(() => {
    if (
      selectedId &&
      showDetail &&
      window.matchMedia("(max-width: 1000px)").matches
    ) {
      mapPage.current
        ?.querySelector(".ticket-detail")
        ?.scrollIntoView({ block: "start" })
    }
  }, [selectedId, showDetail])
  return (
    <section
      ref={mapPage}
      className={selected && showDetail ? "map-page with-detail" : "map-page"}
    >
      <div className="integrated-map">
        <Suspense
          fallback={
            <div className="empty-state" role="status">
              Loading map…
            </div>
          }
        >
          <AvisionMap
            height="100%"
            dataUrl={import.meta.env.BASE_URL + "avision-map"}
            initialArea="corridor"
            markers={markers}
            shownOwners={shownOwners}
            ownerCounts={ownerCounts}
            filterNote={filter.note}
            onShownOwnersChange={(owners) =>
              filter.setShown(OWNERS.filter((owner) => owners.includes(mapOwner(owner))))
            }
            campuses={campuses}
            shownStatuses={shownStatuses}
            statusCounts={statusCounts}
            onShownStatusesChange={(wanted) =>
              filter.setStatuses(STATUSES.filter((status) => wanted.includes(mapStatus(status))))
            }
            selectedMarkerId={selected?.id ?? null}
            focusPoint={focusPoint}
            onMarkerSelect={(marker) => {
              onSelect(marker.id)
              setShowDetail(true)
            }}
          />
        </Suspense>
        {selected && !showDetail && (
          <button className="reopen-detail" onClick={() => setShowDetail(true)}>
            <MapPin size={17} /> Open selected ticket
          </button>
        )}
        {(state.error || (!selected && !hiddenByFilter)) && (
          <div className="integrated-map-notice">
            <TicketsNotice
              state={state}
              emptyTitle="No issues reported yet"
              emptyText="Reported issues will appear at their coordinates on the map."
            />
          </div>
        )}
      </div>
      {selected && showDetail && (
        <TicketDetail
          key={selected.id}
          ticket={selected}
          onClose={() => {
            setShowDetail(false)
            mapPage.current
              ?.querySelector<HTMLElement>(".avision-issue-selected")
              ?.focus({ preventScroll: true })
            if (window.matchMedia("(max-width: 1000px)").matches) {
              mapPage.current?.scrollIntoView({ block: "start" })
            }
          }}
          onTicketChange={(updated) => {
            state.replaceTicket(updated)
            // Moving a ticket can change its department. Keep it on the map
            // even if that department was switched off in Filters.
            filter.reveal(updated)
          }}
          onViewFull={() => onOpen(selected.id)}
          onDeleted={state.removeTicket}
        />
      )}
    </section>
  )
}

function IssuesView({
  state,
  onReport,
  onSelect,
  onOpen,
}: {
  state: TicketsState
  onReport: () => void
  onSelect: (id: string) => void
  onOpen: (id: string) => void
}) {
  const { tickets } = state
  const [status, setStatus] = useState<"All" | Status>("All")
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<"Most recent" | "Most reported">(
    "Most recent",
  )
  // The API returns newest first, so "Most recent" keeps that order.
  const filtered = useMemo(() => {
    const matches = tickets.filter(
      (ticket) =>
        (status === "All" || ticket.status === status) &&
        `${ticket.title} ${ticket.address}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    return sort === "Most reported"
      ? [...matches].sort((a, b) => b.reports - a.reports)
      : matches
  }, [tickets, status, query, sort])
  const counts = useMemo(() => {
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000
    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)
    return {
      open: tickets.filter((t) => t.status === "Open").length,
      openToday: tickets.filter(
        (t) => t.status === "Open" && new Date(t.createdAt).getTime() > dayAgo,
      ).length,
      likelyFixed: tickets.filter((t) => t.status === "Likely fixed").length,
      fixedThisMonth: tickets.filter(
        (t) =>
          t.status === "Fixed" &&
          new Date(t.updatedAt).getTime() >= monthStart.getTime(),
      ).length,
    }
  }, [tickets])

  return (
    <section className="issues-page page-content">
      <div className="page-heading">
        <div>
          <p className="eyebrow">COMMUNITY ACTIVITY</p>
          <h2>Current issues</h2>
          <p>Track accessibility issues reported around downtown Atlanta.</p>
        </div>
        <button className="primary-button" onClick={onReport}>
          <Plus size={17} /> Report an issue
        </button>
      </div>

      <div className="issue-stats">
        <div>
          <span className="stat-icon open">
            <MapPin size={19} />
          </span>
          <p>Open tickets</p>
          <strong>{counts.open}</strong>
          <small>{counts.openToday} added today</small>
        </div>
        <div>
          <span className="stat-icon progress">
            <Clock3 size={19} />
          </span>
          <p>Likely fixed</p>
          <strong>{counts.likelyFixed}</strong>
          <small>Awaiting confirmation</small>
        </div>
        <div>
          <span className="stat-icon resolved">
            <CheckCircle2 size={19} />
          </span>
          <p>Fixed this month</p>
          <strong>{counts.fixedThisMonth}</strong>
          <small>Confirmed by the community</small>
        </div>
      </div>

      <div className="list-controls">
        <div className="status-tabs">
          {(["All", "Open", "Likely fixed", "Fixed"] as const).map((item) => (
            <button
              key={item}
              className={status === item ? "active" : ""}
              onClick={() => setStatus(item)}
            >
              {item}
              {item === "All" && <span>{tickets.length}</span>}
            </button>
          ))}
        </div>
        <div className="control-group">
          <label className="list-search">
            <Search size={17} />
            <input
              aria-label="Search issues"
              placeholder="Search issues"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <button
            className="sort-button"
            onClick={() =>
              setSort(sort === "Most recent" ? "Most reported" : "Most recent")
            }
          >
            {sort} <ChevronDown size={16} />
          </button>
        </div>
      </div>

      <div className="ticket-list">
        {filtered.map((ticket) => (
          // Open details from the row or title; the arrow focuses the issue on the map.
          <article
            className="ticket-row"
            key={ticket.id}
            onClick={() => onOpen(ticket.id)}
          >
            <img src={ticket.image} alt="" />
            <div className="ticket-main">
              <div className="ticket-title-line">
                <h3>
                  <button
                    className="ticket-title-button"
                    onClick={() => onOpen(ticket.id)}
                    aria-label={`Open ticket: ${ticket.title}`}
                  >
                    {ticket.title}
                  </button>
                </h3>
                <StatusPill status={ticket.status} />
              </div>
              <p>
                <MapPin size={14} /> {ticket.address}
              </p>
              <div className="ticket-tags">
                <span className={`owner-tag ${ownerColors[ticket.owner]}`}>
                  {ticket.owner}
                </span>
                <span>
                  <Camera size={13} /> {ticket.reports}{" "}
                  {ticket.reports === 1 ? "report" : "reports"}
                </span>
                <span>
                  <Clock3 size={13} /> {ticket.time}
                </span>
              </div>
            </div>
            <div className="ticket-votes">
              <span>
                <Eye size={15} /> {ticket.stillThere}
                <small>still there</small>
              </span>
              <span>
                <Check size={15} /> {ticket.fixed}
                <small>fixed</small>
              </span>
            </div>
            <button
              className="row-action"
              onClick={(event) => {
                event.stopPropagation()
                onSelect(ticket.id)
              }}
              aria-label={`View ${ticket.title} on map`}
              title="View on map"
            >
              <ArrowRight size={18} />
            </button>
          </article>
        ))}
        <TicketsNotice
          state={state}
          emptyTitle="No issues reported yet"
          emptyText="Be the first to report an accessibility barrier."
        />
        {tickets.length > 0 && filtered.length === 0 && (
          <div className="empty-state">
            <Search size={24} />
            <h3>No matching issues</h3>
            <p>Try a different search term or status filter.</p>
          </div>
        )}
      </div>
      <AdSlot slot={AD_SLOTS.issues} format="horizontal" className="ad-page" />
    </section>
  )
}

// Action counts the profile's progress bar works toward, one after another.
const MILESTONES = [5, 10, 20, 50, 100, 250, 500]

/** One line about the person from their onboarding answers, e.g. "Student at GSU · Rides MARTA". */
function answersSummary(member: Member): string {
  const parts: string[] = []
  if (member.isStudent === true) {
    parts.push(member.school ? `Student at ${member.school}` : "Student")
  } else if (member.isStudent === false) {
    parts.push("Not a student")
  }
  if (member.takesMarta === true) parts.push("Rides MARTA")
  else if (member.takesMarta === false) parts.push("Doesn’t ride MARTA")
  return parts.join(" · ") || "No answers shared"
}

function ProfileView({
  tickets,
  onReport,
  onBrowse,
  onWelcome,
  onOpen,
  onEditAnswers,
}: {
  tickets: Ticket[]
  /** Opens the report form (from the empty "My tickets" list). */
  onReport: () => void
  /** Goes to the list of everyone's tickets (from the empty "My votes" list). */
  onBrowse: () => void
  /** Guests have nothing to sign out of; this takes them back to the sign-in screen. */
  onWelcome: () => void
  onOpen: (id: string) => void
  /** Reopens the onboarding questions (signed-in people only). */
  onEditAnswers: () => void
}) {
  const { account, member, memberError, signIn, signOut, savePicture } = useAccount()
  // Changing the profile picture: pick a file, it uploads, the new one shows.
  const pictureInput = useRef<HTMLInputElement>(null)
  const [savingPicture, setSavingPicture] = useState(false)
  const [pictureError, setPictureError] = useState<string | null>(null)

  async function choosePicture(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = "" // so picking the same file again still counts as a change
    if (!file || savingPicture) return
    if (!file.type.startsWith("image/")) {
      setPictureError("That file isn’t a picture. Choose a JPEG, PNG or WebP image.")
      return
    }
    setSavingPicture(true)
    setPictureError(null)
    try {
      await savePicture(file)
    } catch (err) {
      setPictureError(err instanceof Error ? err.message : "Couldn’t save your picture")
    } finally {
      setSavingPicture(false)
    }
  }
  const [tab, setTab] = useState<"tickets" | "votes">("tickets")
  const [privacyOpener, setPrivacyOpener] = useState<HTMLButtonElement | null>(null)
  const closePrivacy = useCallback(() => setPrivacyOpener(null), [])
  const [notificationOpener, setNotificationOpener] = useState<HTMLButtonElement | null>(null)
  const closeNotifications = useCallback(() => setNotificationOpener(null), [])
  useEffect(closeNotifications, [closeNotifications, account?.id])
  const joined = member
    ? new Date(member.joinedAt).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : null
  // "Mine" means this browser's user: tickets and votes are saved under its ID
  // (see api.ts), so they show here whether or not the person is signed in.
  const myTickets = useMemo(() => tickets.filter((ticket) => ticket.mine), [tickets])
  const myVotes = useMemo(
    () => tickets.filter((ticket) => ticket.myVote !== null),
    [tickets],
  )
  const shown = tab === "tickets" ? myTickets : myVotes
  const markedFixed = myTickets.filter((ticket) => ticket.status !== "Open").length
  // Every ticket and vote is one action; the bar fills toward the next milestone.
  const actions = myTickets.length + myVotes.length
  const milestone = MILESTONES.find((goal) => goal > actions) ?? actions

  return (
    <section className="profile-page page-content">
      <div className="profile-cover" />
      <div className="profile-summary">
        <div className="large-avatar-wrap">
          <div className="large-avatar">
            <AvatarFace member={member} initials={account?.initials ?? "G"} />
          </div>
          {account && (
            <>
              <input
                ref={pictureInput}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={choosePicture}
                hidden
              />
              <button
                type="button"
                className="change-picture"
                onClick={() => pictureInput.current?.click()}
                disabled={savingPicture}
                aria-label="Change your profile picture"
                title="Change your profile picture"
              >
                <Camera size={15} />
              </button>
            </>
          )}
        </div>
        <div className="profile-identity">
          <div>
            <h2>{account?.name ?? "Guest"}</h2>
            <span className={member?.role === "admin" ? "member-badge admin" : "member-badge"}>
              <ShieldCheck size={14} /> {memberLabel(!!account, member)}
            </span>
          </div>
          <p>
            Your tickets and votes from this browser
            {joined && <span>Joined {joined}</span>}
          </p>
          {member?.onboardedAt && (
            <p className="profile-answers">{answersSummary(member)}</p>
          )}
          {savingPicture && <p className="profile-answers">Saving your picture…</p>}
          {pictureError && (
            <p className="account-notice" role="alert">
              {pictureError}
            </p>
          )}
          {account && memberError && (
            <p className="account-notice" role="alert">
              {memberError}{" "}
              <button className="text-button" onClick={signIn}>
                Sign in again
              </button>
            </p>
          )}
        </div>
        {member && (
          <button className="edit-profile-button" onClick={onEditAnswers}>
            Edit profile
          </button>
        )}
      </div>

      <div className="profile-layout">
        <div className="profile-main">
          <div className="profile-tabs">
            <button
              className={tab === "tickets" ? "active" : ""}
              onClick={() => setTab("tickets")}
            >
              My tickets <span>{myTickets.length}</span>
            </button>
            <button
              className={tab === "votes" ? "active" : ""}
              onClick={() => setTab("votes")}
            >
              My votes <span>{myVotes.length}</span>
            </button>
          </div>
          <div className="profile-ticket-list">
            {shown.length === 0 && (
              <div className="empty-state profile-empty">
                <span className="empty-icon" aria-hidden="true">
                  {tab === "tickets" ? <MapPin size={26} /> : <ThumbsUp size={26} />}
                </span>
                <h3>{tab === "tickets" ? "No tickets yet" : "No votes yet"}</h3>
                <p>
                  {tab === "tickets"
                    ? "Seen a blocked ramp, a broken elevator or a damaged sidewalk? Report it and it will show up here."
                    : "Vote “Still there” or “Fixed” on a ticket to keep it accurate. Your votes show up here."}
                </p>
                {tab === "tickets" ? (
                  <button className="primary-button" onClick={onReport}>
                    <Plus size={16} /> Report an issue
                  </button>
                ) : (
                  <button className="secondary-button" onClick={onBrowse}>
                    <List size={16} /> Browse issues
                  </button>
                )}
              </div>
            )}
            {shown.map(
              (ticket) => (
                <article
                  className="profile-ticket"
                  key={`${tab}-${ticket.id}`}
                  onClick={() => onOpen(ticket.id)}
                >
                  <img src={ticket.image} alt="" />
                  <div>
                    <div className="profile-ticket-top">
                      <span>{ticket.code}</span>
                      <StatusPill status={ticket.status} />
                    </div>
                    <h3>{ticket.title}</h3>
                    <p>
                      <MapPin size={14} /> {ticket.address}
                    </p>
                    <div className="profile-ticket-foot">
                      <span>
                        <Clock3 size={13} /> {ticket.time}
                      </span>
                      <span>
                        <ThumbsUp size={13} />{" "}
                        {ticket.stillThere + ticket.fixed}{" "}
                        {ticket.stillThere + ticket.fixed === 1 ? "vote" : "votes"}
                      </span>
                      {tab === "votes" && (
                        <span>
                          <Check size={13} /> You voted{" "}
                          {ticket.myVote === "fixed" ? "Fixed" : "Still there"}
                        </span>
                      )}
                    </div>
                  </div>
                  <button aria-label={`View ${ticket.title}`}>
                    <ArrowRight size={17} />
                  </button>
                </article>
              ),
            )}
          </div>
        </div>

        <aside className="profile-side">
          <div className="impact-card">
            <div className="impact-heading">
              <span className="impact-emoji" aria-hidden="true">
                ✊
              </span>
              <div>
                <p>YOUR COMMUNITY IMPACT</p>
                <h3>Small actions add up.</h3>
              </div>
            </div>
            <div className="impact-grid">
              <div>
                <strong>{myTickets.length}</strong>
                <span>Tickets created</span>
              </div>
              <div>
                <strong>{myVotes.length}</strong>
                <span>Votes cast</span>
              </div>
              <div>
                <strong>{markedFixed}</strong>
                <span>Marked fixed</span>
              </div>
            </div>
            <div className="impact-progress">
              <div>
                <span>Neighborhood contributor</span>
                <strong>
                  {actions} / {milestone}
                </strong>
              </div>
              <div className="progress-track">
                <span style={{ width: `${Math.round((actions / milestone) * 100)}%` }} />
              </div>
              <small>
                {milestone - actions}{" "}
                {milestone - actions === 1 ? "more action" : "more actions"} to
                your next milestone
              </small>
            </div>
          </div>
          <div className="account-card">
            <h3>Account</h3>
            {account && (
              <button type="button" aria-haspopup="dialog" onClick={(event) => setNotificationOpener(event.currentTarget)}>
                <Bell size={17} aria-hidden="true" /> Notification preferences{" "}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            )}
            <button type="button" aria-haspopup="dialog" onClick={(event) => setPrivacyOpener(event.currentTarget)}>
              <ShieldCheck size={17} /> Privacy & security{" "}
              <ArrowRight size={16} />
            </button>
            {account ? (
              <button className="sign-out" onClick={signOut}>
                <LogOut size={17} /> Sign out
              </button>
            ) : (
              <button className="sign-in" onClick={onWelcome}>
                <LogIn size={17} /> Sign in
              </button>
            )}
          </div>
        </aside>
      </div>
      <AdSlot slot={AD_SLOTS.profile} format="horizontal" className="ad-page" />
      {privacyOpener && (
        <PrivacyDialog key={account?.id ?? "guest"} onClose={closePrivacy} opener={privacyOpener} />
      )}
      {account && notificationOpener && (
        <NotificationPreferencesDialog key={account.id} accountId={account.id} onClose={closeNotifications} opener={notificationOpener} />
      )}
    </section>
  )
}

function MobileNav({
  view,
  setView,
  onReport,
  onMenu,
}: {
  view: View
  setView: (view: View) => void
  onReport: () => void
  onMenu: (opener: HTMLButtonElement) => void
}) {
  return (
    <nav className="mobile-nav">
      <button
        className={view === "map" ? "active" : ""}
        onClick={() => setView("map")}
      >
        <Map size={19} /> Map
      </button>
      <button
        className={view === "issues" ? "active" : ""}
        onClick={() => setView("issues")}
      >
        <List size={19} /> Issues
      </button>
      <button
        className="mobile-report"
        onClick={onReport}
        aria-label="Report an issue"
      >
        <Plus size={21} />
      </button>
      <button
        className={view === "profile" ? "active" : ""}
        onClick={() => setView("profile")}
      >
        <User size={19} /> Profile
      </button>
      <button type="button" data-menu-opener onClick={(event) => onMenu(event.currentTarget)} aria-label="More, open menu">
        <Settings size={19} /> More
      </button>
    </nav>
  )
}

export default function App() {
  const auth = useAccount()
  const [view, setView] = useState<View>("onboarding")
  const [menuOpen, setMenuOpen] = useState(false)
  const [resourcesOpener, setResourcesOpener] = useState<HTMLButtonElement | null>(null)
  const [moreInfoOpener, setMoreInfoOpener] = useState<HTMLButtonElement | null>(null)
  const closeMoreInfo = useCallback(() => setMoreInfoOpener(null), [])
  const menuOpener = useRef<HTMLButtonElement | null>(null)
  const openMenu = useCallback((opener: HTMLButtonElement) => {
    menuOpener.current = opener
    setMenuOpen(true)
  }, [])
  const closeResources = useCallback(() => setResourcesOpener(null), [])
  const [reportOpen, setReportOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  // The ticket opened on top of the page, from a list or "View full ticket".
  const [openId, setOpenId] = useState<string | null>(null)
  const ticketsState = useTickets()
  const live = useLiveTickets(ticketsState)
  const update = useUpdateNotice(live.connected)
  // Opened from a link to one ticket (the link in the messages people send to
  // departments): go straight to that ticket, past the welcome screen. It is
  // fetched on its own in case it is older than the list goes back. Then the
  // link comes off the address bar, so a refresh doesn't open it again.
  const upsertLinked = ticketsState.upsertTicket
  useEffect(() => {
    const id = linkedTicket()
    if (!id) return
    window.history.replaceState({}, document.title, window.location.pathname)
    setView((now) => (now === "onboarding" ? "map" : now))
    setSelectedId(id)
    setOpenId(id)
    const gone = () => setOpenId((now) => (now === id ? null : now)) // deleted since: just the map
    getTicket(id)
      .then((ticket) => (ticket ? upsertLinked(ticket) : gone()))
      .catch(gone)
  }, [upsertLinked])
  // Once a sign-in is confirmed, reload: "yours" and your votes now come from the account.
  const memberId = auth.member?.id
  const reloadTickets = ticketsState.reload
  useEffect(() => {
    if (memberId) reloadTickets()
  }, [memberId, reloadTickets])
  const ownerFilter = useOwnerFilter(auth.member, ticketsState.tickets, selectedId)
  const openTicket =
    ticketsState.tickets.find((ticket) => ticket.id === openId) ?? null
  const closeTicket = useCallback(() => setOpenId(null), [])
  // The agent's drafted report for a ticket that was just posted, until dismissed.
  const [toSend, setToSend] = useState<ReportToSend | null>(null)
  const closeToSend = useCallback(() => setToSend(null), [])
  // Screening turned a report away, or posting is paused: said in a box of its own.
  const [screening, setScreening] = useState<ScreeningProblem | null>(null)
  const closeScreening = useCallback(() => setScreening(null), [])
  // A pause we already know about, so the form doesn't open just to close again.
  const pause = useRef<ScreeningProblem | null>(null)
  const openReport = useCallback(() => {
    const known = pause.current
    if (known?.suspendedUntil && new Date(known.suspendedUntil).getTime() > Date.now()) {
      setScreening({ ...known, code: "suspended" })
      return
    }
    pause.current = null
    setReportOpen(true)
  }, [])
  const closeReport = useCallback(() => setReportOpen(false), [])
  const rejectReport = useCallback((problem: ScreeningProblem) => {
    if (problem.suspendedUntil) pause.current = problem
    setReportOpen(false)
    setScreening(problem)
  }, [])
  // Onboarding questions: shown once after a first sign-in (until answered or
  // skipped for this visit), and again from "Edit profile".
  const [questionsOpen, setQuestionsOpen] = useState(false)
  const [questionsSkipped, setQuestionsSkipped] = useState(false)
  const closeQuestions = useCallback(() => {
    setQuestionsOpen(false)
    setQuestionsSkipped(true)
  }, [])
  const showQuestions =
    !!auth.member &&
    (questionsOpen || (auth.member.onboardedAt === null && !questionsSkipped))

  // Wait until we know whether this browser is signed in, so a returning
  // person never sees the welcome screen flash by.
  if (!auth.ready) {
    return (
      <main className="auth-loading" role="status" aria-label="Loading AVision">
        <Brand />
      </main>
    )
  }

  // The welcome screen is for people who haven't chosen yet. Anyone signed in
  // goes straight to the map.
  if (view === "onboarding" && !auth.account) {
    return (
      <Onboarding
        tickets={ticketsState.tickets}
        onContinue={() => setView("map")}
        onOpenTicket={(id) => {
          setSelectedId(id)
          setView("map")
        }}
      />
    )
  }
  const page = view === "onboarding" ? "map" : view

  const titles = {
    map: ["Issue map", "Explore reported barriers around Atlanta"],
    issues: ["Community tickets", "See what your neighbors are reporting"],
    profile: ["My profile", "Manage your tickets and community activity"],
  } as const
  const [title, subtitle] = titles[page]

  return (
    <div className="app-shell">
      <Sidebar
        view={page}
        setView={setView}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        openCount={
          ticketsState.tickets.filter((ticket) => ticket.status === "Open")
            .length
        }
        onReport={openReport}
        onResources={setResourcesOpener}
        onMoreInfo={setMoreInfoOpener}
      />
      <main className="app-main">
        <Backdrop />
        <AppHeader
          title={title}
          subtitle={subtitle}
          onMenu={openMenu}
          setView={setView}
          onOpenTicket={(id) => {
            // Reload first: the notification is about something that just changed.
            reloadTickets()
            setOpenId(id)
          }}
          onNews={reloadTickets}
          bellNudge={live.bellNudge}
        />
        {page === "map" && (
          <MapView
            state={ticketsState}
            filter={ownerFilter}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onOpen={setOpenId}
          />
        )}
        {page === "issues" && (
          <IssuesView
            state={ticketsState}
            onReport={openReport}
            onSelect={(id) => {
              setSelectedId(id)
              setView("map")
            }}
            onOpen={setOpenId}
          />
        )}
        {page === "profile" && (
          <ProfileView
            tickets={ticketsState.tickets}
            onReport={openReport}
            onBrowse={() => setView("issues")}
            onWelcome={() => setView("onboarding")}
            onOpen={setOpenId}
            onEditAnswers={() => setQuestionsOpen(true)}
          />
        )}
        <SiteFooter />
      </main>
      <MobileNav view={page} setView={setView} onReport={openReport} onMenu={openMenu} />
      {openTicket && (
        <TicketModal
          key={openTicket.id}
          ticket={openTicket}
          onClose={closeTicket}
          onTicketChange={ticketsState.replaceTicket}
          onDeleted={(id) => {
            ticketsState.removeTicket(id)
            closeTicket()
          }}
        />
      )}
      {showQuestions && auth.member && (
        <OnboardingQuestions member={auth.member} onClose={closeQuestions} />
      )}
      {reportOpen && (
        <ReportForm
          onClose={closeReport}
          onCreated={(ticket, drafted) => {
            ticketsState.addTicket(ticket)
            setSelectedId(ticket.id)
            setReportOpen(false)
            setView("map")
            setToSend(drafted && { ...drafted, ticketId: ticket.id })
          }}
          onRejected={rejectReport}
        />
      )}
      {screening && <ScreeningNotice problem={screening} onClose={closeScreening} />}
      {toSend && <ReportReady {...toSend} onClose={closeToSend} />}
      {update.updated && <UpdateNotice onRefresh={update.refresh} onLater={update.later} />}
      {resourcesOpener && (
        <ResourcesDialog
          onClose={closeResources}
          opener={resourcesOpener}
          fallbackOpener={menuOpener.current}
        />
      )}
      {moreInfoOpener && <MoreInfoDialog onClose={closeMoreInfo} opener={moreInfoOpener} />}
    </div>
  )
}

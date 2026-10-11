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
} from "lucide-react"
import {
  deleteTicket,
  followUpReport,
  listTickets,
  PLACEHOLDER_PHOTO,
  vote,
  type Member,
  type Status,
  type Ticket,
  type VoteChoice,
} from "./api"
import { useAccount } from "./auth"
import PhotoViewer from "./PhotoViewer"
import ReportForm from "./ReportForm"
import OnboardingQuestions from "./OnboardingQuestions"
import ReportReady, { type ReportToSend } from "./ReportReady"
import { ThemeToggle } from "./theme"
import ResourcesDialog from "./ResourcesDialog"

import { ticketMarker } from "./ticket-map"
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
  const removeTicket = useCallback((id: string) => {
    setTickets((current) => current.filter((ticket) => ticket.id !== id))
  }, [])
  return { tickets, loading, error, reload, replaceTicket, addTicket, removeTicket }
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
  MARTA: "owner-marta",
  GDOT: "owner-gdot",
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand">
      <img
        className={compact ? "brand-mark compact" : "brand-mark"}
        src="/logo.svg"
        alt=""
      />
      <span className={compact ? "brand-name compact" : "brand-name"}>
        AVision
      </span>
    </div>
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

function Onboarding({ onContinue }: { onContinue: () => void }) {
  const auth = useAccount()
  const [step, setStep] = useState(0)

  const panels = [
    {
      eyebrow: "See it. Share it. Fix it.",
      title: "A more accessible city starts with you.",
      body: "Turn everyday accessibility barriers into mapped, trackable tickets—and help your community follow them through to a fix.",
    },
    {
      eyebrow: "One photo is enough",
      title: "Report barriers in a few simple steps.",
      body: "Upload a photo, confirm the location, and review the possible barrier. AVision routes your ticket to the right public agency.",
    },
  ]
  const panel = panels[step]

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
          <div className="story-ticket-card">
            <div className="mini-photo">
              <img
                src={PLACEHOLDER_PHOTO}
                alt="City sidewalk beside a street"
              />
              <span className="ai-badge">
                <Sparkles size={12} /> Possible barrier
              </span>
            </div>
            <div>
              <span className="mini-label">ROUTED TO</span>
              <strong>City of Atlanta</strong>
              <span className="mini-address">
                <MapPin size={13} /> Courtland St NE
              </span>
            </div>
            <CheckCircle2 className="mini-check" size={22} />
          </div>
          <div className="story-controls">
            <div className="story-dots">
              {panels.map((_, index) => (
                <button
                  aria-label={`Show introduction ${index + 1}`}
                  className={index === step ? "story-dot active" : "story-dot"}
                  key={index}
                  onClick={() => setStep(index)}
                />
              ))}
            </div>
            <button
              className="circle-control"
              onClick={() => setStep(step === panels.length - 1 ? 0 : step + 1)}
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
              You can browse and report anonymously. Voting requires sign-in.
            </p>
          </div>
          <p className="legal-copy">
            By continuing, you agree to AVision’s <u>Terms</u> and{" "}
            <u>Privacy Policy</u>.
          </p>
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
}: {
  view: View
  setView: (view: View) => void
  open: boolean
  onClose: () => void
  openCount: number
  onReport: () => void
  onResources: (opener: HTMLButtonElement) => void
}) {
  const { account } = useAccount()
  const navigate = (next: View) => {
    setView(next)
    onClose()
  }

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
            <List size={19} /> Current issues
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
        </nav>
        <div className="sidebar-user">
          <div className="avatar">{account?.initials ?? "G"}</div>
          <div>
            <strong>{account?.name ?? "Guest"}</strong>
            <span>{account ? "Community member" : "Not signed in"}</span>
          </div>
          <ChevronDown size={16} />
        </div>
      </aside>
    </>
  )
}

function AppHeader({
  title,
  subtitle,
  onMenu,
  setView,
}: {
  title: string
  subtitle: string
  onMenu: (opener: HTMLButtonElement) => void
  setView: (view: View) => void
}) {
  const { account } = useAccount()
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
        <button className="icon-button" aria-label="Notifications">
          <Bell size={19} />
          <span className="notification-dot" />
        </button>
        <button
          className="header-avatar"
          onClick={() => setView("profile")}
          aria-label="My profile"
        >
          {account?.initials ?? "G"}
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
  const hasPhoto = ticket.image !== PLACEHOLDER_PHOTO
  const photoAlt = hasPhoto ? `Photo of: ${ticket.title}` : "City sidewalk beside a street"

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
      setFollowUp({ contact: drafted.contact, report: drafted.report, reason: null, kind: "followUp" })
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
      <div className="detail-photo">
        <img src={ticket.image} alt={photoAlt} />
        <div className="photo-count">
          <Camera size={14} /> {ticket.reports}{" "}
          {ticket.reports === 1 ? "report" : "reports"}
        </div>
        {/* Covers the whole photo, so a click or tap anywhere on it opens it. */}
        {hasPhoto && (
          <button
            type="button"
            className="photo-open"
            onClick={() => setViewingPhoto(true)}
          >
            <span>
              <Maximize2 size={13} /> View photo
            </span>
          </button>
        )}
      </div>
      {viewingPhoto && (
        <PhotoViewer
          src={ticket.image}
          alt={photoAlt}
          onClose={() => setViewingPhoto(false)}
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
            <h3>Is this issue still here?</h3>
            <p>Your vote helps keep this ticket accurate.</p>
          </div>
          <div className="vote-buttons" aria-busy={pending !== null}>
            <button
              className={ticket.myVote === "still_there" ? "selected" : ""}
              aria-pressed={ticket.myVote === "still_there"}
              disabled={pending !== null}
              onClick={() => castVote("still_there")}
            >
              <Eye size={17} />{" "}
              {pending === "still_there" ? "Saving…" : "Still there"}
              <span>{ticket.stillThere}</span>
            </button>
            <button
              className={ticket.myVote === "fixed" ? "selected vote-fixed" : ""}
              aria-pressed={ticket.myVote === "fixed"}
              disabled={pending !== null}
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
        {ticket.mine && (
          <div className="delete-ticket">
            {!confirmingDelete ? (
              <button
                type="button"
                className="delete-ticket-button"
                onClick={() => setConfirmingDelete(true)}
              >
                <Trash2 size={15} /> Delete my ticket
              </button>
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
            {deleteError && (
              <p className="vote-error" role="alert">
                {deleteError}
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

function MapView({
  state,
  selectedId,
  onSelect,
  onOpen,
}: {
  state: TicketsState
  selectedId: string | null
  onSelect: (id: string) => void
  onOpen: (id: string) => void
}) {
  const { tickets } = state
  const [showDetail, setShowDetail] = useState(true)
  const mapPage = useRef<HTMLElement>(null)
  const selected =
    tickets.find((ticket) => ticket.id === selectedId) ?? tickets[0] ?? null

  const markers = useMemo(() => tickets.map(ticketMarker), [tickets])
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
        {(state.error || !selected) && (
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
          onTicketChange={state.replaceTicket}
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
  onWelcome,
  onOpen,
  onEditAnswers,
}: {
  tickets: Ticket[]
  /** Guests have nothing to sign out of; this takes them back to the sign-in screen. */
  onWelcome: () => void
  onOpen: (id: string) => void
  /** Reopens the onboarding questions (signed-in people only). */
  onEditAnswers: () => void
}) {
  const { account, member, memberError, signIn, signOut } = useAccount()
  const [tab, setTab] = useState<"tickets" | "votes">("tickets")
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
      <div className="profile-cover">
        <div className="cover-pattern" />
      </div>
      <div className="profile-summary">
        <div className="large-avatar">{account?.initials ?? "G"}</div>
        <div className="profile-identity">
          <div>
            <h2>{account?.name ?? "Guest"}</h2>
            <span className="member-badge">
              <ShieldCheck size={14} />{" "}
              {!account
                ? "Not signed in"
                : member?.role === "facilities_staff"
                  ? "Facilities staff"
                  : "Community member"}
            </span>
          </div>
          <p>
            Your tickets and votes from this browser
            {joined && <span>Joined {joined}</span>}
          </p>
          {member?.onboardedAt && (
            <p className="profile-answers">{answersSummary(member)}</p>
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
              <div className="empty-state">
                {tab === "tickets" ? <MapPin size={24} /> : <ThumbsUp size={24} />}
                <h3>{tab === "tickets" ? "No tickets yet" : "No votes yet"}</h3>
                <p>
                  {tab === "tickets"
                    ? "Issues you report will show up here."
                    : "Open an issue and vote “Still there” or “Fixed” to see it here."}
                </p>
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
              <span>
                <Sparkles size={18} />
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
            <button>
              <Bell size={17} /> Notification preferences{" "}
              <ArrowRight size={16} />
            </button>
            <button>
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
  // Once a sign-in is confirmed, reload: "yours" and your votes now come from the account.
  const memberId = auth.member?.id
  const reloadTickets = ticketsState.reload
  useEffect(() => {
    if (memberId) reloadTickets()
  }, [memberId, reloadTickets])
  const openTicket =
    ticketsState.tickets.find((ticket) => ticket.id === openId) ?? null
  const closeTicket = useCallback(() => setOpenId(null), [])
  // The agent's drafted report for a ticket that was just posted, until dismissed.
  const [toSend, setToSend] = useState<ReportToSend | null>(null)
  const closeToSend = useCallback(() => setToSend(null), [])
  const openReport = useCallback(() => setReportOpen(true), [])
  const closeReport = useCallback(() => setReportOpen(false), [])
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
    return <Onboarding onContinue={() => setView("map")} />
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
      />
      <main className="app-main">
        <AppHeader
          title={title}
          subtitle={subtitle}
          onMenu={openMenu}
          setView={setView}
        />
        {page === "map" && (
          <MapView
            state={ticketsState}
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
            onWelcome={() => setView("onboarding")}
            onOpen={setOpenId}
            onEditAnswers={() => setQuestionsOpen(true)}
          />
        )}
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
            setToSend(drafted)
          }}
        />
      )}
      {toSend && <ReportReady {...toSend} onClose={closeToSend} />}
      {resourcesOpener && (
        <ResourcesDialog
          onClose={closeResources}
          opener={resourcesOpener}
          fallbackOpener={menuOpener.current}
        />
      )}
    </div>
  )
}

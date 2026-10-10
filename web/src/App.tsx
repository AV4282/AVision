import { useCallback, useEffect, useMemo, useState } from "react"
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
  Layers3,
  List,
  LocateFixed,
  LogOut,
  Map,
  MapPin,
  Menu,
  Navigation,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  ThumbsUp,
  User,
  X,
} from "lucide-react"
import {
  listTickets,
  PLACEHOLDER_PHOTO,
  type Status,
  type Ticket,
} from "./api"

type View = "onboarding" | "map" | "issues" | "profile"

type TicketsState = {
  tickets: Ticket[]
  loading: boolean
  error: string | null
  reload: () => void
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
  return { tickets, loading, error, reload }
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
  "City of Atlanta": "owner-blue",
  "GSU Facilities": "owner-green",
  MARTA: "owner-orange",
  GDOT: "owner-slate",
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand">
      <div className="brand-mark" aria-hidden="true">
        <Navigation size={compact ? 17 : 20} strokeWidth={2.6} />
      </div>
      <span className={compact ? "brand-name compact" : "brand-name"}>
        AVision
      </span>
    </div>
  )
}

function StatusPill({ status }: { status: Status }) {
  return (
    <span className={`status-pill ${status.toLowerCase().replace(" ", "-")}`}>
      <span className="status-dot" />
      {status}
    </span>
  )
}

function Onboarding({ onContinue }: { onContinue: () => void }) {
  const [step, setStep] = useState(0)

  const panels = [
    {
      eyebrow: "See it. Share it. Fix it.",
      title: "A more accessible city starts with you.",
      body: "Turn everyday accessibility barriers into mapped, trackable tickets—and help your community follow them through to a fix.",
      icon: <MapPin size={28} />,
    },
    {
      eyebrow: "One photo is enough",
      title: "Report barriers in a few simple steps.",
      body: "Upload a photo, confirm the location, and review the possible barrier. AVision routes your ticket to the right public agency.",
      icon: <Camera size={28} />,
    },
  ]
  const panel = panels[step]

  return (
    <main className="onboarding-shell">
      <header className="onboarding-header">
        <Brand />
        <button className="text-button" onClick={onContinue}>
          Explore as guest <ArrowRight size={16} />
        </button>
      </header>

      <section className="onboarding-grid">
        <div className="onboarding-story">
          <div className="story-glow one" />
          <div className="story-glow two" />
          <div className="story-map-lines" />
          <div className="story-content">
            <div className="story-icon">{panel.icon}</div>
            <p className="eyebrow light">{panel.eyebrow}</p>
            <h1>{panel.title}</h1>
            <p className="story-copy">{panel.body}</p>
          </div>
          <div className="story-ticket-card">
            <div className="mini-photo">
              <img src={PLACEHOLDER_PHOTO} alt="City sidewalk beside a street" />
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
            <button className="google-button" onClick={onContinue}>
              <span className="google-g">G</span>
              Continue with Google
              <ArrowRight size={17} />
            </button>
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
}: {
  view: View
  setView: (view: View) => void
  open: boolean
  onClose: () => void
  openCount: number
}) {
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
          <div className="report-icon">
            <Camera size={19} />
          </div>
          <strong>Spot a barrier?</strong>
          <p>Upload a photo and we’ll help route it.</p>
          <button onClick={() => navigate("issues")}>
            <Plus size={16} /> Report an issue
          </button>
        </div>
        <nav className="support-nav">
          <button>
            <HelpCircle size={18} /> Help & resources
          </button>
          <button>
            <Settings size={18} /> Settings
          </button>
        </nav>
        <div className="sidebar-user">
          <div className="avatar">AJ</div>
          <div>
            <strong>Alex Johnson</strong>
            <span>Community member</span>
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
  onMenu: () => void
  setView: (view: View) => void
}) {
  return (
    <header className="app-header">
      <div className="header-title">
        <button className="menu-button" onClick={onMenu} aria-label="Open menu">
          <Menu size={21} />
        </button>
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="header-actions">
        <button className="icon-button" aria-label="Notifications">
          <Bell size={19} />
          <span className="notification-dot" />
        </button>
        <button className="header-avatar" onClick={() => setView("profile")}>
          AJ
        </button>
      </div>
    </header>
  )
}

function MapArtwork({
  tickets,
  selectedId,
  onSelect,
}: {
  tickets: Ticket[]
  selectedId: string | null
  onSelect: (ticket: Ticket) => void
}) {
  return (
    <div className="map-artwork">
      <div className="park park-one">
        <span>Woodruff Park</span>
      </div>
      <div className="park park-two">
        <span>Hurt Park</span>
      </div>
      <svg
        className="street-map"
        viewBox="0 0 900 650"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g className="blocks">
          <path d="M-20 35L190 55 170 160 -20 145zM220 60L430 75 410 175 195 160zM460 78L680 95 650 195 435 176zM710 95L920 115 900 220 680 197z" />
          <path d="M-20 175L160 188 140 300 -20 280zM190 190L400 205 375 320 165 300zM430 207L635 225 610 340 405 319zM665 226L920 245 900 360 640 340z" />
          <path d="M-20 315L130 330 110 460 -20 440zM160 335L365 350 345 475 135 460zM395 350L595 370 570 500 370 477zM625 370L920 395 900 520 600 500z" />
          <path d="M-20 475L100 490 80 650H-20zM130 492L335 510 315 650H105zM365 512L550 530 530 650H340zM580 530L920 560 900 650H555z" />
        </g>
        <g className="minor-roads">
          <path d="M80 0L160 650M330 0L405 650M580 0L645 650M810 0L865 650" />
          <path d="M0 125L900 195M0 275L900 345M0 430L900 500" />
        </g>
        <path
          className="major-road"
          d="M-40 590C150 500 225 410 360 300S620 95 940 40"
        />
        <path className="rail" d="M-20 80C210 210 490 420 920 590" />
      </svg>
      <div className="map-label label-one">Peachtree St</div>
      <div className="map-label label-two">Decatur St SE</div>
      <div className="map-label label-three">Auburn Ave NE</div>
      <div className="map-campus">GEORGIA STATE UNIVERSITY</div>
      {tickets.map((ticket) => (
        <button
          key={ticket.id}
          className={`map-pin ${ownerColors[ticket.owner]} ${
            selectedId === ticket.id ? "selected" : ""
          }`}
          style={ticket.position}
          onClick={() => onSelect(ticket)}
          aria-label={`View ${ticket.title}`}
        >
          <MapPin size={20} fill="currentColor" />
          {ticket.reports > 1 && <span>{ticket.reports}</span>}
        </button>
      ))}
      <div className="map-tools">
        <button aria-label="Map layers">
          <Layers3 size={18} />
        </button>
        <button aria-label="Use my location">
          <LocateFixed size={18} />
        </button>
      </div>
      <div className="zoom-tools">
        <button aria-label="Zoom in">+</button>
        <button aria-label="Zoom out">−</button>
      </div>
      <span className="map-credit">© OpenStreetMap contributors</span>
    </div>
  )
}

function TicketDetail({
  ticket,
  onClose,
}: {
  ticket: Ticket
  onClose: () => void
}) {
  const [vote, setVote] = useState<"still" | "fixed" | null>(null)

  return (
    <aside className="ticket-detail">
      <div className="detail-handle" />
      <button
        className="detail-close"
        onClick={onClose}
        aria-label="Close ticket details"
      >
        <X size={18} />
      </button>
      <div className="detail-photo">
        <img src={ticket.image} alt="Reported sidewalk accessibility issue" />
        <div className="photo-count">
          <Camera size={14} /> {ticket.reports}{" "}
          {ticket.reports === 1 ? "report" : "reports"}
        </div>
      </div>
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
          <div className="vote-buttons">
            <button
              className={vote === "still" ? "selected" : ""}
              onClick={() => setVote("still")}
            >
              <Eye size={17} /> Still there
              <span>{ticket.stillThere + (vote === "still" ? 1 : 0)}</span>
            </button>
            <button
              className={vote === "fixed" ? "selected fixed" : ""}
              onClick={() => setVote("fixed")}
            >
              <Check size={17} /> Fixed
              <span>{ticket.fixed + (vote === "fixed" ? 1 : 0)}</span>
            </button>
          </div>
        </div>
        <button className="view-ticket-button">
          View full ticket <ArrowRight size={16} />
        </button>
        <p className="reported-time">
          <Clock3 size={14} /> First reported {ticket.firstReported.toLowerCase()}{" "}
          · Updated {ticket.time.toLowerCase()}
        </p>
      </div>
    </aside>
  )
}

function MapView({ state }: { state: TicketsState }) {
  const { tickets } = state
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showDetail, setShowDetail] = useState(true)
  const [query, setQuery] = useState("")
  // Default to the newest ticket; selectedId keeps pointing at fresh data after a reload.
  const selected =
    tickets.find((ticket) => ticket.id === selectedId) ?? tickets[0] ?? null

  return (
    <section className="map-page">
      <div className="map-toolbar">
        <label className="map-search">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search address or issue"
          />
        </label>
        <button className="filter-button">
          <SlidersHorizontal size={17} /> Filters
          <span>2</span>
        </button>
      </div>
      <div className="map-legend">
        <span>
          <i className="owner-blue" /> City
        </span>
        <span>
          <i className="owner-green" /> GSU
        </span>
        <span>
          <i className="owner-orange" /> MARTA
        </span>
        <span>
          <i className="owner-slate" /> GDOT
        </span>
      </div>
      <MapArtwork
        tickets={tickets}
        selectedId={selected?.id ?? null}
        onSelect={(ticket) => {
          setSelectedId(ticket.id)
          setShowDetail(true)
        }}
      />
      {!selected && (
        <div className="map-notice">
          <TicketsNotice
            state={state}
            emptyTitle="No issues reported yet"
            emptyText="Reported issues will appear as pins on the map."
          />
        </div>
      )}
      {selected && !showDetail && (
        <button className="reopen-detail" onClick={() => setShowDetail(true)}>
          <MapPin size={17} /> Open selected ticket
        </button>
      )}
      {selected && showDetail && (
        <TicketDetail
          key={selected.id}
          ticket={selected}
          onClose={() => setShowDetail(false)}
        />
      )}
    </section>
  )
}

function IssuesView({ state }: { state: TicketsState }) {
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
        <button className="primary-button">
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
          <article className="ticket-row" key={ticket.id}>
            <img src={ticket.image} alt="" />
            <div className="ticket-main">
              <div className="ticket-title-line">
                <h3>{ticket.title}</h3>
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
            <button className="row-action" aria-label={`View ${ticket.title}`}>
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

function ProfileView({
  tickets,
  onSignOut,
}: {
  tickets: Ticket[]
  onSignOut: () => void
}) {
  const [tab, setTab] = useState<"tickets" | "votes">("tickets")
  // Placeholder until sign-in: the profile shows sample tickets, not the user's own.
  const myTickets = tickets.slice(0, 3)

  return (
    <section className="profile-page page-content">
      <div className="profile-cover">
        <div className="cover-pattern" />
      </div>
      <div className="profile-summary">
        <div className="large-avatar">AJ</div>
        <div className="profile-identity">
          <div>
            <h2>Alex Johnson</h2>
            <span className="member-badge">
              <ShieldCheck size={14} /> Community member
            </span>
          </div>
          <p>
            <MapPin size={15} /> Downtown Atlanta
            <span>Joined October 2026</span>
          </p>
        </div>
        <button className="edit-profile-button">Edit profile</button>
      </div>

      <div className="profile-layout">
        <div className="profile-main">
          <div className="profile-tabs">
            <button
              className={tab === "tickets" ? "active" : ""}
              onClick={() => setTab("tickets")}
            >
              My tickets <span>3</span>
            </button>
            <button
              className={tab === "votes" ? "active" : ""}
              onClick={() => setTab("votes")}
            >
              My votes <span>12</span>
            </button>
          </div>
          <div className="profile-ticket-list">
            {(tab === "tickets" ? myTickets : tickets.slice(0, 4)).map(
              (ticket) => (
                <article className="profile-ticket" key={`${tab}-${ticket.id}`}>
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
                        {ticket.stillThere + ticket.fixed} votes
                      </span>
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
                <strong>3</strong>
                <span>Tickets created</span>
              </div>
              <div>
                <strong>12</strong>
                <span>Votes cast</span>
              </div>
              <div>
                <strong>2</strong>
                <span>Issues fixed</span>
              </div>
            </div>
            <div className="impact-progress">
              <div>
                <span>Neighborhood contributor</span>
                <strong>15 / 20</strong>
              </div>
              <div className="progress-track">
                <span />
              </div>
              <small>5 more actions to your next milestone</small>
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
            <button className="sign-out" onClick={onSignOut}>
              <LogOut size={17} /> Sign out
            </button>
          </div>
        </aside>
      </div>
    </section>
  )
}

function MobileNav({
  view,
  setView,
}: {
  view: View
  setView: (view: View) => void
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
      <button className="mobile-report">
        <Plus size={21} />
      </button>
      <button
        className={view === "profile" ? "active" : ""}
        onClick={() => setView("profile")}
      >
        <User size={19} /> Profile
      </button>
      <button>
        <Settings size={19} /> More
      </button>
    </nav>
  )
}

export default function App() {
  const [view, setView] = useState<View>("onboarding")
  const [menuOpen, setMenuOpen] = useState(false)
  const ticketsState = useTickets()

  if (view === "onboarding") {
    return <Onboarding onContinue={() => setView("map")} />
  }

  const titles = {
    map: ["Issue map", "Explore reported barriers around Atlanta"],
    issues: ["Community tickets", "See what your neighbors are reporting"],
    profile: ["My profile", "Manage your tickets and community activity"],
  } as const
  const [title, subtitle] = titles[view]

  return (
    <div className="app-shell">
      <Sidebar
        view={view}
        setView={setView}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        openCount={
          ticketsState.tickets.filter((ticket) => ticket.status === "Open")
            .length
        }
      />
      <main className="app-main">
        <AppHeader
          title={title}
          subtitle={subtitle}
          onMenu={() => setMenuOpen(true)}
          setView={setView}
        />
        {view === "map" && <MapView state={ticketsState} />}
        {view === "issues" && <IssuesView state={ticketsState} />}
        {view === "profile" && (
          <ProfileView
            tickets={ticketsState.tickets}
            onSignOut={() => setView("onboarding")}
          />
        )}
      </main>
      <MobileNav view={view} setView={setView} />
    </div>
  )
}

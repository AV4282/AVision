// Client for the AVision ticket API (api/ folder).
// In dev, requests go to /api and Vite proxies them to uvicorn on port 8000.
// For a deployed build, set VITE_API_URL to the API's full URL.

const API_URL = import.meta.env.VITE_API_URL ?? "/api"

export type Status = "Open" | "Likely fixed" | "Fixed"
export type Owner = "City of Atlanta" | "GSU Facilities" | "MARTA" | "GDOT"
export type VoteChoice = "still_there" | "fixed"

/** A ticket as the UI uses it. */
export type Ticket = {
  id: string // UUID, used for API calls
  code: string // short display ID, e.g. "AV-4A14"
  title: string
  description: string
  address: string
  owner: Owner
  status: Status
  time: string // last update, e.g. "12 min ago"
  firstReported: string // e.g. "2 days ago"
  createdAt: string // ISO timestamps, for counts and sorting
  updatedAt: string
  reports: number
  stillThere: number
  fixed: number
  myVote: VoteChoice | null
  image: string
  lat: number
  lng: number
}

/** Fields for POST /tickets. */
export type NewTicket = {
  title: string
  issueType: string // snake_case, e.g. "blocked_curb_ramp"
  owner: Owner
  lat: number
  lng: number
  address?: string
  description?: string
  photoUrl?: string
}

// ---------- API shapes and mapping ----------

type ApiOwner = "gsu_facilities" | "city_of_atlanta" | "marta" | "gdot"
type ApiStatus = "open" | "likely_fixed" | "fixed" | "merged"

type ApiTicket = {
  id: string
  created_at: string
  updated_at: string
  issue_type: string
  owner: ApiOwner
  lat: number
  lng: number
  address: string | null
  title: string
  description: string | null
  photo_url: string | null
  status: ApiStatus
  report_count: number
  last_seen_at: string
  still_there: number
  fixed: number
  my_vote: VoteChoice | null
}

const OWNER_FROM_API: Record<ApiOwner, Owner> = {
  city_of_atlanta: "City of Atlanta",
  gsu_facilities: "GSU Facilities",
  marta: "MARTA",
  gdot: "GDOT",
}
const OWNER_TO_API = Object.fromEntries(
  Object.entries(OWNER_FROM_API).map(([api, ui]) => [ui, api]),
) as Record<Owner, ApiOwner>

// Merged tickets are filtered out by the API, so they never reach the UI.
const STATUS_FROM_API: Record<Exclude<ApiStatus, "merged">, Status> = {
  open: "Open",
  likely_fixed: "Likely fixed",
  fixed: "Fixed",
}
const STATUS_TO_API = Object.fromEntries(
  Object.entries(STATUS_FROM_API).map(([api, ui]) => [ui, api]),
) as Record<Status, ApiStatus>

export const PLACEHOLDER_PHOTO =
  "https://images.unsplash.com/photo-1653701888795-a23335d9aee2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=82&w=900"

export function timeAgo(iso: string, now = Date.now()): string {
  const minutes = Math.floor((now - new Date(iso).getTime()) / 60_000)
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hr ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return "Yesterday"
  if (days < 30) return `${days} days ago`
  return new Date(iso).toLocaleDateString()
}

function toTicket(t: ApiTicket): Ticket {
  return {
    id: t.id,
    code: `AV-${t.id.slice(0, 4).toUpperCase()}`,
    title: t.title,
    description: t.description ?? "",
    address: t.address ?? "Location pinned on map",
    owner: OWNER_FROM_API[t.owner],
    status: STATUS_FROM_API[t.status === "merged" ? "open" : t.status],
    time: timeAgo(t.updated_at),
    firstReported: timeAgo(t.created_at),
    createdAt: t.created_at,
    updatedAt: t.updated_at,
    reports: t.report_count,
    stillThere: t.still_there,
    fixed: t.fixed,
    myVote: t.my_vote,
    image: t.photo_url || PLACEHOLDER_PHOTO,
    lat: t.lat,
    lng: t.lng,
  }
}

// ---------- guest identity ----------
// Until Auth0, each browser gets a guest user from POST /guests, kept in
// localStorage and sent as X-User-Id so votes stick to one person.

const GUEST_KEY = "avision.guestId"
let guestId: string | null = null
let guestRequest: Promise<string> | null = null

function readStoredGuest(): string | null {
  try {
    return localStorage.getItem(GUEST_KEY)
  } catch {
    return null // storage blocked (private mode, etc.): fall back to memory only
  }
}

function storeGuest(id: string | null) {
  guestId = id
  try {
    if (id) localStorage.setItem(GUEST_KEY, id)
    else localStorage.removeItem(GUEST_KEY)
  } catch {
    // memory copy above is enough for this page load
  }
}

export function getGuestId(): Promise<string> {
  guestId ??= readStoredGuest()
  if (guestId) return Promise.resolve(guestId)
  // Share one in-flight request so parallel calls don't create several guests.
  guestRequest ??= request<{ id: string }>("POST", "/guests", { auth: false })
    .then(({ id }) => {
      storeGuest(id)
      return id
    })
    .finally(() => {
      guestRequest = null
    })
  return guestRequest
}

// ---------- requests ----------

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

// FastAPI sends a string for our own errors, and a list for invalid fields
// (e.g. [{ loc: ["body", "photo_url"], msg: "String should match pattern ..." }]).
function errorMessage(detail: unknown): string | null {
  if (typeof detail === "string") return detail
  if (Array.isArray(detail) && detail.length > 0) {
    const { loc, msg } = detail[0] as { loc?: unknown[]; msg?: string }
    const field = loc?.[loc.length - 1]
    return typeof field === "string" ? `${field.replace(/_/g, " ")}: ${msg}` : (msg ?? null)
  }
  return null
}

async function request<T>(
  method: "GET" | "POST",
  path: string,
  { body, auth = true, retried = false }: { body?: unknown; auth?: boolean; retried?: boolean } = {},
): Promise<T> {
  const headers: Record<string, string> = {}
  if (body !== undefined) headers["Content-Type"] = "application/json"
  if (auth) headers["X-User-Id"] = await getGuestId()

  const res = await fetch(API_URL + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  // The stored guest no longer exists (e.g. the database was reset): get a new one, retry once.
  if (res.status === 401 && auth && !retried) {
    storeGuest(null)
    return request<T>(method, path, { body, auth, retried: true })
  }
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new ApiError(res.status, errorMessage(data?.detail) || `Request failed (${res.status})`)
  }
  return res.json() as Promise<T>
}

export async function listTickets(filters: { status?: Status; owner?: Owner } = {}): Promise<Ticket[]> {
  const params = new URLSearchParams()
  if (filters.status) params.set("status", STATUS_TO_API[filters.status])
  if (filters.owner) params.set("owner", OWNER_TO_API[filters.owner])
  const query = params.toString() ? `?${params}` : ""
  return (await request<ApiTicket[]>("GET", `/tickets${query}`)).map(toTicket)
}

export async function getTicket(id: string): Promise<Ticket> {
  return toTicket(await request<ApiTicket>("GET", `/tickets/${id}`))
}

export async function createTicket(ticket: NewTicket): Promise<Ticket> {
  const body = {
    title: ticket.title,
    issue_type: ticket.issueType,
    owner: OWNER_TO_API[ticket.owner],
    lat: ticket.lat,
    lng: ticket.lng,
    address: ticket.address || null,
    description: ticket.description || null,
    photo_url: ticket.photoUrl || null,
  }
  return toTicket(await request<ApiTicket>("POST", "/tickets", { body }))
}

export async function vote(ticketId: string, choice: VoteChoice): Promise<Ticket> {
  return toTicket(await request<ApiTicket>("POST", `/tickets/${ticketId}/votes`, { body: { vote: choice } }))
}

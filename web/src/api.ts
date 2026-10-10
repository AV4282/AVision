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
  position: { left: string; top: string } // placeholder map pin until Leaflet
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

// Stable pseudo-random pin spot from the ID, kept inside the 15–85% band so pins
// don't sit under the map's edges. Replaced by real lat/lng when Leaflet lands.
function placeholderPosition(id: string) {
  let hash = 0
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  return {
    left: `${15 + (hash % 70)}%`,
    top: `${15 + ((hash >>> 8) % 70)}%`,
  }
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
    position: placeholderPosition(t.id),
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

// ---------- signed-in account ----------

/** The AVision user behind a signed-in Auth0 account. */
export type Member = {
  id: string // AVision user ID (not the Auth0 ID)
  displayName: string | null
  avatarUrl: string | null
  role: "user" | "facilities_staff"
  joinedAt: string // ISO timestamp
}

/**
 * Tells the API someone signed in, proving who with their Auth0 access token.
 * The API creates their user the first time and returns the same one after.
 */
export async function recordSignIn(
  accessToken: string,
  profile: { displayName?: string; avatarUrl?: string },
): Promise<Member> {
  const res = await fetch(API_URL + "/me", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      display_name: profile.displayName || null,
      // The API only stores https picture links; anything else is left out.
      avatar_url: profile.avatarUrl?.startsWith("https://") ? profile.avatarUrl : null,
    }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new ApiError(res.status, errorMessage(data?.detail) || `Sign-in failed (${res.status})`)
  }
  const me = (await res.json()) as {
    id: string
    display_name: string | null
    avatar_url: string | null
    role: Member["role"]
    created_at: string
  }
  return {
    id: me.id,
    displayName: me.display_name,
    avatarUrl: me.avatar_url,
    role: me.role,
    joinedAt: me.created_at,
  }
}

// ---------- photos ----------
// A ticket stores a link to its photo (photo_url). uploadPhoto() sends the picture
// to the API, which keeps the file, and returns the link to put on the ticket.

const PHOTO_MAX_SIDE = 1600 // pixels; the API shrinks to the same size

/**
 * Shrinks a photo in the browser before sending it, so a 10 MB phone picture
 * uploads in a moment even on a weak signal. If the browser can't do it, the
 * original file is sent and the API shrinks it instead.
 */
async function shrinkPhoto(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" })
    const scale = Math.min(1, PHOTO_MAX_SIDE / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement("canvas")
    canvas.width = Math.max(1, Math.round(bitmap.width * scale))
    canvas.height = Math.max(1, Math.round(bitmap.height * scale))
    const context = canvas.getContext("2d")
    if (!context) return file
    context.fillStyle = "#fff" // see-through areas would turn black in a JPEG
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85),
    )
    return blob ?? file
  } catch {
    return file
  }
}

/** Uploads a photo and returns its full link, ready to use as a ticket's photoUrl. */
export async function uploadPhoto(file: File): Promise<string> {
  const form = new FormData()
  form.append("file", await shrinkPhoto(file), "photo.jpg")
  // No Content-Type header: the browser adds the right one for a form with a file.
  const res = await fetch(API_URL + "/uploads", { method: "POST", body: form })
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    const fallback =
      res.status === 413
        ? "That photo is too large. Try a smaller one."
        : `Photo upload failed (${res.status})`
    throw new ApiError(res.status, errorMessage(data?.detail) || fallback)
  }
  const { path } = (await res.json()) as { name: string; path: string }
  // The API answers with a path like "/uploads/abc.jpg"; tickets need a full link.
  return new URL(API_URL + path, window.location.origin).href
}

export async function vote(ticketId: string, choice: VoteChoice): Promise<Ticket> {
  return toTicket(await request<ApiTicket>("POST", `/tickets/${ticketId}/votes`, { body: { vote: choice } }))
}

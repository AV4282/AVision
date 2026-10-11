// Client for the AVision ticket API (api/ folder).
// In dev, requests go to /api and Vite proxies them to uvicorn on port 8000.
// For a deployed build, set VITE_API_URL to the API's full URL.
import type { MultiPolygon, Polygon } from "geojson"

const API_URL = import.meta.env.VITE_API_URL ?? "/api"

export type Status = "Open" | "Likely fixed" | "Fixed"
export type Owner = "City of Atlanta" | "GSU Facilities" | "Georgia Tech" | "MARTA" | "GDOT"

/** Every department a ticket can belong to, in the order they are listed in menus. */
export const OWNERS: readonly Owner[] = ["GSU Facilities", "Georgia Tech", "City of Atlanta", "MARTA", "GDOT"]

// The schools AVision covers, as saved in a person's profile.
export const GSU_SCHOOL = "Georgia State University"
export const GEORGIA_TECH_SCHOOL = "Georgia Institute of Technology"

/** The department that looks after a school's campus, or null for a school AVision doesn't cover. */
export function schoolOwner(school: string | null): Owner | null {
  const name = (school ?? "").trim().toLowerCase()
  if (name === GSU_SCHOOL.toLowerCase() || name === "gsu" || name === "georgia state") return "GSU Facilities"
  // Also what people typed under "Another school" before Georgia Tech was listed.
  if (name === GEORGIA_TECH_SCHOOL.toLowerCase() || name === "georgia tech" || name === "gatech" || name === "gt") {
    return "Georgia Tech"
  }
  return null
}
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
  /** True when this browser's user reported the ticket. */
  mine: boolean // the viewer posted it, so they can delete it
  /** The main photo, or a stock picture when the ticket has none. */
  image: string
  /** Every photo on the ticket (up to 5), main one first. Empty when it has none. */
  images: string[]
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
  photoUrl?: string // path from uploadPhoto(), e.g. "/uploads/abc.jpg"
  /** The photos after the main one, as paths from uploadPhoto(). Up to 4. */
  morePhotoUrls?: string[]
}

/** The most photos one ticket can have. */
export const MAX_TICKET_PHOTOS = 5

// ---------- API shapes and mapping ----------

type ApiOwner = "gsu_facilities" | "georgia_tech" | "city_of_atlanta" | "marta" | "gdot"
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
  photo_urls?: string[] // every photo, main one first (newer API versions)
  status: ApiStatus
  report_count: number
  last_seen_at: string
  still_there: number
  fixed: number
  my_vote: VoteChoice | null
  created_by_me?: boolean // missing from an API that hasn't been updated yet
}

const OWNER_FROM_API: Record<ApiOwner, Owner> = {
  city_of_atlanta: "City of Atlanta",
  gsu_facilities: "GSU Facilities",
  georgia_tech: "Georgia Tech",
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

/** What a ticket shows in place of an address when it has none. */
export const NO_ADDRESS = "Location pinned on map"

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
  // Older API versions sent only the one photo_url.
  const images = (t.photo_urls ?? (t.photo_url ? [t.photo_url] : []))
    .map(photoLink)
    .filter((link): link is string => link !== null)
  return {
    id: t.id,
    code: `AV-${t.id.slice(0, 4).toUpperCase()}`,
    title: t.title,
    description: t.description ?? "",
    address: t.address ?? NO_ADDRESS,
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
    mine: t.created_by_me === true,
    image: images[0] ?? PLACEHOLDER_PHOTO,
    images,
    lat: t.lat,
    lng: t.lng,
  }
}

// ---------- who is asking ----------
// Signed in: requests carry the Auth0 access token, and the API saves tickets
// and votes under the person's account (auth.tsx provides the token).
// Not signed in: the browser gets a guest user from POST /guests, kept in
// localStorage and sent as X-User-Id. Signing in moves the guest's activity
// to the account (see recordSignIn), and the guest ID is then forgotten.

let accessToken: (() => Promise<string | null>) | null = null

/** Set by auth.tsx once a sign-in is confirmed, and cleared on sign-out. */
export function setAccessTokenSource(source: (() => Promise<string | null>) | null) {
  accessToken = source
}

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
    /** What the server sent with the error, when it sent more than a sentence. */
    public detail?: unknown,
  ) {
    super(message)
  }
}

/**
 * A report the screening turned away, or a pause on posting after too many of those.
 * The server never posts a ticket in either case.
 */
export type ScreeningProblem = {
  code: "flagged" | "suspended"
  /** What was flagged: the photo, the words, or both. */
  what?: "photo" | "text" | "both"
  /** Why, in a sentence. */
  message: string
  /** Flagged attempts so far, and how many lead to a pause. */
  strikes?: number
  limit?: number
  /** When posting works again, if it is paused now. */
  suspendedUntil: string | null
}

/** The screening problem behind an error, or null when the error is something else. */
export function screeningProblem(err: unknown): ScreeningProblem | null {
  if (!(err instanceof ApiError) || !err.detail || typeof err.detail !== "object") return null
  const detail = err.detail as {
    code?: string
    what?: ScreeningProblem["what"]
    message?: string
    strikes?: number
    limit?: number
    suspended_until?: string | null
  }
  if (detail.code !== "flagged" && detail.code !== "suspended") return null
  return {
    code: detail.code,
    what: detail.what,
    message: detail.message ?? err.message,
    strikes: detail.strikes,
    limit: detail.limit,
    suspendedUntil: detail.suspended_until ?? null,
  }
}

// FastAPI sends a string for our own errors, and a list for invalid fields
// (e.g. [{ loc: ["body", "photo_url"], msg: "String should match pattern ..." }]).
function errorMessage(detail: unknown): string | null {
  if (typeof detail === "string") return detail
  // Screening sends an object: a sentence plus where the person stands.
  if (detail && typeof detail === "object" && !Array.isArray(detail)) {
    const { message } = detail as { message?: unknown }
    return typeof message === "string" ? message : null
  }
  if (Array.isArray(detail) && detail.length > 0) {
    const { loc, msg } = detail[0] as { loc?: unknown[]; msg?: string }
    const field = loc?.[loc.length - 1]
    return typeof field === "string" ? `${field.replace(/_/g, " ")}: ${msg}` : (msg ?? null)
  }
  return null
}

async function request<T>(
  method: "GET" | "POST" | "DELETE",
  path: string,
  { body, auth = true, retried = false }: { body?: unknown; auth?: boolean; retried?: boolean } = {},
): Promise<T> {
  const headers: Record<string, string> = {}
  if (body !== undefined) headers["Content-Type"] = "application/json"
  // Signed in: send the token. If it can't be had right now, carry on as a guest.
  const token = auth && accessToken ? await accessToken().catch(() => null) : null
  if (token) headers["Authorization"] = `Bearer ${token}`
  else if (auth) headers["X-User-Id"] = await getGuestId()

  const res = await fetch(API_URL + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  // The stored guest no longer exists (e.g. the database was reset): get a new one, retry once.
  if (res.status === 401 && auth && !token && !retried) {
    storeGuest(null)
    return request<T>(method, path, { body, auth, retried: true })
  }
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new ApiError(res.status, errorMessage(data?.detail) || `Request failed (${res.status})`, data?.detail)
  }
  if (res.status === 204) return undefined as T // e.g. a delete: nothing to read
  return res.json() as Promise<T>
}

export async function listTickets(filters: { status?: Status; owner?: Owner } = {}): Promise<Ticket[]> {
  const params = new URLSearchParams()
  if (filters.status) params.set("status", STATUS_TO_API[filters.status])
  if (filters.owner) params.set("owner", OWNER_TO_API[filters.owner])
  const query = params.toString() ? `?${params}` : ""
  return (await request<ApiTicket[]>("GET", `/tickets${query}`)).map(toTicket)
}

/** One ticket as the viewer sees it, or null when it no longer exists. */
export async function getTicket(ticketId: string): Promise<Ticket | null> {
  try {
    const found = await request<ApiTicket>("GET", `/tickets/${ticketId}`)
    // A merged ticket lives on as another one; this one is gone from every list.
    return found.status === "merged" ? null : toTicket(found)
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null
    throw err
  }
}

// ---------- live updates ----------
/** What the server says when a ticket changes. Only which ticket and what kind of change. */
export type LiveEvent = {
  type: "ticket_created" | "ticket_changed" | "ticket_deleted"
  id: string
}

// How long to wait before connecting again after the server turned us away,
// and the longest that wait is allowed to grow to.
const LIVE_RETRY_MS = 3_000
const LIVE_RETRY_MAX_MS = 30_000

/**
 * Listens to the server's stream of ticket changes (GET /events, see api/live.py),
 * so the page updates the moment someone posts, votes or deletes. Returns a
 * function that stops listening.
 *
 * The stream is the same for everyone and carries no personal details, so no
 * sign-in is sent with it. If it can't be reached the page still works; it just
 * goes back to showing changes on the next reload.
 */
export function watchLive(handlers: {
  onEvent: (event: LiveEvent) => void
  /** Connected again after being cut off. Anything may have changed in between. */
  onReconnect: () => void
  /** True while connected. */
  onStatus?: (connected: boolean) => void
}): () => void {
  if (typeof EventSource === "undefined") return () => {}
  let source: EventSource | null = null
  let stopped = false
  let missedSome = false
  let wait = LIVE_RETRY_MS
  let retry: number | undefined

  const connect = () => {
    source = new EventSource(`${API_URL}/events`)
    source.onopen = () => {
      wait = LIVE_RETRY_MS
      handlers.onStatus?.(true)
      if (missedSome) handlers.onReconnect()
      missedSome = false
    }
    source.onmessage = (message) => {
      try {
        const event = JSON.parse(message.data) as Partial<LiveEvent> | null
        if (event && typeof event.id === "string" && typeof event.type === "string") {
          handlers.onEvent(event as LiveEvent)
        }
      } catch {
        // Not a line this version understands. Skip it.
      }
    }
    source.onerror = () => {
      missedSome = true
      handlers.onStatus?.(false)
      // A dropped connection is retried by the browser. An error answer (the
      // server restarting, say) makes it give up for good, so then it's on us:
      // try again, waiting a little longer each time.
      if (source?.readyState === EventSource.CLOSED && !stopped) {
        retry = window.setTimeout(connect, wait)
        wait = Math.min(wait * 2, LIVE_RETRY_MAX_MS)
      }
    }
  }
  connect()

  return () => {
    stopped = true
    window.clearTimeout(retry)
    source?.close()
  }
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
    more_photo_urls: ticket.morePhotoUrls ?? [],
  }
  return toTicket(await request<ApiTicket>("POST", "/tickets", { body }))
}

// ---------- signed-in account ----------

/** The AVision user behind a signed-in Auth0 account. */
export type Member = {
  id: string // AVision user ID (not the Auth0 ID)
  displayName: string | null
  avatarUrl: string | null
  role: "user" | "facilities_staff" | "admin"
  joinedAt: string // ISO timestamp
  // Onboarding answers; null = not answered.
  isStudent: boolean | null
  school: string | null
  takesMarta: boolean | null
  onboardedAt: string | null // null = never saved, so the app asks
}

/** Answers to the onboarding questions. */
export type OnboardingAnswers = {
  isStudent: boolean | null
  school: string | null
  takesMarta: boolean | null
}

type ApiMember = {
  id: string
  display_name: string | null
  avatar_url: string | null
  role: Member["role"]
  created_at: string
  is_student: boolean | null
  school: string | null
  takes_marta: boolean | null
  onboarded_at: string | null
}

function toMember(me: ApiMember): Member {
  return {
    id: me.id,
    displayName: me.display_name,
    avatarUrl: me.avatar_url,
    role: me.role,
    joinedAt: me.created_at,
    isStudent: me.is_student,
    school: me.school,
    takesMarta: me.takes_marta,
    onboardedAt: me.onboarded_at,
  }
}

/** POST to an /me route as the signed-in person, and return their updated user. */
async function postAsMember(
  path: string,
  accessToken: string,
  body: unknown,
  failure: string,
  extraHeaders: Record<string, string> = {},
): Promise<Member> {
  const res = await fetch(API_URL + path, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new ApiError(res.status, errorMessage(data?.detail) || `${failure} (${res.status})`)
  }
  return toMember((await res.json()) as ApiMember)
}

/**
 * Tells the API someone signed in, proving who with their Auth0 access token.
 * The API creates their user the first time and returns the same one after.
 * Anything this browser did as a guest moves to the account, and the guest ID
 * is forgotten (a new one is made if they sign out and keep going).
 */
export async function recordSignIn(
  accessToken: string,
  profile: { displayName?: string; avatarUrl?: string },
): Promise<Member> {
  const guest = guestId ?? readStoredGuest()
  const member = await postAsMember(
    "/me",
    accessToken,
    {
      display_name: profile.displayName || null,
      // The API only stores https picture links; anything else is left out.
      avatar_url: profile.avatarUrl?.startsWith("https://") ? profile.avatarUrl : null,
    },
    "Sign-in failed",
    guest ? { "X-User-Id": guest } : {},
  )
  if (guest) storeGuest(null)
  return member
}

/** Saves the signed-in person's onboarding answers. A school is kept only for students. */
export async function saveOnboarding(
  accessToken: string,
  answers: OnboardingAnswers,
): Promise<Member> {
  return postAsMember(
    "/me/onboarding",
    accessToken,
    {
      is_student: answers.isStudent,
      school: answers.isStudent ? answers.school?.trim() || null : null,
      takes_marta: answers.takesMarta,
    },
    "Couldn’t save your answers",
  )
}

/**
 * Sets the signed-in person's profile picture. The server shrinks it and keeps
 * it; faces are not blurred in a profile picture. Later sign-ins keep it.
 */
export async function uploadAvatar(accessToken: string, file: File): Promise<Member> {
  const form = new FormData()
  form.append("file", await shrinkPhoto(file, 512), "avatar.jpg")
  const res = await fetch(API_URL + "/me/avatar", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: form,
  })
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new ApiError(res.status, errorMessage(data?.detail) || `Couldn’t save your picture (${res.status})`)
  }
  return toMember((await res.json()) as ApiMember)
}

/** Changes the signed-in person's display name. Later sign-ins keep it. */
export async function saveDisplayName(accessToken: string, displayName: string): Promise<Member> {
  return postAsMember(
    "/me/name",
    accessToken,
    { display_name: displayName.trim() },
    "Couldn’t save your name",
  )
}

// ---------- photos ----------
// uploadPhoto() sends the picture to the API, which keeps the file and answers with
// its path, e.g. "/uploads/abc.jpg". The ticket stores that path (photo_url), and
// photoLink() turns it into a link for this site, so it works locally and live.

/** The link to show a ticket's photo, or null if it has none. */
export function photoLink(photoUrl: string | null): string | null {
  if (!photoUrl) return null
  if (photoUrl.startsWith("/uploads/")) return API_URL + photoUrl
  return photoUrl // older tickets stored a full link
}

/** A stored photo's path as a complete web address, for putting in a message. */
function fullLink(photoPath: string): string {
  return new URL(photoLink(photoPath) ?? photoPath, window.location.origin).href
}

const PHOTO_MAX_SIDE = 1600 // pixels; the API shrinks to the same size

/**
 * Shrinks a photo in the browser before sending it, so a 10 MB phone picture
 * uploads in a moment even on a weak signal. If the browser can't do it, the
 * original file is sent and the API shrinks it instead.
 */
async function shrinkPhoto(file: File, maxSide = PHOTO_MAX_SIDE): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" })
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
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

/**
 * Whether AVision takes reports at a position (the City of Atlanta and MARTA
 * rail stations). Returns null if it's covered, or the reason it isn't. If the
 * check itself can't be made, this says "covered": the server checks again
 * when the ticket is posted.
 */
export async function outsideCoverage(lat: number, lng: number): Promise<string | null> {
  return (await checkSpot(lat, lng)).outside
}

/** Departments that can't be chosen at a spot, each with the reason. */
export type BlockedOwners = Partial<Record<Owner, string>>

/**
 * What the server says about a spot before anything is posted: `outside` is
 * why it can't be reported at all (null when it can), and `blocked` lists the
 * departments that can't take it. GSU Facilities and Georgia Tech only take
 * tickets on their own campus. If the check can't be made this says all is
 * fine: the server checks again when the ticket is posted.
 */
export async function checkSpot(lat: number, lng: number): Promise<{ outside: string | null; blocked: BlockedOwners }> {
  try {
    const res = await fetch(`${API_URL}/coverage?lat=${lat.toFixed(6)}&lng=${lng.toFixed(6)}`)
    if (!res.ok) return { outside: null, blocked: {} }
    const area = (await res.json()) as {
      covered: boolean
      reason: string
      blocked?: Partial<Record<ApiOwner, string>>
    }
    const blocked: BlockedOwners = {}
    for (const [owner, why] of Object.entries(area.blocked ?? {})) {
      const name = OWNER_FROM_API[owner as ApiOwner]
      if (name && why) blocked[name] = why
    }
    return { outside: area.covered ? null : area.reason, blocked }
  } catch {
    return { outside: null, blocked: {} }
  }
}

/** A campus outline: tickets for `owner` can only be placed inside it. */
export type CampusOutline = {
  owner: Owner
  name: string
  geometry: Polygon | MultiPolygon
}

let campuses: Promise<CampusOutline[]> | null = null

/** The campus outlines, for the map in the form to draw. Empty when they can't be had. */
export function campusOutlines(): Promise<CampusOutline[]> {
  campuses ??= fetch(`${API_URL}/campuses`)
    .then((res) => (res.ok ? res.json() : { campuses: [] }))
    .then((data: { campuses: { owner: ApiOwner; name: string; geometry: CampusOutline["geometry"] }[] }) =>
      data.campuses
        .filter((campus) => OWNER_FROM_API[campus.owner])
        .map((campus) => ({ ...campus, owner: OWNER_FROM_API[campus.owner] })),
    )
    .catch(() => {
      campuses = null // try again next time
      return []
    })
  return campuses
}

/** A photo the API has stored. */
export type UploadedPhoto = {
  /** What to put on the ticket as its photoUrl, e.g. "/uploads/abc.jpg". */
  path: string
  /**
   * How many faces and license plates the server blurred before saving the
   * photo. Both are null when the server stores photos without checking them.
   */
  facesHidden: number | null
  platesHidden: number | null
}

/**
 * Uploads a photo. The server hides faces and license plates before it saves
 * the picture (when its photo privacy service is running), so what comes back
 * is the version everyone will see.
 */
export async function uploadPhoto(file: File): Promise<UploadedPhoto> {
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
  const saved = (await res.json()) as {
    path: string
    faces_hidden?: number | null
    plates_hidden?: number | null
  }
  return {
    path: saved.path,
    facesHidden: saved.faces_hidden ?? null,
    platesHidden: saved.plates_hidden ?? null,
  }
}

// ---------- report agent ----------
// The agent on the server looks at an uploaded photo and works out the issue,
// the department to send it to, the address and a drafted report (api/agent.py).
// Gemini picks the department from what the photo shows and where it is. Nothing
// is saved by it: the form shows the result and the person decides what to post.

/** How to reach an owner. Always from the server's contacts file, never written by AI. */
export type OwnerContact = {
  name: string
  phone: string | null
  phone_note: string | null
  email: string | null
  web: string | null
  web_label: string | null
  hours: string | null
}

/** A drafted report for the owner, for the person to send themselves. */
export type DraftedReport = {
  subject: string
  message: string
  phone_script: string
}

export type PhotoAnalysis = {
  /** False when the photo doesn't show a problem; then only `summary` is filled in. */
  reportable: boolean
  summary: string
  issueType: string
  title: string
  description: string
  possibleBarriers: string[]
  severity: "low" | "medium" | "high"
  /** 0 to 1: how sure the analysis is of the issue type. */
  confidence: number
  owner: Owner | null
  /** Why that owner was picked, in plain words. */
  ownerReason: string | null
  contact: OwnerContact | null
  address: string | null
  report: DraftedReport | null
  /** True when a Microsoft Foundry agent ran the steps; false when the server ran them itself. */
  usedAgent: boolean
}

type ApiAnalysis = {
  analysis: {
    is_reportable: boolean
    issue_type: string
    title: string
    description: string
    possible_barriers: string[]
    severity: "low" | "medium" | "high"
    confidence: number
  }
  owner: ApiChosenOwner | null
  contact: OwnerContact | null
  address: string | null
  report: DraftedReport | null
  summary: string
  orchestrator: "foundry_agent" | "foundry_model" | "direct"
}

/** The department a report goes to, why, and who decided (see api/agent.py). */
type ApiChosenOwner = {
  id: ApiOwner
  name: string
  rule: string
  reason: string
  decided_by: "gemini" | "rules" | "person" | "ticket"
}

/** Whether the server has photo analysis set up, so the form knows to offer it. */
export async function analysisAvailable(): Promise<boolean> {
  try {
    const res = await fetch(API_URL + "/analyze/status")
    return res.ok && (await res.json()).available === true
  } catch {
    return false
  }
}

/** Where the viewer stands with screening. `suspendedUntil` is set while their posting is paused. */
export async function screeningStatus(): Promise<{ strikes: number; limit: number; suspendedUntil: string | null }> {
  const now = await request<{ strikes: number; limit: number; suspended_until: string | null }>(
    "GET",
    "/screening/status",
  )
  return { strikes: now.strikes, limit: now.limit, suspendedUntil: now.suspended_until }
}

/**
 * Runs the report agent on a photo that uploadPhoto() already stored.
 * `photoUrl` is the link uploadPhoto() returned. Takes around 10 to 30 seconds.
 */
export async function analyzePhoto(
  photoUrl: string,
  lat: number,
  lng: number,
  /** The report's other photos (paths), to list in the drafted report. The agent looks at the first only. */
  morePhotoUrls: string[] = [],
): Promise<PhotoAnalysis> {
  const body = {
    photo: photoUrl.slice(photoUrl.lastIndexOf("/") + 1),
    lat: Number(lat.toFixed(6)),
    lng: Number(lng.toFixed(6)),
    // The drafted report mentions the photos, so these have to be full links.
    photo_url: fullLink(photoUrl),
    more_photo_urls: morePhotoUrls.map(fullLink),
  }
  const found = await request<ApiAnalysis>("POST", "/analyze", { body })
  return {
    reportable: found.analysis.is_reportable,
    summary: found.summary,
    issueType: found.analysis.issue_type,
    title: found.analysis.title,
    description: found.analysis.description,
    possibleBarriers: found.analysis.possible_barriers,
    severity: found.analysis.severity,
    confidence: found.analysis.confidence,
    owner: found.owner ? OWNER_FROM_API[found.owner.id] : null,
    ownerReason: found.owner?.reason ?? null,
    contact: found.contact,
    address: found.address,
    report: found.report,
    usedAgent: found.orchestrator !== "direct",
  }
}

/** The department and message the server prepared for a ticket that is being posted. */
export type TicketDraft = {
  owner: Owner
  /** Why that department, in plain words. */
  ownerReason: string
  /** "gemini": the AI chose it. "rules": fixed map rules did. "person": picked in the form. "ticket": the ticket's own. */
  decidedBy: "gemini" | "rules" | "person" | "ticket"
  contact: OwnerContact
  report: DraftedReport
}

/**
 * Asks the server which department a ticket should go to and for a message to
 * send it. Gemini decides from the issue and the place; pass `owner` when the
 * person picked the department themselves. Nothing is saved or sent.
 * Takes a few seconds, or around 15 with a photo the AI hasn't looked at yet.
 */
export async function draftReport(ticket: {
  title: string
  issueType: string
  lat: number
  lng: number
  address?: string
  description?: string
  /** The path uploadPhoto() returned, when the ticket has a photo. */
  photoPath?: string
  /** The ticket's other photos, as paths. */
  morePhotoPaths?: string[]
  owner?: Owner
}): Promise<TicketDraft> {
  const body = {
    title: ticket.title,
    issue_type: ticket.issueType,
    lat: ticket.lat,
    lng: ticket.lng,
    address: ticket.address || null,
    description: ticket.description || null,
    photo: ticket.photoPath ? ticket.photoPath.slice(ticket.photoPath.lastIndexOf("/") + 1) : null,
    // The message mentions the photos, so these have to be full links.
    photo_url: ticket.photoPath ? fullLink(ticket.photoPath) : null,
    more_photo_urls: (ticket.morePhotoPaths ?? []).map(fullLink),
    owner: ticket.owner ? OWNER_TO_API[ticket.owner] : null,
  }
  const drafted = await request<{
    owner: ApiChosenOwner
    contact: OwnerContact
    report: DraftedReport
  }>("POST", "/draft", { body })
  return {
    owner: OWNER_FROM_API[drafted.owner.id],
    ownerReason: drafted.owner.reason,
    decidedBy: drafted.owner.decided_by,
    contact: drafted.contact,
    report: drafted.report,
  }
}

// ---------- notifications ----------
/**
 * Something that happened to a ticket the viewer posted or voted on. The server
 * adds these (api/db.py); nobody is told about their own actions.
 */
export type Notice = {
  id: string
  /** still_there, marked_fixed, likely_fixed, fixed, reopened, reported, moved, rerouted or removed. */
  kind: string
  /** True when the viewer posted the ticket, false when they voted on it. */
  yours: boolean
  /** Null once the ticket is gone. */
  ticketId: string | null
  ticketTitle: string
  time: string // e.g. "5 min ago"
  read: boolean
}

type ApiNotice = {
  id: string
  kind: string
  yours: boolean
  ticket_id: string | null
  ticket_title: string
  created_at: string
  read: boolean
}

/** The viewer's newest notifications, and how many they haven't seen yet. */
export async function listNotices(): Promise<{ unread: number; items: Notice[] }> {
  const found = await request<{ unread: number; items: ApiNotice[] }>("GET", "/notifications")
  return {
    unread: found.unread,
    items: found.items.map((n) => ({
      id: n.id,
      kind: n.kind,
      yours: n.yours,
      ticketId: n.ticket_id,
      ticketTitle: n.ticket_title,
      time: timeAgo(n.created_at),
      read: n.read,
    })),
  }
}

/**
 * Deletes the viewer's notifications for good: the ones listed, or all of them
 * when no list is given. The tickets themselves are not touched.
 */
export async function clearNotices(ids?: string[]): Promise<void> {
  await request<void>("POST", "/notifications/clear", { body: ids ? { ids } : {} })
}

/** Marks notifications as seen, so they stop counting on the bell. */
export async function markNoticesRead(ids: string[]): Promise<void> {
  if (ids.length > 0) await request<void>("POST", "/notifications/read", { body: { ids } })
}

/**
 * Asks the server for a follow-up message about a ticket that is still there,
 * written from the ticket and addressed to its department. Nothing is saved or
 * sent. Takes a few seconds.
 */
export async function followUpReport(ticket: Ticket): Promise<TicketDraft> {
  // The message mentions the photos, so these have to be full links.
  const links = ticket.images.map((image) => new URL(image, window.location.origin).href)
  const body = { photo_url: links[0] ?? null, more_photo_urls: links.slice(1) }
  const drafted = await request<{
    owner: ApiChosenOwner
    contact: OwnerContact
    report: DraftedReport
  }>("POST", `/tickets/${ticket.id}/follow-up`, { body, auth: false })
  return {
    owner: OWNER_FROM_API[drafted.owner.id],
    ownerReason: drafted.owner.reason,
    decidedBy: drafted.owner.decided_by,
    contact: drafted.contact,
    report: drafted.report,
  }
}

/** Deletes a ticket. Only the person who posted it can, or an admin. */
export async function deleteTicket(ticketId: string): Promise<void> {
  await request<void>("DELETE", `/tickets/${ticketId}`)
}

/**
 * Changes where a ticket is and/or which department it goes to. Only its
 * poster can, or an admin. Send the ticket's own position to leave it in place.
 *
 * Without `owner`, the server only changes the department when a move calls
 * for it (the new spot belongs to a different one, say off a campus).
 */
export async function moveTicket(
  ticketId: string,
  to: { lat: number; lng: number; address: string; owner?: Owner },
): Promise<Ticket> {
  const body = {
    lat: to.lat,
    lng: to.lng,
    address: to.address || null,
    owner: to.owner ? OWNER_TO_API[to.owner] : null,
  }
  return toTicket(await request<ApiTicket>("POST", `/tickets/${ticketId}/location`, { body }))
}

/**
 * Tells the server the viewer went to send a report about a ticket (they
 * pressed one of the send buttons on its drafted message). Each person counts
 * once, so calling it again is harmless. Returns the ticket with its new count.
 */
export async function reportSent(ticketId: string): Promise<Ticket> {
  return toTicket(await request<ApiTicket>("POST", `/tickets/${ticketId}/reports`))
}

/** Marks a ticket as fixed. Admins only. */
export async function closeTicket(ticketId: string): Promise<Ticket> {
  return toTicket(await request<ApiTicket>("POST", `/tickets/${ticketId}/close`))
}

export async function vote(ticketId: string, choice: VoteChoice): Promise<Ticket> {
  return toTicket(await request<ApiTicket>("POST", `/tickets/${ticketId}/votes`, { body: { vote: choice } }))
}

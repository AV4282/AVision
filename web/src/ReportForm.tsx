import { lazy, Suspense, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react"
import { Camera, Check, LoaderCircle, Phone, ShieldCheck, Sparkles, TriangleAlert, X } from "lucide-react"
import AddressField from "./AddressField"
import {
  analysisAvailable,
  analyzePhoto,
  createTicket,
  draftReport,
  MAX_TICKET_PHOTOS,
  outsideCoverage,
  photoLink,
  uploadPhoto,
  type Owner,
  type PhotoAnalysis,
  type Ticket,
  type TicketDraft,
  type UploadedPhoto,
} from "./api"
import { nearestAddress } from "./geocode"
import PhotoViewer from "./PhotoViewer"
import type { ReportToSend } from "./ReportReady"
import type { ReportLocation } from "./ReportLocationPicker"

const ReportLocationPicker = lazy(() => import("./ReportLocationPicker"))

// Same snake_case values as reports.issue_type, so tickets and reports line up.
const ISSUE_TYPES = [
  { value: "blocked_curb_ramp", label: "Blocked curb ramp" },
  { value: "missing_curb_cut", label: "Missing curb ramp" },
  { value: "damaged_sidewalk", label: "Damaged sidewalk" },
  { value: "broken_elevator", label: "Broken elevator" },
  { value: "broken_escalator", label: "Broken escalator" },
  { value: "damaged_tactile_paving", label: "Damaged tactile paving" },
  { value: "missing_crosswalk_signal", label: "Missing crosswalk signal" },
  { value: "other", label: "Something else" },
] as const

// The department is chosen on the server when the ticket is posted, by Gemini,
// from the issue and the place (api/agent.py). These are for picking one by hand.
const OWNERS: Owner[] = ["City of Atlanta", "GSU Facilities", "Georgia Tech", "MARTA", "GDOT"]
const LET_AVISION_CHOOSE = "auto"
// What the ticket is filed under if the choice can't be made (the server is unreachable).
const FALLBACK_OWNER: Owner = "City of Atlanta"
// Writing the report is worth a wait, but not a long one: past this the ticket posts without it.
const DRAFT_WAIT_MS = 60_000

/** "2 faces and 1 license plate" across the given photos, or null when nothing was hidden. */
function hiddenSummary(stored: UploadedPhoto[]): string | null {
  const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`
  const faces = stored.reduce((sum, photo) => sum + (photo.facesHidden ?? 0), 0)
  const plates = stored.reduce((sum, photo) => sum + (photo.platesHidden ?? 0), 0)
  const parts = [
    faces ? count(faces, "face", "faces") : null,
    plates ? count(plates, "license plate", "license plates") : null,
  ].filter(Boolean)
  return parts.length ? parts.join(" and ") : null
}

/**
 * One photo chosen for the ticket. It is sent to the server as soon as it is
 * chosen, so the person sees the version everyone else will (faces and license
 * plates hidden) before they post.
 */
type ChosenPhoto = {
  id: number
  file: File
  /** A link to the file on this device, to show it before the upload finishes. */
  preview: string
  /** The upload, running or finished. Replaced when a failed one is tried again. */
  upload: Promise<UploadedPhoto>
  /** The photo as the server stored it, once the upload is done. */
  stored: UploadedPhoto | null
  /** Why the upload failed, if it did. */
  error: string | null
}

// Where the ticket goes on the map: a dropped pin, the device's position, or
// the position of an address picked from the suggestions.
type Location = ReportLocation & { accuracy?: number; fromAddress?: boolean }

export default function ReportForm({
  onClose,
  onCreated,
}: {
  onClose: () => void
  /** `toSend` is the drafted message for the ticket's department. Null only if it couldn't be written. */
  onCreated: (ticket: Ticket, toSend: ReportToSend | null) => void
}) {
  const [issueType, setIssueType] = useState<string>(ISSUE_TYPES[0].value)
  const [title, setTitle] = useState<string>(ISSUE_TYPES[0].label)
  const [titleEdited, setTitleEdited] = useState(false)
  const [owner, setOwner] = useState<Owner | typeof LET_AVISION_CHOOSE>(LET_AVISION_CHOOSE)
  const [address, setAddress] = useState("")
  const [description, setDescription] = useState("")
  // Up to five photos. The first is the ticket's main photo: the one on the
  // map, and the one the report agent looks at.
  const [photos, setPhotos] = useState<ChosenPhoto[]>([])
  const nextPhotoId = useRef(1)
  // The photo open in the viewer, by id.
  const [viewingPhoto, setViewingPhoto] = useState<number | null>(null)
  // Something to say about the last pick, e.g. that not every file fit.
  const [photoNotice, setPhotoNotice] = useState<string | null>(null)
  // "photo" while the picture uploads, "draft" while the report is written,
  // "ticket" while the ticket is saved.
  const [stage, setStage] = useState<"photo" | "draft" | "ticket">("ticket")
  const fileInput = useRef<HTMLInputElement>(null)
  // The report agent: looks at the photo and fills in the form (see api/agent.py).
  const [canAnalyze, setCanAnalyze] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [found, setFound] = useState<PhotoAnalysis | null>(null)
  // Where the ticket was placed when `found` was worked out. The department
  // depends on the place, so findings from another spot aren't reused.
  const foundAt = useRef<{ lat: number; lng: number } | null>(null)
  // The photos on the form when `found` was worked out. The drafted message
  // lists them, so it isn't reused once photos are added or removed.
  const foundPhotos = useRef("")
  const [analyzeError, setAnalyzeError] = useState<string | null>(null)
  const [location, setLocation] = useState<Location | null>(null)
  const [locating, setLocating] = useState(false)
  const placeLookup = useRef(0) // so a slow, older address lookup can't overwrite a newer one
  const locationRequest = useRef(0)
  const addressEdited = useRef(false)
  const analysisRevision = useRef(0)
  const analysisOwner = useRef<Owner | null>(null)
  const [addressStatus, setAddressStatus] = useState("")
  const [locationError, setLocationError] = useState<string | null>(null)
  // Why this spot can't be reported, when it is outside the area AVision covers.
  const [outside, setOutside] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => () => {
    ++placeLookup.current
    ++locationRequest.current
    ++analysisRevision.current
  }, [])

  useEffect(() => {
    if (!location || location.fromAddress || submitting) return
    const controller = new AbortController()
    const lookup = placeLookup.current
    const timer = window.setTimeout(async () => {
      const nearby = await nearestAddress(location.lat, location.lng, controller.signal)
      if (controller.signal.aborted || lookup !== placeLookup.current) return
      if (nearby) {
        if (!addressEdited.current) setAddress(nearby)
        setAddressStatus(addressEdited.current ? `Nearest address: ${nearby}. Your address was kept.` : "Nearest address filled in. You can edit it.")
      } else {
        setAddressStatus("No address found. Your precise coordinates are kept; you can add a landmark.")
      }
    }, 500)
    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [location, submitting])

  function confirmLocation(point: Location) {
    if (submitting) return
    ++placeLookup.current
    ++locationRequest.current
    setLocating(false)
    setError(null)
    setLocationError(null)
    setAddressStatus(point.fromAddress ? "Address and pin synchronized." : "Looking up the nearest address…")
    if (!addressEdited.current) setAddress("")
    if (analysisOwner.current && owner === analysisOwner.current) setOwner(LET_AVISION_CHOOSE)
    analysisOwner.current = null
    forgetFindings()
    setLocation({ lat: point.lat, lng: point.lng, accuracy: point.accuracy, fromAddress: point.fromAddress })
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose, submitting])

  // AVision only takes reports in Atlanta. Say so as soon as a spot outside it
  // is chosen, not after the form has been filled in.
  useEffect(() => {
    setOutside(null)
    if (!location) return
    let current = true
    outsideCoverage(location.lat, location.lng).then((reason) => {
      if (current) setOutside(reason)
    })
    return () => {
      current = false
    }
  }, [location])

  // Offer "fill in from photo" only when the server has it set up.
  useEffect(() => {
    let current = true
    analysisAvailable().then((available) => {
      if (current) setCanAnalyze(available)
    })
    return () => {
      current = false
    }
  }, [])

  // The device-side links are released when the form closes.
  const photosNow = useRef(photos)
  photosNow.current = photos
  useEffect(() => () => photosNow.current.forEach((photo) => URL.revokeObjectURL(photo.preview)), [])

  /** Sends a photo to the server and records how it went on its entry in the list. */
  function startUpload(id: number, file: File): Promise<UploadedPhoto> {
    const upload = uploadPhoto(file)
    const update = (change: Partial<ChosenPhoto>) =>
      setPhotos((list) => list.map((photo) => (photo.id === id && photo.upload === upload ? { ...photo, ...change } : photo)))
    upload.then(
      (stored) => update({ stored, error: null }),
      (err) => update({ error: err instanceof Error ? err.message : "Couldn’t upload the photo." }),
    )
    return upload
  }

  /** The stored version of a chosen photo, waiting for its upload, or trying again if it failed. */
  function storedPhoto(photo: ChosenPhoto): Promise<UploadedPhoto> {
    if (photo.stored) return Promise.resolve(photo.stored)
    if (!photo.error) return photo.upload
    const upload = startUpload(photo.id, photo.file)
    setPhotos((list) => list.map((each) => (each.id === photo.id ? { ...each, upload, error: null } : each)))
    return upload
  }

  function choosePhotos(event: ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(event.target.files ?? [])
    event.target.value = "" // so picking the same file again still counts as a change
    if (picked.length === 0) return
    const images = picked.filter((file) => file.type.startsWith("image/"))
    const room = MAX_TICKET_PHOTOS - photos.length
    const adding = images.slice(0, room)
    if (images.length < picked.length) {
      setPhotoNotice("Some of those files aren’t photos. Choose JPEG, PNG or WebP images.")
    } else if (images.length > room) {
      setPhotoNotice(
        `A ticket can have up to ${MAX_TICKET_PHOTOS} photos, so only the first ${room === 1 ? "one was" : `${room} were`} added.`,
      )
    } else {
      setPhotoNotice(null)
    }
    if (adding.length === 0) return
    const added = adding.map((file) => {
      const id = nextPhotoId.current++
      return { id, file, preview: URL.createObjectURL(file), upload: startUpload(id, file), stored: null, error: null }
    })
    // The agent's findings are about the first photo; they only go stale if that one is new.
    if (photos.length === 0) forgetFindings()
    setPhotos((list) => [...list, ...added])
  }

  function removePhoto(id: number) {
    const leaving = photos.find((photo) => photo.id === id)
    if (!leaving) return
    setPhotoNotice(null)
    URL.revokeObjectURL(leaving.preview)
    if (photos[0]?.id === id) forgetFindings() // the findings were about this photo
    setPhotos((list) => list.filter((photo) => photo.id !== id))
  }

  // Once the server has a photo, show its copy: that is the one that gets posted.
  const shown = (photo: ChosenPhoto) => (photo.stored && photoLink(photo.stored.path)) || photo.preview
  const viewed = photos.find((photo) => photo.id === viewingPhoto)
  const allStored = photos.every((photo) => photo.stored !== null)
  const failedAt = photos.findIndex((photo) => photo.error)
  // Named by position, so it doesn't rely on the red outline alone.
  const uploadProblem =
    failedAt < 0
      ? null
      : photos.length > 1
        ? `Photo ${failedAt + 1}: ${photos[failedAt].error} Remove it to post the rest.`
        : photos[failedAt].error
  const waitingFor = photos.filter((photo) => !photo.stored && !photo.error).length
  const storedPhotos = photos.flatMap((photo) => (photo.stored ? [photo.stored] : []))

  // Findings and pending analysis belong to one photo and confirmed location.
  function forgetFindings() {
    ++analysisRevision.current
    foundAt.current = null
    setFound(null)
    setAnalyzeError(null)
  }

  async function fillFromPhoto() {
    if (photos.length === 0 || analyzing || submitting) return
    if (!location) {
      setAnalyzeError("Choose a location below before analyzing the photo.")
      return
    }
    const revision = ++analysisRevision.current
    const where = location
    setAnalyzing(true)
    setAnalyzeError(null)
    try {
      // The agent looks at the first photo. The others are listed in the message it drafts.
      const saved = await Promise.all(photos.map(storedPhoto))
      if (revision !== analysisRevision.current) return
      const paths = saved.map((photo) => photo.path)
      const result = await analyzePhoto(paths[0], where.lat, where.lng, paths.slice(1))
      if (revision !== analysisRevision.current) return
      setFound(result)
      foundAt.current = { lat: where.lat, lng: where.lng }
      foundPhotos.current = paths.join("|")
      if (result.reportable) {
        // Fill the form in. Everything stays editable, and nothing is posted yet.
        const known = ISSUE_TYPES.some((type) => type.value === result.issueType)
        setIssueType(known ? result.issueType : "other")
        setTitle(result.title.slice(0, 120))
        setTitleEdited(true)
        setDescription(result.description.slice(0, 2000))
        if (result.owner) {
          setOwner(result.owner)
          analysisOwner.current = result.owner
        }
        const nearby = result.address
        if (nearby && !addressEdited.current) setAddress((typed) => (typed.trim() ? typed : nearby))
      }
    } catch (err) {
      if (revision === analysisRevision.current) setAnalyzeError(
        err instanceof Error ? err.message : "Couldn’t analyze the photo. Fill in the form yourself.",
      )
    } finally {
      setAnalyzing(false)
    }
  }

  function chooseIssueType(value: string) {
    setIssueType(value)
    // Keep the title in step with the type until the user writes their own.
    const label = ISSUE_TYPES.find((type) => type.value === value)?.label
    if (!titleEdited && label && value !== "other") setTitle(label)
    if (!titleEdited && value === "other") setTitle("")
  }

  function useMyLocation() {
    if (locating || submitting) return
    if (!("geolocation" in navigator)) {
      setLocationError("This browser can’t share its location.")
      return
    }
    setLocating(true)
    setLocationError(null)
    const lookup = ++locationRequest.current
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (lookup !== locationRequest.current) return
        const { latitude, longitude, accuracy } = position.coords
        confirmLocation({ lat: latitude, lng: longitude, accuracy })
      },
      (err) => {
        if (lookup !== locationRequest.current) return
        setLocationError(
          err.code === err.PERMISSION_DENIED
            ? "Location permission was denied. Choose a pin or an address suggestion."
            : "Couldn’t get your location. Choose a pin or an address suggestion.",
        )
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
    )
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (submitting) return
    if (!location) {
      setError("Choose a location: drop a pin, select an address suggestion, or use your location.")
      return
    }
    ++placeLookup.current
    ++locationRequest.current
    ++analysisRevision.current
    setLocating(false)
    setSubmitting(true)
    setError(null)
    try {
      const where = location
      // Any photo still uploading is waited for; one that failed is tried again.
      if (photos.length > 0) setStage("photo")
      const paths = (await Promise.all(photos.map(storedPhoto))).map((photo) => photo.path)
      const photoUrl = paths[0] ?? ""
      const morePhotoUrls = paths.slice(1)
      const fields = {
        title: title.trim(),
        issueType,
        lat: Number(where.lat.toFixed(6)),
        lng: Number(where.lng.toFixed(6)),
        address: address.trim(),
        description: description.trim(),
      }

      // Every ticket gets a message to send to its department. If the photo
      // was already looked at and nothing was changed since, that message is
      // ready. Otherwise the server writes one now, from what is in the form.
      let toSend: ReportToSend | null = null
      let ticketOwner: Owner = owner === LET_AVISION_CHOOSE ? FALLBACK_OWNER : owner
      if (
        found?.reportable &&
        found.report &&
        found.contact &&
        found.owner === owner &&
        foundPhotos.current === paths.join("|") &&
        foundAt.current?.lat === where.lat &&
        foundAt.current?.lng === where.lng &&
        fields.title === found.title.slice(0, 120).trim() &&
        fields.description === found.description.slice(0, 2000).trim() &&
        fields.address === (found.address ?? "").trim()
      ) {
        toSend = { contact: found.contact, report: found.report, reason: found.ownerReason }
      } else {
        setStage("draft")
        const drafted = await Promise.race<TicketDraft | null>([
          draftReport({
            ...fields,
            photoPath: photoUrl || undefined,
            morePhotoPaths: morePhotoUrls,
            owner: owner === LET_AVISION_CHOOSE ? undefined : owner,
          }).catch(() => null), // the ticket still posts; it just has no message to send
          new Promise<null>((resolve) => window.setTimeout(() => resolve(null), DRAFT_WAIT_MS)),
        ])
        if (drafted) {
          ticketOwner = drafted.owner
          toSend = {
            contact: drafted.contact,
            report: drafted.report,
            reason: drafted.decidedBy === "person" ? null : drafted.ownerReason,
          }
        }
      }

      setStage("ticket")
      const ticket = await createTicket({ ...fields, owner: ticketOwner, photoUrl, morePhotoUrls })
      onCreated(ticket, toSend)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn’t create the ticket")
      setSubmitting(false)
    }
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) onClose()
      }}
    >
      <form
        className="report-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-title"
        onSubmit={submit}
      >
        <div className="report-header">
          <div>
            <p className="eyebrow">NEW TICKET</p>
            <h2 id="report-title">Report an issue</h2>
          </div>
          <button
            type="button"
            className="dialog-close"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close report form"
          >
            <X size={18} />
          </button>
        </div>

        <div className="emergency-banner" role="note">
          <TriangleAlert size={18} aria-hidden="true" />
          <p>
            <strong>Emergency?</strong> If someone is hurt or in danger, call{" "}
            <a href="tel:911">
              <Phone size={12} aria-hidden="true" /> 911
            </a>
            . Reports here aren’t watched in real time.
          </p>
        </div>

        <fieldset className="form-grid report-fields" disabled={submitting}>
          <div className="form-field full">
            <span>
              Photos <em>optional, up to {MAX_TICKET_PHOTOS}</em>
            </span>
            <div className="photo-tiles">
              {photos.map((photo, index) => (
                <div
                  className={`photo-tile${photo.error ? " failed" : ""}${photo.stored ? "" : " waiting"}`}
                  key={photo.id}
                >
                  <button
                    type="button"
                    className="photo-thumb"
                    onClick={() => setViewingPhoto(photo.id)}
                    aria-label={`View photo ${index + 1}${
                      photo.stored ? " as it will be posted" : photo.error ? ", which could not be uploaded" : ""
                    }`}
                  >
                    <img src={shown(photo)} alt="" />
                  </button>
                  {index === 0 && photos.length > 1 && <span className="photo-main">Main</span>}
                  <button
                    type="button"
                    className="photo-remove"
                    onClick={() => removePhoto(photo.id)}
                    disabled={submitting || analyzing}
                    aria-label={`Remove photo ${index + 1}`}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {/* On a phone this offers the camera as well as the photo library. */}
              <input
                ref={fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={choosePhotos}
                hidden
              />
              {photos.length < MAX_TICKET_PHOTOS && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => fileInput.current?.click()}
                  disabled={submitting}
                >
                  <Camera size={15} />
                  {photos.length === 0 ? "Add photos" : "Add another"}
                </button>
              )}
            </div>
            {viewed && (
              <PhotoViewer
                src={shown(viewed)}
                alt={viewed.stored ? "Your photo as it will be posted" : "The photo you chose"}
                onClose={() => setViewingPhoto(null)}
              />
            )}
            {photoNotice && (
              <small className="field-note photo-problem" role="alert">
                {photoNotice}
              </small>
            )}
            {uploadProblem ? (
              <small className="field-note photo-problem" role="alert">
                {uploadProblem}
              </small>
            ) : waitingFor > 0 ? (
              <small className="field-note" role="status">
                {waitingFor === 1 ? "Uploading a photo…" : `Uploading ${waitingFor} photos…`}
              </small>
            ) : photos.length > 0 && allStored && storedPhotos[0].facesHidden !== null ? (
              <small className="field-note photo-checked" role="status">
                <ShieldCheck size={13} aria-hidden="true" />
                {hiddenSummary(storedPhotos)
                  ? `Hidden before saving: ${hiddenSummary(storedPhotos)}. Tap a photo to check.`
                  : "No faces or license plates were found. Tap a photo to check."}
              </small>
            ) : (
              <small className="field-note">
                Photos are public. Please keep faces and license plates out of the
                shot.
              </small>
            )}

            {photos.length > 0 && canAnalyze && (
              <button
                type="button"
                className="ai-button"
                onClick={fillFromPhoto}
                disabled={analyzing || submitting || outside !== null}
              >
                <Sparkles size={15} />
                {analyzing
                  ? "Looking at the photo… this takes about 10 seconds"
                  : found
                    ? "Look at the photo again"
                    : photos.length > 1
                      ? "Fill in the form from the main photo"
                      : "Fill in the form from this photo"}
              </button>
            )}
            {analyzeError && (
              <p className="form-error" role="alert">
                {analyzeError}
              </p>
            )}
            {found && !analyzing && (
              <div className="ai-findings" role="status">
                {found.reportable ? (
                  <>
                    <p className="ai-title">
                      <Sparkles size={14} aria-hidden="true" />
                      <strong>Possible issue: {found.title}</strong>
                      <span className={`ai-tag severity-${found.severity}`}>
                        {found.severity} priority
                      </span>
                      <span className="ai-tag">{Math.round(found.confidence * 100)}% sure</span>
                    </p>
                    {found.possibleBarriers.length > 0 && (
                      <ul>
                        {found.possibleBarriers.map((barrier) => (
                          <li key={barrier}>{barrier}</li>
                        ))}
                      </ul>
                    )}
                    {found.ownerReason && <p>{found.ownerReason}</p>}
                    <p className="ai-check">
                      The form below is filled in. Check it and fix anything
                      that’s wrong before you post.
                    </p>
                  </>
                ) : (
                  <p>{found.summary} You can still fill in the form yourself.</p>
                )}
              </div>
            )}
          </div>

          <label className="form-field">
            <span>What’s the issue?</span>
            <select
              value={issueType}
              onChange={(event) => chooseIssueType(event.target.value)}
              autoFocus
            >
              {ISSUE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Who should fix it?</span>
            <select
              value={owner}
              onChange={(event) => {
                analysisOwner.current = null
                setOwner(event.target.value as Owner | typeof LET_AVISION_CHOOSE)
              }}
            >
              <option value={LET_AVISION_CHOOSE}>Let AVision choose (recommended)</option>
              {OWNERS.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field full">
            <span>Title</span>
            <input
              value={title}
              onChange={(event) => {
                setTitle(event.target.value)
                setTitleEdited(true)
              }}
              maxLength={120}
              required
              placeholder="Short name for the issue"
            />
          </label>

          <label className="form-field full">
            <span>
              Address or landmark <em>optional</em>
            </span>
            <AddressField
              value={address}
              onChange={(text) => {
                addressEdited.current = true
                setAddress(text)
              }}
              onPick={(suggestion) => {
                confirmLocation({ lat: suggestion.lat, lng: suggestion.lng, fromAddress: true })
              }}
            />
          </label>

          <Suspense fallback={<div className="form-field full report-location-loading" role="status">Loading location map…</div>}>
            <ReportLocationPicker location={location} onChange={confirmLocation} onLocate={useMyLocation}
              locating={locating} disabled={submitting} />
          </Suspense>

          <div className="form-field full">
            {addressStatus && <small className="field-note" role="status">{addressStatus}</small>}
            <div className={`location-row location-status ${locating ? "pending" : locationError ? "failed" : location ? "confirmed" : "unconfirmed"}`}
              role="status" aria-live="polite" aria-atomic="true">
              {locating ? <LoaderCircle size={20} aria-hidden="true" />
                : locationError || !location ? <X size={20} aria-hidden="true" />
                : <Check size={20} aria-hidden="true" />}
              <p>
                {locating ? "Finding your location…"
                  : locationError ? `${locationError}${location ? " Your selected pin is still confirmed." : ""}`
                  : location
                  ? `Location confirmed${location.accuracy ? ` (±${Math.round(location.accuracy)} m)` : ""}`
                  : "Confirm the issue’s location before posting."}
              </p>
            </div>
            {outside && (
              <small className="field-note photo-problem" role="alert">
                {outside} Move the pin or pick an address in Atlanta to report something there.
              </small>
            )}
            {/* Laptops often guess their position from Wi-Fi and can be blocks off. */}
            {location?.accuracy && location.accuracy > 150 && (
              <small className="field-note">
                This device’s location is only a rough guess. Check the address
                above before posting.
              </small>
            )}
          </div>

          <label className="form-field full">
            <span>
              Details <em>optional</em>
            </span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={2000}
              rows={3}
              placeholder="What’s blocked or broken, and who it affects. Please don’t describe people."
            />
          </label>

        </fieldset>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <div className="report-actions">
          <button
            type="button"
            className="text-button"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button type="submit" className="primary-button" disabled={submitting || outside !== null}>
            {submitting
              ? stage === "photo"
                ? "Uploading photo…"
                : stage === "draft"
                  ? "Writing your report…"
                  : "Posting…"
              : "Post ticket"}
          </button>
        </div>
      </form>
    </div>
  )
}

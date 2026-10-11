import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react"
import { Camera, LocateFixed, Phone, ShieldCheck, Sparkles, TriangleAlert, X } from "lucide-react"
import AddressField from "./AddressField"
import {
  analysisAvailable,
  analyzePhoto,
  createTicket,
  draftReport,
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
const OWNERS: Owner[] = ["City of Atlanta", "GSU Facilities", "MARTA", "GDOT"]
const LET_AVISION_CHOOSE = "auto"
// What the ticket is filed under if the choice can't be made (the server is unreachable).
const FALLBACK_OWNER: Owner = "City of Atlanta"
// Writing the report is worth a wait, but not a long one: past this the ticket posts without it.
const DRAFT_WAIT_MS = 60_000

/** "2 faces and 1 license plate", or null when nothing was hidden. */
function hiddenSummary(stored: UploadedPhoto): string | null {
  const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`
  const parts = [
    stored.facesHidden ? count(stored.facesHidden, "face", "faces") : null,
    stored.platesHidden ? count(stored.platesHidden, "license plate", "license plates") : null,
  ].filter(Boolean)
  return parts.length ? parts.join(" and ") : null
}

// Default location: GSU downtown campus, where the seed reports are.
const GSU_CAMPUS = { lat: 33.7531, lng: -84.3853 }

// Where the ticket goes on the map: the device's position ("Use my location"),
// or the position of an address picked from the suggestions.
type Location = { lat: number; lng: number; accuracy?: number; fromAddress?: boolean }

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
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [viewingPhoto, setViewingPhoto] = useState(false)
  // The photo as the server stored it, with faces and license plates hidden.
  const [stored, setStored] = useState<UploadedPhoto | null>(null)
  const [photoError, setPhotoError] = useState<string | null>(null)
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
  const [analyzeError, setAnalyzeError] = useState<string | null>(null)
  // The upload of the chosen photo, running or finished, so it is only ever sent once.
  const uploading = useRef<{ file: File; result: Promise<UploadedPhoto> } | null>(null)
  // The photo in the form right now, so an upload that finishes late for an
  // earlier or removed photo is ignored.
  const chosen = useRef<File | null>(null)
  const [location, setLocation] = useState<Location | null>(null)
  const [locating, setLocating] = useState(false)
  const placeLookup = useRef(0) // so a slow, older address lookup can't overwrite a newer one
  const [locationError, setLocationError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose, submitting])

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

  // Show the chosen photo right away, straight from the device.
  useEffect(() => {
    if (!photo) {
      setPhotoPreview(null)
      return
    }
    const url = URL.createObjectURL(photo)
    setPhotoPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [photo])

  // Once the server has the photo, show its copy: that is the one that gets posted.
  const shownPhoto = (stored && photoLink(stored.path)) || photoPreview

  function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = "" // so picking the same file again still counts as a change
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setError("That file isn’t a photo. Choose a JPEG, PNG or WebP image.")
      return
    }
    setError(null)
    setPhoto(file)
    forgetFindings()
    // Send it straight away, so the person can see the version everyone else
    // will see (faces and plates hidden) before they post.
    setStored(null)
    setPhotoError(null)
    chosen.current = file
    upload(file).then(
      (saved) => {
        if (chosen.current === file) setStored(saved)
      },
      (err) => {
        // Shown under the photo. Posting, or looking at the photo, tries the upload again.
        if (chosen.current === file) {
          setPhotoError(err instanceof Error ? err.message : "Couldn’t upload the photo.")
        }
      },
    )
  }

  /** Uploads the photo, or returns the upload already made (or under way) for it. */
  function upload(file: File): Promise<UploadedPhoto> {
    if (uploading.current?.file !== file) {
      const result = uploadPhoto(file)
      const mine = { file, result }
      uploading.current = mine
      // A failed upload is forgotten, so the next step that needs the photo tries again.
      result.catch(() => {
        if (uploading.current === mine) uploading.current = null
      })
    }
    return uploading.current.result
  }

  function removePhoto() {
    setPhoto(null)
    setStored(null)
    setPhotoError(null)
    chosen.current = null
    uploading.current = null
    forgetFindings()
  }

  // Findings belong to one photo. A new photo, or none, starts clean.
  function forgetFindings() {
    setFound(null)
    setAnalyzeError(null)
  }

  async function fillFromPhoto() {
    if (!photo || analyzing) return
    setAnalyzing(true)
    setAnalyzeError(null)
    try {
      const saved = await upload(photo)
      setStored(saved)
      setPhotoError(null)
      const where = location ?? GSU_CAMPUS
      const result = await analyzePhoto(saved.path, where.lat, where.lng)
      setFound(result)
      foundAt.current = { lat: where.lat, lng: where.lng }
      if (result.reportable) {
        // Fill the form in. Everything stays editable, and nothing is posted yet.
        const known = ISSUE_TYPES.some((type) => type.value === result.issueType)
        setIssueType(known ? result.issueType : "other")
        setTitle(result.title.slice(0, 120))
        setTitleEdited(true)
        setDescription(result.description.slice(0, 2000))
        if (result.owner) setOwner(result.owner)
        const nearby = result.address
        if (nearby) setAddress((typed) => (typed.trim() ? typed : nearby))
      }
    } catch (err) {
      setAnalyzeError(
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
    if (!("geolocation" in navigator)) {
      setLocationError("This browser can’t share its location.")
      return
    }
    setLocating(true)
    setLocationError(null)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        setLocation({ lat: latitude, lng: longitude, accuracy })
        setLocating(false)

        // Look up the nearest street address and offer it as the ticket's address.
        // It never replaces an address the person typed themselves.
        const lookup = ++placeLookup.current
        nearestAddress(latitude, longitude).then((found) => {
          if (found && lookup === placeLookup.current) {
            setAddress((typed) => (typed.trim() ? typed : found))
          }
        })
      },
      (err) => {
        setLocationError(
          err.code === err.PERMISSION_DENIED
            ? "Location permission was denied. Using GSU campus instead."
            : "Couldn’t get your location. Using GSU campus instead.",
        )
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
    )
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const where = location ?? GSU_CAMPUS
      let photoUrl = ""
      if (photo) {
        setStage("photo")
        const saved = await upload(photo)
        setStored(saved)
        setPhotoError(null)
        photoUrl = saved.path
      }
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
      const ticket = await createTicket({ ...fields, owner: ticketOwner, photoUrl })
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

        <div className="form-grid">
          <div className="form-field full">
            <span>
              Photo <em>optional</em>
            </span>
            <div className="photo-row">
              {shownPhoto && (
                <button
                  type="button"
                  className="photo-thumb"
                  onClick={() => setViewingPhoto(true)}
                  aria-label={stored ? "View your photo as it will be posted" : "View the photo you chose"}
                >
                  <img src={shownPhoto} alt="" />
                </button>
              )}
              <p>{photo ? photo.name : "No photo added"}</p>
              {/* On a phone this offers the camera as well as the photo library. */}
              <input
                ref={fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={choosePhoto}
                hidden
              />
              {photo && (
                <button
                  type="button"
                  className="text-button"
                  onClick={removePhoto}
                  disabled={submitting || analyzing}
                >
                  Remove
                </button>
              )}
              <button
                type="button"
                className="secondary-button"
                onClick={() => fileInput.current?.click()}
                disabled={submitting}
              >
                <Camera size={15} />
                {photo ? "Change photo" : "Add a photo"}
              </button>
            </div>
            {viewingPhoto && shownPhoto && (
              <PhotoViewer
                src={shownPhoto}
                alt={stored ? "Your photo as it will be posted" : "The photo you chose"}
                onClose={() => setViewingPhoto(false)}
              />
            )}
            {photoError ? (
              <small className="field-note photo-problem" role="alert">
                {photoError}
              </small>
            ) : photo && !stored ? (
              <small className="field-note" role="status">
                Uploading the photo…
              </small>
            ) : stored && stored.facesHidden !== null ? (
              <small className="field-note photo-checked" role="status">
                <ShieldCheck size={13} aria-hidden="true" />
                {hiddenSummary(stored)
                  ? `Hidden before saving: ${hiddenSummary(stored)}. Tap the photo to check.`
                  : "No faces or license plates were found. Tap the photo to check."}
              </small>
            ) : (
              <small className="field-note">
                Photos are public. Please keep faces and license plates out of the
                shot.
              </small>
            )}

            {photo && canAnalyze && (
              <button
                type="button"
                className="ai-button"
                onClick={fillFromPhoto}
                disabled={analyzing || submitting}
              >
                <Sparkles size={15} />
                {analyzing
                  ? "Looking at the photo… this takes about 10 seconds"
                  : found
                    ? "Look at the photo again"
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
                    {!location && (
                      <p>
                        No location is set, so this used the GSU campus. Set the
                        location below and look again to get the right owner.
                      </p>
                    )}
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
              onChange={(event) => setOwner(event.target.value as Owner | typeof LET_AVISION_CHOOSE)}
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
              onChange={setAddress}
              onPick={(suggestion) => {
                // A picked address also places the ticket, unless the device's
                // own position is already in use (that one is more exact).
                if (!location || location.fromAddress) {
                  setLocation({ lat: suggestion.lat, lng: suggestion.lng, fromAddress: true })
                }
              }}
            />
          </label>

          <div className="form-field full">
            <span>Location</span>
            <div className="location-row">
              <p>
                {location
                  ? `${location.fromAddress ? "The address above" : "Your location"} (${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}${
                      location.accuracy ? `, ±${Math.round(location.accuracy)} m` : ""
                    })`
                  : "GSU downtown campus (default)"}
              </p>
              <button
                type="button"
                className="secondary-button"
                onClick={useMyLocation}
                disabled={locating}
              >
                <LocateFixed size={15} />
                {locating ? "Locating…" : "Use my location"}
              </button>
            </div>
            {locationError && <small className="field-note">{locationError}</small>}
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

        </div>

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
          <button type="submit" className="primary-button" disabled={submitting}>
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

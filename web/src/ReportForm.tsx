import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react"
import { Camera, LocateFixed, Phone, Sparkles, TriangleAlert, X } from "lucide-react"
import AddressField from "./AddressField"
import {
  analysisAvailable,
  analyzePhoto,
  createTicket,
  uploadPhoto,
  type Owner,
  type PhotoAnalysis,
  type Ticket,
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

// Picked by hand until the routing step chooses the owner from the location.
const OWNERS: Owner[] = ["City of Atlanta", "GSU Facilities", "MARTA", "GDOT"]

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
  /** `toSend` is the agent's drafted report, when there is one that matches the ticket. */
  onCreated: (ticket: Ticket, toSend: ReportToSend | null) => void
}) {
  const [issueType, setIssueType] = useState<string>(ISSUE_TYPES[0].value)
  const [title, setTitle] = useState<string>(ISSUE_TYPES[0].label)
  const [titleEdited, setTitleEdited] = useState(false)
  const [owner, setOwner] = useState<Owner>("City of Atlanta")
  const [address, setAddress] = useState("")
  const [description, setDescription] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [viewingPhoto, setViewingPhoto] = useState(false)
  // "photo" while the picture uploads, "ticket" while the ticket is saved.
  const [stage, setStage] = useState<"photo" | "ticket">("ticket")
  const fileInput = useRef<HTMLInputElement>(null)
  // The report agent: looks at the photo and fills in the form (see api/agent.py).
  const [canAnalyze, setCanAnalyze] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [found, setFound] = useState<PhotoAnalysis | null>(null)
  const [analyzeError, setAnalyzeError] = useState<string | null>(null)
  // The link of a photo that already uploaded, so a retry doesn't upload it twice.
  const uploaded = useRef<{ file: File; url: string } | null>(null)
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
      if (uploaded.current?.file !== photo) {
        uploaded.current = { file: photo, url: await uploadPhoto(photo) }
      }
      const where = location ?? GSU_CAMPUS
      const result = await analyzePhoto(uploaded.current.url, where.lat, where.lng)
      setFound(result)
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
        if (uploaded.current?.file !== photo) {
          setStage("photo")
          uploaded.current = { file: photo, url: await uploadPhoto(photo) }
        }
        photoUrl = uploaded.current.url
      }
      setStage("ticket")
      const ticket = await createTicket({
        title: title.trim(),
        issueType,
        owner,
        lat: Number(where.lat.toFixed(6)),
        lng: Number(where.lng.toFixed(6)),
        address: address.trim(),
        description: description.trim(),
        photoUrl,
      })
      // Offer the drafted report only if it still matches: same owner as posted.
      const toSend =
        found?.report && found.contact && found.owner === owner
          ? { contact: found.contact, report: found.report }
          : null
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
              {photoPreview && (
                <button
                  type="button"
                  className="photo-thumb"
                  onClick={() => setViewingPhoto(true)}
                  aria-label="View the photo you chose"
                >
                  <img src={photoPreview} alt="" />
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
                  onClick={() => {
                    setPhoto(null)
                    forgetFindings()
                  }}
                  disabled={submitting}
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
            {viewingPhoto && photoPreview && (
              <PhotoViewer
                src={photoPreview}
                alt="The photo you chose"
                onClose={() => setViewingPhoto(false)}
              />
            )}
            <small className="field-note">
              Photos are public. Please keep faces and license plates out of the
              shot.
            </small>

            {photo && canAnalyze && (
              <button
                type="button"
                className="ai-button"
                onClick={fillFromPhoto}
                disabled={analyzing || submitting}
              >
                <Sparkles size={15} />
                {analyzing
                  ? "Looking at the photo… this takes about 20 seconds"
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
              onChange={(event) => setOwner(event.target.value as Owner)}
            >
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
                : "Posting…"
              : "Post ticket"}
          </button>
        </div>
      </form>
    </div>
  )
}

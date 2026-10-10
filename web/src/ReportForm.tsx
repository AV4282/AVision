import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react"
import { Camera, LocateFixed, Phone, TriangleAlert, X } from "lucide-react"
import { createTicket, uploadPhoto, type Owner, type Ticket } from "./api"
import { nearestAddress } from "./geocode"

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

type Location = { lat: number; lng: number; accuracy?: number }

export default function ReportForm({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: (ticket: Ticket) => void
}) {
  const [issueType, setIssueType] = useState<string>(ISSUE_TYPES[0].value)
  const [title, setTitle] = useState<string>(ISSUE_TYPES[0].label)
  const [titleEdited, setTitleEdited] = useState(false)
  const [owner, setOwner] = useState<Owner>("City of Atlanta")
  const [address, setAddress] = useState("")
  const [description, setDescription] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  // "photo" while the picture uploads, "ticket" while the ticket is saved.
  const [stage, setStage] = useState<"photo" | "ticket">("ticket")
  const fileInput = useRef<HTMLInputElement>(null)
  // The link of a photo that already uploaded, so a retry doesn't upload it twice.
  const uploaded = useRef<{ file: File; url: string } | null>(null)
  const [location, setLocation] = useState<Location | null>(null)
  const [locating, setLocating] = useState(false)
  // The nearest street address to `location`, shown instead of raw coordinates.
  const [place, setPlace] = useState<string | null>(null)
  const [findingPlace, setFindingPlace] = useState(false)
  const placeLookup = useRef(0) // so a slow, older lookup can't overwrite a newer one
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

        // Look up the nearest address to show, and offer it as the ticket's address.
        const lookup = ++placeLookup.current
        setPlace(null)
        setFindingPlace(true)
        nearestAddress(latitude, longitude).then((found) => {
          if (lookup !== placeLookup.current) return
          setPlace(found)
          setFindingPlace(false)
          // Never replaces an address the person typed themselves.
          if (found) setAddress((typed) => (typed.trim() ? typed : found))
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
      onCreated(ticket)
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
            <input
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              maxLength={200}
              placeholder="e.g. Courtland St SE & Gilmer St SE"
            />
          </label>

          <div className="form-field full">
            <span>Location</span>
            <div className="location-row">
              <p aria-live="polite">
                {!location
                  ? "GSU downtown campus (default)"
                  : findingPlace
                    ? "Finding the nearest address…"
                    : place
                      ? `Near ${place}`
                      : "Your current location"}
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
            {location?.accuracy && location.accuracy > 150 && !findingPlace && (
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

          <div className="form-field full">
            <span>
              Photo <em>optional</em>
            </span>
            <div className="photo-row">
              {photoPreview && <img src={photoPreview} alt="The photo you chose" />}
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
                  onClick={() => setPhoto(null)}
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
            <small className="field-note">
              Photos are public. Please keep faces and license plates out of the
              shot.
            </small>
          </div>
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

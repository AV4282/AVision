import { useEffect, useState, type FormEvent } from "react"
import { LocateFixed, Phone, TriangleAlert, X } from "lucide-react"
import { createTicket, type Owner, type Ticket } from "./api"

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
  const [photoUrl, setPhotoUrl] = useState("")
  const [location, setLocation] = useState<Location | null>(null)
  const [locating, setLocating] = useState(false)
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
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        })
        setLocating(false)
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
      const ticket = await createTicket({
        title: title.trim(),
        issueType,
        owner,
        lat: Number(where.lat.toFixed(6)),
        lng: Number(where.lng.toFixed(6)),
        address: address.trim(),
        description: description.trim(),
        photoUrl: photoUrl.trim(),
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
              <p>
                {location
                  ? `Your location (${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}${
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

          <label className="form-field full">
            <span>
              Photo link <em>optional</em>
            </span>
            <input
              type="url"
              value={photoUrl}
              onChange={(event) => setPhotoUrl(event.target.value)}
              maxLength={1000}
              placeholder="https://…"
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
            {submitting ? "Posting…" : "Post ticket"}
          </button>
        </div>
      </form>
    </div>
  )
}

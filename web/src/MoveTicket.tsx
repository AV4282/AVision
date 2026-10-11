import { lazy, Suspense, useEffect, useRef, useState, type FormEvent } from "react"
import { X } from "lucide-react"
import AddressField from "./AddressField"
import { checkSpot, moveTicket, NO_ADDRESS, OWNERS, type BlockedOwners, type Owner, type Ticket } from "./api"
import { nearestAddress } from "./geocode"
import type { ReportLocation } from "./ReportLocationPicker"

const ReportLocationPicker = lazy(() => import("./ReportLocationPicker"))

/**
 * Lets a ticket's poster (or an admin) fix it after posting: put the pin
 * somewhere else, for when it went in the wrong spot, and/or send the ticket to
 * a different department. The same pin map as the report form: tap the map,
 * drag the pin, use the device's location, or pick an address. Nothing changes
 * until Save.
 */
export default function MoveTicket({
  ticket,
  onClose,
  onMoved,
}: {
  ticket: Ticket
  onClose: () => void
  /** Called with the updated ticket once the changes are saved. */
  onMoved: (ticket: Ticket) => void
}) {
  const [location, setLocation] = useState<ReportLocation>({ lat: ticket.lat, lng: ticket.lng })
  const startAddress = ticket.address === NO_ADDRESS ? "" : ticket.address
  const [address, setAddress] = useState(startAddress)
  const [owner, setOwner] = useState<Owner>(ticket.owner)
  // Whether the person chose the department themselves. If they didn't, the
  // server may still change it to match a new spot (see api/main.py).
  const [ownerChosen, setOwnerChosen] = useState(false)
  // Once the person types their own words, a pin move no longer replaces them.
  const addressEdited = useRef(false)
  // A pin placed by picking an address already has its address.
  const fromAddress = useRef(false)
  const [addressNote, setAddressNote] = useState("")
  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  // Why the new spot can't be used, when it is outside the area AVision covers.
  const [outside, setOutside] = useState<string | null>(null)
  // Departments that can't take this spot: GSU Facilities and Georgia Tech only work on their own campus.
  const [blocked, setBlocked] = useState<BlockedOwners>({})
  const [ownerNote, setOwnerNote] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const moved = location.lat !== ticket.lat || location.lng !== ticket.lng
  const changed = moved || owner !== ticket.owner || address.trim() !== startAddress.trim()

  // Escape closes this box only. It sits on top of the open ticket, which also
  // listens for Escape, so the key is caught first and goes no further.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      event.stopImmediatePropagation()
      if (!saving) onClose()
    }
    window.addEventListener("keydown", onKey, true)
    return () => window.removeEventListener("keydown", onKey, true)
  }, [onClose, saving])

  // Say right away if the new spot is outside the area, not after Save.
  // The same check says which departments can't take the spot.
  useEffect(() => {
    setOutside(null)
    let current = true
    checkSpot(location.lat, location.lng).then((spot) => {
      if (!current) return
      // A ticket that stays where it is isn't checked again for being inside Atlanta.
      setOutside(moved ? spot.outside : null)
      setBlocked(spot.blocked)
    })
    return () => {
      current = false
    }
  }, [location, moved])

  // A department picked here that can't take the spot is unpicked, with a line saying why.
  useEffect(() => {
    if (!ownerChosen || !blocked[owner]) return
    setOwnerNote(`${blocked[owner]} Move the pin onto campus to choose it.`)
    setOwner(ticket.owner)
    setOwnerChosen(false)
  }, [blocked, owner, ownerChosen, ticket.owner])
  // The pin left the campus of the ticket's own department: saving hands the ticket on.
  const handsOn = moved && !ownerChosen && Boolean(blocked[ticket.owner])

  // A moved pin gets the nearest address, after a short pause so dragging
  // doesn't ask for one at every step.
  useEffect(() => {
    if (!moved || fromAddress.current) return
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      const nearby = await nearestAddress(location.lat, location.lng, controller.signal)
      if (controller.signal.aborted) return
      if (nearby && !addressEdited.current) setAddress(nearby)
      setAddressNote(
        !nearby
          ? "No address found there. You can type a landmark."
          : addressEdited.current
            ? `Nearest address: ${nearby}. Your own text was kept.`
            : "Nearest address filled in. You can edit it.",
      )
    }, 500)
    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [location, moved])

  function place(point: ReportLocation, pickedAddress = false) {
    if (saving) return
    fromAddress.current = pickedAddress
    setLocating(false)
    setLocationError(null)
    setError(null)
    setAddressNote(pickedAddress ? "Pin moved to that address." : "Looking up the nearest address…")
    // The old address belongs to the old spot. Unless the person typed their
    // own, clear it; the nearest address to the new spot fills in below.
    if (!pickedAddress && !addressEdited.current) setAddress("")
    setLocation({ lat: point.lat, lng: point.lng })
  }

  function useMyLocation() {
    if (locating || saving) return
    if (!("geolocation" in navigator)) {
      setLocationError("This browser can’t share its location.")
      return
    }
    setLocating(true)
    setLocationError(null)
    navigator.geolocation.getCurrentPosition(
      (position) => place({ lat: position.coords.latitude, lng: position.coords.longitude }),
      (err) => {
        setLocating(false)
        setLocationError(
          err.code === err.PERMISSION_DENIED
            ? "Location permission was denied. Tap the map or pick an address instead."
            : "Couldn’t get your location. Tap the map or pick an address instead.",
        )
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
    )
  }

  async function save(event: FormEvent) {
    event.preventDefault()
    if (saving || !changed || outside) return
    setSaving(true)
    setError(null)
    try {
      onMoved(
        await moveTicket(ticket.id, {
          lat: Number(location.lat.toFixed(6)),
          lng: Number(location.lng.toFixed(6)),
          address: address.trim(),
          owner: ownerChosen ? owner : undefined,
        }),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn’t save the changes")
      setSaving(false)
    }
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose()
      }}
    >
      <form
        className="report-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="move-ticket-title"
        onSubmit={save}
      >
        <div className="report-header">
          <div>
            <p className="eyebrow">EDIT TICKET</p>
            <h2 id="move-ticket-title">Fix the location or department</h2>
          </div>
          <button
            type="button"
            className="dialog-close"
            onClick={onClose}
            disabled={saving}
            aria-label="Close without saving"
          >
            <X size={18} />
          </button>
        </div>

        <p className="ready-intro">
          Change which department this goes to, or put the pin where the issue
          really is: tap the map, drag the pin, or pick an address. Nothing
          changes until you save.
        </p>

        <fieldset className="form-grid report-fields" disabled={saving}>
          <label className="form-field full">
            <span>Who should fix it?</span>
            <select
              value={owner}
              onChange={(event) => {
                setOwnerNote(null)
                setOwner(event.target.value as Owner)
                setOwnerChosen(true)
              }}
            >
              {OWNERS.map((name) => (
                <option key={name} value={name} disabled={Boolean(blocked[name]) && name !== ticket.owner}>
                  {name}
                  {name === ticket.owner ? " (now)" : blocked[name] ? " (on campus only)" : ""}
                </option>
              ))}
            </select>
            {ownerNote ? (
              <small className="field-note" role="status">
                {ownerNote}
              </small>
            ) : handsOn ? (
              <small className="field-note" role="status">
                {blocked[ticket.owner]} Saving hands this ticket to the department for the new spot.
              </small>
            ) : (
              !ownerChosen && (
                <small className="field-note">
                  Moving the pin onto a campus or a MARTA station can change this
                  for you. Choose one here to set it yourself.
                </small>
              )
            )}
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
              onPick={(suggestion) => place({ lat: suggestion.lat, lng: suggestion.lng }, true)}
            />
          </label>

          <Suspense
            fallback={
              <div className="form-field full report-location-loading" role="status">
                Loading location map…
              </div>
            }
          >
            <ReportLocationPicker
              location={location}
              onChange={(point) => place(point)}
              onLocate={useMyLocation}
              locating={locating}
              disabled={saving}
            />
          </Suspense>

          <div className="form-field full">
            {addressNote && (
              <small className="field-note" role="status">
                {addressNote}
              </small>
            )}
            {locationError && (
              <small className="field-note photo-problem" role="alert">
                {locationError}
              </small>
            )}
            {outside && (
              <small className="field-note photo-problem" role="alert">
                {outside} Move the pin back inside Atlanta to save.
              </small>
            )}
          </div>
        </fieldset>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <div className="report-actions">
          <button type="button" className="text-button" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="primary-button" disabled={saving || !changed || outside !== null}>
            {saving ? "Saving…" : changed ? "Save changes" : "Nothing changed yet"}
          </button>
        </div>
      </form>
    </div>
  )
}

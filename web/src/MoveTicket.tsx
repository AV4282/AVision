import { lazy, Suspense, useEffect, useRef, useState, type FormEvent } from "react"
import { X } from "lucide-react"
import AddressField from "./AddressField"
import { moveTicket, NO_ADDRESS, outsideCoverage, type Ticket } from "./api"
import { nearestAddress } from "./geocode"
import type { ReportLocation } from "./ReportLocationPicker"

const ReportLocationPicker = lazy(() => import("./ReportLocationPicker"))

/**
 * Lets a ticket's poster (or an admin) put it somewhere else on the map, for
 * when the pin went in the wrong spot. The same pin map as the report form:
 * tap the map, drag the pin, use the device's location, or pick an address.
 * Nothing changes until Save.
 */
export default function MoveTicket({
  ticket,
  onClose,
  onMoved,
}: {
  ticket: Ticket
  onClose: () => void
  /** Called with the updated ticket once the new spot is saved. */
  onMoved: (ticket: Ticket) => void
}) {
  const [location, setLocation] = useState<ReportLocation>({ lat: ticket.lat, lng: ticket.lng })
  const [address, setAddress] = useState(ticket.address === NO_ADDRESS ? "" : ticket.address)
  // Once the person types their own words, a pin move no longer replaces them.
  const addressEdited = useRef(false)
  // A pin placed by picking an address already has its address.
  const fromAddress = useRef(false)
  const [addressNote, setAddressNote] = useState("")
  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  // Why the new spot can't be used, when it is outside the area AVision covers.
  const [outside, setOutside] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const moved = location.lat !== ticket.lat || location.lng !== ticket.lng

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
  useEffect(() => {
    setOutside(null)
    if (!moved) return
    let current = true
    outsideCoverage(location.lat, location.lng).then((reason) => {
      if (current) setOutside(reason)
    })
    return () => {
      current = false
    }
  }, [location, moved])

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
    if (saving || !moved || outside) return
    setSaving(true)
    setError(null)
    try {
      onMoved(
        await moveTicket(ticket.id, {
          lat: Number(location.lat.toFixed(6)),
          lng: Number(location.lng.toFixed(6)),
          address: address.trim(),
        }),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn’t move the ticket")
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
            <p className="eyebrow">EDIT LOCATION</p>
            <h2 id="move-ticket-title">Move this ticket</h2>
          </div>
          <button
            type="button"
            className="dialog-close"
            onClick={onClose}
            disabled={saving}
            aria-label="Close without moving"
          >
            <X size={18} />
          </button>
        </div>

        <p className="ready-intro">
          Put the pin where the issue really is: tap the map, drag the pin, or
          pick an address. Nothing changes until you save.
        </p>

        <fieldset className="form-grid report-fields" disabled={saving}>
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
          <button type="submit" className="primary-button" disabled={saving || !moved || outside !== null}>
            {saving ? "Saving…" : moved ? "Save new location" : "Move the pin first"}
          </button>
        </div>
      </form>
    </div>
  )
}

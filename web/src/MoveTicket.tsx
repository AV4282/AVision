import { lazy, Suspense, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react"
import { Camera, X } from "lucide-react"
import AddressField from "./AddressField"
import {
  checkSpot,
  editTicket,
  ISSUE_TYPES,
  MAX_TICKET_PHOTOS,
  NO_ADDRESS,
  OWNERS,
  photoLink,
  photoPath,
  screeningProblem,
  uploadPhoto,
  type BlockedOwners,
  type Owner,
  type Ticket,
  type TicketChanges,
} from "./api"
import { nearestAddress } from "./geocode"
import PhotoViewer from "./PhotoViewer"
import type { ReportLocation } from "./ReportLocationPicker"

const ReportLocationPicker = lazy(() => import("./ReportLocationPicker"))

// One of the ticket's photos while it is being edited: one it already had, or
// one just added, which is uploaded straight away.
type EditPhoto = {
  id: number
  /** Its stored path, once it has one. Null while a new photo uploads, or if that failed. */
  path: string | null
  /** What to show: the stored photo, or the chosen file until it is stored. */
  shown: string
  error: string | null
}

/**
 * Lets a ticket's poster (or an admin) change anything about it after posting:
 * the title, the type of issue, the details, the photos (add or remove, up to
 * five), the department, and where the pin is. The same pin map as the report
 * form: tap the map, drag the pin, use the device's location, or pick an
 * address. Nothing changes until Save, and only what was changed is sent.
 *
 * New words and a new main photo are screened by the server like a new report.
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
  const [title, setTitle] = useState(ticket.title)
  const [issueType, setIssueType] = useState(ticket.issueType)
  const [description, setDescription] = useState(ticket.description)
  // The photos, main one first. A ticket whose pictures aren't uploads of ours
  // (some early test tickets) keeps them as they are.
  const startPaths = ticket.images.map(photoPath)
  const photosLocked = startPaths.some((path) => path === null)
  const nextPhotoId = useRef(ticket.images.length)
  const [photos, setPhotos] = useState<EditPhoto[]>(() =>
    ticket.images.map((link, id) => ({ id, path: photoPath(link), shown: link, error: null })),
  )
  const [viewingPhoto, setViewingPhoto] = useState<number | null>(null)
  const [photoNotice, setPhotoNotice] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
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
  const uploading = photos.some((photo) => photo.path === null && !photo.error)
  const failedPhoto = photos.some((photo) => photo.error)
  const photosChanged =
    !photosLocked && photos.map((photo) => photo.path).join("|") !== startPaths.join("|")
  const wordsChanged =
    title.trim() !== ticket.title || issueType !== ticket.issueType || description.trim() !== ticket.description
  const changed =
    wordsChanged || photosChanged || moved || owner !== ticket.owner || address.trim() !== startAddress.trim()
  const viewed = photos.find((photo) => photo.id === viewingPhoto)
  // The ticket's own type stays on the list even if it isn't one of the usual ones.
  const knownType = ISSUE_TYPES.some((type) => type.value === ticket.issueType)

  // Local previews of added photos are released when the box closes.
  const photosNow = useRef(photos)
  photosNow.current = photos
  useEffect(
    () => () =>
      photosNow.current.forEach((photo) => {
        if (photo.shown.startsWith("blob:")) URL.revokeObjectURL(photo.shown)
      }),
    [],
  )

  // Added photos upload at once (and get faces and plates blurred), so Save has nothing to wait for.
  function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    event.target.value = "" // so the same file can be picked again
    const room = MAX_TICKET_PHOTOS - photos.length
    setPhotoNotice(
      files.length > room
        ? `A ticket can have ${MAX_TICKET_PHOTOS} photos, so only the first ${room} ${room === 1 ? "was" : "were"} added.`
        : null,
    )
    for (const file of files.slice(0, room)) {
      const id = nextPhotoId.current++
      const preview = URL.createObjectURL(file)
      setPhotos((now) => [...now, { id, path: null, shown: preview, error: null }])
      uploadPhoto(file)
        .then((stored) =>
          setPhotos((now) =>
            now.map((photo) =>
              photo.id === id ? { ...photo, path: stored.path, shown: photoLink(stored.path) ?? preview } : photo,
            ),
          ),
        )
        .catch((err) =>
          setPhotos((now) =>
            now.map((photo) =>
              photo.id === id
                ? { ...photo, error: err instanceof Error ? err.message : "That photo couldn’t be saved." }
                : photo,
            ),
          ),
        )
    }
  }

  function removePhoto(id: number) {
    setPhotoNotice(null)
    setPhotos((now) => now.filter((photo) => photo.id !== id))
  }

  // The first photo is the one on the map and in lists.
  function makeMain(id: number) {
    setPhotos((now) => {
      const chosen = now.find((photo) => photo.id === id)
      return chosen ? [chosen, ...now.filter((photo) => photo.id !== id)] : now
    })
  }

  // Escape closes this box only. It sits on top of the open ticket, which also
  // listens for Escape, so the key is caught first and goes no further.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      event.stopImmediatePropagation()
      // With a photo open, Escape closes just the photo.
      if (viewingPhoto !== null) setViewingPhoto(null)
      else if (!saving) onClose()
    }
    window.addEventListener("keydown", onKey, true)
    return () => window.removeEventListener("keydown", onKey, true)
  }, [onClose, saving, viewingPhoto])

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
    if (saving || !changed || outside || uploading || failedPhoto) return
    if (!title.trim()) {
      setError("Give the ticket a title.")
      return
    }
    setSaving(true)
    setError(null)
    // Only what was changed is sent, so nothing else is touched.
    const changes: TicketChanges = {}
    if (title.trim() !== ticket.title) changes.title = title.trim()
    if (issueType !== ticket.issueType) changes.issueType = issueType
    if (description.trim() !== ticket.description) changes.description = description.trim()
    if (photosChanged) changes.photos = photos.map((photo) => photo.path).filter((path): path is string => path !== null)
    if (moved) {
      changes.lat = Number(location.lat.toFixed(6))
      changes.lng = Number(location.lng.toFixed(6))
    }
    if (address.trim() && (moved || address.trim() !== startAddress.trim())) changes.address = address.trim()
    if (ownerChosen) changes.owner = owner
    try {
      onMoved(await editTicket(ticket.id, changes))
    } catch (err) {
      // Screening turned the new words or main photo away: say why, and leave the box open to fix it.
      const problem = screeningProblem(err)
      setError(
        problem?.code === "flagged"
          ? `Not saved. ${problem.message}` +
              (problem.suspendedUntil
                ? " That was one flagged attempt too many, so posting is paused for a day."
                : problem.strikes && problem.limit
                  ? ` Flagged attempt ${problem.strikes} of ${problem.limit}.`
                  : "")
          : err instanceof Error
            ? err.message
            : "Couldn’t save the changes",
      )
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
            <h2 id="move-ticket-title">Edit your ticket</h2>
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
          Change the title, details, photos, department or location. Nothing
          changes until you save.
        </p>

        <fieldset className="form-grid report-fields" disabled={saving}>
          <label className="form-field full">
            <span>Title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={120}
              required
              placeholder="Short name for the issue"
            />
          </label>

          <label className="form-field">
            <span>What’s the issue?</span>
            <select value={issueType} onChange={(event) => setIssueType(event.target.value)}>
              {!knownType && <option value={ticket.issueType}>{ticket.issueType.replace(/_/g, " ")}</option>}
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
              Details <em>optional</em>
            </span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={2000}
              rows={3}
              placeholder="What is wrong, and where exactly?"
            />
          </label>

          <div className="form-field full">
            <span>
              Photos <em>optional, up to {MAX_TICKET_PHOTOS}</em>
            </span>
            {photosLocked ? (
              <small className="field-note">This ticket’s pictures can’t be changed here.</small>
            ) : (
              <>
                <div className="photo-tiles">
                  {photos.map((photo, index) => (
                    <div
                      className={`photo-tile${photo.error ? " failed" : ""}${photo.path ? "" : " waiting"}`}
                      key={photo.id}
                    >
                      <button
                        type="button"
                        className="photo-thumb"
                        onClick={() => setViewingPhoto(photo.id)}
                        aria-label={`View photo ${index + 1}${photo.error ? ", which could not be saved" : ""}`}
                      >
                        <img src={photo.shown} alt="" />
                      </button>
                      {index === 0 && photos.length > 1 && <span className="photo-main">Main</span>}
                      {index > 0 && photo.path && (
                        <button type="button" className="photo-make-main" onClick={() => makeMain(photo.id)}>
                          Set main
                        </button>
                      )}
                      <button
                        type="button"
                        className="photo-remove"
                        onClick={() => removePhoto(photo.id)}
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
                    onChange={addPhotos}
                    hidden
                  />
                  {photos.length < MAX_TICKET_PHOTOS && (
                    <button type="button" className="secondary-button" onClick={() => fileInput.current?.click()}>
                      <Camera size={15} />
                      {photos.length === 0 ? "Add photos" : "Add another"}
                    </button>
                  )}
                </div>
                {viewed && <PhotoViewer src={viewed.shown} alt="Photo on this ticket" onClose={() => setViewingPhoto(null)} />}
                <small className="field-note" role="status">
                  {uploading
                    ? "Saving the new photo… Faces and license plates are blurred first."
                    : "The first photo is the one shown on the map. Removed photos are deleted when you save."}
                </small>
                {photos
                  .filter((photo) => photo.error)
                  .map((photo) => (
                    <small className="field-note photo-problem" role="alert" key={photo.id}>
                      {photo.error?.replace(/\.?$/, ".")} Remove that photo to save.
                    </small>
                  ))}
                {photoNotice && (
                  <small className="field-note photo-problem" role="alert">
                    {photoNotice}
                  </small>
                )}
              </>
            )}
          </div>

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
          <button
            type="submit"
            className="primary-button"
            disabled={saving || !changed || outside !== null || uploading || failedPhoto}
          >
            {saving ? "Saving…" : uploading ? "Saving photo…" : changed ? "Save changes" : "Nothing changed yet"}
          </button>
        </div>
      </form>
    </div>
  )
}

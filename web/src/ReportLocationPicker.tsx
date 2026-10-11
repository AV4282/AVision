import { useEffect, useId, useRef, useState } from "react"
import { divIcon, DomEvent, type Marker as LeafletMarker } from "leaflet"
import { GeoJSON, MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet"
import { LocateFixed } from "lucide-react"
import "leaflet/dist/leaflet.css"
import { campusOutlines, type CampusOutline, type Owner } from "./api"

export type ReportLocation = { lat: number; lng: number }

// A starting view only; the form has no location until the person confirms one.
const GSU_CAMPUS: ReportLocation = { lat: 33.7531, lng: -84.3853 }
const pinIcon = divIcon({
  className: "report-location-pin",
  html: '<svg viewBox="0 0 32 42" aria-hidden="true"><path d="M16 40C12 34 2 23 2 16a14 14 0 0 1 28 0c0 7-10 18-14 24Z"/><circle cx="16" cy="16" r="6"/></svg>',
  iconSize: [44, 48],
  iconAnchor: [22, 46],
})

// The campus outlines are drawn on the map, since GSU Facilities and Georgia
// Tech only take tickets placed inside their own. Colors match the main map's.
const CAMPUS_COLORS: Partial<Record<Owner, string>> = {
  "GSU Facilities": "#0039A6",
  "Georgia Tech": "#8F713D",
}

function PickerBehavior({ location, onChange, disabled, onLocate, locating }: {
  location: ReportLocation | null
  onChange: (location: ReportLocation) => void
  disabled: boolean
  onLocate: () => void
  locating: boolean
}) {
  const actions = useRef<HTMLDivElement>(null)
  const map = useMapEvents({
    click(event) {
      if (!disabled) onChange(event.latlng.wrap())
    },
  })

  useEffect(() => {
    if (actions.current) DomEvent.disableClickPropagation(actions.current)
  }, [])

  useEffect(() => {
    const container = map.getContainer()
    container.setAttribute("aria-label", "Report location map. Use arrow keys to pan and plus or minus to zoom.")
    const observer = new ResizeObserver(() => map.invalidateSize({ pan: false }))
    observer.observe(container)
    map.invalidateSize({ pan: false })
    return () => observer.disconnect()
  }, [map])

  useEffect(() => {
    if (location) map.panTo([location.lat, location.lng], { animate: false })
  }, [map, location?.lat, location?.lng])

  return (
    <div ref={actions} className="report-pin-actions">
      <button type="button" className="secondary-button" disabled={disabled}
        onClick={() => onChange(map.getCenter().wrap())}>
        Place pin at map center
      </button>
      <button type="button" className="secondary-button" disabled={disabled || locating}
        onClick={onLocate}>
        <LocateFixed size={16} aria-hidden="true" />
        {locating ? "Locating…" : "Place pin at my location"}
      </button>
    </div>
  )
}

export default function ReportLocationPicker({ location, onChange, onLocate, locating, disabled = false }: {
  location: ReportLocation | null
  onChange: (location: ReportLocation) => void
  onLocate: () => void
  locating: boolean
  disabled?: boolean
}) {
  const instructionsId = useId()
  const marker = useRef<LeafletMarker>(null)
  const [mouseDragging] = useState(() => window.matchMedia("(any-pointer: fine)").matches)
  const [campuses, setCampuses] = useState<CampusOutline[]>([])
  useEffect(() => {
    let current = true
    campusOutlines().then((found) => {
      if (current) setCampuses(found)
    })
    return () => {
      current = false
    }
  }, [])

  return (
    <section className="report-location-picker form-field full" aria-label="Drop a Pin" aria-describedby={instructionsId}>
      <span>Drop a Pin <em>required</em></span>
      <small id={instructionsId} className="field-note">
        Click or tap to place a pin, or drag the pin to move it. On touch screens, swipe to scroll.
        {campuses.length > 0 && " Dashed outlines show the campuses: GSU Facilities and Georgia Tech only take reports inside their own."}
      </small>
      <div className="report-location-frame">
        <MapContainer className="report-location-map" center={location ?? GSU_CAMPUS} zoom={16}
          scrollWheelZoom={false} dragging={mouseDragging} touchZoom={false} doubleClickZoom={false}>
          <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
          {campuses.map((campus) => (
            <GeoJSON key={campus.owner} data={campus.geometry} interactive={false} style={{
              color: CAMPUS_COLORS[campus.owner] ?? "#334155",
              weight: 2,
              dashArray: "6 5",
              fillOpacity: 0.07,
            }} />
          ))}
          <PickerBehavior location={location} onChange={onChange} disabled={disabled} onLocate={onLocate} locating={locating} />
          {location && (
            <Marker ref={marker} position={[location.lat, location.lng]} icon={pinIcon} draggable={!disabled}
              title="Selected report location" alt="Selected report location" eventHandlers={{
                dragend() {
                  const point = marker.current?.getLatLng().wrap()
                  if (point && !disabled) onChange(point)
                },
              }} />
          )}
        </MapContainer>
      </div>
      <small className="field-note" role="status">
        {location ? `Selected: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : "No location selected. The map starts near GSU downtown campus."}
      </small>
    </section>
  )
}

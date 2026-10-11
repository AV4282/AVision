import { useEffect, useId, useRef, useState } from "react"
import { divIcon, DomEvent, type Marker as LeafletMarker } from "leaflet"
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"

export type ReportLocation = { lat: number; lng: number }

// A starting view only; the form has no location until the person confirms one.
const GSU_CAMPUS: ReportLocation = { lat: 33.7531, lng: -84.3853 }
const pinIcon = divIcon({
  className: "report-location-pin",
  html: '<svg viewBox="0 0 32 42" aria-hidden="true"><path d="M16 40C12 34 2 23 2 16a14 14 0 0 1 28 0c0 7-10 18-14 24Z"/><circle cx="16" cy="16" r="6"/></svg>',
  iconSize: [44, 48],
  iconAnchor: [22, 46],
})

function PickerBehavior({ location, onChange, disabled }: {
  location: ReportLocation | null
  onChange: (location: ReportLocation) => void
  disabled: boolean
}) {
  const centerButton = useRef<HTMLButtonElement>(null)
  const map = useMapEvents({
    click(event) {
      if (!disabled) onChange(event.latlng.wrap())
    },
  })

  useEffect(() => {
    if (centerButton.current) DomEvent.disableClickPropagation(centerButton.current)
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
    <button ref={centerButton} type="button" className="secondary-button report-center-pin" disabled={disabled}
      onClick={() => onChange(map.getCenter().wrap())}>
      Place pin at map center
    </button>
  )
}

export default function ReportLocationPicker({ location, onChange, disabled = false }: {
  location: ReportLocation | null
  onChange: (location: ReportLocation) => void
  disabled?: boolean
}) {
  const instructionsId = useId()
  const marker = useRef<LeafletMarker>(null)
  const [mouseDragging] = useState(() => window.matchMedia("(any-pointer: fine)").matches)

  return (
    <section className="report-location-picker form-field full" aria-label="Drop a Pin" aria-describedby={instructionsId}>
      <span>Drop a Pin <em>required</em></span>
      <small id={instructionsId} className="field-note">
        Click or tap to place a pin, or drag the pin to move it. On touch screens, swipe to scroll.
      </small>
      <div className="report-location-frame">
        <MapContainer className="report-location-map" center={location ?? GSU_CAMPUS} zoom={16}
          scrollWheelZoom={false} dragging={mouseDragging} touchZoom={false} doubleClickZoom={false}>
          <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
          <PickerBehavior location={location} onChange={onChange} disabled={disabled} />
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

import { useEffect, useMemo, useRef, useState } from "react"

import {
  GeoJSON,
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet"

import { divIcon, type Marker as LeafletMarker } from "leaflet"

import {
  ATLANTA_VIEW,
  CORRIDOR_VIEW,
  GSU_VIEW,
  GEORGIA_TECH_VIEW,
  CORRIDOR_STATIONS,
  PILOT_OUTLINE,
  ISSUE_OWNERS,
  ISSUE_STATUS_LABELS,
  boundsOverlap,
  geometryBounds,
  type MapBounds,
} from "./map-config"

import type {
  AvisionMapProps,
  MapCoordinates,
  NeighborhoodData,
  StationData,
  AvisionMapStatus,
  AvisionMapMarker,
  AvisionMapOwner,
} from "./types"

import {
  cityData,
  gsuData,
  highwayData,
  useGeographicData,
  validPoint,
} from "./map-data"

import "leaflet/dist/leaflet.css"

import "./AvisionMap.css"

export type {
  AvisionMapProps,
  AvisionMapMarker,
  AvisionMapOwner,
  AvisionMapStatus,
  MapCoordinates,
} from "./types"

const stationIcon = divIcon({
  className: "avision-station-pin",

  html: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="3" width="12" height="15" rx="3"/><path d="M8 7h8v5H8zM8 21l2-3m6 3-2-3"/><circle cx="9" cy="15" r=".6"/><circle cx="15" cy="15" r=".6"/></svg>',

  iconSize: [29, 32],

  iconAnchor: [14, 16],
})

const gsuIcon = divIcon({
  className: "avision-gsu-reference",

  html: '<span aria-hidden="true">G</span>',

  iconSize: [24, 24],

  iconAnchor: [12, 12],
})

// Agency fills and letters stay independent of status badges and selection rings.

const issueIcons = new Map(
  ISSUE_OWNERS.flatMap((owner) =>
    (["open", "likely_fixed", "fixed", "merged", "unknown"] as const).flatMap(
      (status) =>
        [false, true].map(
          (selected) =>
            [
              `${owner.id}:${status}:${selected}`,

              divIcon({
                className: `avision-issue-pin avision-owner-${owner.id} ${
                  selected ? "avision-issue-selected" : ""
                }`,

                html: `<span class="avision-issue-agency" aria-hidden="true" style="background:${owner.color}">${owner.symbol}</span><span class="avision-issue-status avision-issue-status-${status}" aria-hidden="true">${
                  status === "fixed"
                    ? "✓"
                    : status === "likely_fixed"
                      ? "◷"
                      : status === "merged"
                        ? "↗"
                        : status === "open"
                          ? "!"
                          : "?"
                }</span>`,

                iconSize: [32, 32],

                iconAnchor: [16, 16],
              }),
            ] as const,
        ),
    ),
  ),
)

type Focus = {
  bounds?: MapBounds

  point?: MapCoordinates
}

type SearchResult = {
  key: string

  name: string

  kind: string

  focus: Focus
}

const NO_MARKERS = Object.freeze([])

// The owners a ticket filter can switch on and off. "Owner unknown" is not one:
// every ticket has an owner, the mark is only for data the map can't place.
const FILTER_OWNERS = ISSUE_OWNERS.filter((owner) => owner.id !== "unknown")

function IssueMarker({
  marker,

  selected,

  onSelect,
}: {
  marker: AvisionMapMarker

  selected: boolean

  onSelect?: AvisionMapProps["onMarkerSelect"]
}) {
  const ref = useRef<LeafletMarker>(null)

  const owner =
    ISSUE_OWNERS.find((item) => item.id === marker.owner) ??
    ISSUE_OWNERS[ISSUE_OWNERS.length - 1]

  const status = marker.status
    ? (ISSUE_STATUS_LABELS[marker.status] ?? "Status unknown")
    : undefined

  const label = [
    marker.label,

    marker.owner ? owner.label : undefined,

    status,

    selected ? "Selected" : undefined,
  ]

    .filter(Boolean)

    .join(" · ")

  // React Leaflet does not update a Marker's title when props change.

  useEffect(() => {
    if (!ref.current) return

    ref.current.options.title = label

    const element = ref.current.getElement()

    element?.setAttribute("title", label)

    element?.setAttribute("aria-label", label)

    element?.setAttribute("aria-pressed", String(selected))
  }, [label, selected])

  return (
    <Marker
      ref={ref}
      position={[marker.latitude, marker.longitude]}
      icon={
        issueIcons.get(
          `${owner.id}:${marker.status ?? "unknown"}:${selected}`,
        ) ?? issueIcons.get(`${owner.id}:unknown:${selected}`)!
      }
      opacity={marker.status === "fixed" && !selected ? 0.75 : 1}
      zIndexOffset={selected ? 2000 : 1000}
      title={label}
      eventHandlers={{
        click: (event) => {
          event.originalEvent.stopPropagation()

          onSelect?.(marker)
        },

        keydown: (event) => {
          if (
            event.originalEvent.key === "Enter" ||
            event.originalEvent.key === " "
          ) {
            event.originalEvent.preventDefault()

            event.originalEvent.stopPropagation()

            onSelect?.(marker)
          }
        },
      }}
    >
      <Tooltip>
        <strong>{marker.label}</strong>
        <br />
        {owner.label}
        {status ? ` · ${status}` : ""}
      </Tooltip>
    </Marker>
  )
}

function MapBehavior({
  focus,

  onMapClick,

  onBounds,
}: {
  focus: Focus

  onMapClick?: AvisionMapProps["onMapClick"]

  onBounds: (bounds: MapBounds) => void
}) {
  const map = useMap()

  // Where the map is on its way to, until it gets there. If the map changes
  // size mid-move (a filter note appearing above it, say), the move is finished
  // in one step instead of being stopped part-way.
  const heading = useRef<Focus | null>(null)

  useEffect(() => {
    map.invalidateSize()

    const animate = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches

    heading.current = focus

    if (focus.bounds)
      map.fitBounds(focus.bounds, { padding: [24, 24], maxZoom: 16, animate })

    if (focus.point)
      map.setView([focus.point.latitude, focus.point.longitude], 17, {
        animate,
      })
  }, [focus, map])

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      const center = map.getCenter()

      const target = heading.current

      map.invalidateSize({ pan: false })

      if (target?.point)
        map.setView([target.point.latitude, target.point.longitude], 17, {
          animate: false,
        })
      else if (target?.bounds)
        map.fitBounds(target.bounds, {
          padding: [24, 24],
          maxZoom: 16,
          animate: false,
        })
      else map.setView(center, map.getZoom(), { animate: false })
    })

    observer.observe(map.getContainer())

    return () => observer.disconnect()
  }, [map])

  useMapEvents({
    click(event) {
      onMapClick?.({ latitude: event.latlng.lat, longitude: event.latlng.lng })
    },

    moveend() {
      heading.current = null // arrived; from here the person's own panning is kept

      const bounds = map.getBounds()

      onBounds([
        [bounds.getSouth(), bounds.getWest()],

        [bounds.getNorth(), bounds.getEast()],
      ])
    },
  })

  return null
}

const LEGEND_KEY = "avision.map.legend" // where the "hide legend" choice is kept
// The closest the map zooms in. OpenStreetMap has street tiles down to this level
// and no further. The map and its tile layer must agree on it: Leaflet's tile
// layer stops at 18 unless told otherwise, which left the map blank at 19.
const MAX_ZOOM = 19

export default function AvisionMap({
  height = 600,

  dataUrl = "/avision-map",

  markers = NO_MARKERS,

  selectedMarkerId = null,

  focusPoint,

  initialArea = "atlanta",

  shownOwners,

  ownerCounts,

  onShownOwnersChange,

  filterNote,

  onMarkerSelect,

  onMapClick,
}: AvisionMapProps) {
  const [reducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )

  const [neighborhoodData, setNeighborhoodData] =
    useState<NeighborhoodData | null>(null)

  const [stationData, setStationData] = useState<StationData | null>(null)

  const [dataRetry, setDataRetry] = useState(0)

  const [dataError, setDataError] = useState(false)

  const [tileError, setTileError] = useState(false)

  const [query, setQuery] = useState("")

  const [searchOpen, setSearchOpen] = useState(false)

  const [activeResult, setActiveResult] = useState(0)

  const [initialBounds] = useState(() =>
    initialArea === "corridor"
      ? CORRIDOR_VIEW
      : initialArea === "gsu"
        ? GSU_VIEW
        : ATLANTA_VIEW,
  )

  const [focus, setFocus] = useState<Focus>({ bounds: initialBounds })

  const [view, setView] = useState<MapBounds>(initialBounds)

  const [showBoundary, setShowBoundary] = useState(false)

  const [showHighways, setShowHighways] = useState(false)

  const [showCity, setShowCity] = useState(false)

  const [showGsu, setShowGsu] = useState(false)

  const [showNeighborhoods, setShowNeighborhoods] = useState(false)

  const [showStations, setShowStations] = useState(true)

  const [softStyle, setSoftStyle] = useState(true)

  // The legend under the map can be hidden to give the map more room. The
  // choice is remembered in this browser.
  const [showLegend, setShowLegend] = useState(() => {
    try {
      return localStorage.getItem(LEGEND_KEY) !== "hidden"
    } catch {
      return true // storage is blocked in some browsers; the legend just starts shown
    }
  })

  function toggleLegend() {
    const next = !showLegend
    setShowLegend(next)
    try {
      localStorage.setItem(LEGEND_KEY, next ? "shown" : "hidden")
    } catch {
      // Not remembered for next time, but it still works for this visit.
    }
  }

  const [selectedNeighborhood, setSelectedNeighborhood] =
    useState<string | null>(null)

  const search = useRef<HTMLDivElement>(null)

  const base = dataUrl.replace(/\/$/, "")

  const { data: roads, error: roadError } = useGeographicData(
    `${base}/gdot-roads.geojson`,
    highwayData,
    dataRetry,
  )

  const { data: city, error: cityError } = useGeographicData(
    `${base}/atlanta-city-limits.geojson`,
    cityData,
    dataRetry,
  )

  const { data: gsu, error: gsuError } = useGeographicData(
    `${base}/gsu-references.geojson`,
    gsuData,
    dataRetry,
  )

  useEffect(() => {
    if (focusPoint && validPoint(focusPoint)) {
      setSelectedNeighborhood(null)

      setFocus({ point: focusPoint })
    }
  }, [focusPoint])

  useEffect(() => {
    const controller = new AbortController()

    setDataError(false)

    setNeighborhoodData(null)

    setStationData(null)

    async function load() {
      try {
        const responses = await Promise.all(
          ["neighborhoods", "stations"].map((name) =>
            fetch(`${base}/${name}.geojson`, { signal: controller.signal }),
          ),
        )

        if (responses.some((response) => !response.ok))
          throw new Error("Map data unavailable")

        const [neighborhoods, stations] = await Promise.all(
          responses.map((response) => response.json()),
        )

        if (
          neighborhoods.type !== "FeatureCollection" ||
          stations.type !== "FeatureCollection" ||
          !Array.isArray(neighborhoods.features) ||
          !Array.isArray(stations.features)
        )
          throw new Error("Invalid map data")

        if (!controller.signal.aborted) {
          setNeighborhoodData(neighborhoods)

          setStationData(stations)
        }
      } catch {
        if (!controller.signal.aborted) setDataError(true)
      }
    }

    void load()

    return () => controller.abort()
  }, [base, dataRetry])

  useEffect(() => {
    const closeSearch = (event: PointerEvent) => {
      if (!search.current?.contains(event.target as Node)) setSearchOpen(false)
    }

    document.addEventListener("pointerdown", closeSearch)

    return () => document.removeEventListener("pointerdown", closeSearch)
  }, [])

  const neighborhoods = useMemo(
    () =>
      neighborhoodData?.features.map((feature) => ({
        feature,

        bounds: geometryBounds(feature.geometry),
      })) ?? [],

    [neighborhoodData],
  )

  const stations = useMemo(
    () =>
      stationData?.features.filter((station) =>
        CORRIDOR_STATIONS.includes(station.properties.STATION),
      ) ?? [],

    [stationData],
  )

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return []

    return [
      ...stations.map((station) => ({
        key: `station-${station.properties.STATION}`,

        name: `${station.properties.STATION} station`,

        kind: "MARTA",

        focus: {
          point: {
            latitude: station.geometry.coordinates[1],

            longitude: station.geometry.coordinates[0],
          },
        },
      })),

      ...(gsu?.features.map((building) => ({
        key: `gsu-${building.properties.sourceObjectId}`,

        name: building.properties.name,

        kind: "GSU building reference",

        focus: {
          point: {
            latitude: building.geometry.coordinates[1],
            longitude: building.geometry.coordinates[0],
          },
        },
      })) ?? []),

      {
        key: "gsu",

        name: "GSU downtown",

        kind: "Campus area",

        focus: { bounds: GSU_VIEW },
      },

      ...neighborhoods.map(({ feature, bounds }) => ({
        key: `area-${feature.properties.NAME}`,

        name: feature.properties.NAME,

        kind: "Neighborhood",

        focus: { bounds },
      })),
    ]

      .filter((item) =>
        item.name.toLowerCase().includes(query.trim().toLowerCase()),
      )

      .slice(0, 6)
  }, [query, stations, neighborhoods, gsu])

  const outlines = showNeighborhoods
    ? neighborhoods.filter((item) => boundsOverlap(item.bounds, view))
    : []

  const highlighted = neighborhoods.find(
    (item) => item.feature.properties.NAME === selectedNeighborhood,
  )

  const visibleMarkers = markers.filter(validPoint)

  function selectResult(item: SearchResult) {
    setFocus({ ...item.focus })

    setSelectedNeighborhood(item.kind === "Neighborhood" ? item.name : null)

    setSearchOpen(false)

    setQuery("")
  }

  // Ticket filters, when the page asked for them.
  const filters =
    shownOwners && onShownOwnersChange
      ? { shown: shownOwners, change: onShownOwnersChange }
      : null

  const shownFilterOwners = filters
    ? FILTER_OWNERS.filter((owner) => filters.shown.includes(owner.id))
    : FILTER_OWNERS

  const filtered = shownFilterOwners.length < FILTER_OWNERS.length

  const hiddenTickets = FILTER_OWNERS.filter(
    (owner) => !shownFilterOwners.includes(owner),
  ).reduce((sum, owner) => sum + (ownerCounts?.[owner.id] ?? 0), 0)

  function toggleOwner(id: AvisionMapOwner, show: boolean) {
    if (!filters) return

    filters.change(
      FILTER_OWNERS.map((owner) => owner.id).filter((each) =>
        each === id ? show : filters.shown.includes(each),
      ),
    )
  }

  const showAllOwners = () =>
    filters?.change(FILTER_OWNERS.map((owner) => owner.id))

  function focusArea(bounds: MapBounds) {
    setSelectedNeighborhood(null)

    setFocus({ bounds })

    setSearchOpen(false)
  }

  return (
    <section
      className={`avision-map-widget ${softStyle ? "avision-soft-map" : ""}`}
      style={{ height }}
      aria-label="Avision interactive Atlanta map"
    >
      <div className="avision-map-toolbar">
        <div ref={search} className="avision-map-search">
          <input
            aria-label="Search stations, neighborhoods, or GSU buildings"
            placeholder="Find a station, neighborhood, or GSU building"
            value={query}
            onFocus={() => setSearchOpen(true)}
            onChange={(event) => {
              setQuery(event.target.value)

              setSearchOpen(true)

              setActiveResult(0)
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setSearchOpen(false)

                setQuery("")
              }

              if (event.key === "ArrowDown" && results.length) {
                event.preventDefault()

                setSearchOpen(true)

                setActiveResult((index) => (index + 1) % results.length)
              }

              if (event.key === "ArrowUp" && results.length) {
                event.preventDefault()

                setActiveResult(
                  (index) => (index + results.length - 1) % results.length,
                )
              }

              if (event.key === "Enter" && results.length) {
                event.preventDefault()

                selectResult(results[activeResult] ?? results[0])
              }
            }}
          />
          {query && (
            <button
              type="button"
              className="avision-map-clear"
              aria-label="Clear map search"
              onClick={() => {
                setQuery("")

                setSearchOpen(false)
              }}
            >
              ×
            </button>
          )}
          {searchOpen && query.trim() && (
            <div className="avision-map-results">
              {results.length ? (
                results.map((item, index) => (
                  <button
                    type="button"
                    key={item.key}
                    className={
                      index === activeResult ? "avision-search-active" : ""
                    }
                    onClick={() => selectResult(item)}
                  >
                    <span>{item.name}</span>
                    <small>{item.kind}</small>
                  </button>
                ))
              ) : (
                <p role="status">
                  {dataError
                    ? "Search data is unavailable. Try the area buttons."
                    : !stationData
                      ? "Loading map search…"
                      : "No match. Try Five Points, Downtown, or GSU."}
                </p>
              )}
            </div>
          )}
        </div>
        <nav className="avision-map-views" aria-label="Map area">
          <button type="button" onClick={() => focusArea(ATLANTA_VIEW)}>
            Atlanta
          </button>
          <button type="button" onClick={() => focusArea(CORRIDOR_VIEW)}>
            GSU + MARTA
          </button>
          <button type="button" onClick={() => focusArea(GSU_VIEW)}>
            GSU
          </button>
          <button type="button" onClick={() => focusArea(GEORGIA_TECH_VIEW)}>
            Georgia Tech
          </button>
        </nav>
      </div>
      <div className="avision-map-canvas">
        <MapContainer
          bounds={initialBounds}
          minZoom={10}
          maxZoom={MAX_ZOOM}
          zoomControl={true}
          zoomAnimation={!reducedMotion}
          fadeAnimation={!reducedMotion}
          markerZoomAnimation={!reducedMotion}
          scrollWheelZoom={true}
          className="avision-leaflet-map"
        >
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={MAX_ZOOM}
            maxNativeZoom={MAX_ZOOM}
            eventHandlers={{ tileerror: () => setTileError(true) }}
          />
          <MapBehavior
            focus={focus}
            onMapClick={onMapClick}
            onBounds={setView}
          />
          {showCity && city && (
            <GeoJSON
              data={city}
              interactive={false}
              style={{
                color: "#0039A6",
                weight: 1.5,
                fillOpacity: 0.025,
                className: "avision-city-boundary",
              }}
            />
          )}
          {showHighways && roads && (
            <GeoJSON
              data={roads}
              style={(feature) => ({
                color: "#F4A261",

                weight: feature?.properties.kind === "context" ? 1.5 : 2,

                opacity: feature?.properties.kind === "context" ? 0.6 : 0.85,

                className: "avision-gdot-road",
              })}
              interactive={false}
            />
          )}
          {showBoundary && (
            <GeoJSON
              data={PILOT_OUTLINE}
              style={{
                color: "#334155",

                weight: 2.5,

                dashArray: "7 6",

                fillOpacity: 0.04,
              }}
              interactive={false}
            />
          )}
          {outlines.map(({ feature }) => (
            <GeoJSON
              key={feature.properties.NAME}
              data={feature}
              style={{
                color: "#334155",

                weight: 1.3,

                dashArray: "3 5",

                fillOpacity: 0.015,
              }}
              interactive={false}
            />
          ))}
          {highlighted && (
            <GeoJSON
              key={`selected-${highlighted.feature.properties.NAME}`}
              data={highlighted.feature}
              style={{ color: "#0039A6", weight: 2.5, fillOpacity: 0.07 }}
              interactive={false}
            />
          )}
          {showStations &&
            stations.map((station) => (
              <Marker
                key={station.properties.STATION}
                position={[
                  station.geometry.coordinates[1],

                  station.geometry.coordinates[0],
                ]}
                icon={stationIcon}
                title={`${station.properties.STATION} MARTA station`}
              >
                <Tooltip direction="top" offset={[0, -16]}>
                  {station.properties.STATION} station
                </Tooltip>
              </Marker>
            ))}
          {showGsu &&
            gsu?.features.map((building) => (
              <Marker
                key={building.properties.sourceObjectId}
                icon={gsuIcon}
                zIndexOffset={100}
                position={[
                  building.geometry.coordinates[1],
                  building.geometry.coordinates[0],
                ]}
                title={`${building.properties.name} · GSU building reference · ${building.properties.address}`}
              >
                <Tooltip>
                  <strong>{building.properties.name}</strong>
                  <br />
                  {building.properties.address}
                  <br />
                  Address reference; not a property boundary or accessible
                  entrance.
                </Tooltip>
              </Marker>
            ))}
          {visibleMarkers.map((marker) => (
            <IssueMarker
              key={marker.id}
              marker={marker}
              selected={marker.id === selectedMarkerId}
              onSelect={onMarkerSelect}
            />
          ))}
        </MapContainer>
        {(tileError || dataError || roadError || cityError || gsuError) && (
          <div className="avision-map-warning" role="status">
            {tileError && (
              <span>
                Some map tiles couldn’t load. Check your connection and reload.{" "}
              </span>
            )}
            {dataError && (
              <span>Station and neighborhood data couldn’t load. </span>
            )}
            {roadError && (
              <span>
                GDOT roads couldn’t load. Ticket locations still work.{" "}
              </span>
            )}
            {cityError && <span>Atlanta boundary couldn’t load. </span>}
            {gsuError && <span>GSU reference points couldn’t load. </span>}
            {(dataError || roadError || cityError || gsuError) && (
              <button
                type="button"
                onClick={() => setDataRetry((value) => value + 1)}
              >
                Retry geographic data
              </button>
            )}
          </div>
        )}
      </div>
      {showLegend && (visibleMarkers.length > 0 || filtered) && (
        <div
          id="avision-map-legend"
          className="avision-map-legend"
          role="group"
          aria-label="Issue marker legend"
        >
          <span className="avision-map-legend-title">Issue owner</span>
          {ISSUE_OWNERS.map((owner) => (
            <span className="avision-map-legend-item" key={owner.id}>
              <span
                className={`avision-map-legend-dot avision-legend-owner-${owner.id}`}
                style={{ backgroundColor: owner.color }}
                aria-hidden="true"
              >
                {owner.symbol}
              </span>
              {owner.label}
            </span>
          ))}
          <span className="avision-map-legend-title">Status</span>
          {(["open", "likely_fixed", "fixed"] as AvisionMapStatus[]).map(
            (status) => (
              <span className="avision-map-legend-item" key={status}>
                <span
                  className={`avision-legend-status avision-issue-status-${status}`}
                  aria-hidden="true"
                >
                  {status === "fixed"
                    ? "✓"
                    : status === "likely_fixed"
                      ? "◷"
                      : "!"}
                </span>
                {ISSUE_STATUS_LABELS[status]}
              </span>
            ),
          )}
        </div>
      )}
      <div className="avision-map-options" aria-label="Map layers">
        {filters && (
          <details
            className="avision-map-layer-menu avision-map-filter-menu"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.currentTarget.open = false

                event.currentTarget.querySelector("summary")?.focus()
              }
            }}
          >
            <summary>
              Filters{" "}
              <span>
                {shownFilterOwners.length}/{FILTER_OWNERS.length}
              </span>
            </summary>
            <fieldset className="avision-map-layer-list">
              <legend>Show tickets for</legend>
              {FILTER_OWNERS.map((owner) => (
                <label key={owner.id}>
                  <input
                    type="checkbox"
                    checked={filters.shown.includes(owner.id)}
                    onChange={(event) =>
                      toggleOwner(owner.id, event.target.checked)
                    }
                  />
                  <span
                    className={`avision-map-legend-dot avision-legend-owner-${owner.id}`}
                    style={{ backgroundColor: owner.color }}
                    aria-hidden="true"
                  >
                    {owner.symbol}
                  </span>
                  {owner.label}
                  <small>
                    {ownerCounts?.[owner.id] ?? 0}
                    <span className="avision-sr-only"> tickets</span>
                  </small>
                </label>
              ))}
              <button
                type="button"
                className="avision-map-filter-all"
                onClick={showAllOwners}
                disabled={!filtered}
              >
                Show all
              </button>
              {filterNote && filtered && (
                <p>
                  These were {filterNote}. Change them here any time, or edit
                  your profile to change what you start with.
                </p>
              )}
            </fieldset>
          </details>
        )}
        {filters && filtered && (
          <button
            type="button"
            className="avision-map-show-all"
            onClick={showAllOwners}
            aria-label={`Show all tickets${hiddenTickets > 0 ? ` (${hiddenTickets} hidden)` : ""}`}
          >
            Show all
          </button>
        )}
        <details
          className="avision-map-layer-menu"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.currentTarget.open = false

              event.currentTarget.querySelector("summary")?.focus()
            }
          }}
        >
          <summary>
            Layers{" "}
            <span>
              {
                [
                  showHighways,
                  showCity,
                  showGsu,
                  showBoundary,
                  showStations,
                  showNeighborhoods,
                ].filter(Boolean).length
              }
            </span>
          </summary>
          <fieldset className="avision-map-layer-list">
            <legend>Geographic reference layers</legend>
            <label>
              <input
                type="checkbox"
                checked={showHighways}
                disabled={!roads}
                onChange={(event) => setShowHighways(event.target.checked)}
              />
              GDOT / Highways
            </label>
            <label>
              <input
                type="checkbox"
                checked={showCity}
                disabled={!city}
                onChange={(event) => setShowCity(event.target.checked)}
              />
              Atlanta municipal boundary
            </label>
            <label>
              <input
                type="checkbox"
                checked={showGsu}
                disabled={!gsu}
                onChange={(event) => setShowGsu(event.target.checked)}
              />
              GSU building references
            </label>
            <label>
              <input
                type="checkbox"
                checked={showBoundary}
                onChange={(event) => setShowBoundary(event.target.checked)}
              />{" "}
              Illustrative pilot outline
            </label>
            <label>
              <input
                type="checkbox"
                checked={showStations}
                disabled={!stationData}
                onChange={(event) => setShowStations(event.target.checked)}
              />{" "}
              Stations
            </label>
            <label>
              <input
                type="checkbox"
                checked={showNeighborhoods}
                disabled={!neighborhoodData}
                onChange={(event) => setShowNeighborhoods(event.target.checked)}
              />{" "}
              Neighborhoods
            </label>
            <p>
              Reference layers do not assign ticket responsibility. The pilot
              outline is illustrative; GSU points are addresses. I-285 is a
              highway, not the city boundary.
            </p>
          </fieldset>
        </details>
        <span className="avision-map-style" aria-label="Map style">
          <button
            type="button"
            aria-pressed={softStyle}
            onClick={() => setSoftStyle(true)}
          >
            Soft
          </button>
          <button
            type="button"
            aria-pressed={!softStyle}
            onClick={() => setSoftStyle(false)}
          >
            Street
          </button>
        </span>
        {/* Styled like the Soft / Street buttons beside it. */}
        <span className="avision-map-style">
          <button
            type="button"
            aria-expanded={showLegend}
            aria-controls="avision-map-legend"
            onClick={toggleLegend}
          >
            {showLegend ? "Hide legend" : "Show legend"}
          </button>
        </span>
      </div>
    </section>
  )
}

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
  SourceInfo,
  AvisionMapStatus,
  AvisionMapMarker,
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

  useEffect(() => {
    map.invalidateSize()

    const animate = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches

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

      map.invalidateSize({ pan: false })

      map.setView(center, map.getZoom(), { animate: false })
    })

    observer.observe(map.getContainer())

    return () => observer.disconnect()
  }, [map])

  useMapEvents({
    click(event) {
      onMapClick?.({ latitude: event.latlng.lat, longitude: event.latlng.lng })
    },

    moveend() {
      const bounds = map.getBounds()

      onBounds([
        [bounds.getSouth(), bounds.getWest()],

        [bounds.getNorth(), bounds.getEast()],
      ])
    },
  })

  return null
}

export default function AvisionMap({
  height = 600,

  dataUrl = "/avision-map",

  markers = NO_MARKERS,

  selectedMarkerId = null,

  focusPoint,

  initialArea = "atlanta",

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

  const [sourcesOpen, setSourcesOpen] = useState(false)

  const [retrievedDate, setRetrievedDate] = useState("Date unavailable")

  const [dataSources, setDataSources] = useState<SourceInfo[]>([])

  const [selectedNeighborhood, setSelectedNeighborhood] =
    useState<string | null>(null)

  const search = useRef<HTMLDivElement>(null)

  const sources = useRef<HTMLDialogElement>(null)

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

    setRetrievedDate("Date unavailable")

    setDataSources([])

    fetch(`${base}/sources.json`, { signal: controller.signal })

      .then((response) => (response.ok ? response.json() : null))

      .then((source) => {
        if (!controller.signal.aborted && Array.isArray(source?.datasets)) {
          setDataSources(
            source.datasets.filter(
              (item: SourceInfo) =>
                typeof item?.label === "string" &&
                typeof item.url === "string" &&
                item.url.startsWith("https://") &&
                typeof item.description === "string" &&
                typeof item.dateNote === "string" &&
                !Number.isNaN(new Date(item.retrievedAt).valueOf()),
            ),
          )
        }

        const value = source?.retrievedDate ?? source?.retrievedAt

        if (
          !controller.signal.aborted &&
          value &&
          !Number.isNaN(new Date(value).valueOf())
        )
          setRetrievedDate(
            new Date(value).toLocaleDateString("en-US", {
              year: "numeric",

              month: "long",

              day: "numeric",

              timeZone: "UTC",
            }),
          )
      })

      .catch(() => {})

    return () => controller.abort()
  }, [base, dataRetry])

  useEffect(() => {
    const closeSearch = (event: PointerEvent) => {
      if (!search.current?.contains(event.target as Node)) setSearchOpen(false)
    }

    document.addEventListener("pointerdown", closeSearch)

    return () => document.removeEventListener("pointerdown", closeSearch)
  }, [])

  useEffect(() => {
    if (sourcesOpen && !sources.current?.open) sources.current?.showModal()

    if (!sourcesOpen && sources.current?.open) sources.current?.close()
  }, [sourcesOpen])

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
        </nav>
      </div>
      <div className="avision-map-canvas">
        <MapContainer
          bounds={initialBounds}
          minZoom={10}
          maxZoom={19}
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
      {visibleMarkers.length > 0 && (
        <div
          className="avision-map-legend"
          role="group"
          aria-label="Issue marker legend"
        >
          <span className="avision-map-legend-title">Issue owner</span>
          {ISSUE_OWNERS.map((owner) => (
            <span className="avision-map-legend-item" key={owner.id}>
              <span
                className="avision-map-legend-dot"
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
        <button
          type="button"
          className="avision-map-sources"
          onClick={() => setSourcesOpen(true)}
        >
          Data sources
        </button>
      </div>
      <dialog
        ref={sources}
        className="avision-map-source-dialog"
        onCancel={() => setSourcesOpen(false)}
        onClose={() => setSourcesOpen(false)}
      >
        <div className="avision-map-dialog-heading">
          <h2>Map sources</h2>
          <button
            type="button"
            aria-label="Close map sources"
            onClick={() => setSourcesOpen(false)}
          >
            ×
          </button>
        </div>
        <p>
          Streets:{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noreferrer"
          >
            OpenStreetMap
          </a>
          . Soft and Street use the same tiles with different colors.
        </p>
        <p>
          Neighborhoods and station points:{" "}
          <a
            href="https://gis.atlantaga.gov/dpcd/rest/services/OpenDataService1/MapServer"
            target="_blank"
            rel="noreferrer"
          >
            City of Atlanta GIS
          </a>
          , downloaded {retrievedDate}. Individual features may have been
          updated earlier.
        </p>
        <p>
          The pilot outline is a team-defined GSU and MARTA area. It doesn’t
          show campus property lines or agency ownership.
        </p>
        {dataSources.map((source) => (
          <p key={source.id}>
            <a href={source.url} target="_blank" rel="noreferrer">
              {source.label}
            </a>
            , retrieved{" "}
            {new Date(source.retrievedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "UTC",
            })}
            . {source.dateNote} {source.description}
            {source.buildingList && (
              <>
                {" "}
                <a href={source.buildingList} target="_blank" rel="noreferrer">
                  GSU building list
                </a>
                .
              </>
            )}
          </p>
        ))}
        {!dataSources.length && (
          <p>
            Additional layer source metadata is unavailable. See the bundled
            sources.json for provenance.
          </p>
        )}
      </dialog>
    </section>
  )
}

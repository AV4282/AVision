import { useEffect, useMemo, useRef, useState } from "react";
import {
  GeoJSON,
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { divIcon } from "leaflet";
import {
  ATLANTA_VIEW,
  CORRIDOR_VIEW,
  GSU_VIEW,
  CORRIDOR_STATIONS,
  CONTROL_PLACEHOLDERS,
  AREA_PLACEHOLDERS,
  PILOT_OUTLINE,
  boundsOverlap,
  geometryBounds,
  type MapBounds,
} from "./map-config";
import type {
  AvisionMapProps,
  MapCoordinates,
  NeighborhoodData,
  StationData,
} from "./types";
import "leaflet/dist/leaflet.css";
import "./AvisionMap.css";

export type {
  AvisionMapProps,
  AvisionMapMarker,
  MapCoordinates,
} from "./types";

const stationIcon = divIcon({
  className: "avision-station-pin",
  html: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="3" width="12" height="15" rx="3"/><path d="M8 7h8v5H8zM8 21l2-3m6 3-2-3"/><circle cx="9" cy="15" r=".6"/><circle cx="15" cy="15" r=".6"/></svg>',
  iconSize: [29, 32],
  iconAnchor: [14, 16],
});
const issueIcon = divIcon({
  className: "avision-issue-pin",
  html: '<span aria-hidden="true">●</span>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

type Focus = { bounds?: MapBounds; point?: MapCoordinates };
type SearchResult = { key: string; name: string; kind: string; focus: Focus };
const NO_MARKERS = Object.freeze([]);

function MapBehavior({
  focus,
  onMapClick,
  onBounds,
}: {
  focus: Focus;
  onMapClick?: AvisionMapProps["onMapClick"];
  onBounds: (bounds: MapBounds) => void;
}) {
  const map = useMap();
  useEffect(() => {
    const animate = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    if (focus.bounds)
      map.fitBounds(focus.bounds, { padding: [24, 24], maxZoom: 16, animate });
    if (focus.point)
      map.setView([focus.point.latitude, focus.point.longitude], 17, {
        animate,
      });
  }, [focus, map]);
  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);
  useMapEvents({
    click(event) {
      onMapClick?.({ latitude: event.latlng.lat, longitude: event.latlng.lng });
    },
    moveend() {
      const bounds = map.getBounds();
      onBounds([
        [bounds.getSouth(), bounds.getWest()],
        [bounds.getNorth(), bounds.getEast()],
      ]);
    },
  });
  return null;
}

export default function AvisionMap({
  height = 600,
  dataUrl = "/avision-map",
  markers = NO_MARKERS,
  onMarkerSelect,
  onMapClick,
}: AvisionMapProps) {
  const [neighborhoodData, setNeighborhoodData] =
    useState<NeighborhoodData | null>(null);
  const [stationData, setStationData] = useState<StationData | null>(null);
  const [dataError, setDataError] = useState(false);
  const [tileError, setTileError] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeResult, setActiveResult] = useState(0);
  const [focus, setFocus] = useState<Focus>({ bounds: ATLANTA_VIEW });
  const [view, setView] = useState<MapBounds>(ATLANTA_VIEW);
  const [showBoundary, setShowBoundary] = useState(true);
  const [showNeighborhoods, setShowNeighborhoods] = useState(false);
  const [showStations, setShowStations] = useState(true);
  const [softStyle, setSoftStyle] = useState(true);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [retrievedDate, setRetrievedDate] = useState("Date unavailable");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<
    string | null
  >(null);
  const search = useRef<HTMLDivElement>(null);
  const sources = useRef<HTMLDialogElement>(null);
  const base = dataUrl.replace(/\/$/, "");

  useEffect(() => {
    const controller = new AbortController();
    setDataError(false);
    setNeighborhoodData(null);
    setStationData(null);
    async function load() {
      try {
        const responses = await Promise.all(
          ["neighborhoods", "stations"].map((name) =>
            fetch(`${base}/${name}.geojson`, { signal: controller.signal }),
          ),
        );
        if (responses.some((response) => !response.ok))
          throw new Error("Map data unavailable");
        const [neighborhoods, stations] = await Promise.all(
          responses.map((response) => response.json()),
        );
        if (
          neighborhoods.type !== "FeatureCollection" ||
          stations.type !== "FeatureCollection" ||
          !Array.isArray(neighborhoods.features) ||
          !Array.isArray(stations.features)
        )
          throw new Error("Invalid map data");
        if (!controller.signal.aborted) {
          setNeighborhoodData(neighborhoods);
          setStationData(stations);
        }
      } catch {
        if (!controller.signal.aborted) setDataError(true);
      }
    }
    void load();
    setRetrievedDate("Date unavailable");
    fetch(`${base}/sources.json`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((source) => {
        const value = source?.retrievedDate ?? source?.retrievedAt;
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
          );
      })
      .catch(() => {});
    return () => controller.abort();
  }, [base]);

  useEffect(() => {
    const closeSearch = (event: PointerEvent) => {
      if (!search.current?.contains(event.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("pointerdown", closeSearch);
    return () => document.removeEventListener("pointerdown", closeSearch);
  }, []);
  useEffect(() => {
    if (sourcesOpen && !sources.current?.open) sources.current?.showModal();
    if (!sourcesOpen && sources.current?.open) sources.current?.close();
  }, [sourcesOpen]);

  const neighborhoods = useMemo(
    () =>
      neighborhoodData?.features.map((feature) => ({
        feature,
        bounds: geometryBounds(feature.geometry),
      })) ?? [],
    [neighborhoodData],
  );
  const stations = useMemo(
    () =>
      stationData?.features.filter((station) =>
        CORRIDOR_STATIONS.includes(station.properties.STATION),
      ) ?? [],
    [stationData],
  );
  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];
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
      .slice(0, 6);
  }, [query, stations, neighborhoods]);
  const outlines = showNeighborhoods
    ? neighborhoods.filter((item) => boundsOverlap(item.bounds, view))
    : [];
  const highlighted = neighborhoods.find(
    (item) => item.feature.properties.NAME === selectedNeighborhood,
  );

  function selectResult(item: SearchResult) {
    setFocus({ ...item.focus });
    setSelectedNeighborhood(item.kind === "Neighborhood" ? item.name : null);
    setSearchOpen(false);
    setQuery("");
  }
  function focusArea(bounds: MapBounds) {
    setSelectedNeighborhood(null);
    setFocus({ bounds });
    setSearchOpen(false);
  }

  return (
    <section
      className={`avision-map-widget ${softStyle ? "avision-soft-map" : ""}`}
      style={{ height }}
      aria-label="Avision interactive Atlanta map"
    >
      {/* Hidden labels for future connections. They add no markers, requests, or actions. */}
      <div hidden aria-hidden="true" style={{ display: "none" }}>
        {CONTROL_PLACEHOLDERS.map((name) => (
          <span
            key={`control:${name}`}
            data-avision-placeholder={`control:${name}`}
          />
        ))}
        {results.map((item) => (
          <span
            key={`search-result:${item.key}`}
            data-avision-placeholder={`search-result:${item.key}`}
          />
        ))}
        {AREA_PLACEHOLDERS.map((name) => (
          <span
            key={`area:${name}`}
            data-avision-placeholder={`location:area:${name}`}
          />
        ))}
        {stations.map((station) => (
          <span
            key={`station:${station.properties.STATION}`}
            data-avision-placeholder={`location:station:${station.properties.STATION}`}
          />
        ))}
        {neighborhoods.map(({ feature }) => (
          <span
            key={`neighborhood:${feature.properties.NAME}`}
            data-avision-placeholder={`location:neighborhood:${feature.properties.NAME}`}
          />
        ))}
        {markers.map((marker) => (
          <span
            key={`marker:${marker.id}`}
            data-avision-placeholder={`location:marker:${marker.id}`}
          />
        ))}
      </div>
      <div className="avision-map-toolbar">
        <div ref={search} className="avision-map-search">
          <input
            aria-label="Search stations or neighborhoods"
            placeholder="Find a station or neighborhood"
            value={query}
            onFocus={() => setSearchOpen(true)}
            onChange={(event) => {
              setQuery(event.target.value);
              setSearchOpen(true);
              setActiveResult(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setSearchOpen(false);
                setQuery("");
              }
              if (event.key === "ArrowDown" && results.length) {
                event.preventDefault();
                setSearchOpen(true);
                setActiveResult((index) => (index + 1) % results.length);
              }
              if (event.key === "ArrowUp" && results.length) {
                event.preventDefault();
                setActiveResult(
                  (index) => (index + results.length - 1) % results.length,
                );
              }
              if (event.key === "Enter" && results.length) {
                event.preventDefault();
                selectResult(results[activeResult] ?? results[0]);
              }
            }}
          />
          {query && (
            <button
              type="button"
              className="avision-map-clear"
              aria-label="Clear map search"
              onClick={() => {
                setQuery("");
                setSearchOpen(false);
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
          bounds={ATLANTA_VIEW}
          minZoom={10}
          maxZoom={19}
          zoomControl={true}
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
          {showBoundary && (
            <GeoJSON
              data={PILOT_OUTLINE}
              style={{
                color: "#0b7162",
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
                color: "#786844",
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
              style={{ color: "#805f2f", weight: 2.5, fillOpacity: 0.07 }}
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
          {markers
            .filter(
              (marker) =>
                Number.isFinite(marker.latitude) &&
                Math.abs(marker.latitude) <= 90 &&
                Number.isFinite(marker.longitude) &&
                Math.abs(marker.longitude) <= 180,
            )
            .map((marker) => (
              <Marker
                key={marker.id}
                position={[marker.latitude, marker.longitude]}
                icon={issueIcon}
                zIndexOffset={1000}
                title={marker.label}
                eventHandlers={{
                  click: (event) => {
                    event.originalEvent.stopPropagation();
                    onMarkerSelect?.(marker);
                  },
                }}
              >
                <Tooltip>{marker.label}</Tooltip>
              </Marker>
            ))}
        </MapContainer>
        {(tileError || dataError) && (
          <div className="avision-map-warning" role="status">
            {dataError
              ? "Station and neighborhood data couldn’t load. The street map still works."
              : "Some map tiles couldn’t load. Check your connection and reload."}
          </div>
        )}
      </div>
      <div className="avision-map-options" aria-label="Map layers">
        <label>
          <input
            type="checkbox"
            checked={showBoundary}
            onChange={(event) => setShowBoundary(event.target.checked)}
          />{" "}
          Pilot outline
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
      </dialog>
    </section>
  );
}

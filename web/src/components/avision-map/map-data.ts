import { useEffect, useState } from "react"
import type { MultiPolygon, Polygon } from "geojson"
import type {
  CityData,
  GsuData,
  HighwayData,
  MapCoordinates,
  NeighborhoodData,
  StationData,
} from "./types"

export function validPoint(point: MapCoordinates) {
  return (
    Number.isFinite(point.latitude) &&
    Math.abs(point.latitude) <= 90 &&
    Number.isFinite(point.longitude) &&
    Math.abs(point.longitude) <= 180
  )
}

const validPosition = (point: unknown) =>
  Array.isArray(point) &&
  validPoint({ latitude: point[1], longitude: point[0] })

export function highwayData(value: unknown): value is HighwayData {
  const data = value as HighwayData | null
  return (
    data?.type === "FeatureCollection" &&
    Array.isArray(data.features) &&
    data.features.length > 0 &&
    data.features.every(
      (feature) =>
        feature.type === "Feature" &&
        typeof feature.properties?.name === "string" &&
        ["highway", "state-route", "context"].includes(
          feature.properties?.kind,
        ) &&
        feature.geometry?.type === "MultiLineString" &&
        Array.isArray(feature.geometry.coordinates) &&
        feature.geometry.coordinates.length > 0 &&
        feature.geometry.coordinates.every(
          (line) =>
            Array.isArray(line) &&
            line.length >= 2 &&
            line.every(validPosition),
        ),
    )
  )
}

// An area the map can draw and take bounds from: closed rings of positions
// that are actually on the globe.
const drawableArea = (geometry: unknown) => {
  const area = geometry as Polygon | MultiPolygon | null
  if (
    !area ||
    !["Polygon", "MultiPolygon"].includes(area.type) ||
    !Array.isArray(area.coordinates)
  )
    return false
  const rings =
    area.type === "Polygon" ? area.coordinates : area.coordinates.flat()
  return (
    rings.length > 0 &&
    rings.every(
      (ring) =>
        Array.isArray(ring) &&
        ring.length >= 4 &&
        ring.every(validPosition) &&
        ring[0].join(",") === ring[ring.length - 1].join(","),
    )
  )
}

export function cityData(value: unknown): value is CityData {
  const data = value as CityData | null
  return (
    data?.type === "FeatureCollection" &&
    Array.isArray(data.features) &&
    data.features.length > 0 &&
    data.features.every(
      (feature) =>
        feature.properties?.NAME === "Atlanta" && drawableArea(feature.geometry),
    )
  )
}

// The map takes each neighborhood's bounds for the outline layer and for
// search, so a feature without a drawable area has to be caught here.
export function neighborhoodData(value: unknown): value is NeighborhoodData {
  const data = value as NeighborhoodData | null
  return (
    data?.type === "FeatureCollection" &&
    Array.isArray(data.features) &&
    data.features.length > 0 &&
    data.features.every(
      (feature) =>
        typeof feature.properties?.NAME === "string" &&
        drawableArea(feature.geometry),
    )
  )
}

export function stationData(value: unknown): value is StationData {
  const data = value as StationData | null
  return (
    data?.type === "FeatureCollection" &&
    Array.isArray(data.features) &&
    data.features.length > 0 &&
    data.features.every(
      (feature) =>
        typeof feature.properties?.STATION === "string" &&
        feature.geometry?.type === "Point" &&
        validPosition(feature.geometry.coordinates),
    )
  )
}

export function gsuData(value: unknown): value is GsuData {
  const data = value as GsuData | null
  return (
    data?.type === "FeatureCollection" &&
    Array.isArray(data.features) &&
    data.features.length > 0 &&
    data.features.every(
      (feature) =>
        typeof feature.properties?.name === "string" &&
        typeof feature.properties.address === "string" &&
        feature.properties.referenceOnly === true &&
        feature.geometry?.type === "Point" &&
        validPosition(feature.geometry.coordinates),
    )
  )
}

// Optional reference layers fail independently, leaving ticket interactions available.
export function useGeographicData<T>(
  url: string,
  validate: (value: unknown) => value is T,
  retry: number,
) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    setData(null)
    setError(false)
    fetch(url, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Geographic data unavailable")
        const value: unknown = await response.json()
        if (!validate(value)) throw new Error("Invalid geographic data")
        if (!controller.signal.aborted) setData(value)
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true)
      })
    return () => controller.abort()
  }, [url, validate, retry])
  return { data, error }
}

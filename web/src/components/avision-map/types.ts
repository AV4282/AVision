import type { FeatureCollection, MultiPolygon, Point, Polygon } from "geojson"
export type MapCoordinates = {
  latitude: number
  longitude: number
}

export type AvisionMapOwner = "gsu" | "city" | "marta" | "gdot" | "unknown"
export type AvisionMapStatus = "open" | "likely_fixed" | "fixed" | "merged"
export type AvisionMapMarker = MapCoordinates & {
  id: string
  label: string
  owner?: AvisionMapOwner
  status?: AvisionMapStatus
}
export type AvisionMapProps = {
  height?: number | string
  dataUrl?: string
  markers?: readonly AvisionMapMarker[]
  /** Controlled highlight; selecting a marker still calls onMarkerSelect. */
  selectedMarkerId?: string | null
  /** A new object requests focus without locking subsequent pan/search. */
  focusPoint?: MapCoordinates | null
  initialArea?: "atlanta" | "corridor" | "gsu"
  onMarkerSelect?: (marker: AvisionMapMarker) => void
  onMapClick?: (coordinates: MapCoordinates) => void
}
export type NeighborhoodData = FeatureCollection<Polygon | MultiPolygon, {
  NAME: string
}>
export type StationData = FeatureCollection<Point, { STATION: string }>

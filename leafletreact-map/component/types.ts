import type { FeatureCollection, MultiPolygon, Point, Polygon } from 'geojson'

export type MapCoordinates = { latitude: number; longitude: number }
export type AvisionMapMarker = MapCoordinates & { id: string; label: string }
export type AvisionMapProps = {
  height?: number | string
  dataUrl?: string
  markers?: readonly AvisionMapMarker[]
  onMarkerSelect?: (marker: AvisionMapMarker) => void
  onMapClick?: (coordinates: MapCoordinates) => void
}
export type NeighborhoodData = FeatureCollection<Polygon | MultiPolygon, { NAME: string }>
export type StationData = FeatureCollection<Point, { STATION: string }>

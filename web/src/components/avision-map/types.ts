import type {
  FeatureCollection,
  MultiLineString,
  MultiPolygon,
  Point,
  Polygon,
} from "geojson"

export type MapCoordinates = {
  latitude: number

  longitude: number
}

export type AvisionMapOwner = "gsu" | "gt" | "city" | "marta" | "gdot" | "unknown"

export type AvisionMapStatus = "open" | "likely_fixed" | "fixed" | "merged"

export type AvisionMapMarker = MapCoordinates & {
  id: string

  label: string

  owner?: AvisionMapOwner

  status?: AvisionMapStatus
}


/** A campus outline the map can draw as a reference layer. */
export type AvisionMapCampus = {
  id: string
  /** Its switch under Layers, e.g. "Georgia Tech campus outline". */
  label: string
  color: string
  geometry: Polygon | MultiPolygon
}

export type AvisionMapProps = {
  height?: number | string

  dataUrl?: string

  markers?: readonly AvisionMapMarker[]

  /** Controlled highlight; selecting a marker still calls onMarkerSelect. */

  selectedMarkerId?: string | null

  /** A new object requests focus without locking subsequent pan/search. */

  focusPoint?: MapCoordinates | null

  initialArea?: "atlanta" | "corridor" | "gsu" | "gt"

  /**
   * Ticket filters. Given together with onShownOwnersChange, the map offers a
   * "Filters" menu with a switch per owner. The page does the filtering itself:
   * `markers` should hold only the tickets of the owners listed here.
   */

  shownOwners?: readonly AvisionMapOwner[]

  /** How many tickets each owner has, shown beside its switch. */

  ownerCounts?: Partial<Record<AvisionMapOwner, number>>

  onShownOwnersChange?: (owners: AvisionMapOwner[]) => void

  /**
   * The same for a ticket's status (open, likely fixed, fixed). Given together
   * with onShownStatusesChange, the Filters menu also has a switch per status.
   * Again the page filters `markers` itself.
   */

  shownStatuses?: readonly AvisionMapStatus[]

  /** How many tickets have each status, shown beside its switch. */

  statusCounts?: Partial<Record<AvisionMapStatus, number>>

  onShownStatusesChange?: (statuses: AvisionMapStatus[]) => void

  /** Why the filters are set as they are, e.g. "picked from your profile". */

  filterNote?: string | null

  /**
   * Campus outlines to offer under Layers, each with its own switch (off to
   * start with). A campus department only takes tickets inside its outline.
   */

  campuses?: readonly AvisionMapCampus[]

  onMarkerSelect?: (marker: AvisionMapMarker) => void

  onMapClick?: (coordinates: MapCoordinates) => void
}

export type NeighborhoodData = FeatureCollection<Polygon | MultiPolygon, {
  NAME: string
}>

export type StationData = FeatureCollection<Point, { STATION: string }>

export type HighwayData = FeatureCollection<MultiLineString, {
  name: string

  kind: "highway" | "state-route" | "context"

  routeCodes: string[]

  sourceRouteIds: string[]
}>

export type CityData = FeatureCollection<Polygon | MultiPolygon, {
  NAME: string

  OBJECTID: number

  LAST_EDITED_DATE: number
}>

export type GsuData = FeatureCollection<Point, {
  name: string

  address: string

  sourceObjectId: number

  lastEditedAt: string

  referenceOnly: true
}>

export type SourceInfo = {
  id: string

  label: string

  url: string

  retrievedAt: string

  dateNote: string

  description: string

  buildingList?: string
}

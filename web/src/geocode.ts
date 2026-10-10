// Address lookups for the report form, both built on OpenStreetMap data and
// both free with no key:
//
//   nearestAddress()    position -> street address, for "Use my location".
//                       Service: Nominatim. Light use only (about one request a
//                       second) and no search-as-you-type, so call it once per
//                       button press. https://operations.osmfoundation.org/policies/nominatim/
//
//   suggestAddresses()  a few typed letters -> matching addresses, for the
//                       suggestions under the address box.
//                       Service: Photon, which is made for search-as-you-type.
//                       Fair use applies, so wait for a pause in typing before
//                       calling it. https://photon.komoot.io

type NominatimReply = {
  name?: string
  address?: {
    house_number?: string
    road?: string
    pedestrian?: string
    neighbourhood?: string
    suburb?: string
    city?: string
    town?: string
    village?: string
  }
}

/**
 * The closest address to a position, e.g. "Library North, 100 Decatur Street
 * Southeast, Atlanta". Returns null when nothing is found or the lookup fails,
 * so callers can fall back to plain wording.
 */
export async function nearestAddress(lat: number, lng: number): Promise<string | null> {
  const query = new URLSearchParams({
    format: "jsonv2",
    lat: String(lat),
    lon: String(lng),
    zoom: "18", // building level
    addressdetails: "1",
    "accept-language": "en",
  })
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${query}`, {
      signal: AbortSignal.timeout(6000),
    })
    if (!res.ok) return null
    const { name, address = {} } = (await res.json()) as NominatimReply

    const road = address.road ?? address.pedestrian
    const street = [address.house_number, road].filter(Boolean).join(" ")
    const area = address.city ?? address.town ?? address.village
    // A named place (a building, a station) comes first when there is one.
    const parts = [name !== road ? name : "", street || address.neighbourhood, area]
    const label = [...new Set(parts.filter(Boolean))].join(", ")
    return label ? label.slice(0, 200) : null
  } catch {
    return null // offline, blocked, or too slow
  }
}

/** One suggested address, with the position it stands for. */
export type AddressSuggestion = {
  /** The full text put in the address box, e.g. "Library North, 100 Decatur Street Southeast, Atlanta". */
  label: string
  /** The two lines shown in the list: the place or street, then the rest. */
  primary: string
  secondary: string
  lat: number
  lng: number
}

type PhotonReply = {
  features?: {
    geometry?: { coordinates?: [number, number] } // [longitude, latitude]
    properties?: {
      name?: string
      housenumber?: string
      street?: string
      city?: string
      district?: string
    }
  }[]
}

// AVision covers Atlanta, so suggestions stay inside the metro area (west, south,
// east, north) and places near the GSU campus come first.
const SEARCH_AREA = "-84.65,33.55,-84.15,34.0"
const SEARCH_CENTER = { lat: "33.7531", lon: "-84.3853" }
const MAX_SUGGESTIONS = 5

/**
 * Addresses and places that match what the person has typed so far. Returns an
 * empty list when nothing matches or the lookup fails. Pass a signal to cancel
 * a lookup that is no longer needed (the person kept typing).
 */
export async function suggestAddresses(
  text: string,
  signal?: AbortSignal,
): Promise<AddressSuggestion[]> {
  const query = new URLSearchParams({
    q: text,
    limit: "10", // more than we show, because several results often read the same
    lang: "en",
    bbox: SEARCH_AREA,
    ...SEARCH_CENTER,
  })
  try {
    const res = await fetch(`https://photon.komoot.io/api/?${query}`, { signal })
    if (!res.ok) return []
    const { features = [] } = (await res.json()) as PhotonReply

    const suggestions: AddressSuggestion[] = []
    for (const { geometry, properties: place = {} } of features) {
      const [lng, lat] = geometry?.coordinates ?? []
      if (typeof lat !== "number" || typeof lng !== "number") continue
      const street = [place.housenumber, place.street].filter(Boolean).join(" ")
      const primary = place.name || street
      if (!primary) continue
      const area = place.city ?? place.district ?? ""
      const secondary = [place.name ? street : "", area].filter(Boolean).join(", ")
      const label = [primary, secondary].filter(Boolean).join(", ").slice(0, 200)
      if (suggestions.some((seen) => seen.label === label)) continue
      suggestions.push({ label, primary, secondary, lat, lng })
      if (suggestions.length === MAX_SUGGESTIONS) break
    }
    return suggestions
  } catch {
    return [] // cancelled, offline, or blocked
  }
}

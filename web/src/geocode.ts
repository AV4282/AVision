// Address lookups for the report form, both built on OpenStreetMap data and
// both free with no key:
//
//   nearestAddress()    position -> street address, for pins and "Use my location".
//                       Service: Nominatim. Light use only (about one request a
//                       second) and no search-as-you-type, so call it once per
//                       confirmed move. https://operations.osmfoundation.org/policies/nominatim/
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

// Shared by this page's callers only. A server-wide limiter is still needed:
// Nominatim's one-request-per-second limit covers ALL users and backend workers.
let reverseQueue: Promise<unknown> = Promise.resolve()
let nextReverseAt = 0
const reverseCache = new Map<string, string>()

/** Returns the nearest address, or null on failure. Canceled lookups can be skipped. */
export function nearestAddress(lat: number, lng: number, signal?: AbortSignal): Promise<string | null> {
  const key = `${lat.toFixed(6)},${lng.toFixed(6)}`
  const result = reverseQueue.then(async () => {
    if (signal?.aborted) return null
    if (reverseCache.has(key)) return reverseCache.get(key)!
    const wait = nextReverseAt - Date.now()
    if (wait > 0) await new Promise((resolve) => window.setTimeout(resolve, wait))
    if (signal?.aborted) return null
    nextReverseAt = Date.now() + 1100
    const label = await fetchNearestAddress(lat, lng, signal)
    if (label) {
      if (reverseCache.size >= 64) reverseCache.delete(reverseCache.keys().next().value!)
      reverseCache.set(key, label)
    }
    return label
  })
  reverseQueue = result.catch(() => null)
  return result
}

async function fetchNearestAddress(lat: number, lng: number, signal?: AbortSignal): Promise<string | null> {
  const query = new URLSearchParams({
    format: "jsonv2",
    lat: String(lat),
    lon: String(lng),
    zoom: "18", // building level
    addressdetails: "1",
    "accept-language": "en",
  })
  try {
    // Deployments can switch to a compatible proxy/provider in the served HTML,
    // without rebuilding the app: <meta name="avision-reverse-geocode-url" content="/geocode/reverse">.
    const endpoint = document.querySelector<HTMLMetaElement>('meta[name="avision-reverse-geocode-url"]')?.content
    const url = new URL(endpoint || "https://nominatim.openstreetmap.org/reverse", window.location.origin)
    url.search = query.toString()
    const res = await fetch(url, {
      signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(6000)]) : AbortSignal.timeout(6000),
      referrerPolicy: "origin",
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

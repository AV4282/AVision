// Turns a map position into the nearest street address, for showing people
// where "Use my location" put them.
//
// Uses OpenStreetMap's free lookup service (Nominatim). It needs no key, but it
// asks for light use only (about one request a second), so call it once per
// button press, never in a loop. https://operations.osmfoundation.org/policies/nominatim/

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

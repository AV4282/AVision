import type { Ticket } from "./api"
import type {
  AvisionMapMarker,
  AvisionMapOwner,
  AvisionMapStatus,
} from "./components/avision-map/types"

const owners: Record<Ticket["owner"], AvisionMapOwner> = {
  "City of Atlanta": "city",
  "GSU Facilities": "gsu",
  MARTA: "marta",
  GDOT: "gdot",
}
const statuses: Record<Ticket["status"], AvisionMapStatus> = {
  Open: "open",
  "Likely fixed": "likely_fixed",
  Fixed: "fixed",
}

/** Display the API's location, owner and status without deriving routing decisions. */
export function ticketMarker(ticket: Ticket): AvisionMapMarker {
  return {
    id: ticket.id,
    label: ticket.title,
    latitude: ticket.lat,
    longitude: ticket.lng,
    owner: owners[ticket.owner] ?? "unknown",
    status: statuses[ticket.status],
  }
}

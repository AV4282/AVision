import type { Ticket } from "./api"
import type {
  AvisionMapMarker,
  AvisionMapOwner,
  AvisionMapStatus,
} from "./components/avision-map/types"

const owners: Record<Ticket["owner"], AvisionMapOwner> = {
  "City of Atlanta": "city",
  "GSU Facilities": "gsu",
  "Georgia Tech": "gt",
  MARTA: "marta",
  GDOT: "gdot",
}
const statuses: Record<Ticket["status"], AvisionMapStatus> = {
  Open: "open",
  "Likely fixed": "likely_fixed",
  Fixed: "fixed",
}

/** The map's name for a ticket's owner. */
export function mapOwner(owner: Ticket["owner"]): AvisionMapOwner {
  return owners[owner] ?? "unknown"
}

/** The map's name for a ticket's status. */
export function mapStatus(status: Ticket["status"]): AvisionMapStatus {
  return statuses[status]
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

import { useEffect, useId, useRef } from "react"
import { createPortal } from "react-dom"
import { Building2, ExternalLink, GraduationCap, Mail, MapPin, Phone, Route, TrainFront, X } from "lucide-react"
import directory from "../../api/data/contacts.json"

const resources = [
  { contact: directory.owners.city_of_atlanta, Icon: MapPin },
  { contact: directory.owners.gsu_facilities, Icon: Building2 },
  { contact: directory.owners.georgia_tech, Icon: GraduationCap },
  { contact: directory.owners.marta, Icon: TrainFront },
  { contact: directory.owners.gdot, Icon: Route },
]

function isVisible(element: HTMLElement | null): element is HTMLElement {
  if (!element?.isConnected || element.closest("[inert]")) return false
  const rect = element.getBoundingClientRect()
  const style = getComputedStyle(element)
  return style.visibility !== "hidden" && style.display !== "none" &&
    rect.width > 0 && rect.height > 0 && rect.right > 0 && rect.bottom > 0 &&
    rect.left < window.innerWidth && rect.top < window.innerHeight
}

export default function ResourcesDialog({
  onClose,
  opener,
  fallbackOpener,
}: {
  onClose: () => void
  opener: HTMLElement
  fallbackOpener: HTMLElement | null
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const body = document.body
    const html = document.documentElement
    const { scrollX, scrollY } = window
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      width: body.style.width,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    }
    const htmlOverflow = html.style.overflow
    const scrollbarWidth = window.innerWidth - html.clientWidth
    const paddingRight = getComputedStyle(body).paddingRight

    // The top layer contains keyboard focus and makes the map and page inert.
    dialog.showModal()
    closeRef.current?.focus({ preventScroll: true })
    Object.assign(body.style, {
      position: "fixed",
      top: `-${scrollY}px`,
      left: `-${scrollX}px`,
      width: "100%",
      overflow: "hidden",
      paddingRight: `calc(${paddingRight} + ${scrollbarWidth}px)`,
    })
    html.style.overflow = "hidden"

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        const controls = Array.from(dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"])',
        )).filter((element) => element.getClientRects().length > 0)
        const first = controls[0]
        const last = controls[controls.length - 1]
        const active = document.activeElement
        if (!dialog.contains(active) || (event.shiftKey ? active === first : active === last)) {
          event.preventDefault()
          const next = event.shiftKey ? last : first
          next?.focus()
        }
        return
      }
      if (event.key !== "Escape") return
      event.preventDefault()
      event.stopImmediatePropagation()
      onClose()
    }
    window.addEventListener("keydown", onKey, true)
    return () => {
      window.removeEventListener("keydown", onKey, true)
      dialog.close()
      Object.assign(body.style, previous)
      html.style.overflow = htmlOverflow
      window.scrollTo({ left: scrollX, top: scrollY, behavior: "instant" })
      // A menu item is offscreen after the mobile menu closes. Restore its
      // visible menu trigger instead, including when the viewport has changed.
      const candidates = [fallbackOpener, opener, ...document.querySelectorAll<HTMLElement>(
        "[data-resources-opener], [data-menu-opener]",
      )]
      candidates.find(isVisible)?.focus({ preventScroll: true })
    }
  }, [onClose, opener, fallbackOpener])

  return createPortal(
    <dialog
      ref={dialogRef}
      className="resources-dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onClose()
      }}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <header className="resources-header">
        <div>
          <p className="eyebrow">LOCAL CONTACTS</p>
          <h2 id={titleId}>Help & resources</h2>
          <p id={descriptionId}>Find the right agency for an accessibility barrier.</p>
        </div>
        <button ref={closeRef} type="button" className="dialog-close" onClick={onClose} aria-label="Close help & resources">
          <X size={20} aria-hidden="true" />
        </button>
      </header>
      <div className="resources-body">
        <p className="resources-emergency">
          <Phone size={18} aria-hidden="true" />
          <span>For emergencies, call <a href="tel:911">911</a>.</span>
        </p>
        <p className="resources-guidance">
          You contact agencies yourself. Choose a phone, email, or website link
          below to get in touch. Opening this popup does not send a report.
        </p>
        <div className="resources-grid">
          {resources.map(({ contact, Icon }) => (
            <section className="resource-card" key={contact.short_name} aria-label={contact.name}>
              <div className="resource-heading">
                <span className="resource-icon"><Icon size={22} aria-hidden="true" /></span>
                <div>
                  <h3>{contact === directory.owners.city_of_atlanta ? "ATL311" : contact.short_name}</h3>
                  <p>{contact.name}</p>
                </div>
              </div>
              {/* The first sentence describes coverage; later sentences concern AI routing. */}
              <p className="resource-description">{contact.handles.split(". ")[0].replace(/\.$/, "")}.</p>
              <div className="resource-links">
                <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}>
                  <Phone size={17} aria-hidden="true" />
                  <span><span className="resource-link-label">Call</span>{contact.phone}</span>
                </a>
                <p className="resource-phone-note">{contact.phone_note}</p>
                {contact.email && (
                  <a href={`mailto:${contact.email}`}>
                    <Mail size={17} aria-hidden="true" />
                    <span><span className="resource-link-label">Email</span>{contact.email}</span>
                  </a>
                )}
                <a href={contact.web.split("#")[0]} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={17} aria-hidden="true" />
                  <span><span className="resource-link-label">Official website · opens in a new tab</span>{new URL(contact.web).hostname}</span>
                </a>
              </div>
            </section>
          ))}
        </div>
      </div>
    </dialog>,
    document.body,
  )
}

import { useEffect, useRef } from "react"

function isVisible(element: HTMLElement | null): element is HTMLElement {
  if (!element?.isConnected || element.closest("[inert]")) return false
  const rect = element.getBoundingClientRect()
  const style = getComputedStyle(element)
  return style.visibility !== "hidden" && style.display !== "none" &&
    rect.width > 0 && rect.height > 0 && rect.right > 0 && rect.bottom > 0 &&
    rect.left < window.innerWidth && rect.top < window.innerHeight
}

export default function useModalDialog({
  onClose,
  opener,
}: {
  onClose: () => void
  opener: HTMLElement
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

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
          'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
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
      if (isVisible(opener)) opener.focus({ preventScroll: true })
    }
  }, [onClose, opener])

  return { dialogRef, closeRef }
}

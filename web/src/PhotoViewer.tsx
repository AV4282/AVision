import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

/**
 * Shows one photo as large as the screen allows, on top of everything else.
 * Close it with the X, the Escape key, or a click anywhere outside the photo.
 */
export default function PhotoViewer({
  src,
  alt,
  onClose,
}: {
  src: string
  alt: string
  onClose: () => void
}) {
  const closeButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // Listen first (capture) and stop the key there, so Escape closes only the
    // photo and not the ticket or form underneath it.
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      event.stopImmediatePropagation()
      onClose()
    }
    window.addEventListener("keydown", onKey, true)
    return () => window.removeEventListener("keydown", onKey, true)
  }, [onClose])

  // Keyboard users land on the close button, and go back to where they were after.
  useEffect(() => {
    const opener = document.activeElement
    closeButton.current?.focus()
    return () => {
      if (opener instanceof HTMLElement) opener.focus()
    }
  }, [])

  // Rendered at the end of the page, so nothing it was opened from can clip it.
  return createPortal(
    <div
      className="photo-viewer"
      role="dialog"
      aria-modal="true"
      aria-label="Photo"
      // Stops here, so the ticket or form behind doesn't treat it as its own click.
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation()
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <img src={src} alt={alt} />
      <button
        ref={closeButton}
        type="button"
        className="photo-viewer-close"
        onClick={onClose}
        aria-label="Close photo"
      >
        <X size={20} />
      </button>
    </div>,
    document.body,
  )
}

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

/**
 * Shows one photo as large as the screen allows, on top of everything else.
 * Close it with the X, the Escape key, or a click anywhere outside the photo.
 */
export default function PhotoViewer({
  src,
  alt,
  onClose,
  onStep,
  position,
}: {
  src: string
  alt: string
  onClose: () => void
  /** Move to the previous (-1) or next (1) photo. Leave out for a single photo. */
  onStep?: (by: -1 | 1) => void
  /** Where this photo is among the others, e.g. "2 / 5". */
  position?: string
}) {
  const closeButton = useRef<HTMLButtonElement>(null)
  // Where a touch began, to tell a sideways swipe from a tap.
  const touchStart = useRef<number | null>(null)

  useEffect(() => {
    // Listen first (capture) and stop the key there, so the keys work on the
    // photo only and not on the ticket or form underneath it.
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopImmediatePropagation()
        onClose()
      } else if (onStep && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
        event.stopImmediatePropagation()
        event.preventDefault()
        onStep(event.key === "ArrowLeft" ? -1 : 1)
      }
    }
    window.addEventListener("keydown", onKey, true)
    return () => window.removeEventListener("keydown", onKey, true)
  }, [onClose, onStep])

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
      onTouchStart={(event) => {
        touchStart.current = event.touches[0].clientX
      }}
      onTouchEnd={(event) => {
        const moved = touchStart.current === null ? 0 : event.changedTouches[0].clientX - touchStart.current
        touchStart.current = null
        if (onStep && Math.abs(moved) > 45) onStep(moved > 0 ? -1 : 1)
      }}
    >
      <img src={src} alt={alt} />
      {onStep && (
        <>
          <button type="button" className="photo-step previous" onClick={() => onStep(-1)} aria-label="Previous photo">
            <ChevronLeft size={24} />
          </button>
          <button type="button" className="photo-step next" onClick={() => onStep(1)} aria-label="Next photo">
            <ChevronRight size={24} />
          </button>
          {position && (
            <span className="photo-position" aria-live="polite">
              {position}
            </span>
          )}
        </>
      )}
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

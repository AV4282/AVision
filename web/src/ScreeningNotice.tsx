import { useEffect, useRef } from "react"
import { Ban, TriangleAlert } from "lucide-react"
import type { ScreeningProblem } from "./api"

// "Oct 12 at 3:40 PM", in the viewer's own time zone.
function when(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.valueOf())) return "tomorrow"
  const day = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  return `${day} at ${time}`
}

const WHAT = {
  photo: "The photo was flagged.",
  text: "The wording was flagged.",
  both: "The photo and the wording were flagged.",
}

/**
 * Shown after screening turns a report away (see `screen` in api/main.py).
 * The form has already closed and nothing was posted. It says why, where the
 * person stands, and, once posting is paused, when it works again.
 */
export default function ScreeningNotice({ problem, onClose }: {
  problem: ScreeningProblem
  onClose: () => void
}) {
  const button = useRef<HTMLButtonElement>(null)
  const paused = problem.suspendedUntil !== null

  useEffect(() => {
    button.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      event.stopImmediatePropagation()
      onClose()
    }
    window.addEventListener("keydown", onKey, true)
    return () => window.removeEventListener("keydown", onKey, true)
  }, [onClose])

  const flagged = problem.code === "flagged"
  const count =
    flagged && !paused && problem.strikes && problem.limit
      ? `Flagged attempt ${problem.strikes} of ${problem.limit}. At ${problem.limit}, posting is paused for a day.`
      : null

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className="report-dialog screening-notice"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="screening-title"
        aria-describedby="screening-text"
      >
        <span className={`screening-icon${paused ? " paused" : ""}`} aria-hidden="true">
          {paused ? <Ban size={26} /> : <TriangleAlert size={26} />}
        </span>
        <p className="eyebrow">{paused ? "POSTING PAUSED" : "NOT POSTED"}</p>
        <h2 id="screening-title">{paused ? "Posting is paused" : "This report wasn’t posted"}</h2>
        <div id="screening-text">
          {flagged && (
            <p className="screening-reason">
              {problem.what && <strong>{WHAT[problem.what]} </strong>}
              {problem.message}
            </p>
          )}
          {paused ? (
            <p>
              {flagged ? "That was one flagged report too many. " : "Several of your reports were flagged as not real. "}
              You can post again on <strong>{when(problem.suspendedUntil!)}</strong>. Browsing and voting still work.
            </p>
          ) : (
            <p>
              Reports here go to real city, campus and transit departments. Please take this seriously and only post
              real issues you have seen yourself.
            </p>
          )}
          {count && <p className="screening-count">{count}</p>}
        </div>
        <button ref={button} type="button" className="primary-button" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from "react"

/**
 * One Google AdSense ad unit. Ads are on only when the build has the
 * publisher id (VITE_ADSENSE_CLIENT in web/.env, "ca-pub-..."), and a slot
 * shows only when its own id is set, so a missing id leaves no gap. The
 * AdSense script itself is loaded once from index.html, where Google looks
 * for it; the build points that tag at the same id and leaves it out
 * altogether when ads are off (vite.config.ts).
 *
 * Where ads go, and where they don't. Google serves no ads on a screen
 * without publisher content, or on one used for navigation or other
 * behavioural purposes, so the site's one ad unit sits under the list of
 * reported issues, and only when the list has issues in it. Not in the
 * navigation menu, not on the map, the welcome screen, the report form, a
 * ticket's photo or the profile, and never styled to look like the app.
 * https://support.google.com/publisherpolicies/answer/11112688
 */
// AVision's own AdSense ids. These are public (they are in every page that
// shows an ad), so they live here; the VITE_ADSENSE_* settings override them,
// e.g. VITE_ADSENSE_CLIENT="" to build without ads.
const setting = (value: string | undefined, fallback: string) => (value === undefined ? fallback : value.trim())

export const ADSENSE_CLIENT = setting(import.meta.env.VITE_ADSENSE_CLIENT, "ca-pub-9613332564332030")

/** Where the ad sits. The slot id comes from AdSense, one per ad unit. */
export const AD_SLOTS = {
  /** "Under Issues": under the issues list, when it has issues. */
  issues: setting(import.meta.env.VITE_ADSENSE_SLOT_ISSUES, "8712979906"),
}

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

export default function AdSlot({ slot, format = "auto", className = "" }: {
  slot: string
  /** AdSense ad format: "auto" fits the space; "horizontal" or "rectangle" fix the shape. */
  format?: "auto" | "horizontal" | "rectangle" | "vertical"
  className?: string
}) {
  const ins = useRef<HTMLModElement>(null)
  // What AdSense has done with this unit. While it is "pending" the unit keeps
  // its full width, because AdSense measures the space it is given: asked for
  // inside a box collapsed to a pixel, it finds no room and fills nothing. The
  // frame and the "Advertisement" label appear with the ad, and a unit AdSense
  // passes on is taken off the page, so nothing is labelled over nothing.
  const [state, setState] = useState<"pending" | "filled" | "unfilled">(
    "pending",
  )

  // Ask AdSense to fill this unit once it is on the page. A unit that was
  // already filled (React drawing it twice in dev) is left alone.
  useEffect(() => {
    const unit = ins.current
    if (!ADSENSE_CLIENT || !slot || !unit) return
    const read = () => {
      const answer = unit.getAttribute("data-ad-status")
      if (answer === "filled" || answer === "unfilled") setState(answer)
    }
    const watcher = new MutationObserver(read)
    watcher.observe(unit, { attributes: true, attributeFilter: ["data-ad-status"] })
    read() // it may have answered before this ran
    if (!unit.getAttribute("data-adsbygoogle-status")) {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch {
        // The script is blocked or hasn't loaded: no answer is coming.
      }
    }
    // An ad blocker, or no script at all, leaves no answer to wait for. Give
    // the space back rather than hold it open for an ad that isn't coming.
    const giveUp = window.setTimeout(
      () => setState((now) => (now === "pending" ? "unfilled" : now)),
      3000,
    )
    return () => {
      watcher.disconnect()
      window.clearTimeout(giveUp)
    }
  }, [slot])

  if (!ADSENSE_CLIENT || !slot) return null
  return (
    <div className={`ad-slot ${className}`.trim()} data-ad-state={state}>
      <span className="ad-label">Advertisement</span>
      <ins
        ref={ins}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}

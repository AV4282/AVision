import { useEffect, useRef } from "react"

/**
 * One Google AdSense ad unit. Ads are on only when the build has the
 * publisher id (VITE_ADSENSE_CLIENT in web/.env, "ca-pub-..."), and a slot
 * shows only when its own id is set, so a missing id leaves no gap. The
 * AdSense script itself is loaded once in index.html, also from that id.
 *
 * Where ads go, and where they don't (AdSense policy): beside or under the
 * content, never over the map, in the report form, or on a ticket's photo,
 * and never styled so they look like part of the app.
 */
export const ADSENSE_CLIENT = (import.meta.env.VITE_ADSENSE_CLIENT ?? "").trim()

/** Where each ad sits. The slot ids come from AdSense, one per ad unit. */
export const AD_SLOTS = {
  /** Bottom of the left menu, above Help & resources (desktop only). */
  sidebar: (import.meta.env.VITE_ADSENSE_SLOT_SIDEBAR ?? "").trim(),
  /** Under the issues list. */
  issues: (import.meta.env.VITE_ADSENSE_SLOT_ISSUES ?? "").trim(),
  /** Under the profile page. */
  profile: (import.meta.env.VITE_ADSENSE_SLOT_PROFILE ?? "").trim(),
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

  // Ask AdSense to fill this unit once it is on the page. A unit that was
  // already filled (React drawing it twice in dev) is left alone.
  useEffect(() => {
    if (!ADSENSE_CLIENT || !slot || !ins.current) return
    if (ins.current.getAttribute("data-adsbygoogle-status")) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // The script is blocked or hasn't loaded: the space stays empty.
    }
  }, [slot])

  if (!ADSENSE_CLIENT || !slot) return null
  return (
    <div className={`ad-slot ${className}`.trim()} aria-label="Advertisement">
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

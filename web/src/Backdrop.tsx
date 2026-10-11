import { useMemo, type CSSProperties } from "react"

/**
 * Decoration behind the page: stars that twinkle in dark mode and leaves that
 * sway and drift down in light mode. It sits under everything, so cards and
 * the map cover it and it only shows on the bare page around them. Each piece
 * is its own small element, moved and faded by the browser's own animation
 * (see "Page backdrop" in index.css), which costs far less than redrawing a
 * picture of the whole sky. With "reduce motion" on, nothing moves.
 */

// The same "random" numbers every time, so the sky doesn't jump when the page redraws.
function numbers(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const STAR_TINTS = ["#ffffff", "#ffffff", "#ddd6fe", "#97caeb"]
const LEAF_TINTS = ["#1f8a66", "#3fa67c", "#7fb957", "#e0992a", "#ee7f45"]

type Piece = { key: number; className: string; style: CSSProperties }

function makeStars(): Piece[] {
  const next = numbers(7)
  return Array.from({ length: 170 }, (_, key) => {
    // About one in ten is a larger four-point sparkle; the rest are dots.
    const sparkle = key % 10 === 0
    const size = sparkle ? 10 + next() * 7 : 1.5 + next() * 1.9
    const time = 2.2 + next() * 3.6
    return {
      key,
      className: sparkle ? "backdrop-star sparkle" : "backdrop-star",
      style: {
        left: `${(next() * 100).toFixed(2)}%`,
        top: `${(next() * 100).toFixed(2)}%`,
        width: `${size.toFixed(1)}px`,
        height: `${size.toFixed(1)}px`,
        color: STAR_TINTS[Math.floor(next() * STAR_TINTS.length)],
        "--low": (0.3 + next() * 0.25).toFixed(2),
        "--peak": (0.85 + next() * 0.15).toFixed(2),
        animationDuration: `${time.toFixed(2)}s`,
        animationDelay: `${(-next() * time).toFixed(2)}s`,
      } as CSSProperties,
    }
  })
}

function makeLeaves(): Piece[] {
  const next = numbers(23)
  return Array.from({ length: 34 }, (_, key) => {
    // The first fourteen drift down the page; the others stay put and sway.
    const falling = key < 14
    const time = 22 + next() * 16
    const sway = 2.6 + next() * 2.4
    return {
      key,
      className: falling ? "backdrop-leaf falling" : "backdrop-leaf",
      style: {
        left: `${(next() * 100).toFixed(2)}%`,
        top: falling ? undefined : `${(next() * 100).toFixed(2)}%`,
        width: `${(17 + next() * 14).toFixed(0)}px`,
        color: LEAF_TINTS[Math.floor(next() * LEAF_TINTS.length)],
        opacity: (0.55 + next() * 0.3).toFixed(2),
        "--turn": `${Math.round(next() * 360)}deg`,
        "--swing": falling ? "24deg" : "9deg",
        "--drift": `${Math.round(-90 + next() * 180)}px`,
        "--sway": `${sway.toFixed(2)}s`,
        animationDuration: `${time.toFixed(2)}s`,
        animationDelay: `${(-next() * time).toFixed(2)}s`,
      } as CSSProperties,
    }
  })
}

const Leaf = () => (
  <svg viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M20.5 3.5C12 3 5.5 6.5 4 13c-.6 2.6 0 5 1.2 6.6 1.6 1.2 4.1 1.7 6.8.9 6.5-1.9 9-8.5 8.5-17Z"
    />
    <path d="M4.6 20.4C8 15 12 10.5 17 7" fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
)

export default function Backdrop() {
  const stars = useMemo(makeStars, [])
  const leaves = useMemo(makeLeaves, [])
  // Both sets are here; index.css shows the one that goes with the theme, so
  // switching themes needs nothing from this component.
  return (
    <div className="app-backdrop" aria-hidden="true">
      {stars.map((star) => (
        <span key={star.key} className={star.className} style={star.style} />
      ))}
      {leaves.map((leaf) => (
        <span key={leaf.key} className={leaf.className} style={leaf.style}>
          <Leaf />
        </span>
      ))}
    </div>
  )
}

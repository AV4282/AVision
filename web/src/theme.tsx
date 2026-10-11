import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { flushSync } from "react-dom"
import { Moon, Sun } from "lucide-react"

type Theme = "light" | "dark"
const STORAGE_KEY = "avision.theme"
const ThemeContext = createContext<{
  theme: Theme
  /** `from` is the button that was pressed; the new colors spread out from it. */
  toggleTheme: (from?: Element) => void
} | null>(null)

// How long the fallback color fade runs (see switchSmoothly). Matches index.css.
const FADE_MS = 400

/**
 * Runs `apply` (which switches the theme) with a smooth change-over instead of
 * a hard cut. Where the browser can, the new colors spread out in a circle
 * from the button that was pressed. Elsewhere the colors fade. With "reduce
 * motion" on, it just switches.
 */
function switchSmoothly(apply: () => void, from?: Element) {
  const root = document.documentElement
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    apply()
    return
  }

  if (typeof document.startViewTransition === "function") {
    // The circle starts at the middle of the button and grows to the farthest corner.
    const box = from?.getBoundingClientRect()
    const x = box ? box.left + box.width / 2 : window.innerWidth / 2
    const y = box ? box.top + box.height / 2 : 0
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    root.style.setProperty("--theme-x", `${x}px`)
    root.style.setProperty("--theme-y", `${y}px`)
    root.style.setProperty("--theme-r", `${radius}px`)
    root.classList.add("theme-switching")
    const done = () => root.classList.remove("theme-switching")
    try {
      document.startViewTransition(apply).finished.then(done, done)
    } catch {
      done()
      apply()
    }
    return
  }

  // No view transitions in this browser: let every color ease to its new value.
  root.classList.add("theme-fading")
  apply()
  window.setTimeout(() => root.classList.remove("theme-fading"), FADE_MS + 50)
}

function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === "light" || value === "dark" ? value : null
  } catch {
    return null
  }
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<Theme | null>(storedTheme)
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
  )
  const theme = preference ?? (systemDark ? "dark" : "light")

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => setSystemDark(media.matches)
    media.addEventListener("change", onChange)
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) {
        setPreference(storedTheme())
      }
    }
    window.addEventListener("storage", onStorage)
    return () => {
      media.removeEventListener("change", onChange)
      window.removeEventListener("storage", onStorage)
    }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  function toggleTheme(from?: Element) {
    const next = theme === "dark" ? "light" : "dark"
    switchSmoothly(() => {
      // Set it on the page directly, and have React catch up before the browser
      // takes its "after" picture, so the button's icon changes in the same step.
      document.documentElement.dataset.theme = next
      flushSync(() => setPreference(next))
    }, from)
    // Storage may be unavailable in a restricted browser.
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Keep the choice for this session when persistence is blocked.
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function ThemeToggle() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("ThemeToggle must be inside ThemeProvider")
  const { theme, toggleTheme } = context
  const dark = theme === "dark"
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={(event) => toggleTheme(event.currentTarget)}
      aria-label="Dark mode"
      aria-pressed={dark}
      title={`Switch to ${dark ? "light" : "dark"} mode`}
    >
      {/* Icon only: a moon while dark mode is on, a sun while it's off. The label above is for screen readers. */}
      {dark ? <Moon size={18} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}
    </button>
  )
}

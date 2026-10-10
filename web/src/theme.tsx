import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { Moon, Sun } from "lucide-react"

type Theme = "light" | "dark"
const STORAGE_KEY = "avision.theme"
const ThemeContext = createContext<{
  theme: Theme
  toggleTheme: () => void
} | null>(null)

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

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark"
    // Apply immediately; storage may be unavailable in a restricted browser.
    document.documentElement.dataset.theme = next
    setPreference(next)
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
      onClick={toggleTheme}
      aria-label="Dark mode"
      aria-pressed={dark}
      title={`Switch to ${dark ? "light" : "dark"} mode`}
    >
      {dark ? <Moon size={17} aria-hidden="true" /> : <Sun size={17} aria-hidden="true" />}
      <span>{dark ? "Dark" : "Light"}</span>
    </button>
  )
}

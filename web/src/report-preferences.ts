import { useCallback, useSyncExternalStore } from "react"

const CHANGE_EVENT = "avision.report-preferences-change"
const sessionPreferences = new Map<string, boolean>()

function preferenceKey(accountId: string | null) {
  return `avision.report-name.v1:${accountId ? `account:${encodeURIComponent(accountId)}` : "guest"}`
}

function readPreference(key: string): boolean {
  if (sessionPreferences.has(key)) return sessionPreferences.get(key)!
  try {
    return localStorage.getItem(key) === "true"
  } catch {
    return false
  }
}

export function useReportNamePreference(accountId: string | null) {
  const key = preferenceKey(accountId)
  const subscribe = useCallback((notify: () => void) => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === key || event.key === null) {
        sessionPreferences.delete(key)
        notify()
      }
    }
    window.addEventListener("storage", onStorage)
    window.addEventListener(CHANGE_EVENT, notify)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener(CHANGE_EVENT, notify)
    }
  }, [key])
  const getSnapshot = useCallback(() => readPreference(key), [key])
  const includeName = useSyncExternalStore(subscribe, getSnapshot)
  const getSessionOnly = useCallback(() => sessionPreferences.has(key), [key])
  const sessionOnly = useSyncExternalStore(subscribe, getSessionOnly)

  // Only the boolean is saved. Each account and the browser's guest have separate keys.
  const setIncludeName = useCallback((value: boolean) => {
    try {
      localStorage.setItem(key, String(value))
      sessionPreferences.delete(key)
    } catch {
      sessionPreferences.set(key, value)
    }
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }, [key])

  return { includeName, setIncludeName, sessionOnly }
}

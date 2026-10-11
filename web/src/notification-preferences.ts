import { useCallback, useSyncExternalStore } from "react"

const CHANGE_EVENT = "avision.notification-preferences-change"
const sessionPreferences = new Map<string, boolean>()

function usePreference(accountId: string | null, setting: "in-app" | "my-reports") {
  const key = `avision.notifications.v1:${accountId ? `account:${encodeURIComponent(accountId)}` : "guest"}:${setting}`
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
  const getSnapshot = useCallback(() => {
    if (sessionPreferences.has(key)) return sessionPreferences.get(key)!
    try {
      return localStorage.getItem(key) !== "false"
    } catch {
      return true
    }
  }, [key])
  const enabled = useSyncExternalStore(subscribe, getSnapshot)
  const getSessionOnly = useCallback(() => sessionPreferences.has(key), [key])
  const sessionOnly = useSyncExternalStore(subscribe, getSessionOnly)
  const setEnabled = useCallback((value: boolean) => {
    if (!accountId) return
    try {
      localStorage.setItem(key, String(value))
      sessionPreferences.delete(key)
    } catch {
      sessionPreferences.set(key, value)
    }
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }, [accountId, key])
  return { enabled, setEnabled, sessionOnly }
}

export function useNotificationPreferences(accountId: string | null) {
  const inApp = usePreference(accountId, "in-app")
  const myReports = usePreference(accountId, "my-reports")
  return {
    inApp: inApp.enabled,
    setInApp: inApp.setEnabled,
    myReports: myReports.enabled,
    setMyReports: myReports.setEnabled,
    sessionOnly: inApp.sessionOnly || myReports.sessionOnly,
  }
}

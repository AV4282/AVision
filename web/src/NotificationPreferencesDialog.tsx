import { useId } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { useNotificationPreferences } from "./notification-preferences"
import useModalDialog from "./useModalDialog"

export default function NotificationPreferencesDialog({ accountId, onClose, opener }: {
  accountId: string
  onClose: () => void
  opener: HTMLElement
}) {
  const { inApp, setInApp, myReports, setMyReports, sessionOnly } = useNotificationPreferences(accountId)
  const { dialogRef, closeRef } = useModalDialog({ onClose, opener })
  const id = useId()

  return createPortal(
    <dialog
      ref={dialogRef}
      className="privacy-dialog"
      aria-modal="true"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
      onCancel={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onClose()
      }}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation()
        if (event.target !== event.currentTarget) return
        const bounds = event.currentTarget.getBoundingClientRect()
        if (event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom) onClose()
      }}
    >
      <header className="report-header privacy-header">
        <div>
          <p className="eyebrow">ACCOUNT</p>
          <h2 id={`${id}-title`}>Notification preferences</h2>
          <p id={`${id}-description`}>Choose what appears in your notification bell.</p>
        </div>
        <button ref={closeRef} type="button" className="dialog-close" onClick={onClose} aria-label="Close notification preferences">
          <X size={20} aria-hidden="true" />
        </button>
      </header>
      <div className="privacy-body">
        <section aria-label="Email notifications">
          <div className="privacy-preference">
            <label htmlFor={`${id}-email`}>Email notifications</label>
            <input id={`${id}-email`} className="privacy-switch" type="checkbox" role="switch" checked={false} disabled aria-describedby={`${id}-email-help`} />
          </div>
          <p id={`${id}-email-help`}>Unavailable. AVision does not send notification emails.</p>
        </section>
        <section aria-label="In-app notifications">
          <div className="privacy-preference">
            <label htmlFor={`${id}-in-app`}>In-app notifications</label>
            <input id={`${id}-in-app`} className="privacy-switch" type="checkbox" role="switch" checked={inApp} aria-describedby={`${id}-in-app-help`} onChange={(event) => setInApp(event.target.checked)} />
          </div>
          <p id={`${id}-in-app-help`}>Show ticket activity and unread counts in the bell in this browser.</p>
        </section>
        <section aria-label="My report updates">
          <div className="privacy-preference">
            <label htmlFor={`${id}-reports`}>My report updates</label>
            <input id={`${id}-reports`} className="privacy-switch" type="checkbox" role="switch" checked={myReports} disabled={!inApp} aria-describedby={`${id}-reports-help`} onChange={(event) => setMyReports(event.target.checked)} />
          </div>
          <p id={`${id}-reports-help`}>
            {inApp
              ? "Show votes and status changes on tickets you posted. Updates to tickets you voted on still appear."
              : "Turn on in-app notifications to show updates. Your choice for tickets you posted is kept."}
          </p>
        </section>
        <p className="privacy-storage" role="status">
          {sessionOnly
            ? "Browser storage is unavailable. Kept for this account until you reload."
            : "Saved automatically for this account in this browser only."}
          {" "}These settings hide notices here; AVision still stores ticket activity, which can appear when you turn them back on.
        </p>
        <div className="privacy-actions">
          <button type="button" className="secondary-button" onClick={onClose}>Done</button>
        </div>
      </div>
    </dialog>,
    document.body,
  )
}

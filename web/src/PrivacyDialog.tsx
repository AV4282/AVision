import { useId } from "react"
import { createPortal } from "react-dom"
import { Camera, LogOut, ShieldCheck, X } from "lucide-react"
import { useAccount } from "./auth"
import { useReportNamePreference } from "./report-preferences"
import useModalDialog from "./useModalDialog"

export default function PrivacyDialog({ onClose, opener }: {
  onClose: () => void
  opener: HTMLElement
}) {
  const { account, signOut } = useAccount()
  const { includeName, setIncludeName, sessionOnly } = useReportNamePreference(account?.id ?? null)
  const { dialogRef, closeRef } = useModalDialog({ onClose, opener })
  const titleId = useId()
  const descriptionId = useId()
  const toggleId = useId()
  const helperId = useId()

  return createPortal(
    <dialog
      ref={dialogRef}
      className="privacy-dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onClose()
      }}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <header className="report-header privacy-header">
        <div>
          <p className="eyebrow">ACCOUNT</p>
          <h2 id={titleId}>Privacy & security</h2>
          <p id={descriptionId}>Your report preferences and photo privacy.</p>
        </div>
        <button ref={closeRef} type="button" className="dialog-close" onClick={onClose} aria-label="Close privacy & security">
          <X size={20} aria-hidden="true" />
        </button>
      </header>
      <div className="privacy-body">
        <section aria-label="Prepared reports">
          <div className="privacy-preference">
            <label htmlFor={toggleId}>Include my name in prepared reports</label>
            <input
              id={toggleId}
              className="privacy-switch"
              type="checkbox"
              role="switch"
              checked={!!account && includeName}
              disabled={!account}
              aria-describedby={helperId}
              onChange={(event) => setIncludeName(event.target.checked)}
            />
          </div>
          <p id={helperId}>
            Adds your profile name to newly prepared report text, including follow-ups.
            It does not change previous reports or public attribution. Names you type
            yourself are kept. You can review and edit each message before sending.
          </p>
          <p className="privacy-storage" role="status">
            {!account
              ? "Sign in to include your profile name. Guest reports have no profile name added."
              : sessionOnly
                ? "Browser storage is unavailable. This choice applies to this account for this visit only."
                : "Saved automatically for this account in this browser only. Other accounts have separate preferences."}
          </p>
        </section>
        <section aria-labelledby={`${titleId}-photos`}>
          <h3 id={`${titleId}-photos`}><Camera size={18} aria-hidden="true" /> Photo privacy</h3>
          <p>
            Ticket photos are re-saved without hidden metadata such as GPS details.
            When the server’s photo protection service is enabled, it blurs detected
            faces and license plates before storage; uploads are refused if that
            service fails. If it is not enabled, photos are stored without that blurring.
          </p>
          <p>
            Detection can miss details. Tickets and their photos are public, so review
            the stored photo before posting. This does not guarantee complete anonymization.
          </p>
        </section>
        <section aria-labelledby={`${titleId}-session`}>
          <h3 id={`${titleId}-session`}><ShieldCheck size={18} aria-hidden="true" /> Sign-in status</h3>
          <p>{account ? "You are signed in." : "You are browsing as a guest. There is no signed-in session to sign out of."}</p>
          {account && (
            <button type="button" className="secondary-button privacy-sign-out" onClick={signOut}>
              <LogOut size={17} aria-hidden="true" /> Sign out
            </button>
          )}
        </section>
        <div className="privacy-actions">
          <button type="button" className="secondary-button" onClick={onClose}>Done</button>
        </div>
      </div>
    </dialog>,
    document.body,
  )
}

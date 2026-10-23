import { useId } from "react"
import { createPortal } from "react-dom"
import { Camera, LogOut, Megaphone, ShieldCheck, X } from "lucide-react"
import { ADSENSE_CLIENT } from "./AdSlot"
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
            Adds your profile name to new report messages and follow-ups. Previous
            reports and public attribution stay unchanged. Names you type are kept.
            Review and edit before sending.
          </p>
          <p className="privacy-storage" role="status">
            {!account
              ? "Sign in to add your profile name to reports."
              : sessionOnly
                ? "Browser storage is unavailable. Kept for this account until you reload."
                : "Saved for this account in this browser only."}
          </p>
        </section>
        <section aria-labelledby={`${titleId}-photos`}>
          <h3 id={`${titleId}-photos`}><Camera size={18} aria-hidden="true" /> Photo privacy</h3>
          <p>
            Ticket photos are saved without hidden metadata such as GPS details.
            When enabled, photo protection blurs detected faces and license plates
            before storage and rejects uploads if it fails. Without it, photos aren’t blurred.
          </p>
          <p>
            Ticket photos are public. Detection can miss details, so review the
            stored photo before posting. Complete anonymization isn’t guaranteed.
          </p>
        </section>
        {ADSENSE_CLIENT && (
          <section aria-labelledby={`${titleId}-ads`}>
            <h3 id={`${titleId}-ads`}><Megaphone size={18} aria-hidden="true" /> Advertising</h3>
            <p>
              AVision shows Google AdSense ads beside its own content. Third
              party vendors, including Google, use cookies to serve ads based on
              your prior visits to this site or other sites. Google’s
              advertising cookies let it and its partners serve ads to you based
              on those visits.
            </p>
            <p>
              You can opt out of personalised advertising in{" "}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer">
                Google Ads Settings
              </a>
              , or opt out of other vendors’ advertising cookies at{" "}
              <a href="https://www.aboutads.info/choices/" target="_blank" rel="noreferrer">
                aboutads.info
              </a>
              . Ads never go over the map, into the report form or onto a
              ticket’s photo, and reporting an issue does not depend on them.
            </p>
          </section>
        )}
        <section aria-labelledby={`${titleId}-session`}>
          <h3 id={`${titleId}-session`}><ShieldCheck size={18} aria-hidden="true" /> Sign-in status</h3>
          <p>{account ? "You are signed in." : "You’re browsing as a guest. No account is signed in."}</p>
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

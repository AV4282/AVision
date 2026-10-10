import { useEffect, useState } from "react"
import { Check, Copy, ExternalLink, Mail, Phone, X } from "lucide-react"
import type { DraftedReport, OwnerContact } from "./api"

/** What the report agent prepared for the owner of a ticket that was just posted. */
export type ReportToSend = {
  contact: OwnerContact
  report: DraftedReport
}

/**
 * Shown right after a ticket is posted with the agent's help: the drafted
 * message and the owner's contact details. AVision never sends anything itself;
 * the person copies the message, opens an email, or calls.
 */
export default function ReportReady({
  contact,
  report,
  onClose,
}: ReportToSend & { onClose: () => void }) {
  const [subject, setSubject] = useState(report.subject)
  const [message, setMessage] = useState(report.message)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(`${subject}\n\n${message}`)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch {
      // Clipboard blocked: the text is right there to select by hand.
    }
  }

  const mailto = contact.email
    ? `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
    : null

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className="report-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-ready-title"
      >
        <div className="report-header">
          <div>
            <p className="eyebrow">TICKET POSTED</p>
            <h2 id="report-ready-title">Now tell {contact.name}</h2>
          </div>
          <button
            type="button"
            className="dialog-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <p className="ready-intro">
          Your ticket is on the map. AVision doesn’t send reports for you, so
          here is a message you can send yourself. Change anything you like.
        </p>

        <div className="form-grid">
          <label className="form-field full">
            <span>Subject</span>
            <input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              maxLength={200}
            />
          </label>
          <label className="form-field full">
            <span>Message</span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={9}
            />
          </label>
        </div>

        <div className="ready-actions">
          <button type="button" className="secondary-button" onClick={copyMessage}>
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? "Copied" : "Copy message"}
          </button>
          {mailto && (
            <a className="secondary-button" href={mailto}>
              <Mail size={15} /> Open in email
            </a>
          )}
          {contact.web && (
            <a
              className="secondary-button"
              href={contact.web}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink size={15} /> {contact.web_label ?? "Open their website"}
            </a>
          )}
        </div>

        {contact.phone && (
          <div className="ready-call">
            <p>
              <Phone size={14} aria-hidden="true" /> <strong>Or call</strong>{" "}
              <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}>{contact.phone}</a>
              {contact.phone_note && <span> {contact.phone_note}</span>}
              {contact.hours && <span> Open {contact.hours.replace(/\.$/, "")}.</span>}
            </p>
            <p className="ready-script">“{report.phone_script}”</p>
          </div>
        )}

        <div className="report-actions">
          <button type="button" className="primary-button" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

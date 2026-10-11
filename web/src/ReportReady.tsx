import { useEffect, useRef, useState } from "react"
import { Check, Copy, ExternalLink, Mail, Phone, Send, X } from "lucide-react"
import { reportSent, ticketLink, type DraftedReport, type OwnerContact } from "./api"
import { useAccount } from "./auth"
import { useReportNamePreference } from "./report-preferences"

/** What was prepared for the department a just-posted ticket should go to. */
export type ReportToSend = {
  contact: OwnerContact
  report: DraftedReport
  /** Why this department, in plain words. Null when the person picked it themselves. */
  reason: string | null
  /** "followUp" for a ticket that is still there; otherwise this is a ticket that was just posted. */
  kind?: "new" | "followUp"
  /** The ticket this message is about, so sending it can count toward the ticket's reports. */
  ticketId?: string
}

/**
 * Shown right after a ticket is posted: the drafted message, ready to edit,
 * and a button that opens it in the person's own email, addressed to the
 * department. AVision never sends anything itself.
 */
// The message has one link: the ticket's own page, where the photos are. It
// goes just above the closing "Sent with AVision" line the server writes.
function withTicketLink(message: string, ticketId: string): string {
  const line = `See the report and its photos: ${ticketLink(ticketId)}`
  const closing = message.lastIndexOf("\nSent with AVision")
  return closing === -1 ? `${message}\n${line}` : `${message.slice(0, closing)}\n${line}${message.slice(closing)}`
}

export default function ReportReady({
  contact,
  report,
  reason,
  kind = "new",
  ticketId,
  onClose,
}: ReportToSend & { onClose: () => void }) {
  const { account } = useAccount()
  const { includeName } = useReportNamePreference(account?.id ?? null)
  const [subject, setSubject] = useState(report.subject)
  // Snapshot at preparation: later preference changes must not rewrite an edited message.
  const [message, setMessage] = useState(() => {
    const name = account?.name.trim()
    const text = ticketId ? withTicketLink(report.message, ticketId) : report.message
    return includeName && name ? `${text}\n\n${name}` : text
  })
  const [copied, setCopied] = useState(false)

  // Pressing any of the send buttons (email, Gmail, the web form, the phone
  // number) counts this person as having reported the ticket. Once is enough;
  // the server ignores repeats anyway. The page hears the new count through
  // live updates, so nothing here waits for the answer.
  const counted = useRef(false)
  function noteSent() {
    if (!ticketId || counted.current) return
    counted.current = true
    reportSent(ticketId).catch(() => {
      counted.current = false // try again on the next press
    })
  }

  // Escape closes this box only. It can sit on top of an open ticket, which
  // also listens for Escape, so the key is caught first and goes no further.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      event.stopImmediatePropagation()
      onClose()
    }
    window.addEventListener("keydown", onKey, true)
    return () => window.removeEventListener("keydown", onKey, true)
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

  // Both links carry whatever is in the boxes right now, edits included.
  const mailto = contact.email
    ? `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
    : null
  // For people who read their mail in the browser and have no email app set up.
  const gmail = contact.email
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contact.email)}` +
      `&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
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
            <p className="eyebrow">{kind === "followUp" ? "FOLLOW-UP" : "TICKET POSTED"}</p>
            <h2 id="report-ready-title">
              {kind === "followUp" ? `Follow up with ${contact.name}` : `Now tell ${contact.name}`}
            </h2>
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
          {kind === "followUp"
            ? "Here is a follow-up written from this ticket. AVision doesn’t send it for you, so send it yourself. Change anything you like first."
            : "Your ticket is on the map. AVision doesn’t send reports for you, so here is a message to send yourself. Change anything you like first."}
        </p>

        <div className="ready-to">
          <Mail size={16} aria-hidden="true" />
          <div>
            <p>
              <strong>To: {contact.name}</strong>
              {contact.email && <span> {contact.email}</span>}
            </p>
            {reason && <p className="ready-reason">{reason}</p>}
          </div>
        </div>

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
          {mailto && (
            <a className="primary-button" href={mailto} onClick={noteSent}>
              <Send size={15} /> Email {contact.name}
            </a>
          )}
          {gmail && (
            <a className="secondary-button" href={gmail} target="_blank" rel="noreferrer" onClick={noteSent}>
              <Mail size={15} /> Open in Gmail
            </a>
          )}
          <button type="button" className="secondary-button" onClick={copyMessage}>
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? "Copied" : "Copy message"}
          </button>
          {contact.web && (
            <a
              className="secondary-button"
              href={contact.web}
              target="_blank"
              rel="noreferrer"
              onClick={noteSent}
            >
              <ExternalLink size={15} /> {contact.web_label ?? "Open their website"}
            </a>
          )}
        </div>

        {contact.phone && (
          <div className="ready-call">
            <p>
              <Phone size={14} aria-hidden="true" /> <strong>Or call</strong>{" "}
              <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} onClick={noteSent}>
                {contact.phone}
              </a>
              {contact.phone_note && <span> {contact.phone_note}</span>}
              {contact.hours && <span> Open {contact.hours.replace(/\.$/, "")}.</span>}
            </p>
            <p className="ready-script">“{report.phone_script}”</p>
          </div>
        )}

        <div className="report-actions">
          <button type="button" className="secondary-button" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

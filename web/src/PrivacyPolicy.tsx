import { useEffect } from "react"
import { ArrowLeft, ShieldCheck } from "lucide-react"
import Brand from "./Brand"
import SiteFooter from "./SiteFooter"
import { ThemeToggle } from "./theme"

const sections = [
  ["reports", "Public reports & photos"],
  ["location", "Location"],
  ["accounts", "Accounts & activity"],
  ["age", "Age eligibility"],
  ["ai", "AI processing"],
  ["services", "Other service providers"],
  ["storage", "Browser storage & advertising"],
  ["retention", "Retention & your choices"],
  ["contact", "Contact & policy updates"],
] as const

export default function PrivacyPolicy() {
  useEffect(() => {
    const previous = document.title
    document.title = "Privacy Policy | AVision"
    if (window.location.hash) {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView()
    }
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <div className="privacy-policy-shell">
      <a className="policy-skip-link" href="#policy-content">
        Skip to privacy policy
      </a>
      <header className="onboarding-header">
        <a className="policy-brand" href="/" aria-label="AVision home">
          <Brand />
        </a>
        <ThemeToggle />
      </header>
      <main id="policy-content" className="privacy-policy" tabIndex={-1}>
        <a className="text-button policy-back" href="/">
          <ArrowLeft size={16} aria-hidden="true" /> Back to AVision
        </a>
        <header className="policy-intro">
          <p className="eyebrow">
            <ShieldCheck size={16} aria-hidden="true" /> YOUR PRIVACY
          </p>
          <h1>Privacy Policy</h1>
          <p>
            AVision helps people report accessibility barriers in Georgia, USA.
            Here’s how we handle your information.
          </p>
          <p className="policy-updated">
            Draft updated: <time dateTime="2026-10-20">October 20, 2026</time>
          </p>
        </header>
        <aside className="policy-review" aria-label="Policy review status">
          <strong>WIP example: not an effective privacy policy</strong>
          <p>
            This placeholder is for team review only. Do not merge or publish it
            until the pending details are confirmed, the wording is corrected
            and completed, and the final policy is approved. Live service
            settings were checked October 20, 2026.
          </p>
        </aside>
        <nav className="policy-contents" aria-label="Privacy policy sections">
          <h2>On this page</h2>
          <ol>
            {sections.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`}>{label}</a>
              </li>
            ))}
          </ol>
        </nav>
        <section id="reports" aria-labelledby="reports-title">
          <h2 id="reports-title">Public reports & photos</h2>
          <p>
            Ticket text, photos, exact locations, status, and vote totals are
            public. Avoid including faces, contact details, or personal
            information about yourself or others, especially children.
          </p>
          <p>
            Uploaded ticket photos are stored on our server and accessible by
            public links, even before posting. We remove hidden GPS details from
            the photo files.
          </p>
          <p>
            The live service reports that face and license plate blurring is
            enabled for new ticket photos. Detected faces and plates are blurred
            before storage. Processing failures reject the upload. Detection can
            miss details, so review photos before posting. Profile pictures are
            not blurred.
          </p>
        </section>
        <section id="location" aria-labelledby="location-title">
          <h2 id="location-title">Location</h2>
          <p>
            Device location is used when you choose a location button and your
            browser allows it. You can place a map pin or search for an address
            instead. Report locations help identify the responsible department
            and are public, even when GPS details are removed from photos.
          </p>
        </section>
        <section id="accounts" aria-labelledby="accounts-title">
          <h2 id="accounts-title">Accounts & activity</h2>
          <p>
            Google sign-in uses Auth0. The app receives profile details such as
            your name, email, and picture. We store your sign-in identifier,
            display name, picture, and optional student, school, and MARTA
            answers. We don’t receive your Google password.
          </p>
          <p>
            We link tickets, votes, report activity, notifications, and
            moderation records to your account or a guest ID saved in your
            browser. Guest activity may move to your account when you sign in.
          </p>
        </section>
        <section id="age" aria-labelledby="age-title">
          <h2 id="age-title">Age eligibility</h2>
          <p>
            Our minimum age and any parental consent requirements are pending
            legal review. We’ll add the confirmed rules and a private contact
            for parents or guardians before this policy takes effect.
          </p>
        </section>
        <section id="ai" aria-labelledby="ai-title">
          <h2 id="ai-title">AI processing</h2>
          <p>
            We may send stored photos, report text, and location details to
            Anthropic’s Claude to prepare and check reports. The live service
            lists Claude as its primary AI.
          </p>
          <p>
            Google’s Gemini may also process photos or report details when
            enabled. Its live configuration remains unconfirmed. Microsoft
            Foundry is not currently configured on the live service. Provider
            retention and AI training settings still need confirmation.
          </p>
          <p>
            AI checks can reject reports or temporarily pause posting after
            repeated flags. Review AI results before posting. You choose whether
            to send a prepared message. Opening an email draft shares its
            contents with your email service, and sending it shares them with
            the recipient.
          </p>
        </section>
        <section id="services" aria-labelledby="services-title">
          <h2 id="services-title">Other service providers</h2>
          <ul>
            <li>
              <strong>Supabase and Vultr:</strong> the database and server
              providers listed in AVision’s setup. Their live account details
              remain unconfirmed.
            </li>
            <li>
              <strong>OpenStreetMap, Nominatim, and Photon:</strong> maps,
              location lookups, and address searches.
            </li>
            <li>
              <strong>Google Fonts and Unsplash:</strong> fonts and images.
            </li>
          </ul>
          <p>
            Outside services may receive your IP address and browser details.
            Their own privacy policies also apply. Data storage locations still
            need confirmation.
          </p>
        </section>
        <section id="storage" aria-labelledby="storage-title">
          <h2 id="storage-title">Browser storage & advertising</h2>
          <p>
            Your browser stores sign-in information, a guest identifier, and
            your preferences. Sign-in services may also use cookies. Clearing
            browser data removes local settings and may remove access to guest
            activity. It does not delete server records.
          </p>
          <p>
            The live site loads Google AdSense. Google and other advertising
            providers may use cookies to personalize ads based on visits to this
            and other sites. Ad partners and consent settings still need
            confirmation.
          </p>
          <p>
            Manage Google ad personalization through{" "}
            <a href="https://adssettings.google.com/partnerads">
              Google’s Partner Ad Settings
            </a>
            . Other advertising providers offer{" "}
            <a href="https://optout.aboutads.info/">their own opt-out tools</a>.
            You can also restrict cookies in your browser. These choices do not
            stop all advertising or data collection. Read{" "}
            <a href="https://policies.google.com/technologies/partner-sites">
              how Google uses information from partner sites
            </a>
            .
          </p>
        </section>
        <section id="retention" aria-labelledby="retention-title">
          <h2 id="retention-title">Retention & your choices</h2>
          <p>
            Use your profile to edit your details and privacy preferences. You
            can edit or delete your tickets, except fixed tickets, which require
            an administrator. Privacy & security lets you choose whether new
            prepared messages include your profile name. It does not remove
            names you type.
          </p>
          <p>
            Accounts and tickets are not automatically deleted after a set
            period. Deleting a ticket also deletes its photos from that server.
            Some related records, such as removal notifications, may remain.
            Unused uploads are eligible for periodic cleanup after one hour.
            Browsers may cache photos for up to a year, and other people may
            keep copies after deletion.
          </p>
          <p>
            Account deletion and data export are not yet available in the app.
            Retention periods for backups, logs, and providers still need
            confirmation. Complete security cannot be guaranteed.
          </p>
        </section>
        <section id="contact" aria-labelledby="contact-title">
          <h2 id="contact-title">Contact & policy updates</h2>
          <p>
            <strong>Privacy contact: not yet confirmed.</strong> Depending on
            applicable law, you may have rights to access, correct, or delete
            your information. A private request channel still needs to be added.
            Please keep privacy requests and personal details out of public
            tickets.
          </p>
          <p>
            We’ll update the date above when this policy changes. This draft is
            not yet in effect.
          </p>
        </section>
      </main>
      <SiteFooter privacyPage />
    </div>
  )
}

import { useEffect, useId, useState, type FormEvent } from "react"
import { X } from "lucide-react"
import { useAccount } from "./auth"
import type { Member } from "./api"

// The onboarding questions from the design doc, asked once after a first sign-in
// and editable later from the profile. Every question can be left unanswered.
// When opened from "Edit profile", the person can also change their name.

const GSU = "Georgia State University"

function YesNo({
  legend,
  name,
  value,
  onChange,
}: {
  legend: string
  name: string
  value: boolean | null
  onChange: (answer: boolean) => void
}) {
  return (
    <fieldset className="choice-group">
      <legend>{legend}</legend>
      <div className="choice-options">
        {[
          { label: "Yes", answer: true },
          { label: "No", answer: false },
        ].map(({ label, answer }) => (
          <label key={label} className={value === answer ? "choice selected" : "choice"}>
            <input
              type="radio"
              name={name}
              checked={value === answer}
              onChange={() => onChange(answer)}
            />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default function OnboardingQuestions({
  member,
  onClose,
}: {
  member: Member
  /** Called after saving, or when the person skips. */
  onClose: () => void
}) {
  const { account, saveOnboarding, saveName } = useAccount()
  const ids = useId()
  const [isStudent, setIsStudent] = useState(member.isStudent)
  // GSU is the one listed choice; any other school is typed in.
  const [schoolChoice, setSchoolChoice] = useState<"gsu" | "other">(
    member.school && member.school !== GSU ? "other" : "gsu",
  )
  const [otherSchool, setOtherSchool] = useState(
    member.school && member.school !== GSU ? member.school : "",
  )
  const [takesMarta, setTakesMarta] = useState(member.takesMarta)
  const currentName = member.displayName || account?.name || ""
  const [name, setName] = useState(currentName)
  const firstTime = member.onboardedAt === null
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !saving) onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose, saving])

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (saving) return
    const newName = name.trim()
    if (!firstTime && !newName) {
      setError("Enter the name you want shown on your profile.")
      return
    }
    setSaving(true)
    setError(null)
    try {
      if (!firstTime && newName !== currentName) await saveName(newName)
      await saveOnboarding({
        isStudent,
        school: isStudent ? (schoolChoice === "gsu" ? GSU : otherSchool.trim() || null) : null,
        takesMarta,
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn’t save your changes")
      setSaving(false)
    }
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose()
      }}
    >
      <form
        className="report-dialog onboarding-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${ids}-title`}
        onSubmit={submit}
      >
        <div className="report-header">
          <div>
            <p className="eyebrow">{firstTime ? "WELCOME" : "YOUR PROFILE"}</p>
            <h2 id={`${ids}-title`}>
              {firstTime ? "A few quick questions" : "Edit your profile"}
            </h2>
          </div>
          <button
            type="button"
            className="dialog-close"
            onClick={onClose}
            disabled={saving}
            aria-label="Close questions"
          >
            <X size={18} />
          </button>
        </div>

        {!firstTime && (
          <label className="form-field">
            <span>Your name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={80}
              autoComplete="name"
              required
            />
          </label>
        )}

        <p className="onboarding-intro">
          These help us show the issues that matter to you. Every question is optional.
        </p>

        <YesNo
          legend="Are you a student?"
          name={`${ids}-student`}
          value={isStudent}
          onChange={setIsStudent}
        />

        {isStudent && (
          <fieldset className="choice-group">
            <legend>What school do you go to?</legend>
            <div className="choice-options">
              <label className={schoolChoice === "gsu" ? "choice selected" : "choice"}>
                <input
                  type="radio"
                  name={`${ids}-school`}
                  checked={schoolChoice === "gsu"}
                  onChange={() => setSchoolChoice("gsu")}
                />
                {GSU}
              </label>
              <label className={schoolChoice === "other" ? "choice selected" : "choice"}>
                <input
                  type="radio"
                  name={`${ids}-school`}
                  checked={schoolChoice === "other"}
                  onChange={() => setSchoolChoice("other")}
                />
                Another school
              </label>
            </div>
            {schoolChoice === "other" && (
              <label className="form-field">
                <span className="sr-only">School name</span>
                <input
                  value={otherSchool}
                  onChange={(event) => setOtherSchool(event.target.value)}
                  maxLength={120}
                  placeholder="School name"
                  autoFocus
                />
              </label>
            )}
          </fieldset>
        )}

        <YesNo
          legend="Do you take MARTA?"
          name={`${ids}-marta`}
          value={takesMarta}
          onChange={setTakesMarta}
        />

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <div className="report-actions">
          <button type="button" className="text-button" onClick={onClose} disabled={saving}>
            {firstTime ? "Skip for now" : "Cancel"}
          </button>
          <button type="submit" className="primary-button" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  )
}

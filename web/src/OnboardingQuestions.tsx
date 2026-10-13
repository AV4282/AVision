import { useEffect, useId, useState, type FormEvent } from "react"
import { X } from "lucide-react"
import { useAccount } from "./auth"
import { GEORGIA_TECH_SCHOOL, GSU_SCHOOL, schoolOwner, type Member } from "./api"

// The onboarding questions from the design doc, asked once after a first sign-in
// and editable later from the profile. Every question can be left unanswered.
// When opened from "Edit profile", the person can also change their name.
//
// The answers decide which tickets the map shows first (see useOwnerFilter in
// App.tsx): the City of Atlanta's and GDOT's for everyone, plus the person's
// school's, and MARTA's if they ride it.

// The schools AVision covers. Any other school is typed in under "Another school".
const SCHOOLS = [
  { id: "gsu", name: GSU_SCHOOL, label: "Georgia State University" },
  { id: "gt", name: GEORGIA_TECH_SCHOOL, label: "Georgia Tech" },
] as const
type SchoolChoice = (typeof SCHOOLS)[number]["id"] | "other"

/** Which choice a saved school is: one of the listed ones, or "other". */
function choiceFor(school: string | null): SchoolChoice {
  const owner = schoolOwner(school)
  return owner === "GSU Facilities" ? "gsu" : owner === "Georgia Tech" ? "gt" : school ? "other" : "gsu"
}

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
  const [schoolChoice, setSchoolChoice] = useState<SchoolChoice>(choiceFor(member.school))
  const [otherSchool, setOtherSchool] = useState(
    member.school && choiceFor(member.school) === "other" ? member.school : "",
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
        school: isStudent
          ? (SCHOOLS.find((school) => school.id === schoolChoice)?.name ?? (otherSchool.trim() || null))
          : null,
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
          Your answers pick which tickets the map shows you first. You can
          switch the others on from the map’s Filters any time. Every question
          is optional.
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
              {SCHOOLS.map((school) => (
                <label
                  key={school.id}
                  className={schoolChoice === school.id ? "choice selected" : "choice"}
                >
                  <input
                    type="radio"
                    name={`${ids}-school`}
                    checked={schoolChoice === school.id}
                    onChange={() => setSchoolChoice(school.id)}
                  />
                  {school.label}
                </label>
              ))}
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
            <p className="choice-note">
              {schoolChoice === "other"
                ? "AVision only covers the Georgia State and Georgia Tech campuses for now, so there are no tickets for other schools yet. You can still see and report anything in the City of Atlanta or on MARTA."
                : "Georgia State and Georgia Tech are the only schools AVision covers for now."}
            </p>
          </fieldset>
        )}

        <YesNo
          legend="Do you take MARTA?"
          name={`${ids}-marta`}
          value={takesMarta}
          onChange={setTakesMarta}
        />

        <p className="choice-note">
          AVision covers the City of Atlanta, MARTA, Georgia State and Georgia
          Tech right now.
        </p>

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

"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { setPrefs } from "@/lib/prefs";
import { Account } from "../Account";
import { Paving } from "../Paving";
import styles from "./onboarding.module.css";

type Step = "student" | "school" | "marta";

const QUESTIONS: Record<Step, string> = {
  student: "Are you a student?",
  school: "What school do you go to?",
  marta: "Do you take MARTA?",
};

// Schools AVision supports, shown as one-tap answers. Anyone else types their
// school. To add Georgia Tech later, add a line here. `value` is what gets saved.
const SCHOOLS = [{ label: "Georgia State University", value: "Georgia State University" }];

function YesNo(props: { labelledBy: string; value: boolean | null; onAnswer: (answer: boolean) => void }) {
  const { labelledBy, value, onAnswer } = props;
  return (
    <div role="group" aria-labelledby={labelledBy} className={styles.options}>
      {[true, false].map((answer) => (
        <button
          key={String(answer)}
          type="button"
          className={styles.option}
          aria-pressed={value === answer}
          onClick={() => onAnswer(answer)}
        >
          {answer ? "Yes" : "No"}
          <span className={styles.mark} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

export function Onboarding() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const headingId = useId();
  const fieldId = useId();
  const errorId = useId();

  const [step, setStep] = useState<Step>("student");
  const [isStudent, setIsStudent] = useState<boolean | null>(null);
  const [school, setSchool] = useState("");
  const [takesMarta, setTakesMarta] = useState<boolean | null>(null);
  const [schoolMissing, setSchoolMissing] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const fieldRef = useRef<HTMLInputElement>(null);
  const isFirstRender = useRef(true);
  const finished = useRef(false);

  // The school question only exists for students.
  const steps: Step[] = isStudent === false ? ["student", "marta"] : ["student", "school", "marta"];
  const position = steps.indexOf(step);

  // The questions are only for people who have an account. Anyone else is
  // sent to the home page, where Sign up creates one first.
  useEffect(() => {
    if (!isLoading && !user) router.replace("/");
  }, [isLoading, user, router]);

  // A new question takes focus, so keyboard and screen reader users land on it.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
    headingRef.current?.focus();
  }, [step]);

  // Next.js keeps a page's state alive after you leave it. Once the questions
  // are answered, clear them as the page is hidden, so "answer again" starts
  // from the first question instead of the last one.
  useLayoutEffect(() => {
    return () => {
      if (!finished.current) return;
      finished.current = false;
      setStep("student");
      setIsStudent(null);
      setSchool("");
      setTakesMarta(null);
      setSchoolMissing(false);
    };
  }, []);

  function answerStudent(answer: boolean) {
    setIsStudent(answer);
    if (!answer) setSchool("");
    setStep(answer ? "school" : "marta");
  }

  function pickSchool(value: string) {
    setSchool(value);
    setSchoolMissing(false);
    setStep("marta");
  }

  function submitSchool(event: FormEvent) {
    event.preventDefault();
    if (!school.trim()) {
      setSchoolMissing(true);
      fieldRef.current?.focus();
      return;
    }
    setStep("marta");
  }

  function answerMarta(answer: boolean) {
    setTakesMarta(answer);
    setPrefs({
      onboarded: true,
      userId: user?.sub ?? null,
      isStudent,
      school: isStudent ? school.trim() : null,
      takesMarta: answer,
    });
    finished.current = true;
    router.replace("/");
  }

  return (
    <div className={styles.page}>
      <aside className={styles.brand}>
        <Link href="/" className={styles.wordmark}>
          AVision
        </Link>
        <div className={styles.pitch}>
          <p className={styles.tagline}>Spot an issue. Report it in a minute.</p>
          <p className={styles.lead}>
            AVision helps you report everyday problems around your city or campus, like a broken streetlight, a blocked
            sidewalk or an elevator that is out of service, to the people who can fix them.
          </p>
        </div>
        <div className={styles.paving}>
          <Paving />
        </div>
      </aside>

      <Account className={styles.account} />

      <main className={styles.flow}>
        {/* Nothing is shown until we know the person is signed in. */}
        {user && (
          <div className={styles.panel}>
            <div className={styles.progress}>
              <span className={styles.dashes} aria-hidden="true">
                {steps.map((name, index) => (
                  <span key={name} className={styles.dash} data-reached={index <= position} />
                ))}
              </span>
              <p className={styles.count}>
                Question {position + 1} of {steps.length}
              </p>
            </div>

            {/* The key restarts the entrance animation for each question. */}
            <div key={step} className={styles.step}>
              <h1 id={headingId} ref={headingRef} tabIndex={-1} className={styles.question}>
                {QUESTIONS[step]}
              </h1>

              {step === "student" && <YesNo labelledBy={headingId} value={isStudent} onAnswer={answerStudent} />}

              {step === "school" && (
                <form onSubmit={submitSchool} noValidate>
                  <div role="group" aria-labelledby={headingId} className={styles.options}>
                    {SCHOOLS.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        className={styles.option}
                        aria-pressed={school === item.value}
                        onClick={() => pickSchool(item.value)}
                      >
                        {item.label}
                        <span className={styles.mark} aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                  <label htmlFor={fieldId} className={styles.fieldLabel}>
                    Go somewhere else? Type your school
                  </label>
                  <input
                    id={fieldId}
                    ref={fieldRef}
                    className={styles.field}
                    type="text"
                    value={SCHOOLS.some((item) => item.value === school) ? "" : school}
                    maxLength={100}
                    autoComplete="off"
                    autoCapitalize="words"
                    spellCheck={false}
                    aria-invalid={schoolMissing}
                    aria-describedby={errorId}
                    onChange={(event) => {
                      setSchool(event.target.value);
                      setSchoolMissing(false);
                    }}
                  />
                  <p id={errorId} role="alert" className={styles.error}>
                    {schoolMissing ? "Choose a school above, or type yours here." : ""}
                  </p>
                  <p className={styles.note}>Campus reports cover Georgia State only for now.</p>
                  <button type="submit" className={styles.primary}>
                    Continue
                  </button>
                </form>
              )}

              {step === "marta" && <YesNo labelledBy={headingId} value={takesMarta} onAnswer={answerMarta} />}
            </div>

            {position > 0 && (
              <button type="button" className={styles.back} onClick={() => setStep(steps[position - 1])}>
                Back
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

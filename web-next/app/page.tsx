"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { hasAnswered, usePrefs } from "@/lib/prefs";
import { Account, SIGN_UP_HREF } from "./Account";
import { Paving } from "./Paving";
import styles from "./home.module.css";

const yesNo = (value: boolean | null) => (value === null ? "Not answered" : value ? "Yes" : "No");

/**
 * The landing page. Nobody is asked anything here. The questions come right
 * after an account is created: Sign up goes to Auth0, then to /onboarding.
 *
 * The "Your answers" block is a placeholder so the team can see what the
 * questions saved. Replace it with the real signed-in home when that exists.
 */
export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const prefs = usePrefs();
  const answered = !!user && !!prefs && hasAnswered(prefs, user.sub);

  // An account that has not answered yet gets the questions. This covers
  // people who created their account from the Log in screen (for example with
  // Google), which skips the Sign up link.
  useEffect(() => {
    if (user && prefs && !hasAnswered(prefs, user.sub)) router.replace("/onboarding");
  }, [user, prefs, router]);

  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <p className={styles.wordmark}>AVision</p>
        <Account />
      </header>

      <main className={styles.hero}>
        <h1 className={styles.tagline}>
          <span className={styles.line}>Spot an issue.</span> <span className={styles.line}>Report it in a minute.</span>
        </h1>
        <p className={styles.lead}>
          AVision helps you report everyday problems around your city or campus, like a broken streetlight, a blocked
          sidewalk or an elevator that is out of service, to the people who can fix them.
        </p>

        {!isLoading && !user && (
          <div className={styles.cta}>
            <a className={styles.signup} href={SIGN_UP_HREF}>
              Sign up
            </a>
            <a className={styles.login} href="/auth/login">
              Log in
            </a>
          </div>
        )}

        {answered && prefs && (
          <section className={styles.answers} aria-labelledby="answers-title">
            <h2 id="answers-title" className={styles.answersTitle}>
              Your answers
            </h2>
            <dl>
              <div>
                <dt>Student</dt>
                <dd>{yesNo(prefs.isStudent)}</dd>
              </div>
              {prefs.school && (
                <div>
                  <dt>School</dt>
                  <dd>{prefs.school}</dd>
                </div>
              )}
              <div>
                <dt>Takes MARTA</dt>
                <dd>{yesNo(prefs.takesMarta)}</dd>
              </div>
            </dl>
            <Link className={styles.again} href="/onboarding">
              Answer the questions again
            </Link>
          </section>
        )}
      </main>

      <div className={styles.paving}>
        <Paving />
      </div>
    </div>
  );
}

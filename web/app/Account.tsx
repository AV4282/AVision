"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import styles from "./account.module.css";

/** Creates the account with Auth0, then brings the person to the questions. */
export const SIGN_UP_HREF = "/auth/login?screen_hint=signup&returnTo=/onboarding";

/**
 * Log in / Sign up when signed out, the person's name and Log out when signed
 * in. Shows nothing while loading or if the session check fails.
 *
 * These are plain <a> tags on purpose: they must be full page loads, because
 * the /auth routes are served by Auth0 in proxy.ts and are not pages here.
 */
export function Account({ className = "" }: { className?: string }) {
  const { user, isLoading, error } = useUser();
  const ready = !isLoading && !error;

  return (
    <nav aria-label="Account" className={`${styles.account} ${className}`}>
      {ready && user && (
        <>
          <span className={styles.name}>{user.name || user.email}</span>
          <a className={styles.link} href="/auth/logout">
            Log out
          </a>
        </>
      )}
      {ready && !user && (
        <>
          <a className={styles.link} href="/auth/login">
            Log in
          </a>
          <a className={styles.button} href={SIGN_UP_HREF}>
            Sign up
          </a>
        </>
      )}
    </nav>
  );
}

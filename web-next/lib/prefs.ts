"use client";

import { useSyncExternalStore } from "react";

/**
 * What onboarding saves, kept in one localStorage entry on the person's device.
 * Other screens read it with usePrefs() and change it with setPrefs().
 */
export type Prefs = {
  onboarded: boolean; // finished the intro questions
  userId: string | null; // the Auth0 ID of the account that answered
  isStudent: boolean | null; // null = not answered
  school: string | null; // only set when isStudent is true
  takesMarta: boolean | null; // null = not answered
};

export const PREFS_KEY = "avision.prefs";

const DEFAULTS: Prefs = { onboarded: false, userId: null, isStudent: null, school: null, takesMarta: null };

// If storage is blocked (private mode, strict settings) the answers still hold
// for this visit, held in memory.
let memory: string | null = null;
let cachedRaw: string | null | undefined;
let cachedValue: Prefs = DEFAULTS;
const listeners = new Set<() => void>();

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(PREFS_KEY) ?? memory;
  } catch {
    return memory;
  }
}

const yesNo = (value: unknown): boolean | null => (typeof value === "boolean" ? value : null);

export function getPrefs(): Prefs {
  const raw = readRaw();
  if (raw === cachedRaw) return cachedValue;
  let value = DEFAULTS;
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      value = {
        onboarded: parsed?.onboarded === true,
        userId: typeof parsed?.userId === "string" && parsed.userId ? parsed.userId : null,
        isStudent: yesNo(parsed?.isStudent),
        school: typeof parsed?.school === "string" && parsed.school.trim() ? parsed.school.trim() : null,
        takesMarta: yesNo(parsed?.takesMarta),
      };
    } catch {
      value = DEFAULTS;
    }
  }
  cachedRaw = raw;
  cachedValue = value;
  return value;
}

export function setPrefs(patch: Partial<Prefs>) {
  const next = JSON.stringify({ ...getPrefs(), ...patch });
  memory = next;
  try {
    window.localStorage.setItem(PREFS_KEY, next);
  } catch {
    // Storage is unavailable. The in-memory copy above keeps this visit working.
  }
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  window.addEventListener("storage", notify);
  return () => {
    listeners.delete(notify);
    window.removeEventListener("storage", notify);
  };
}

/** True when these saved answers were given by this signed-in account. */
export function hasAnswered(prefs: Prefs, userId: string | null | undefined): boolean {
  return prefs.onboarded && !!userId && prefs.userId === userId;
}

/**
 * Returns null while the page is still server-rendered HTML, then the saved
 * answers. Treat null as "not known yet" and avoid acting on it.
 */
export function usePrefs(): Prefs | null {
  return useSyncExternalStore<Prefs | null>(subscribe, getPrefs, () => null);
}

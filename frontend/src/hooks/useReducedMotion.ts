"use client";

import { useSyncExternalStore } from "react";

/**
 * Tracks the user's prefers-reduced-motion setting.
 * Returns true when animations should be reduced/disabled.
 * Uses useSyncExternalStore for lint-safe, SSR-compatible subscription.
 */

function subscribe(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshot() {
  return false; // SSR: assume no reduced motion
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

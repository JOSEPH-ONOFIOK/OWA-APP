"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

// Drop-in replacement for react-router's `navigate(path, { state })` / `useLocation().state`,
// since Next.js's App Router has no client-side router-state payload. Keyed by the
// destination pathname so the receiving page's useWizardState() call picks it up.
const keyFor = (path: string) => `owa_state:${path}`;

interface RouterLike {
  push: (href: string) => void;
}

export function pushWithState<T>(router: RouterLike, path: string, state: T) {
  try {
    sessionStorage.setItem(keyFor(path), JSON.stringify(state));
  } catch {
    // sessionStorage unavailable (e.g. private browsing) — navigation still proceeds without state
  }
  router.push(path);
}

export function useWizardState<T = unknown>(): T | undefined {
  const pathname = usePathname();
  const [state] = useState<T | undefined>(() => {
    if (typeof window === "undefined") return undefined;
    const raw = sessionStorage.getItem(keyFor(pathname));
    if (raw == null) return undefined;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return undefined;
    }
  });
  return state;
}

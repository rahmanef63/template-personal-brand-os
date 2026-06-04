"use client";

import { useEffect, useState } from "react";

/** Persisted user default for the row-peek surface. "sheet" or "dialog"
 *  only — "page" is a one-shot navigation action (handled by RowPeek's
 *  onOpenAsPage callback), never a persistable default. Cross-tab sync
 *  via the `storage` event. Lifted from notion-page-clone CK-1D. */
export type RowOpenMode = "sheet" | "dialog";

const KEY = "db:row-open-mode";
const DEFAULT: RowOpenMode = "sheet";

function readMode(): RowOpenMode {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const v = localStorage.getItem(KEY);
    if (v === "sheet" || v === "dialog") return v;
    if (v === "page") {
      try { localStorage.setItem(KEY, DEFAULT); } catch { /* storage blocked (private mode / quota) — ignore */ }
      return DEFAULT;
    }
  } catch { /* localStorage unavailable — fall back to default */ }
  return DEFAULT;
}

export function useRowOpenMode(): [RowOpenMode, (m: RowOpenMode) => void] {
  const [mode, setMode] = useState<RowOpenMode>(DEFAULT);

  useEffect(() => {
    setMode(readMode());
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setMode(readMode());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const set = (m: RowOpenMode) => {
    setMode(m);
    try { localStorage.setItem(KEY, m); } catch { /* storage blocked (private mode / quota) — keep in-memory only */ }
  };

  return [mode, set];
}

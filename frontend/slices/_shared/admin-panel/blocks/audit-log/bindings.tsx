"use client";

import * as React from "react";
import { SEED_EVENTS } from "./seed";
import type { AuditEventRow } from "./types";

/** Adapter pattern (CC-wave). Audit-log is read-mostly — view owns
 *  filter state (UI), bindings owns the event stream + the optional
 *  logEvent action a real backend would expose. */
export type AuditLogBindings = {
  events: AuditEventRow[];
  isLoading: boolean;
  /** Optional — present in Convex bindings, absent in demo. */
  logEvent?: (event: Omit<AuditEventRow, "id" | "at">) => void;
  /** Optional — clears the persisted log. Present in Convex bindings only;
   *  the in-memory demo omits it (the "Clear log" control hides when absent). */
  clear?: () => void;
};

export function useDefaultAuditLogBindings(): AuditLogBindings {
  return { events: SEED_EVENTS, isLoading: false };
}

const Ctx = React.createContext<AuditLogBindings | null>(null);

export function AuditLogBindingsProvider({
  value,
  children,
}: {
  value: AuditLogBindings;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuditLogBindings(): AuditLogBindings {
  const ctx = React.useContext(Ctx);
  const fallback = useDefaultAuditLogBindings();
  return ctx ?? fallback;
}

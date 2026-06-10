"use client";

import * as React from "react";
import type { Action, State } from "./types";

// Store context + accessor, split out of store.tsx so the dispatch wiring
// (store-dispatch.tsx) and the provider can share it without a cycle.

export type Ctx = { state: State; dispatch: (a: Action) => void; ready: boolean; progress: number };

export const StoreCtx = React.createContext<Ctx | null>(null);

export function useStore() {
  const c = React.useContext(StoreCtx);
  if (!c) throw new Error("useStore must be inside <StoreProvider>");
  return c;
}

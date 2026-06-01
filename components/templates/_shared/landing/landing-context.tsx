"use client";

import * as React from "react";
import type { LandingSection } from "./types";

/** Store adapter — every template's StoreProvider wraps with LandingProvider
 *  and supplies these handlers from its own dispatch. Keeps the shared
 *  admin views (LandingView / LandingEditorView) template-agnostic. */
export type LandingStore = {
  items: LandingSection[];
  publicBase: string;
  adminBase: string;
  create: (section: LandingSection) => void;
  update: (id: string, patch: Partial<Omit<LandingSection, "id">>) => void;
  remove: (id: string) => void;
};

const Ctx = React.createContext<LandingStore | null>(null);

export function LandingProvider({
  value,
  children,
}: {
  value: LandingStore;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLandingStore(): LandingStore {
  const ctx = React.useContext(Ctx);
  if (!ctx) {
    throw new Error(
      "useLandingStore must be used inside <LandingProvider /> — wrap your template's StoreProvider with it.",
    );
  }
  return ctx;
}

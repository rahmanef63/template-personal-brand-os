"use client";

import * as React from "react";
import { DEFAULT_CONFIG, DEFAULT_MODERATION } from "./seed";
import type { AiConfig, ModerationRule } from "./types";

/** Adapter pattern (CC-wave). View consumes config + moderation +
 *  mutators. Demo impl: useState + DEFAULT_*. Convex impl: useQuery
 *  + useMutation against aiConfig + moderationRules tables. */
export type AiConfigBindings = {
  config: AiConfig;
  moderation: ModerationRule[];
  isLoading: boolean;
  setConfig: React.Dispatch<React.SetStateAction<AiConfig>>;
  toggleRule: (id: string, enabled: boolean) => void;
  setThreshold: (id: string, threshold: number) => void;
  reset: () => void;
};

export function useDefaultAiConfigBindings(): AiConfigBindings {
  const [config, setConfig] = React.useState<AiConfig>(DEFAULT_CONFIG);
  const [moderation, setModeration] =
    React.useState<ModerationRule[]>(DEFAULT_MODERATION);
  const toggleRule: AiConfigBindings["toggleRule"] = React.useCallback(
    (id, enabled) =>
      setModeration((prev) => prev.map((r) => (r.id === id ? { ...r, enabled } : r))),
    [],
  );
  const setThreshold: AiConfigBindings["setThreshold"] = React.useCallback(
    (id, threshold) =>
      setModeration((prev) => prev.map((r) => (r.id === id ? { ...r, threshold } : r))),
    [],
  );
  const reset = React.useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    setModeration(DEFAULT_MODERATION);
  }, []);
  return { config, moderation, isLoading: false, setConfig, toggleRule, setThreshold, reset };
}

const Ctx = React.createContext<AiConfigBindings | null>(null);

export function AiConfigBindingsProvider({
  value,
  children,
}: {
  value: AiConfigBindings;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAiConfigBindings(): AiConfigBindings {
  const ctx = React.useContext(Ctx);
  const fallback = useDefaultAiConfigBindings();
  return ctx ?? fallback;
}

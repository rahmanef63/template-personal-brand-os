"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { AiConfigBindings } from "./bindings";
import { DEFAULT_CONFIG, DEFAULT_MODERATION } from "./seed";
import type { AiConfig } from "./types";

/** Convex-backed AiConfigBindings — real persistence against the
 *  adminAiConfig singleton + adminModerationRules rows. While the query is
 *  loading (=== undefined) we return the seed so the UI is never blank,
 *  mirroring the in-memory demo's DEFAULT_*. */
export function useConvexAiConfigBindings(): AiConfigBindings {
  const data = useQuery(api.adminPanel_aiConfig.get);
  const setConfigMut = useMutation(api.adminPanel_aiConfig.setConfig);
  const toggleRuleMut = useMutation(api.adminPanel_aiConfig.toggleRule);
  const setThresholdMut = useMutation(api.adminPanel_aiConfig.setThreshold);
  const resetMut = useMutation(api.adminPanel_aiConfig.reset);

  const isLoading = data === undefined;
  const config: AiConfig = data?.config ?? DEFAULT_CONFIG;
  const moderation = data?.moderation ?? DEFAULT_MODERATION;

  // SetStateAction adapter: resolve the next value from the current persisted
  // config, then upsert the singleton. No local optimistic state — Convex
  // reactivity re-renders with the persisted result.
  const setConfig: AiConfigBindings["setConfig"] = React.useCallback(
    (action) => {
      const next =
        typeof action === "function"
          ? (action as (c: AiConfig) => AiConfig)(config)
          : action;
      void setConfigMut(next);
    },
    [config, setConfigMut],
  );

  const toggleRule: AiConfigBindings["toggleRule"] = React.useCallback(
    (id, enabled) => {
      void toggleRuleMut({ id, enabled });
    },
    [toggleRuleMut],
  );

  const setThreshold: AiConfigBindings["setThreshold"] = React.useCallback(
    (id, threshold) => {
      void setThresholdMut({ id, threshold });
    },
    [setThresholdMut],
  );

  const reset: AiConfigBindings["reset"] = React.useCallback(() => {
    void resetMut();
  }, [resetMut]);

  return { config, moderation, isLoading, setConfig, toggleRule, setThreshold, reset };
}

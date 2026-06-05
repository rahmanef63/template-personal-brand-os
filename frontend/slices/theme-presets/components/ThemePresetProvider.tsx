"use client";

/** Provider context — thin wrapper around the tweakcn helpers in
 *  lib/tweakcn. Boots persisted preset on first client mount, loads
 *  registry once for the switcher, exposes commit/preview/restore.
 *  Deeply-nested consumers read state via `useThemePreset()` instead
 *  of mounting the switcher themselves.
 *
 *  v2 — site-default layer. Resolution order:
 *    1. visitor's explicit choice (localStorage, set via setPreset)
 *    2. siteDefault — the site-wide default the owner saved in settings
 *       (host pushes it via setSiteDefault once its backend loads)
 *    3. hostDefault — the template's build-time default preset
 *  Defaults are applied WITHOUT persisting, so a later change to the
 *  site default propagates to visitors who never picked their own. */

import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
  type ReactNode,
} from "react";
import {
  applyTweakcnPreset, bootTweakcnPreset, clearTweakcnPreset,
  getSavedTweakcnPreset, loadTweakcnRegistry, previewTweakcnPreset,
  type TweakcnRegistry,
} from "../lib/tweakcn";

export const DEFAULT_PRESET_NAME = "default";

interface ThemePresetContextValue {
  presetName: string | null;
  registry: TweakcnRegistry | null;
  setPreset: (name: string | null) => void;
  preview: (name: string | null) => void;
  restore: () => void;
  /** Site-wide default from the owner's settings (null = none). Hosts
   *  call this once their settings query resolves. */
  setSiteDefault: (name: string | null) => void;
  isReady: boolean;
}

const ThemePresetContext = createContext<ThemePresetContextValue>({
  presetName: null,
  registry: null,
  setPreset: () => {},
  preview: () => {},
  restore: () => {},
  setSiteDefault: () => {},
  isReady: false,
});

export function ThemePresetProvider({
  children,
  hostDefault = null,
}: {
  children: ReactNode;
  /** Template's build-time default preset (used until/unless the owner
   *  saves a different site default, and for fresh clones pre-backend). */
  hostDefault?: string | null;
}) {
  const [registry, setRegistry] = useState<TweakcnRegistry | null>(null);
  const [presetName, setPresetName] = useState<string | null>(null);
  const [siteDefault, setSiteDefaultState] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setPresetName(getSavedTweakcnPreset());
    void bootTweakcnPreset()
      .catch(() => {})
      .finally(() => setIsReady(true));
  }, []);

  // Default resolution — only when the visitor has no explicit choice.
  // Non-persisting apply so future default changes still propagate.
  useEffect(() => {
    if (!isReady) return;
    if (getSavedTweakcnPreset()) return;
    const fallback = siteDefault ?? hostDefault;
    if (!fallback) return;
    setPresetName(fallback);
    void previewTweakcnPreset(fallback);
  }, [isReady, siteDefault, hostDefault]);

  useEffect(() => {
    let cancelled = false;
    loadTweakcnRegistry()
      .then((r) => { if (!cancelled) setRegistry(r); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const setSiteDefault = useCallback((name: string | null) => {
    setSiteDefaultState(name);
  }, []);

  const setPreset = useCallback((name: string | null) => {
    if (!name) {
      // Reset = back to the site/template default (clear the explicit choice).
      clearTweakcnPreset();
      const fallback = siteDefault ?? hostDefault;
      setPresetName(fallback);
      if (fallback) void previewTweakcnPreset(fallback);
      return;
    }
    setPresetName(name);
    void applyTweakcnPreset(name);
  }, [siteDefault, hostDefault]);

  const preview = useCallback((name: string | null) => {
    void previewTweakcnPreset(name);
  }, []);

  const restore = useCallback(() => {
    const saved = getSavedTweakcnPreset();
    const target = saved ?? siteDefault ?? hostDefault;
    if (target) void previewTweakcnPreset(target);
    else void previewTweakcnPreset(null);
  }, [siteDefault, hostDefault]);

  const value = useMemo<ThemePresetContextValue>(
    () => ({ presetName, registry, setPreset, preview, restore, setSiteDefault, isReady }),
    [presetName, registry, setPreset, preview, restore, setSiteDefault, isReady],
  );

  return (
    <ThemePresetContext.Provider value={value}>
      {children}
    </ThemePresetContext.Provider>
  );
}

export function useThemePreset(): ThemePresetContextValue {
  return useContext(ThemePresetContext);
}

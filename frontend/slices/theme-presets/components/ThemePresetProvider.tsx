"use client";

/** Provider context — thin wrapper around the tweakcn helpers in
 *  lib/tweakcn. Boots persisted preset on first client mount, loads
 *  registry once for the switcher, exposes commit/preview/restore.
 *  Deeply-nested consumers read state via `useThemePreset()` instead
 *  of mounting the switcher themselves. */

import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
  type ReactNode,
} from "react";
import {
  applyTweakcnPreset, bootTweakcnPreset, clearTweakcnPreset,
  getSavedTweakcnPreset, loadTweakcnRegistry, previewTweakcnPreset,
  restoreTweakcnPreset,
  type TweakcnRegistry,
} from "../lib/tweakcn";

export const DEFAULT_PRESET_NAME = "default";

interface ThemePresetContextValue {
  presetName: string | null;
  registry: TweakcnRegistry | null;
  setPreset: (name: string | null) => void;
  preview: (name: string | null) => void;
  restore: () => void;
  isReady: boolean;
}

const ThemePresetContext = createContext<ThemePresetContextValue>({
  presetName: null,
  registry: null,
  setPreset: () => {},
  preview: () => {},
  restore: () => {},
  isReady: false,
});

export function ThemePresetProvider({ children }: { children: ReactNode }) {
  const [registry, setRegistry] = useState<TweakcnRegistry | null>(null);
  const [presetName, setPresetName] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setPresetName(getSavedTweakcnPreset());
    void bootTweakcnPreset()
      .catch(() => {})
      .finally(() => setIsReady(true));
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadTweakcnRegistry()
      .then((r) => { if (!cancelled) setRegistry(r); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const setPreset = useCallback((name: string | null) => {
    setPresetName(name);
    if (!name) clearTweakcnPreset();
    else void applyTweakcnPreset(name);
  }, []);

  const preview = useCallback((name: string | null) => {
    void previewTweakcnPreset(name);
  }, []);

  const restore = useCallback(() => {
    void restoreTweakcnPreset();
  }, []);

  const value = useMemo<ThemePresetContextValue>(
    () => ({ presetName, registry, setPreset, preview, restore, isReady }),
    [presetName, registry, setPreset, preview, restore, isReady],
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

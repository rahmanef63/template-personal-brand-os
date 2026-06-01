"use client";

import * as React from "react";
import { DEFAULT_IDENTITY, INTEGRATIONS, SEED_KEYS } from "./seed";
import type { ApiKey, Integration, WorkspaceIdentity } from "./types";

/** Adapter pattern (CC-wave). Settings = chassis concern (identity +
 *  integrations + keys). Convex impl: identity → workspace doc,
 *  integrations → encrypted secret vault, keys → hashed key table +
 *  audit-log write on revoke. Demo: useState + SEED. */
export type SettingsBindings = {
  identity: WorkspaceIdentity;
  integrations: Integration[];
  apiKeys: ApiKey[];
  isLoading: boolean;
  setIdentity: React.Dispatch<React.SetStateAction<WorkspaceIdentity>>;
  revokeKey: (id: string) => void;
};

export function useDefaultSettingsBindings(): SettingsBindings {
  const [identity, setIdentity] = React.useState<WorkspaceIdentity>(DEFAULT_IDENTITY);
  const [apiKeys, setApiKeys] = React.useState<ApiKey[]>(SEED_KEYS);
  const revokeKey: SettingsBindings["revokeKey"] = React.useCallback(
    (id) => setApiKeys((prev) => prev.filter((k) => k.id !== id)),
    [],
  );
  return {
    identity,
    integrations: INTEGRATIONS,
    apiKeys,
    isLoading: false,
    setIdentity,
    revokeKey,
  };
}

const Ctx = React.createContext<SettingsBindings | null>(null);

export function SettingsBindingsProvider({
  value,
  children,
}: {
  value: SettingsBindings;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettingsBindings(): SettingsBindings {
  const ctx = React.useContext(Ctx);
  const fallback = useDefaultSettingsBindings();
  return ctx ?? fallback;
}

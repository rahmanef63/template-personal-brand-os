"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { SettingsBindings } from "./bindings";
import { DEFAULT_IDENTITY, INTEGRATIONS, SEED_KEYS } from "./seed";
import type { WorkspaceIdentity } from "./types";

/** Convex-backed SettingsBindings — real persistence against the
 *  adminWorkspaceSettings singleton + adminIntegrations + adminApiKeys rows.
 *  While the query is loading (=== undefined) we return the seed so the UI is
 *  never blank, mirroring the in-memory demo's DEFAULT_* / SEED_*. */
export function useConvexSettingsBindings(): SettingsBindings {
  const data = useQuery(api.adminPanel_settings.get);
  const setIdentityMut = useMutation(api.adminPanel_settings.setIdentity);
  const revokeKeyMut = useMutation(api.adminPanel_settings.revokeKey);

  const isLoading = data === undefined;
  const identity: WorkspaceIdentity = data?.identity ?? DEFAULT_IDENTITY;
  const integrations = data?.integrations ?? INTEGRATIONS;
  const apiKeys = data?.apiKeys ?? SEED_KEYS;

  // SetStateAction adapter: resolve the next value from the current persisted
  // identity, then upsert the singleton. No local optimistic state — Convex
  // reactivity re-renders with the persisted result.
  const setIdentity: SettingsBindings["setIdentity"] = React.useCallback(
    (action) => {
      const next =
        typeof action === "function"
          ? (action as (i: WorkspaceIdentity) => WorkspaceIdentity)(identity)
          : action;
      void setIdentityMut(next);
    },
    [identity, setIdentityMut],
  );

  const revokeKey: SettingsBindings["revokeKey"] = React.useCallback(
    (id) => {
      void revokeKeyMut({ id });
    },
    [revokeKeyMut],
  );

  return { identity, integrations, apiKeys, isLoading, setIdentity, revokeKey };
}

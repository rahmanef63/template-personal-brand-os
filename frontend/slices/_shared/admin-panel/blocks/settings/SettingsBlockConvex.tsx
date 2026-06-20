"use client";

import { SettingsBindingsProvider } from "./bindings";
import { SettingsBlockView } from "./SettingsBlockView";
import { useConvexSettingsBindings } from "./useConvexSettingsBindings";

/** Convex-backed mount of the Settings block — wraps the bare view in a
 *  provider whose value is the persisted (adminWorkspaceSettings +
 *  adminIntegrations + adminApiKeys) bindings instead of the in-memory demo
 *  fallback. */
export function SettingsBlockConvex() {
  return (
    <SettingsBindingsProvider value={useConvexSettingsBindings()}>
      <SettingsBlockView />
    </SettingsBindingsProvider>
  );
}

"use client";

import { AnalyticsBindingsProvider } from "./bindings";
import { AnalyticsBlockView } from "./AnalyticsBlockView";
import { useConvexAnalyticsBindings } from "./useConvexAnalyticsBindings";

/** Convex-backed mount of the Analytics block — wraps the bare view in a
 *  provider whose value is computed from REAL pb tables (via
 *  api.adminPanel_analytics.get) instead of the in-memory demo seed.
 *  Read-only block: no mutations. */
export function AnalyticsBlockConvex() {
  return (
    <AnalyticsBindingsProvider value={useConvexAnalyticsBindings()}>
      <AnalyticsBlockView />
    </AnalyticsBindingsProvider>
  );
}

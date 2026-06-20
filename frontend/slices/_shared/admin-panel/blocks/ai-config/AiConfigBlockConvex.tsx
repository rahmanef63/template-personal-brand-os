"use client";

import { AiConfigBindingsProvider } from "./bindings";
import { AiConfigBlockView } from "./AiConfigBlockView";
import { useConvexAiConfigBindings } from "./useConvexAiConfigBindings";

/** Convex-backed mount of the AI config block — wraps the bare view in a
 *  provider whose value is the persisted (adminAiConfig + adminModerationRules)
 *  bindings instead of the in-memory demo fallback. */
export function AiConfigBlockConvex() {
  return (
    <AiConfigBindingsProvider value={useConvexAiConfigBindings()}>
      <AiConfigBlockView />
    </AiConfigBindingsProvider>
  );
}

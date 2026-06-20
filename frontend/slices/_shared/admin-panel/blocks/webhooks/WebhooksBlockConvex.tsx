"use client";

import { WebhooksBindingsProvider } from "./bindings";
import { WebhooksBlockView } from "./WebhooksBlockView";
import { useConvexWebhooksBindings } from "./useConvexWebhooksBindings";

/** Convex-backed mount of the Webhooks block — wraps the bare view in a
 *  provider whose value is the persisted (adminWebhooks + adminWebhookDeliveries)
 *  bindings instead of the in-memory demo fallback. */
export function WebhooksBlockConvex() {
  return (
    <WebhooksBindingsProvider value={useConvexWebhooksBindings()}>
      <WebhooksBlockView />
    </WebhooksBindingsProvider>
  );
}

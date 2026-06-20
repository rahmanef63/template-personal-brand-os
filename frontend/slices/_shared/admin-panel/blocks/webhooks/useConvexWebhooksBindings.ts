"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { WebhooksBindings } from "./bindings";
import { SEED_DELIVERIES, SEED_ENDPOINTS } from "./seed";
import type { WebhookDelivery, WebhookEndpoint } from "./types";

/** Convex-backed WebhooksBindings — real persistence against the
 *  adminWebhooks + adminWebhookDeliveries tables. While the query is loading
 *  (=== undefined) we return the seed so the UI is never blank, mirroring the
 *  in-memory demo's SEED_*. Once loaded, the persisted rows drive the view
 *  (empty tables => EmptyState, which is correct for real persistence).
 *  All ops are fire-and-forget; Convex reactivity re-renders with the result. */
export function useConvexWebhooksBindings(): WebhooksBindings {
  const data = useQuery(api.adminPanel_webhooks.get);
  const addEndpointMut = useMutation(api.adminPanel_webhooks.addEndpoint);
  const togglePauseMut = useMutation(api.adminPanel_webhooks.togglePause);
  const removeMut = useMutation(api.adminPanel_webhooks.remove);
  const fireMut = useMutation(api.adminPanel_webhooks.fire);

  const isLoading = data === undefined;
  // Convex stores events as string[]; the binding wants the WebhookEventName
  // literal union. The mutations validate event names server-side, so the
  // persisted rows are well-formed — cast at this boundary.
  const endpoints = (data?.endpoints ?? SEED_ENDPOINTS) as WebhookEndpoint[];
  const deliveries = (data?.deliveries ?? SEED_DELIVERIES) as WebhookDelivery[];

  const togglePause: WebhooksBindings["togglePause"] = React.useCallback(
    (id) => {
      void togglePauseMut({ id });
    },
    [togglePauseMut],
  );

  const remove: WebhooksBindings["remove"] = React.useCallback(
    (id) => {
      void removeMut({ id });
    },
    [removeMut],
  );

  const fire: WebhooksBindings["fire"] = React.useCallback(
    (endpointId, event) => {
      void fireMut({ endpointId, event });
    },
    [fireMut],
  );

  const addEndpoint: WebhooksBindings["addEndpoint"] = React.useCallback(
    (url, events) => {
      void addEndpointMut({ url, events });
    },
    [addEndpointMut],
  );

  return { endpoints, deliveries, isLoading, togglePause, remove, fire, addEndpoint };
}

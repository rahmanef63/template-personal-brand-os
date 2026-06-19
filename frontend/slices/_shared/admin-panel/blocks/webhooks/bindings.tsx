"use client";

import * as React from "react";
import { SEED_DELIVERIES, SEED_ENDPOINTS } from "./seed";
import type {
  DeliveryStatus,
  WebhookDelivery,
  WebhookEndpoint,
  WebhookEventName,
} from "./types";

/** Adapter pattern (CC-wave). View consumes endpoints + deliveries +
 *  per-endpoint actions. CD-wave adds `fire()` — Test button posts a
 *  mock event and prepends a new delivery row. Convex impl wraps
 *  useQuery + useMutation; a scheduled function performs
 *  retry-with-backoff out of band. */
export type WebhooksBindings = {
  endpoints: WebhookEndpoint[];
  deliveries: WebhookDelivery[];
  isLoading: boolean;
  togglePause: (id: string) => void;
  remove: (id: string) => void;
  /** Fires a mock delivery for the given endpoint. Demo impl
   *  prepends a synthetic delivery. Convex impl POSTs to the endpoint
   *  URL and writes the delivery record. */
  fire: (endpointId: string, event?: WebhookEventName) => void;
};

/** Demo physics for the synthetic delivery created by fire(). 70%
 *  delivered, 20% retry, 10% failed. Latency 60-220ms. */
function rollDeliveryStatus(): { status: DeliveryStatus; httpCode: number; durationMs: number; attempt: number } {
  const r = Math.random();
  const durationMs = 60 + Math.floor(Math.random() * 160);
  if (r < 0.7) return { status: "delivered", httpCode: 200, durationMs, attempt: 0 };
  if (r < 0.9) return { status: "retry", httpCode: 502, durationMs: durationMs * 4, attempt: 1 };
  return { status: "failed", httpCode: 0, durationMs: 5000, attempt: 4 };
}

export function useDefaultWebhooksBindings(): WebhooksBindings {
  const [endpoints, setEndpoints] =
    React.useState<WebhookEndpoint[]>(SEED_ENDPOINTS);
  const [deliveries, setDeliveries] =
    React.useState<WebhookDelivery[]>(SEED_DELIVERIES);

  const togglePause: WebhooksBindings["togglePause"] = React.useCallback(
    (id) =>
      setEndpoints((prev) =>
        prev.map((e) =>
          e.id === id
            ? { ...e, status: e.status === "paused" ? "active" : "paused" }
            : e,
        ),
      ),
    [],
  );
  const remove: WebhooksBindings["remove"] = React.useCallback(
    (id) => setEndpoints((prev) => prev.filter((e) => e.id !== id)),
    [],
  );
  const fire: WebhooksBindings["fire"] = React.useCallback((endpointId, event = "post.created") => {
    const roll = rollDeliveryStatus();
    const delivery: WebhookDelivery = {
      id: `dl_live_${Date.now().toString(36)}`,
      endpointId,
      event,
      at: new Date().toISOString(),
      ...roll,
    };
    setDeliveries((prev) => [delivery, ...prev]);
    // Bump endpoint's lastDeliveryAt + reset failingRetries on success.
    setEndpoints((prev) =>
      prev.map((e) =>
        e.id === endpointId
          ? {
              ...e,
              lastDeliveryAt: delivery.at,
              failingRetries: delivery.status === "delivered" ? 0 : e.failingRetries + delivery.attempt,
              status: delivery.status === "failed" ? "failing" : e.status,
            }
          : e,
      ),
    );
  }, []);

  return { endpoints, deliveries, isLoading: false, togglePause, remove, fire };
}

const Ctx = React.createContext<WebhooksBindings | null>(null);

export function WebhooksBindingsProvider({
  value,
  children,
}: {
  value: WebhooksBindings;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWebhooksBindings(): WebhooksBindings {
  const ctx = React.useContext(Ctx);
  const fallback = useDefaultWebhooksBindings();
  return ctx ?? fallback;
}

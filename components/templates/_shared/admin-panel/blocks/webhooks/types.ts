// Webhook types — no canonical slice exists yet. Schema here would
// be the seed for a future frontend/slices/webhooks/ canonical slice
// (HMAC signature, retry policy, dead-letter, replay).
//
// BW-wave (2026-05-21) — fifth admin-panel block with real impl.

export type WebhookEventName =
  | "user.invited"
  | "user.revoked"
  | "page.published"
  | "page.unpublished"
  | "post.created"
  | "post.published"
  | "workflow.completed"
  | "payment.succeeded";

export type EndpointStatus = "active" | "paused" | "failing";

export type WebhookEndpoint = {
  id: string;
  url: string;
  description: string;
  events: WebhookEventName[];
  status: EndpointStatus;
  /** Last 4 of the signing secret. */
  secretTail: string;
  /** ISO datetime of last delivery, or null if never. */
  lastDeliveryAt: string | null;
  /** Number of failed retries since last success. */
  failingRetries: number;
};

export type DeliveryStatus = "delivered" | "failed" | "pending" | "retry";

export type WebhookDelivery = {
  id: string;
  endpointId: string;
  event: WebhookEventName;
  at: string;
  /** HTTP response code. 0 = no response (timeout, DNS). */
  httpCode: number;
  status: DeliveryStatus;
  /** Round-trip ms. */
  durationMs: number;
  /** Retry attempt number (0 = first try). */
  attempt: number;
};

import { TONES } from "../../ui/tones";
import type {
  DeliveryStatus,
  EndpointStatus,
  WebhookDelivery,
  WebhookEndpoint,
  WebhookEventName,
} from "./types";

export const ALL_EVENTS: WebhookEventName[] = [
  "user.invited",
  "user.revoked",
  "page.published",
  "page.unpublished",
  "post.created",
  "post.published",
  "workflow.completed",
  "payment.succeeded",
];

export const STATUS_META: Record<EndpointStatus, { label: string; tone: string }> = {
  active:  { label: "Active",  tone: TONES.success.badge },
  paused:  { label: "Paused",  tone: TONES.neutral.badge },
  failing: { label: "Failing", tone: TONES.danger.badge },
};

export const DELIVERY_META: Record<DeliveryStatus, { label: string; tone: string }> = {
  delivered: { label: "Delivered", tone: TONES.success.badge },
  failed:    { label: "Failed",    tone: TONES.danger.badge },
  pending:   { label: "Pending",   tone: TONES.warn.badge },
  retry:     { label: "Retry",     tone: TONES.info.badge },
};

export const SEED_ENDPOINTS: WebhookEndpoint[] = [
  {
    id: "wh_1",
    url: "https://hooks.zapier.com/hooks/catch/189342/abc7Q2",
    description: "Zapier → CRM lead intake",
    events: ["user.invited", "post.created", "workflow.completed"],
    status: "active",
    secretTail: "k7Q2",
    lastDeliveryAt: "2026-05-21T07:14:00Z",
    failingRetries: 0,
  },
  {
    id: "wh_2",
    url: "https://api.slack.com/services/T032/B040/x12M",
    description: "Slack #ops alerts",
    events: ["page.published", "post.published", "payment.succeeded"],
    status: "active",
    secretTail: "x12M",
    lastDeliveryAt: "2026-05-21T06:42:00Z",
    failingRetries: 0,
  },
  {
    id: "wh_3",
    url: "https://internal.lumen.dev/wh/audit",
    description: "Internal audit mirror",
    events: ["user.revoked", "page.unpublished"],
    status: "failing",
    secretTail: "9b3F",
    lastDeliveryAt: "2026-05-21T05:18:00Z",
    failingRetries: 4,
  },
  {
    id: "wh_4",
    url: "https://staging.intake.example.com/hook",
    description: "Staging sandbox (do not delete)",
    events: ["post.created"],
    status: "paused",
    secretTail: "tQ8m",
    lastDeliveryAt: null,
    failingRetries: 0,
  },
];

export const SEED_DELIVERIES: WebhookDelivery[] = [
  { id: "dl_12", endpointId: "wh_1", event: "post.created",       at: "2026-05-21T07:14:00Z", httpCode: 200, status: "delivered", durationMs: 142, attempt: 0 },
  { id: "dl_11", endpointId: "wh_2", event: "page.published",     at: "2026-05-21T06:42:00Z", httpCode: 200, status: "delivered", durationMs: 88,  attempt: 0 },
  { id: "dl_10", endpointId: "wh_3", event: "user.revoked",       at: "2026-05-21T05:18:00Z", httpCode: 502, status: "failed",    durationMs: 1200, attempt: 4 },
  { id: "dl_9",  endpointId: "wh_3", event: "user.revoked",       at: "2026-05-21T05:08:00Z", httpCode: 502, status: "retry",     durationMs: 1180, attempt: 3 },
  { id: "dl_8",  endpointId: "wh_1", event: "workflow.completed", at: "2026-05-21T04:55:00Z", httpCode: 200, status: "delivered", durationMs: 168, attempt: 0 },
  { id: "dl_7",  endpointId: "wh_2", event: "payment.succeeded",  at: "2026-05-21T04:22:00Z", httpCode: 200, status: "delivered", durationMs: 102, attempt: 0 },
  { id: "dl_6",  endpointId: "wh_1", event: "user.invited",       at: "2026-05-21T03:46:00Z", httpCode: 200, status: "delivered", durationMs: 154, attempt: 0 },
  { id: "dl_5",  endpointId: "wh_3", event: "page.unpublished",   at: "2026-05-21T02:14:00Z", httpCode: 0,   status: "failed",    durationMs: 5000, attempt: 4 },
  { id: "dl_4",  endpointId: "wh_2", event: "post.published",     at: "2026-05-21T01:08:00Z", httpCode: 200, status: "delivered", durationMs: 76,  attempt: 0 },
  { id: "dl_3",  endpointId: "wh_1", event: "post.created",       at: "2026-05-20T22:40:00Z", httpCode: 200, status: "delivered", durationMs: 132, attempt: 0 },
  { id: "dl_2",  endpointId: "wh_1", event: "post.created",       at: "2026-05-20T20:12:00Z", httpCode: 200, status: "delivered", durationMs: 144, attempt: 0 },
  { id: "dl_1",  endpointId: "wh_2", event: "page.published",     at: "2026-05-20T18:30:00Z", httpCode: 200, status: "delivered", durationMs: 95,  attempt: 0 },
];

export const SAMPLE_PAYLOAD = `{
  "id": "evt_2026_05_21_abc",
  "type": "post.published",
  "createdAt": "2026-05-21T07:14:00Z",
  "data": {
    "postId": "post_42",
    "title": "Case study: Lumen rebrand",
    "authorId": "u_3"
  }
}`;

export const SAMPLE_SIGNATURE =
  "X-Webhook-Signature: t=1716275640, v1=8f3a6c0e9d4b5e2a7c1d8e6f3a9b4c2d1e7f8a3b5c9d2e1f6a4b8c3d7e2f9a1b";

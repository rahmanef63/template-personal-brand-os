// Payment webhook handlers — Midtrans + Doku.
//
// Wire in your consumer's convex/http.ts:
//
//   import { httpRouter } from "convex/server";
//   import { midtransWebhook, dokuWebhook } from "./features/payment/http";
//   const http = httpRouter();
//   http.route({ path: "/webhooks/midtrans", method: "POST", handler: midtransWebhook });
//   http.route({ path: "/webhooks/doku",     method: "POST", handler: dokuWebhook });
//   export default http;
//
// Midtrans signature spec (Snap):
//   signature_key = SHA512(order_id + status_code + gross_amount + server_key)
// Reference: https://docs.midtrans.com/reference/notification-webhook-http
//
// DOKU signature spec (Direct/Notification API):
//   header `Signature: HMACSHA256=<base64(HMAC-SHA256(canonical, secret))>`
//   where canonical is the multi-line string defined in doku/signature.ts.
// Reference: https://sandbox.doku.com/integration/api/notification
//
// Both handlers fail-fast on signature mismatch and are idempotent — same
// orderId being marked paid twice is a no-op.

import { httpAction } from "../../_generated/server";
import { internal } from "../../_generated/api";
import { constantTimeEqual, sha512Hex } from "../../_shared/crypto";
import { verifySignature } from "./doku/signature";
import type { DokuNotification } from "./doku/types";

type MidtransNotification = {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: string;
  fraud_status?: string;
  transaction_id: string;
  payment_type?: string;
};

export const midtransWebhook = httpAction(async (ctx, req) => {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) {
    return new Response("MIDTRANS_SERVER_KEY not configured", { status: 500 });
  }

  let body: MidtransNotification;
  try {
    body = (await req.json()) as MidtransNotification;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const expected = await sha512Hex(
    `${body.order_id}${body.status_code}${body.gross_amount}${serverKey}`,
  );
  if (!constantTimeEqual(expected, body.signature_key ?? "")) {
    return new Response("Signature mismatch", { status: 401 });
  }

  // Map Midtrans transaction_status → our status enum.
  const statusMap: Record<string, "paid" | "pending" | "failed" | "expired"> = {
    capture: body.fraud_status === "challenge" ? "pending" : "paid",
    settlement: "paid",
    pending: "pending",
    deny: "failed",
    cancel: "failed",
    expire: "expired",
    failure: "failed",
  };
  const status = statusMap[body.transaction_status] ?? "pending";

  await ctx.runMutation(internal.features.payment.mutation.recordWebhookEvent, {
    provider: "midtrans",
    eventType: body.transaction_status,
    requestId: body.transaction_id,
    payload: body,
  });

  if (status === "paid") {
    await ctx.runMutation(internal.features.payment.mutation.markPaidByWebhook, {
      orderId: body.order_id,
      providerTransactionId: body.transaction_id,
    });
  } else if (status === "failed" || status === "expired") {
    await ctx.runMutation(internal.features.payment.mutation.markFailedByWebhook, {
      orderId: body.order_id,
      status,
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

// ─── DOKU webhook ─────────────────────────────────────────────────────────

/**
 * DOKU sends notifications as JSON POST with a `Signature` header. The
 * canonical string includes Client-Id / Request-Id / Request-Timestamp /
 * Request-Target / Digest(body) — same scheme as our outbound calls.
 *
 * Configure your `DOKU_NOTIFY_PATH` (default `/webhooks/doku`) in the
 * DOKU merchant dashboard so this handler receives both VA + e-wallet +
 * QRIS + checkout status updates on a single endpoint.
 */
export const dokuWebhook = httpAction(async (ctx, req) => {
  const clientId = process.env.DOKU_CLIENT_ID;
  const secret = process.env.DOKU_SECRET_KEY;
  if (!clientId || !secret) {
    return new Response("DOKU not configured", { status: 500 });
  }

  const requestId = req.headers.get("Request-Id") ?? "";
  const requestTimestamp = req.headers.get("Request-Timestamp") ?? "";
  const receivedSignature = req.headers.get("Signature") ?? "";
  const requestTarget =
    process.env.DOKU_NOTIFY_PATH ?? new URL(req.url).pathname;

  const rawBody = await req.text();

  const ok = await verifySignature(
    {
      clientId,
      requestId,
      requestTimestamp,
      requestTarget,
      body: rawBody,
      secret,
    },
    receivedSignature,
  );
  if (!ok) return new Response("Signature mismatch", { status: 401 });

  let body: DokuNotification;
  try {
    body = JSON.parse(rawBody) as DokuNotification;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  // Insert (or short-circuit if duplicate request_id).
  await ctx.runMutation(internal.features.payment.mutation.recordWebhookEvent, {
    provider: "doku",
    eventType: body.transaction?.status ?? "UNKNOWN",
    requestId: requestId || body.request_id,
    payload: body,
  });

  const statusMap: Record<string, "paid" | "pending" | "failed" | "expired"> = {
    SUCCESS: "paid",
    PENDING: "pending",
    FAILED: "failed",
    EXPIRED: "expired",
    REFUNDED: "failed", // surfaced as failed; full refund flow is a separate model
  };
  const next = statusMap[body.transaction?.status ?? ""] ?? "pending";
  const orderId = body.order?.invoice_number;
  if (!orderId) return new Response("Missing order.invoice_number", { status: 400 });

  if (next === "paid") {
    await ctx.runMutation(internal.features.payment.mutation.markPaidByWebhook, {
      orderId,
      providerTransactionId: body.transaction?.original_request_id ?? requestId,
    });
  } else if (next === "failed" || next === "expired") {
    await ctx.runMutation(internal.features.payment.mutation.markFailedByWebhook, {
      orderId,
      status: next,
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

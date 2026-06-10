// payment tables — shared across Midtrans / Doku / future providers.
// Provider-specific actions live in convex/features/payment/actions/<provider>.ts;
// the table shape stays provider-agnostic.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const paymentTables = {
  paymentOrders: defineTable({
    // Optional → guest checkout supported. Guest orders are readable by
    // anyone holding the (unguessable) orderId; owned orders stay owner-only.
    userId: v.optional(v.id("users")),
    // Guest buyer contact for orders without a userId.
    buyer: v.optional(
      v.object({
        name: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
      }),
    ),
    orderId: v.string(),
    amount: v.number(),
    currency: v.string(),
    provider: v.union(v.literal("midtrans"), v.literal("doku"), v.literal("stripe")),
    status: v.union(
      v.literal("pending"),
      // Buyer returned from hosted checkout and *claims* payment — NOT
      // verified. Only the signature-checked webhook may set "paid".
      v.literal("client_claimed"),
      v.literal("paid"),
      v.literal("failed"),
      v.literal("expired"),
      v.literal("refunded"),
    ),
    providerTransactionId: v.optional(v.string()),
    snapToken: v.optional(v.string()),
    // Doku-specific: hosted checkout URL or VA/QRIS instructions for direct.
    checkoutUrl: v.optional(v.string()),
    paymentChannel: v.optional(v.string()), // "VIRTUAL_ACCOUNT_BCA", "QRIS", "EMONEY_GOPAY", ...
    paymentInstructions: v.optional(v.any()), // { vaNumber?, qrString?, deeplink?, expiresAt? }
    metadata: v.optional(v.any()),
    createdAt: v.number(),
    paidAt: v.optional(v.number()),
    expiresAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_orderId", ["orderId"])
    .index("by_status_createdAt", ["status", "createdAt"]),

  paymentWebhookEvents: defineTable({
    provider: v.string(),
    eventType: v.string(),
    // Provider-supplied unique id for idempotency (e.g. Doku request_id,
    // Midtrans transaction_id). Indexed so duplicate webhooks short-circuit.
    requestId: v.optional(v.string()),
    payload: v.any(),
    receivedAt: v.number(),
    processed: v.boolean(),
  })
    .index("by_provider_received", ["provider", "receivedAt"])
    .index("by_provider_request", ["provider", "requestId"]),
};

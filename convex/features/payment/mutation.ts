import { internalMutation, mutation } from "../../_generated/server";
import { v } from "convex/values";
import { requireUser } from "../../_shared/auth";

export const recordPending = internalMutation({
  args: {
    userId: v.id("users"),
    orderId: v.string(),
    amount: v.number(),
    snapToken: v.string(),
  },
  handler: async (ctx, { userId, orderId, amount, snapToken }) => {
    return ctx.db.insert("paymentOrders", {
      userId,
      orderId,
      amount,
      currency: "IDR",
      provider: "midtrans",
      status: "pending",
      snapToken,
      createdAt: Date.now(),
    });
  },
});

export const recordWebhookEvent = internalMutation({
  args: {
    provider: v.string(),
    eventType: v.string(),
    requestId: v.optional(v.string()),
    payload: v.any(),
  },
  handler: async (ctx, args) => {
    // Idempotency short-circuit — DOKU retries failed deliveries with the
    // same request_id. Midtrans uses transaction_id similarly.
    if (args.requestId) {
      const existing = await ctx.db
        .query("paymentWebhookEvents")
        .withIndex("by_provider_request", (q) =>
          q.eq("provider", args.provider).eq("requestId", args.requestId),
        )
        .first();
      if (existing) return existing._id;
    }
    return ctx.db.insert("paymentWebhookEvents", {
      ...args,
      receivedAt: Date.now(),
      processed: false,
    });
  },
});

// ─── Doku-specific record helpers ─────────────────────────────────────────

export const recordDokuPending = internalMutation({
  args: {
    // Optional — guest checkout has no auth user; buyer carries the contact.
    userId: v.optional(v.id("users")),
    buyer: v.optional(
      v.object({
        name: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
      }),
    ),
    orderId: v.string(),
    amount: v.number(),
    paymentChannel: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Idempotent — if the order already exists (retry), patch instead of insert.
    const existing = await ctx.db
      .query("paymentOrders")
      .withIndex("by_orderId", (q) => q.eq("orderId", args.orderId))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        amount: args.amount,
        paymentChannel: args.paymentChannel,
      });
      return existing._id;
    }
    return ctx.db.insert("paymentOrders", {
      userId: args.userId,
      buyer: args.buyer,
      orderId: args.orderId,
      amount: args.amount,
      currency: "IDR",
      provider: "doku",
      status: "pending",
      paymentChannel: args.paymentChannel,
      createdAt: Date.now(),
    });
  },
});

export const attachDokuCheckout = internalMutation({
  args: {
    orderId: v.string(),
    checkoutUrl: v.string(),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("paymentOrders")
      .withIndex("by_orderId", (q) => q.eq("orderId", args.orderId))
      .unique();
    if (!order) throw new Error(`Order not found: ${args.orderId}`);
    await ctx.db.patch(order._id, {
      checkoutUrl: args.checkoutUrl,
      expiresAt: args.expiresAt,
    });
  },
});

export const attachDokuDirect = internalMutation({
  args: {
    orderId: v.string(),
    paymentInstructions: v.any(),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("paymentOrders")
      .withIndex("by_orderId", (q) => q.eq("orderId", args.orderId))
      .unique();
    if (!order) throw new Error(`Order not found: ${args.orderId}`);
    await ctx.db.patch(order._id, {
      paymentInstructions: args.paymentInstructions,
      expiresAt: args.expiresAt,
    });
  },
});

export const markWebhookProcessed = internalMutation({
  args: { eventId: v.id("paymentWebhookEvents") },
  handler: async (ctx, { eventId }) => {
    await ctx.db.patch(eventId, { processed: true });
  },
});

// Client-callable "I just came back from the provider's hosted checkout, my
// order should be paid now" optimistic update. Webhook (markPaidByWebhook) is
// the ONLY path that may set "paid" — this records an unverified
// "client_claimed" instead, so a buyer can't flip their own order to paid
// from devtools with a fabricated transaction id.
//
// Gate: requireUser. Anonymous guest-checkout flows should not use this path
// (use the webhook to flip status server-side). If your app needs guest
// optimistic update, replace requireUser with an order.ownerToken check.
export const markPaid = mutation({
  args: { orderId: v.string(), providerTransactionId: v.string() },
  handler: async (ctx, { orderId, providerTransactionId }) => {
    const userId = await requireUser(ctx);
    const order = await ctx.db
      .query("paymentOrders")
      .withIndex("by_orderId", (q) => q.eq("orderId", orderId))
      .unique();
    if (!order) throw new Error(`Order not found: ${orderId}`);
    if (order.userId !== userId) throw new Error("Forbidden");
    if (order.status !== "pending") return; // idempotent; never downgrade
    await ctx.db.patch(order._id, {
      status: "client_claimed",
      providerTransactionId,
    });
  },
});

export const markPaidByWebhook = internalMutation({
  args: { orderId: v.string(), providerTransactionId: v.string() },
  handler: async (ctx, { orderId, providerTransactionId }) => {
    const order = await ctx.db
      .query("paymentOrders")
      .withIndex("by_orderId", (q) => q.eq("orderId", orderId))
      .unique();
    if (!order || order.status === "paid") return; // idempotent
    await ctx.db.patch(order._id, {
      status: "paid",
      providerTransactionId,
      paidAt: Date.now(),
    });
  },
});

export const markFailedByWebhook = internalMutation({
  args: {
    orderId: v.string(),
    status: v.union(v.literal("failed"), v.literal("expired")),
  },
  handler: async (ctx, { orderId, status }) => {
    const order = await ctx.db
      .query("paymentOrders")
      .withIndex("by_orderId", (q) => q.eq("orderId", orderId))
      .unique();
    if (!order) return;
    if (order.status === "paid") return; // don't downgrade paid
    await ctx.db.patch(order._id, { status });
  },
});

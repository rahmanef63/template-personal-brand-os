import { v } from "convex/values";
import { query } from "./_generated/server";
import { requireUser } from "./_shared/auth";

// Admin-only order list (read-only view). Joins each pbOrders row with
// its paymentOrders status so the dashboard shows payment state without a
// second client query. Buyer contact is PII — hence the auth gate.
export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    await requireUser(ctx);
    const orders = await ctx.db
      .query("pbOrders")
      .order("desc")
      .take(limit ?? 100);
    return Promise.all(
      orders.map(async (o) => {
        const payment = await ctx.db
          .query("paymentOrders")
          .withIndex("by_orderId", (q) => q.eq("orderId", o.orderId))
          .unique();
        return {
          id: o._id,
          orderId: o.orderId,
          buyer: o.buyer,
          items: o.items,
          totalLabel: o.totalLabel,
          status: o.status,
          ts: o.ts,
          paymentStatus: payment?.status ?? null,
          paidAt: payment?.paidAt ?? null,
        };
      }),
    );
  },
});

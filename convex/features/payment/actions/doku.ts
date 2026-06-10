"use node";

/**
 * DOKU payment actions — createCheckoutPayment (hosted page),
 * createDirectPayment (single channel, returns instructions),
 * getPaymentStatus (poll; webhook is the authoritative path).
 *
 * Create actions work for users AND guests (userId optional; guest
 * contact stored as `buyer`), are KEY-GUARDED (return {ok:false,notice}
 * when DOKU creds are unset — demo/fresh clones never crash), insert a
 * pending paymentOrders row before the DOKU call, and mark it failed
 * on API errors.
 */

import { action } from "../../../_generated/server";
import { internal } from "../../../_generated/api";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { CREDS_NOTICE, credsMissing, dokuFetch, DokuApiError } from "../doku/client";
import type {
  DokuChannel,
  DokuCheckoutRequest,
  DokuCheckoutResponse,
  DokuDirectRequest,
  DokuDirectResponse,
  DokuStatusResponse,
} from "../doku/types";
import {
  buildCustomer,
  buildOrder,
  customerArg,
  extractInstructions,
  itemsArg,
  routeForChannel,
} from "./doku_helpers";


// ─── Checkout (hosted) ───────────────────────────────────────────────────

export const createCheckoutPayment = action({
  args: {
    orderId: v.string(),
    amount: v.number(),
    customer: customerArg,
    callbackUrl: v.optional(v.string()),
    expiryMinutes: v.optional(v.number()),
    /** Restrict the hosted page to a subset of channels; omit = all. */
    paymentMethods: v.optional(v.array(v.string())),
    /** Free-form items for the receipt. */
    items: itemsArg,
  },
  handler: async (ctx, args) => {
    if (credsMissing()) return { ok: false as const, notice: CREDS_NOTICE };
    if (args.amount <= 0) throw new Error("Amount must be > 0");
    const userId = (await getAuthUserId(ctx)) ?? undefined;

    await ctx.runMutation(internal.features.payment.mutation.recordDokuPending, {
      userId,
      buyer: userId ? undefined : args.customer,
      orderId: args.orderId,
      amount: args.amount,
    });

    try {
      const payload = {
        order: buildOrder({
          invoiceNumber: args.orderId,
          amount: args.amount,
          callbackUrl: args.callbackUrl,
          expiryMinutes: args.expiryMinutes,
        }),
        customer: buildCustomer(args.customer),
        payment_method_types: args.paymentMethods,
        line_items: args.items,
      } as unknown as DokuCheckoutRequest;

      const res = await dokuFetch<DokuCheckoutResponse>({
        method: "POST",
        path: "/checkout/v1/payment",
        body: payload,
      });

      const expiresAt = res.payment?.expired_date
        ? Date.parse(res.payment.expired_date)
        : undefined;

      await ctx.runMutation(internal.features.payment.mutation.attachDokuCheckout, {
        orderId: args.orderId,
        checkoutUrl: res.payment.url,
        expiresAt,
      });

      return {
        ok: true as const,
        checkoutUrl: res.payment.url,
        token: res.payment.token,
        expiresAt,
      };
    } catch (err) {
      await ctx.runMutation(
        internal.features.payment.mutation.markFailedByWebhook,
        { orderId: args.orderId, status: "failed" },
      );
      if (err instanceof DokuApiError) {
        throw new Error(`DOKU checkout failed (${err.status}): ${err.message}`);
      }
      throw err;
    }
  },
});

// ─── Direct payment (single channel) ─────────────────────────────────────

export const createDirectPayment = action({
  args: {
    orderId: v.string(),
    amount: v.number(),
    channel: v.string(), // DokuChannel — kept as string for flexibility
    customer: customerArg,
    callbackUrl: v.optional(v.string()),
    expiryMinutes: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (credsMissing()) return { ok: false as const, notice: CREDS_NOTICE };
    if (args.amount <= 0) throw new Error("Amount must be > 0");
    const userId = (await getAuthUserId(ctx)) ?? undefined;

    await ctx.runMutation(internal.features.payment.mutation.recordDokuPending, {
      userId,
      buyer: userId ? undefined : args.customer,
      orderId: args.orderId,
      amount: args.amount,
      paymentChannel: args.channel,
    });

    try {
      const payload = {
        channel: args.channel as DokuChannel,
        order: buildOrder({
          invoiceNumber: args.orderId,
          amount: args.amount,
          callbackUrl: args.callbackUrl,
          expiryMinutes: args.expiryMinutes,
        }),
        customer: buildCustomer(args.customer),
      } as unknown as DokuDirectRequest;

      const res = await dokuFetch<DokuDirectResponse>({
        method: "POST",
        path: routeForChannel(args.channel),
        body: payload,
      });

      const instructions = extractInstructions(res);
      const expiresAt = res.expired_date ? Date.parse(res.expired_date) : undefined;

      await ctx.runMutation(internal.features.payment.mutation.attachDokuDirect, {
        orderId: args.orderId,
        paymentInstructions: instructions,
        expiresAt,
      });

      return { ok: true as const, instructions, expiresAt };
    } catch (err) {
      await ctx.runMutation(
        internal.features.payment.mutation.markFailedByWebhook,
        { orderId: args.orderId, status: "failed" },
      );
      if (err instanceof DokuApiError) {
        throw new Error(`DOKU direct failed (${err.status}): ${err.message}`);
      }
      throw err;
    }
  },
});

// ─── Status poll ─────────────────────────────────────────────────────────

export const getPaymentStatus = action({
  args: { orderId: v.string() },
  handler: async (_ctx, args) => {
    const res = await dokuFetch<DokuStatusResponse>({
      method: "GET",
      path: `/orders/v1/status/${encodeURIComponent(args.orderId)}`,
    });
    return {
      status: res.order.status,
      paidAt: res.transaction?.date ? Date.parse(res.transaction.date) : null,
      providerTxId: res.transaction?.id ?? null,
      channel: res.payment?.channel ?? null,
    };
  },
});

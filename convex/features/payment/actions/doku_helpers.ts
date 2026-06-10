// Pure helpers for DOKU action handlers. Split out of `doku.ts` (LOC cap).
//
// `buildOrder` / `buildCustomer` shape outbound API payloads.
// `routeForChannel` maps a DokuChannel string to the matching v1/v2 URL path.
// `extractInstructions` flattens the polymorphic Direct response payload.

import { v } from "convex/values";
import type { DokuDirectResponse } from "../doku/types";

// Reusable arg validators for the action signatures.
export const customerArg = v.object({
  name: v.string(),
  email: v.string(),
  phone: v.optional(v.string()),
});

export const itemsArg = v.optional(
  v.array(
    v.object({
      name: v.string(),
      quantity: v.number(),
      price: v.number(),
      sku: v.optional(v.string()),
    }),
  ),
);

export function buildOrder(args: {
  invoiceNumber: string;
  amount: number;
  callbackUrl?: string;
  expiryMinutes?: number;
}) {
  return {
    invoice_number: args.invoiceNumber,
    amount: args.amount,
    currency: "IDR",
    callback_url: args.callbackUrl,
    expiry_minutes: args.expiryMinutes ?? 60,
  };
}

export function buildCustomer(c: {
  name: string;
  email: string;
  phone?: string;
}) {
  return {
    name: c.name,
    email: c.email,
    phone: c.phone,
    country: "ID",
  };
}

export function routeForChannel(channel: string): string {
  // Sandbox + live share these paths; only host differs (in client.ts).
  if (channel.startsWith("VIRTUAL_ACCOUNT_")) {
    const map: Record<string, string> = {
      VIRTUAL_ACCOUNT_BCA: "/bca-virtual-account/v2/payment-code",
      VIRTUAL_ACCOUNT_BANK_MANDIRI: "/mandiri-virtual-account/v2/payment-code",
      VIRTUAL_ACCOUNT_BRI: "/bri-virtual-account/v2/payment-code",
      VIRTUAL_ACCOUNT_BNI: "/bni-virtual-account/v2/payment-code",
      VIRTUAL_ACCOUNT_BANK_CIMB: "/cimb-virtual-account/v2/payment-code",
      VIRTUAL_ACCOUNT_BANK_PERMATA: "/permata-virtual-account/v2/payment-code",
      VIRTUAL_ACCOUNT_BANK_DANAMON: "/danamon-virtual-account/v2/payment-code",
      VIRTUAL_ACCOUNT_BSI: "/bsi-virtual-account/v2/payment-code",
      VIRTUAL_ACCOUNT_DOKU: "/doku-virtual-account/v2/payment-code",
    };
    return map[channel] ?? "/doku-virtual-account/v2/payment-code";
  }
  if (channel === "QRIS") return "/qris/v1/payment-code";
  if (channel.startsWith("EMONEY_")) {
    const sub = channel.replace("EMONEY_", "").toLowerCase();
    return `/emoney/${sub}/v2/payment`;
  }
  if (channel === "CREDIT_CARD") return "/credit-card/v1/payment";
  if (channel.startsWith("ONLINE_TO_OFFLINE_")) {
    const sub = channel.replace("ONLINE_TO_OFFLINE_", "").toLowerCase();
    return `/${sub}/v1/payment`;
  }
  if (channel.startsWith("PEER_TO_PEER_")) {
    const sub = channel.replace("PEER_TO_PEER_", "").toLowerCase();
    return `/${sub}/v1/payment`;
  }
  // Fallback — Checkout route is safer than guessing.
  return "/checkout/v1/payment";
}

export function extractInstructions(res: DokuDirectResponse) {
  return {
    vaNumber: res.virtual_account_info?.virtual_account_number,
    howToPayUrl: res.virtual_account_info?.how_to_pay_page,
    qrString: res.qris_info?.qr_string,
    qrImageUrl: res.qris_info?.image_url,
    deeplink: res.ewallet_info?.deeplink_url,
    webUrl: res.ewallet_info?.web_url,
    paymentUrl: res.payment_url,
  };
}

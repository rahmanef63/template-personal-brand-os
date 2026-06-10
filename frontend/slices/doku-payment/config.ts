import { defineFeature } from "@/lib/shared/features/defineFeature";

/**
 * DOKU Payment feature config. Mirrors midtrans-payment shape so the
 * builder can swap providers without UI changes.
 */
export const dokuPaymentConfig = defineFeature({
  slug: "doku-payment",
  title: "DOKU — Indonesia Payment",
  category: "payment",
  routes: [
    { path: "/checkout", view: () => import("./components/checkout-page"), requiresAuth: true },
  ],
  nav: { label: "Checkout", group: "payment", order: 1 },
  peers: [{ slug: "convex-auth", range: "^0.1" }],
  providers: ["doku"],
});

/** Channels surfaced in the Direct picker. Editable as needed by consumers. */
export const dokuDefaultChannels = [
  "VIRTUAL_ACCOUNT_BCA",
  "VIRTUAL_ACCOUNT_BANK_MANDIRI",
  "QRIS",
  "EMONEY_GOPAY",
  "EMONEY_OVO",
  "EMONEY_DANA",
  "EMONEY_SHOPEEPAY",
] as const;

/**
 * DOKU channel registry — UI-facing labels, grouping, logos.
 *
 * IDs match the `channel` field DOKU API expects. Logos point to the
 * payment-network public CDN (CCSA-tier brand assets — same usage as
 * any e-commerce checkout). Drop your own asset in `/public/payments/`
 * if you want to self-host.
 */

export type ChannelGroup = "va" | "qris" | "ewallet" | "card" | "paylater" | "retail";

export interface PaymentChannel {
  id: string;
  label: string;
  group: ChannelGroup;
  /** Optional brand color for accents. */
  color?: string;
  /** Native instruction hint shown above the form. */
  hint?: string;
}

export const DOKU_CHANNELS: readonly PaymentChannel[] = [
  // ─── Virtual Account ───────────────────────────────────────────────
  { id: "VIRTUAL_ACCOUNT_BCA",           label: "BCA Virtual Account",      group: "va", color: "#0061a8", hint: "Bayar via m-BCA, KlikBCA, ATM BCA." },
  { id: "VIRTUAL_ACCOUNT_BANK_MANDIRI",  label: "Mandiri Virtual Account",  group: "va", color: "#003a70", hint: "Bayar via Livin, ATM Mandiri." },
  { id: "VIRTUAL_ACCOUNT_BRI",           label: "BRI Virtual Account",      group: "va", color: "#005baa", hint: "Bayar via BRImo, ATM BRI." },
  { id: "VIRTUAL_ACCOUNT_BNI",           label: "BNI Virtual Account",      group: "va", color: "#ee7400" },
  { id: "VIRTUAL_ACCOUNT_BANK_CIMB",     label: "CIMB Niaga VA",            group: "va" },
  { id: "VIRTUAL_ACCOUNT_BANK_PERMATA",  label: "Permata VA",               group: "va" },
  { id: "VIRTUAL_ACCOUNT_BANK_DANAMON",  label: "Danamon VA",               group: "va" },
  { id: "VIRTUAL_ACCOUNT_BSI",           label: "BSI Virtual Account",      group: "va" },
  { id: "VIRTUAL_ACCOUNT_DOKU",          label: "DOKU Virtual Account",     group: "va" },

  // ─── QRIS ──────────────────────────────────────────────────────────
  { id: "QRIS", label: "QRIS (semua aplikasi)", group: "qris", color: "#e2231a", hint: "Scan dengan GoPay / OVO / Dana / mobile-banking apa saja." },

  // ─── e-Wallet ──────────────────────────────────────────────────────
  { id: "EMONEY_GOPAY",     label: "GoPay",     group: "ewallet", color: "#00aed6" },
  { id: "EMONEY_OVO",       label: "OVO",       group: "ewallet", color: "#4c2a86" },
  { id: "EMONEY_DANA",      label: "DANA",      group: "ewallet", color: "#118eea" },
  { id: "EMONEY_SHOPEEPAY", label: "ShopeePay", group: "ewallet", color: "#ee4d2d" },
  { id: "EMONEY_LINKAJA",   label: "LinkAja",   group: "ewallet", color: "#e30613" },

  // ─── Credit Card ───────────────────────────────────────────────────
  { id: "CREDIT_CARD", label: "Kartu Kredit / Debit", group: "card" },

  // ─── PayLater ──────────────────────────────────────────────────────
  { id: "PEER_TO_PEER_KREDIVO", label: "Kredivo PayLater", group: "paylater" },
  { id: "PEER_TO_PEER_AKULAKU", label: "Akulaku PayLater", group: "paylater" },
  { id: "PEER_TO_PEER_BCA",     label: "BCA PayLater",     group: "paylater" },

  // ─── Retail ────────────────────────────────────────────────────────
  { id: "ONLINE_TO_OFFLINE_ALFA",      label: "Alfamart / Alfamidi", group: "retail" },
  { id: "ONLINE_TO_OFFLINE_INDOMARET", label: "Indomaret",           group: "retail" },
] as const;

export const CHANNEL_BY_ID: ReadonlyMap<string, PaymentChannel> = new Map(
  DOKU_CHANNELS.map((c) => [c.id, c]),
);

export const GROUP_LABELS: Record<ChannelGroup, string> = {
  va: "Virtual Account",
  qris: "QRIS",
  ewallet: "E-Wallet",
  card: "Kartu",
  paylater: "PayLater",
  retail: "Minimarket",
};

/**
 * DOKU API request/response types — minimal shapes we use, not exhaustive.
 *
 * Reference (verify against your merchant docs on first integration):
 *   - Checkout API:    POST /checkout/v1/payment
 *   - Direct VA:       POST /bca-virtual-account/v2/payment-code (per-bank URL varies)
 *   - Direct QRIS:     POST /qris/v1/payment-code
 *   - Direct e-Wallet: POST /emoney/<provider>/v1/payment
 *   - Status check:    GET  /orders/v1/status/{invoice-number}
 *
 * All amounts in IDR are whole rupiah (no decimals). Currency hardcoded
 * "IDR" — DOKU also supports USD in Snap, not modeled here.
 */

export type DokuChannel =
  | "VIRTUAL_ACCOUNT_BCA"
  | "VIRTUAL_ACCOUNT_BANK_MANDIRI"
  | "VIRTUAL_ACCOUNT_BRI"
  | "VIRTUAL_ACCOUNT_BNI"
  | "VIRTUAL_ACCOUNT_BANK_CIMB"
  | "VIRTUAL_ACCOUNT_BANK_PERMATA"
  | "VIRTUAL_ACCOUNT_BANK_DANAMON"
  | "VIRTUAL_ACCOUNT_BSI"
  | "VIRTUAL_ACCOUNT_DOKU"
  | "QRIS"
  | "EMONEY_OVO"
  | "EMONEY_DANA"
  | "EMONEY_LINKAJA"
  | "EMONEY_SHOPEEPAY"
  | "EMONEY_GOPAY"
  | "CREDIT_CARD"
  | "PEER_TO_PEER_BCA"
  | "ONLINE_TO_OFFLINE_ALFA"
  | "ONLINE_TO_OFFLINE_INDOMARET"
  | "PEER_TO_PEER_KREDIVO"
  | "PEER_TO_PEER_AKULAKU";

export interface DokuCustomer {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  country?: string; // ISO-3166 alpha-2; default ID
}

export interface DokuLineItem {
  name: string;
  quantity: number;
  /** Unit price in whole IDR. Required by DOKU. */
  price: number;
  sku?: string;
  category?: string;
}

export interface DokuOrder {
  /** Your unique order id. Used as DOKU invoice_number. Max ~64 chars. */
  invoiceNumber: string;
  /** Total amount in whole IDR. Must equal sum(lineItems.price * quantity). */
  amount: number;
  currency: "IDR";
  /** Defaults to 60 minutes if omitted. */
  expiryMinutes?: number;
  callbackUrl?: string; // success / pending redirect
  callbackUrlCancel?: string;
  lineItems?: DokuLineItem[];
}

// ─── Checkout (hosted page) ──────────────────────────────────────────────
export interface DokuCheckoutRequest {
  order: DokuOrder;
  customer: DokuCustomer;
  payment_method_types?: DokuChannel[]; // restrict channels; omit = all enabled
}

export interface DokuCheckoutResponse {
  order: { invoice_number: string; amount: number };
  payment: {
    token: string;
    url: string; // ← redirect target
    expired_date: string; // ISO
  };
  uuid?: string;
}

// ─── Direct payment ──────────────────────────────────────────────────────
export interface DokuDirectRequest {
  channel: DokuChannel;
  order: DokuOrder;
  customer: DokuCustomer;
  /** Channel-specific extras (e.g. successful_payment_url for QRIS). */
  extra?: Record<string, unknown>;
}

export interface DokuDirectResponse {
  order: { invoice_number: string; amount: number };
  virtual_account_info?: {
    virtual_account_number: string;
    how_to_pay_page?: string;
    how_to_pay_api?: string;
    created_date?: string;
    expired_date?: string;
  };
  qris_info?: {
    qr_string: string;
    image_url?: string;
    expired_date?: string;
  };
  ewallet_info?: {
    deeplink_url?: string;
    web_url?: string;
    expired_date?: string;
  };
  payment_url?: string; // PayLater / Minimarket
  expired_date?: string;
}

// ─── Status ──────────────────────────────────────────────────────────────
export type DokuPaymentStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "EXPIRED"
  | "REFUNDED";

export interface DokuStatusResponse {
  order: {
    invoice_number: string;
    amount: number;
    status: DokuPaymentStatus;
  };
  transaction?: {
    id: string;
    date: string;
    status: DokuPaymentStatus;
  };
  payment?: {
    channel: DokuChannel | string;
    paid_date?: string;
  };
}

// ─── Webhook (Notification) ──────────────────────────────────────────────
export interface DokuNotification {
  service: { id: string };
  order: { invoice_number: string; amount: string };
  transaction: {
    status: DokuPaymentStatus;
    date: string;
    original_request_id?: string;
  };
  channel: { id: DokuChannel | string };
  /** DOKU request id — use for idempotency. */
  request_id?: string;
  /** Sent in headers as well; mirrored here for convenience. */
  signature?: string;
}

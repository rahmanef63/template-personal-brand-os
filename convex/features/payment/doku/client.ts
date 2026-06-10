/**
 * DOKU REST client — fetch wrapper that signs every request.
 *
 * Use from Convex actions (NOT mutations — fetch needs node runtime).
 * Reads credentials from environment:
 *
 *   DOKU_CLIENT_ID         (required)  merchant Client-Id
 *   DOKU_SECRET_KEY        (required)  HMAC secret for signing
 *   DOKU_IS_PRODUCTION     (optional)  "true" → live host; default sandbox
 *
 * The base URL switches between sandbox + live; everything else is identical.
 */

import { makeRequestId, nowIso, signRequest } from "./signature";

const SANDBOX_BASE = "https://api-sandbox.doku.com";
const LIVE_BASE = "https://api.doku.com";

export interface DokuCredentials {
  clientId: string;
  secretKey: string;
  isProduction: boolean;
}

/** Consumer-facing notice returned by key-guarded actions when creds are unset. */
export const CREDS_NOTICE =
  "Pembayaran online belum aktif di situs ini (kredensial DOKU belum " +
  "dipasang). Set DOKU_CLIENT_ID + DOKU_SECRET_KEY via `npx convex env set`.";

/** True when DOKU env creds are absent — actions return {ok:false} instead of throwing. */
export function credsMissing(): boolean {
  return !process.env.DOKU_CLIENT_ID || !process.env.DOKU_SECRET_KEY;
}

export function readCredentials(): DokuCredentials {
  const clientId = process.env.DOKU_CLIENT_ID;
  const secretKey = process.env.DOKU_SECRET_KEY;
  if (!clientId || !secretKey) {
    throw new Error(
      "DOKU credentials missing. Set DOKU_CLIENT_ID + DOKU_SECRET_KEY via " +
        "`npx convex env set` (self-hosted) or your hosted Convex dashboard.",
    );
  }
  return {
    clientId,
    secretKey,
    isProduction: process.env.DOKU_IS_PRODUCTION === "true",
  };
}

export function baseUrl(creds: DokuCredentials): string {
  return creds.isProduction ? LIVE_BASE : SANDBOX_BASE;
}

interface DokuRequestOptions {
  method: "GET" | "POST";
  path: string; // e.g. "/checkout/v1/payment"
  body?: unknown;
  /** Override request id (e.g. for idempotent retries). */
  requestId?: string;
}

export class DokuApiError extends Error {
  readonly status: number;
  readonly responseBody: string;
  readonly requestId: string;
  constructor(message: string, status: number, body: string, requestId: string) {
    super(message);
    this.name = "DokuApiError";
    this.status = status;
    this.responseBody = body;
    this.requestId = requestId;
  }
}

export async function dokuFetch<T>(opts: DokuRequestOptions): Promise<T> {
  const creds = readCredentials();
  const requestId = opts.requestId ?? makeRequestId();
  const requestTimestamp = nowIso();
  const bodyString = opts.body ? JSON.stringify(opts.body) : "";

  const signature = await signRequest({
    clientId: creds.clientId,
    requestId,
    requestTimestamp,
    requestTarget: opts.path,
    body: bodyString,
    secret: creds.secretKey,
  });

  const url = baseUrl(creds) + opts.path;
  const res = await fetch(url, {
    method: opts.method,
    headers: {
      "Content-Type": "application/json",
      "Client-Id": creds.clientId,
      "Request-Id": requestId,
      "Request-Timestamp": requestTimestamp,
      Signature: signature,
    },
    body: opts.method === "POST" ? bodyString : undefined,
  });

  const text = await res.text();
  if (!res.ok) {
    throw new DokuApiError(
      `DOKU ${opts.method} ${opts.path} → ${res.status}`,
      res.status,
      text,
      requestId,
    );
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new DokuApiError(
      `DOKU returned non-JSON for ${opts.path}`,
      res.status,
      text,
      requestId,
    );
  }
}

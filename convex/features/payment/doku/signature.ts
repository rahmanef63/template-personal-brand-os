/**
 * DOKU signature helpers.
 *
 * Outbound (we → DOKU): header `Signature: HMACSHA256=<base64(digest)>` where
 *   digest = HMAC-SHA256(
 *     `Client-Id:{clientId}\n` +
 *     `Request-Id:{requestId}\n` +
 *     `Request-Timestamp:{ISO-8601}\n` +
 *     `Request-Target:{path+query}\n` +
 *     `Digest:{base64(sha256(body))}`,
 *     secret,
 *   )
 *
 * Inbound (DOKU → us, webhook): verify the `Signature` header using the
 *   same scheme but with `Request-Target` set to your notify path.
 *
 * Reference: https://sandbox.doku.com/integration/api/signature
 *           https://sandbox.doku.com/integration/api/notification
 *
 * Both sandbox + production use the same algorithm; only the host differs.
 */

import { constantTimeEqual } from "../../../_shared/crypto";

const enc = new TextEncoder();

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

function toBase64(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

async function sha256Base64(input: string): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", enc.encode(input));
  return toBase64(new Uint8Array(hash));
}

export interface SignParams {
  clientId: string;
  requestId: string;
  requestTimestamp: string; // ISO-8601 e.g. 2026-05-11T03:14:15Z
  requestTarget: string; // path including leading /, with query
  body: string; // raw JSON body or "" for GET
  secret: string;
}

/** Build the canonical string-to-sign for both sign + verify. */
async function canonicalString(p: SignParams): Promise<string> {
  const digest = p.body ? await sha256Base64(p.body) : "";
  const lines = [
    `Client-Id:${p.clientId}`,
    `Request-Id:${p.requestId}`,
    `Request-Timestamp:${p.requestTimestamp}`,
    `Request-Target:${p.requestTarget}`,
  ];
  if (digest) lines.push(`Digest:${digest}`);
  return lines.join("\n");
}

/** Returns `HMACSHA256=<base64>` ready for the `Signature` header. */
export async function signRequest(p: SignParams): Promise<string> {
  const key = await importHmacKey(p.secret);
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(await canonicalString(p)),
  );
  return `HMACSHA256=${toBase64(new Uint8Array(sig))}`;
}

/** Verify a `Signature` header sent by DOKU on a webhook. */
export async function verifySignature(
  p: SignParams,
  received: string | null | undefined,
): Promise<boolean> {
  if (!received) return false;
  const expected = await signRequest(p);
  return constantTimeEqual(expected, received);
}

/** Convenience: ISO-8601 timestamp DOKU expects. */
export function nowIso(): string {
  return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
}

/** Convenience: cryptographic-grade request id. */
export function makeRequestId(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return [...arr].map((b) => b.toString(16).padStart(2, "0")).join("");
}

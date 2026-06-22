import { ConvexError } from "convex/values";
import type { MutationCtx } from "../_generated/server";

/**
 * Minimal fixed-window rate limit for ANONYMOUS public mutations (no IP/identity
 * available, so callers key by email + a global bucket as a flood backstop).
 *
 * Atomic by construction: Convex mutations are serializable transactions, so the
 * read → patch below cannot race with a concurrent caller for the same key.
 * No external component/dependency.
 *
 * ponytail: per-key rows are reused in place (reset on window roll), so the table
 * grows by unique-key, not per-request. Add a cleanup cron if unique keys (emails)
 * grow large on a high-traffic clone.
 */
export async function enforceRateLimit(
  ctx: MutationCtx,
  key: string,
  limit: number,
  windowMs: number,
): Promise<void> {
  const now = Date.now();
  const row = await ctx.db
    .query("rateLimits")
    .withIndex("by_key", (q) => q.eq("key", key))
    .unique();
  if (!row) {
    await ctx.db.insert("rateLimits", { key, count: 1, windowStart: now });
    return;
  }
  if (now - row.windowStart >= windowMs) {
    await ctx.db.patch(row._id, { count: 1, windowStart: now });
    return;
  }
  if (row.count >= limit) {
    throw new ConvexError("Terlalu banyak permintaan. Coba lagi sebentar.");
  }
  await ctx.db.patch(row._id, { count: row.count + 1 });
}

// Common windows + a helper that applies a per-identity cap AND a global flood cap.
export const HOUR_MS = 60 * 60 * 1000;
export async function limitPublicWrite(
  ctx: MutationCtx,
  scope: string,
  identity: string,
): Promise<void> {
  await enforceRateLimit(ctx, `${scope}:${identity.toLowerCase()}`, 5, HOUR_MS);
  await enforceRateLimit(ctx, `${scope}:__global__`, 120, HOUR_MS);
}

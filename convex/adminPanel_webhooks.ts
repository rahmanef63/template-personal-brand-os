import { v, ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { logAudit } from "./adminPanel_auditLog";

// Admin-panel "Webhooks" block — real persistence of endpoints + deliveries.
// Mirrors convex/settings.ts auth-guard (getAuthUserId -> throw ConvexError if
// not signed in). Tables are keyed by a stable frontend string id (whId/dlId)
// so the binding's `id: string` contract holds.
//
// ponytail: there is no real HTTP delivery. `fire` persists a SIMULATED
// delivery row (same status physics as the in-memory demo) rather than POSTing
// to the endpoint URL. A future canonical slice would add a Convex action +
// scheduled retry-with-backoff.

const EVENT_NAMES = [
  "user.invited",
  "user.revoked",
  "page.published",
  "page.unpublished",
  "post.created",
  "post.published",
  "workflow.completed",
  "payment.succeeded",
] as const;

// Demo physics for the synthetic delivery (mirrors bindings.tsx
// rollDeliveryStatus): 70% delivered, 20% retry, 10% failed.
function rollDeliveryStatus(): {
  status: "delivered" | "failed" | "retry";
  httpCode: number;
  durationMs: number;
  attempt: number;
} {
  const r = Math.random();
  const durationMs = 60 + Math.floor(Math.random() * 160);
  if (r < 0.7) return { status: "delivered", httpCode: 200, durationMs, attempt: 0 };
  if (r < 0.9) return { status: "retry", httpCode: 502, durationMs: durationMs * 4, attempt: 1 };
  return { status: "failed", httpCode: 0, durationMs: 5000, attempt: 4 };
}

// Read persisted endpoints + deliveries. Empty tables resolve to empty arrays —
// the view's EmptyState then prompts "Add one to start delivering events."
export const get = query({
  args: {},
  handler: async (ctx) => {
    const endpointRows = await ctx.db.query("adminWebhooks").collect();
    const endpoints = endpointRows.map((e) => ({
      id: e.whId,
      url: e.url,
      description: e.description,
      events: e.events,
      status: e.status,
      secretTail: e.secretTail,
      lastDeliveryAt: e.lastDeliveryAt,
      failingRetries: e.failingRetries,
    }));

    const deliveryRows = await ctx.db.query("adminWebhookDeliveries").collect();
    // Newest first (the demo prepends).
    deliveryRows.sort((a, b) => b.at.localeCompare(a.at));
    const deliveries = deliveryRows.map((d) => ({
      id: d.dlId,
      endpointId: d.endpointId,
      event: d.event,
      at: d.at,
      httpCode: d.httpCode,
      status: d.status,
      durationMs: d.durationMs,
      attempt: d.attempt,
    }));

    return { endpoints, deliveries };
  },
});

async function findEndpoint(ctx: any, whId: string) {
  return await ctx.db
    .query("adminWebhooks")
    .withIndex("by_whId", (q: any) => q.eq("whId", whId))
    .first();
}

// Wire the inert "Add endpoint" button — insert a fresh active endpoint.
export const addEndpoint = mutation({
  args: { url: v.string(), events: v.array(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Harus login sebagai admin.");

    const whId = `wh_${Date.now().toString(36)}`;
    // ponytail: secretTail is a throwaway 4-char tag, not a real signing secret.
    const secretTail = Math.random().toString(36).slice(2, 6);
    await ctx.db.insert("adminWebhooks", {
      whId,
      url: args.url,
      description: args.url,
      events: args.events,
      status: "active",
      secretTail,
      lastDeliveryAt: null,
      failingRetries: 0,
    });
    await logAudit(ctx, {
      action: "create",
      entityType: "webhook",
      entityId: whId,
      entityLabel: args.url,
      severity: "info",
    });
    return whId;
  },
});

export const togglePause = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Harus login sebagai admin.");
    const row = await findEndpoint(ctx, args.id);
    if (!row) throw new ConvexError(`Unknown endpoint: ${args.id}`);
    await ctx.db.patch(row._id, {
      status: row.status === "paused" ? "active" : "paused",
    });
  },
});

export const remove = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Harus login sebagai admin.");
    const row = await findEndpoint(ctx, args.id);
    if (!row) return;
    await logAudit(ctx, {
      action: "delete",
      entityType: "webhook",
      entityId: row.whId,
      entityLabel: row.description || row.url,
      severity: "warn",
    });
    await ctx.db.delete(row._id);
  },
});

export const fire = mutation({
  args: { endpointId: v.string(), event: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Harus login sebagai admin.");
    const endpoint = await findEndpoint(ctx, args.endpointId);
    if (!endpoint) throw new ConvexError(`Unknown endpoint: ${args.endpointId}`);

    const event = (args.event as string | undefined) ?? "post.created";
    if (!EVENT_NAMES.includes(event as (typeof EVENT_NAMES)[number])) {
      throw new ConvexError(`Unknown event: ${event}`);
    }

    // ponytail: simulated success — no real HTTP delivery. Persist the row.
    const roll = rollDeliveryStatus();
    const at = new Date().toISOString();
    const dlId = `dl_live_${Date.now().toString(36)}`;
    await ctx.db.insert("adminWebhookDeliveries", {
      dlId,
      endpointId: args.endpointId,
      event,
      at,
      httpCode: roll.httpCode,
      status: roll.status,
      durationMs: roll.durationMs,
      attempt: roll.attempt,
    });

    // Bump endpoint's lastDeliveryAt + reset/accumulate failingRetries
    // (mirrors the in-memory demo's fire()).
    await ctx.db.patch(endpoint._id, {
      lastDeliveryAt: at,
      failingRetries:
        roll.status === "delivered"
          ? 0
          : endpoint.failingRetries + roll.attempt,
      status: roll.status === "failed" ? "failing" : endpoint.status,
    });

    return dlId;
  },
});

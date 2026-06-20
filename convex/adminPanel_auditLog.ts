import { v, ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Admin-panel "Audit log" block — REAL persistence of admin activity. Rows are
// appended by logAudit() (called from the other admin mutations) and surfaced
// here as AuditEventRow[]. Mirrors convex/settings.ts auth-guard (getAuthUserId
// -> throw ConvexError if not signed in).
//
// The actor on each event is the signed-in admin, resolved the same way
// convex/users.ts:currentUser does (earliest account = owner, else "admin").

type AuditAction =
  | "create" | "update" | "delete" | "publish" | "unpublish"
  | "invite" | "revoke" | "login" | "logout" | "export";
type AuditEntityType =
  | "page" | "user" | "role" | "webhook" | "setting" | "post" | "workflow" | "session";
type AuditSeverity = "info" | "warn" | "alert";

function initials(nameOrEmail: string): string {
  const base = nameOrEmail.split("@")[0].replace(/[._-]+/g, " ").trim();
  const parts = base.split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] ?? "?").concat(parts[1]?.[0] ?? "").toUpperCase();
}

/** Shared append helper — call from any admin mutation AFTER its own auth guard
 *  to record what the signed-in admin just did. Resolves the actor from the
 *  auth identity (earliest account = "owner", everyone else = "admin"). No-op
 *  when signed out (the caller already guards, this is belt-and-suspenders). */
export async function logAudit(
  ctx: MutationCtx,
  event: {
    action: AuditAction;
    entityType: AuditEntityType;
    entityId: string;
    entityLabel: string;
    severity?: AuditSeverity;
    diffSummary?: string;
  },
): Promise<void> {
  const userId = await getAuthUserId(ctx);
  if (!userId) return;
  const me = await ctx.db.get(userId);
  const first = await ctx.db.query("users").order("asc").first();
  const name =
    (me?.name as string | undefined) || (me?.email as string | undefined) || "Admin";
  const role = first?._id === userId ? ("owner" as const) : ("admin" as const);

  await ctx.db.insert("adminAuditEvents", {
    evId: `ev_live_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    at: new Date().toISOString(),
    actorId: userId as string,
    actorName: name,
    actorInitials: initials(name),
    actorRole: role,
    action: event.action,
    entityType: event.entityType,
    entityId: event.entityId,
    entityLabel: event.entityLabel,
    severity: event.severity ?? "info",
    diffSummary: event.diffSummary,
  });
}

// Read recent events as AuditEventRow[] (exact frontend binding shape). Newest
// first. Admin-only — returns [] when signed out (mirrors users.ts join reads).
export const get = query({
  args: {},
  handler: async (ctx) => {
    const me = await getAuthUserId(ctx);
    if (!me) return [];

    const rows = await ctx.db
      .query("adminAuditEvents")
      .withIndex("by_at")
      .order("desc")
      .take(200);

    return rows.map((r) => ({
      id: r.evId,
      at: r.at,
      actor: {
        id: r.actorId,
        name: r.actorName,
        initials: r.actorInitials,
        role: r.actorRole,
      },
      action: r.action,
      entityType: r.entityType,
      entityId: r.entityId,
      entityLabel: r.entityLabel,
      severity: r.severity,
      diffSummary: r.diffSummary,
    }));
  },
});

// Append an event directly (the binding's optional logEvent op). Admin-only.
// The view never calls this today, but it satisfies the AuditLogBindings
// contract for consumers that want to log a manual event.
export const logEvent = mutation({
  args: {
    action: v.string(),
    entityType: v.string(),
    entityId: v.string(),
    entityLabel: v.string(),
    severity: v.optional(v.string()),
    diffSummary: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Harus login sebagai admin.");
    await logAudit(ctx, {
      action: args.action as AuditAction,
      entityType: args.entityType as AuditEntityType,
      entityId: args.entityId,
      entityLabel: args.entityLabel,
      severity: args.severity as AuditSeverity | undefined,
      diffSummary: args.diffSummary,
    });
  },
});

// Clear the log — deletes every event. Admin-only. Gives the read-mostly block
// a real write op (the view's "Clear log" control).
export const clear = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Harus login sebagai admin.");
    const rows = await ctx.db.query("adminAuditEvents").collect();
    for (const row of rows) await ctx.db.delete(row._id);
  },
});

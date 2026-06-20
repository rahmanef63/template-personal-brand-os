import { v, ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { logAudit } from "./adminPanel_auditLog";

// Admin-panel "Users" block — real persistence. Joins the @convex-dev/auth
// `users` table (untouched) with the adminRoles mapping table. Mirrors
// convex/users.ts:listAdmins for the user join + convex/settings.ts for the
// auth-guarded upsert/delete pattern.
//
// Role resolution: the earliest account (lowest _creationTime) is always the
// owner. Any other user's role comes from their adminRoles row, defaulting to
// "viewer" when none exists. changeRole upserts the row; revoke deletes it.

const ROLE = v.union(
  v.literal("owner"),
  v.literal("admin"),
  v.literal("editor"),
  v.literal("viewer"),
);

function initials(nameOrEmail: string): string {
  const base = nameOrEmail.split("@")[0].replace(/[._-]+/g, " ").trim();
  const parts = base.split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] ?? "?").concat(parts[1]?.[0] ?? "").toUpperCase();
}

// Read all users as UserRow[] (exact frontend UsersBindings.users shape).
// Admin-only — returns [] when signed out (mirrors users.ts:listAdmins).
export const get = query({
  args: {},
  handler: async (ctx) => {
    const me = await getAuthUserId(ctx);
    if (!me) return [];

    const users = await ctx.db.query("users").order("asc").collect();
    const roleRows = await ctx.db.query("adminRoles").collect();
    const roleByUser = new Map(roleRows.map((r) => [r.userId, r.role]));

    return users.map((u, i) => {
      const name = (u.name as string | undefined) || (u.email as string | undefined) || "Admin";
      const email = (u.email as string | undefined) ?? "";
      // Earliest account is the immutable owner; others use their stored role
      // (default "viewer"). The owner row is never written to adminRoles.
      const role = i === 0 ? ("owner" as const) : roleByUser.get(u._id) ?? ("viewer" as const);
      return {
        id: u._id as string,
        name,
        email,
        initials: initials(name),
        role,
        // ponytail: @convex-dev/auth users carry no status / activity columns —
        // surface everyone as active and use account creation as lastActive.
        status: "active" as const,
        lastActive: new Date(u._creationTime).toISOString(),
      };
    });
  },
});

// Upsert a user's role mapping. Admin-only. The owner (earliest account) can't
// be re-roled — its role is derived, not stored.
export const changeRole = mutation({
  args: { id: v.id("users"), role: ROLE },
  handler: async (ctx, args) => {
    const me = await getAuthUserId(ctx);
    if (!me) throw new ConvexError("Harus login sebagai admin.");

    const first = await ctx.db.query("users").order("asc").first();
    if (first?._id === args.id) return; // owner role is immutable / derived

    const target = await ctx.db.get(args.id);
    const targetLabel =
      (target?.name as string | undefined) ||
      (target?.email as string | undefined) ||
      (args.id as string);
    await logAudit(ctx, {
      action: "update",
      entityType: "role",
      entityId: args.id as string,
      entityLabel: targetLabel,
      severity: "warn",
      diffSummary: `role → ${args.role}`,
    });

    const existing = await ctx.db
      .query("adminRoles")
      .withIndex("by_userId", (q) => q.eq("userId", args.id))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { role: args.role });
      return existing._id;
    }
    return ctx.db.insert("adminRoles", { userId: args.id, role: args.role });
  },
});

// Revoke a user's elevated role — drops their adminRoles mapping so they fall
// back to the default ("viewer"). Admin-only.
// ponytail: cannot delete @convex-dev/auth users from the admin panel; revoke
// only removes the role mapping, the auth account itself stays.
export const revoke = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const me = await getAuthUserId(ctx);
    if (!me) throw new ConvexError("Harus login sebagai admin.");

    const target = await ctx.db.get(args.id);
    const targetLabel =
      (target?.name as string | undefined) ||
      (target?.email as string | undefined) ||
      (args.id as string);
    await logAudit(ctx, {
      action: "revoke",
      entityType: "user",
      entityId: args.id as string,
      entityLabel: targetLabel,
      severity: "alert",
    });

    const existing = await ctx.db
      .query("adminRoles")
      .withIndex("by_userId", (q) => q.eq("userId", args.id))
      .first();
    if (existing) await ctx.db.delete(existing._id);
  },
});

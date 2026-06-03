import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Roles are DERIVED, not stored — keeps the @convex-dev/auth `users` table
// untouched (no migration risk). The earliest account (lowest _creationTime) is
// the owner; any later admin (invited via ADMIN_SIGNUP_KEY) is an editor.
function initials(nameOrEmail: string): string {
  const base = nameOrEmail.split("@")[0].replace(/[._-]+/g, " ").trim();
  const parts = base.split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] ?? "?").concat(parts[1]?.[0] ?? "").toUpperCase();
}

// The signed-in admin (or null). Used by the dashboard / nav-user dropdown.
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const me = await ctx.db.get(userId);
    if (!me) return null;
    const first = await ctx.db.query("users").order("asc").first();
    const isOwner = first?._id === me._id;
    const label = (me.name as string | undefined) || (me.email as string | undefined) || "Admin";
    return {
      _id: me._id,
      name: (me.name as string | undefined) ?? null,
      email: (me.email as string | undefined) ?? null,
      role: isOwner ? ("owner" as const) : ("editor" as const),
      initials: initials(label),
    };
  },
});

// All admins with their derived role. Admin-only (returns [] when signed out).
export const listAdmins = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const users = await ctx.db.query("users").order("asc").collect();
    return users.map((u, i) => {
      const label = (u.name as string | undefined) || (u.email as string | undefined) || "Admin";
      return {
        _id: u._id,
        name: (u.name as string | undefined) ?? null,
        email: (u.email as string | undefined) ?? null,
        role: i === 0 ? ("owner" as const) : ("editor" as const),
        initials: initials(label),
      };
    });
  },
});

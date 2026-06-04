import { query } from "../../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

/** Load a notion doc by slug. Admin-only — Notes/Database live in the
 *  dashboard; unauthenticated callers get null (host falls back to seed). */
export const get = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db
      .query("notion_docs")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
  },
});

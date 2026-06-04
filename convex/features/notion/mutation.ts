import { mutation } from "../../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

/** Upsert a notion doc (whole-document save, debounced by the host). */
export const save = mutation({
  args: {
    slug: v.string(),
    kind: v.union(v.literal("page"), v.literal("database")),
    data: v.any(),
  },
  handler: async (ctx, { slug, kind, data }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const existing = await ctx.db
      .query("notion_docs")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { kind, data, updatedAt: Date.now() });
      return existing._id;
    }
    return await ctx.db.insert("notion_docs", { slug, kind, data, updatedAt: Date.now() });
  },
});

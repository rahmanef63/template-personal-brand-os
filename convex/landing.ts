import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Landing sections stored as blobs keyed by the frontend string id.
export const list = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("landingSections").take(200);
    return rows.map((r) => r.data);
  },
});

export const upsert = mutation({
  args: { sectionId: v.string(), data: v.any() },
  handler: async (ctx, { sectionId, data }) => {
    const existing = await ctx.db
      .query("landingSections")
      .withIndex("by_sectionId", (q) => q.eq("sectionId", sectionId))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { data });
      return existing._id;
    }
    return await ctx.db.insert("landingSections", { sectionId, data });
  },
});

export const remove = mutation({
  args: { sectionId: v.string() },
  handler: async (ctx, { sectionId }) => {
    const existing = await ctx.db
      .query("landingSections")
      .withIndex("by_sectionId", (q) => q.eq("sectionId", sectionId))
      .unique();
    if (existing) await ctx.db.delete(existing._id);
  },
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Page-builder entries stored as blobs keyed by the frontend string id.
export const list = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("pages").take(500);
    return rows.map((r) => r.data);
  },
});

export const bySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const row = await ctx.db
      .query("pages")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    return row?.data ?? null;
  },
});

export const upsert = mutation({
  args: { entryId: v.string(), slug: v.string(), data: v.any() },
  handler: async (ctx, { entryId, slug, data }) => {
    const existing = await ctx.db
      .query("pages")
      .withIndex("by_entryId", (q) => q.eq("entryId", entryId))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { slug, data });
      return existing._id;
    }
    return await ctx.db.insert("pages", { entryId, slug, data });
  },
});

export const remove = mutation({
  args: { entryId: v.string() },
  handler: async (ctx, { entryId }) => {
    const existing = await ctx.db
      .query("pages")
      .withIndex("by_entryId", (q) => q.eq("entryId", entryId))
      .unique();
    if (existing) await ctx.db.delete(existing._id);
  },
});

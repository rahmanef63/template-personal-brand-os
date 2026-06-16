import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./_shared/auth";

export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    return await ctx.db
      .query("portfolio")
      .withIndex("by_publishedAt")
      .order("desc")
      .take(limit ?? 50);
  },
});

export const bySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("portfolio")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
  },
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("portfolio")),
    slug: v.string(),
    title: v.string(),
    category: v.string(),
    cover: v.string(),
    blurb: v.string(),
    problem: v.string(),
    approach: v.string(),
    result: v.string(),
    publishedAt: v.number(),
  },
  handler: async (ctx, { id, ...data }) => {
    await requireUser(ctx);
    if (id) {
      await ctx.db.patch(id, data);
      return id;
    }
    return await ctx.db.insert("portfolio", data);
  },
});

export const remove = mutation({
  args: { id: v.id("portfolio") },
  handler: async (ctx, { id }) => {
    await requireUser(ctx);
    await ctx.db.delete(id);
  },
});

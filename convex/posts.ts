import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./_shared/auth";

export const listPublished = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_status_publishedAt", (q) => q.eq("status", "published"))
      .order("desc")
      .take(limit ?? 50);
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("posts").order("desc").take(200);
  },
});

export const bySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
  },
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("posts")),
    slug: v.string(),
    title: v.string(),
    excerpt: v.string(),
    body: v.string(),
    cover: v.string(),
    tag: v.string(),
    author: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("scheduled"),
      v.literal("published"),
    ),
    publishedAt: v.number(),
    readMin: v.number(),
  },
  handler: async (ctx, { id, ...data }) => {
    await requireUser(ctx);
    if (id) {
      await ctx.db.patch(id, data);
      return id;
    }
    return await ctx.db.insert("posts", { ...data, views: 0 });
  },
});

export const remove = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, { id }) => {
    await requireUser(ctx);
    await ctx.db.delete(id);
  },
});

export const incrementView = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, { id }) => {
    const p = await ctx.db.get(id);
    if (p) await ctx.db.patch(id, { views: p.views + 1 });
  },
});

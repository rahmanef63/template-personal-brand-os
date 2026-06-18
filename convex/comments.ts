import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { optionalUser, requireUser } from "./_shared/auth";

export const listForPost = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    if (!(await optionalUser(ctx))) return [];
    return await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", postId))
      .order("asc")
      .take(200);
  },
});

export const listByStatus = query({
  args: {
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("spam"),
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { status, limit }) => {
    if (!(await optionalUser(ctx))) return [];
    return await ctx.db
      .query("comments")
      .withIndex("by_status_ts", (q) => q.eq("status", status))
      .order("desc")
      .take(limit ?? 100);
  },
});

export const create = mutation({
  args: {
    postId: v.id("posts"),
    postTitle: v.string(),
    author: v.string(),
    email: v.string(),
    body: v.string(),
    aiFlag: v.optional(v.union(v.literal("spam"), v.literal("toxic"), v.null())),
  },
  handler: async (ctx, args) => {
    const flagged = args.aiFlag === "spam" || args.aiFlag === "toxic";
    return await ctx.db.insert("comments", {
      ...args,
      status: flagged ? "pending" : "approved",
      ts: Date.now(),
    });
  },
});

export const moderate = mutation({
  args: {
    id: v.id("comments"),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("spam"),
    ),
  },
  handler: async (ctx, { id, status }) => {
    await requireUser(ctx);
    await ctx.db.patch(id, { status });
  },
});

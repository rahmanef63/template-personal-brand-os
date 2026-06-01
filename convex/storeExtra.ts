import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Extra functions the store adapter needs but the base entity modules lacked:
// a list-all for comments + admin upsert/remove for comments/subscribers/chat.

export const commentsListAll = query({
  args: {},
  handler: async (ctx) => ctx.db.query("comments").order("desc").take(500),
});

export const commentUpsert = mutation({
  args: {
    id: v.optional(v.id("comments")),
    postId: v.id("posts"),
    postTitle: v.string(),
    author: v.string(),
    email: v.string(),
    body: v.string(),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("spam")),
    aiFlag: v.optional(v.union(v.literal("spam"), v.literal("toxic"), v.null())),
    ts: v.number(),
  },
  handler: async (ctx, { id, ...data }) => {
    if (id) {
      await ctx.db.patch(id, data);
      return id;
    }
    return await ctx.db.insert("comments", data);
  },
});

export const commentRemove = mutation({
  args: { id: v.id("comments") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const subscriberUpsert = mutation({
  args: {
    id: v.optional(v.id("subscribers")),
    email: v.string(),
    status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("unsubscribed")),
    source: v.string(),
    ts: v.number(),
  },
  handler: async (ctx, { id, ...data }) => {
    if (id) {
      await ctx.db.patch(id, data);
      return id;
    }
    return await ctx.db.insert("subscribers", data);
  },
});

export const subscriberRemove = mutation({
  args: { id: v.id("subscribers") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const chatUpsertSession = mutation({
  args: {
    id: v.optional(v.id("chatSessions")),
    visitorId: v.string(),
    startedAt: v.number(),
    flagged: v.boolean(),
  },
  handler: async (ctx, { id, ...data }) => {
    if (id) {
      await ctx.db.patch(id, data);
      return id;
    }
    return await ctx.db.insert("chatSessions", data);
  },
});

export const chatRemoveSession = mutation({
  args: { id: v.id("chatSessions") },
  handler: async (ctx, { id }) => {
    for (const m of await ctx.db
      .query("chatMessages")
      .withIndex("by_session_ts", (q) => q.eq("sessionId", id))
      .collect()) {
      await ctx.db.delete(m._id);
    }
    await ctx.db.delete(id);
  },
});

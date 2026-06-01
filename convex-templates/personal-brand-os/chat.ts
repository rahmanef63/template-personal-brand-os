import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listSessions = query({
  args: {
    flagged: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { flagged, limit }) => {
    if (flagged !== undefined) {
      return await ctx.db
        .query("chatSessions")
        .withIndex("by_flagged_startedAt", (q) => q.eq("flagged", flagged))
        .order("desc")
        .take(limit ?? 100);
    }
    return await ctx.db.query("chatSessions").order("desc").take(limit ?? 100);
  },
});

export const messages = query({
  args: { sessionId: v.id("chatSessions") },
  handler: async (ctx, { sessionId }) => {
    return await ctx.db
      .query("chatMessages")
      .withIndex("by_session_ts", (q) => q.eq("sessionId", sessionId))
      .order("asc")
      .take(500);
  },
});

export const startSession = mutation({
  args: { visitorId: v.string() },
  handler: async (ctx, { visitorId }) => {
    return await ctx.db.insert("chatSessions", {
      visitorId,
      startedAt: Date.now(),
      flagged: false,
    });
  },
});

export const sendMessage = mutation({
  args: {
    sessionId: v.id("chatSessions"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    flag: v.optional(v.boolean()),
  },
  handler: async (ctx, { sessionId, role, content, flag }) => {
    await ctx.db.insert("chatMessages", {
      sessionId,
      role,
      content,
      ts: Date.now(),
    });
    if (flag) {
      await ctx.db.patch(sessionId, { flagged: true });
    }
  },
});

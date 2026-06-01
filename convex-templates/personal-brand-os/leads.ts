import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    status: v.optional(
      v.union(v.literal("new"), v.literal("contacted"), v.literal("closed")),
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { status, limit }) => {
    if (status) {
      return await ctx.db
        .query("leads")
        .withIndex("by_status_ts", (q) => q.eq("status", status))
        .order("desc")
        .take(limit ?? 100);
    }
    return await ctx.db.query("leads").order("desc").take(limit ?? 100);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    topic: v.string(),
    source: v.string(),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("leads", { ...args, ts: Date.now(), status: "new" });
  },
});

export const update = mutation({
  args: {
    id: v.id("leads"),
    status: v.optional(
      v.union(v.literal("new"), v.literal("contacted"), v.literal("closed")),
    ),
    topic: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...patch }) => {
    await ctx.db.patch(id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("leads") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

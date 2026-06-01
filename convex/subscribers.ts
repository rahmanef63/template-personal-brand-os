import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    return await ctx.db.query("subscribers").order("desc").take(limit ?? 200);
  },
});

export const subscribe = mutation({
  args: { email: v.string(), source: v.string() },
  handler: async (ctx, { email, source }) => {
    const existing = await ctx.db
      .query("subscribers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    if (existing) {
      if (existing.status === "unsubscribed") {
        await ctx.db.patch(existing._id, { status: "pending", ts: Date.now() });
      }
      return existing._id;
    }
    return await ctx.db.insert("subscribers", {
      email,
      source,
      status: "pending",
      ts: Date.now(),
    });
  },
});

export const confirm = mutation({
  args: { id: v.id("subscribers") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { status: "confirmed" });
  },
});

export const unsubscribe = mutation({
  args: { id: v.id("subscribers") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { status: "unsubscribed" });
  },
});

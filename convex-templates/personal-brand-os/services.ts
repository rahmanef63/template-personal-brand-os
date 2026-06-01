import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("services").take(100);
  },
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("services")),
    slug: v.string(),
    name: v.string(),
    description: v.string(),
    priceLabel: v.string(),
    period: v.string(),
    bullets: v.array(v.string()),
    featured: v.boolean(),
  },
  handler: async (ctx, { id, ...data }) => {
    if (id) {
      await ctx.db.patch(id, data);
      return id;
    }
    return await ctx.db.insert("services", data);
  },
});

export const remove = mutation({
  args: { id: v.id("services") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

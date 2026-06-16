import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./_shared/auth";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("resources").take(100);
  },
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("resources")),
    title: v.string(),
    description: v.string(),
    fileLabel: v.string(),
    gated: v.boolean(),
  },
  handler: async (ctx, { id, ...data }) => {
    await requireUser(ctx);
    if (id) {
      await ctx.db.patch(id, data);
      return id;
    }
    return await ctx.db.insert("resources", { ...data, downloads: 0 });
  },
});

export const remove = mutation({
  args: { id: v.id("resources") },
  handler: async (ctx, { id }) => {
    await requireUser(ctx);
    await ctx.db.delete(id);
  },
});

export const incrementDownload = mutation({
  args: { id: v.id("resources") },
  handler: async (ctx, { id }) => {
    const r = await ctx.db.get(id);
    if (r) await ctx.db.patch(id, { downloads: r.downloads + 1 });
  },
});

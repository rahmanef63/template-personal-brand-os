import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireUser } from "./_shared/auth";

// File upload to Convex storage. Admin uploads an image → we POST it to the
// upload URL → store returns a storageId → getUrl returns the served URL
// (on the deployment domain, *.convex.cloud — whitelisted in next.config.mjs).
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const getUrl = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    await requireUser(ctx);
    return await ctx.storage.getUrl(storageId);
  },
});

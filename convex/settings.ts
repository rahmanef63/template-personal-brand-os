import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Public read of site config — used by the public site (title/favicon/brand) and
// the admin Settings UI. Resolves storage ids to served URLs.
export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("siteSettings").first();
  },
});

const FIELDS = {
  siteName: v.optional(v.string()),
  tagline: v.optional(v.string()),
  ownerName: v.optional(v.string()),
  contactEmail: v.optional(v.string()),
  brandColor: v.optional(v.string()),
  themeDefault: v.optional(v.string()),
  // tweakcn preset name — site-wide color preset ("" = template default)
  themePreset: v.optional(v.string()),
  logoUrl: v.optional(v.string()),
  faviconUrl: v.optional(v.string()),
  socials: v.optional(v.string()),
  seoDescription: v.optional(v.string()),
  analyticsId: v.optional(v.string()),
  // About-page content (JSON string): { timeline: [{year,milestone}], mentions: [string] }
  aboutContent: v.optional(v.string()),
  // set true on the final wizard step so the wizard never shows again
  markOnboarded: v.optional(v.boolean()),
};

// Upsert the singleton settings row. Admin-only.
export const upsert = mutation({
  args: FIELDS,
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Harus login sebagai admin.");

    const { markOnboarded, ...fields } = args;
    // strip undefined so we only patch provided fields
    const patch: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(fields)) {
      if (val !== undefined) patch[k] = val;
    }
    if (markOnboarded) patch.onboardedAt = Date.now();

    const existing = await ctx.db.query("siteSettings").first();
    if (existing) {
      await ctx.db.patch(existing._id, patch);
      return existing._id;
    }
    return ctx.db.insert("siteSettings", patch);
  },
});

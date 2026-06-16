import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { notionTables } from "./features/notion/_schema";
import { paymentTables } from "./features/payment/_schema";

// Personal Brand OS — full schema (Convex Cloud target).
// authTables = @convex-dev/auth. Content tables mirror the localStorage shape
// the frontend store used, so the Convex-backed store adapter maps 1:1.
export default defineSchema({
  ...authTables,
  ...notionTables,
  ...paymentTables,

  posts: defineTable({
    slug: v.string(),
    title: v.string(),
    excerpt: v.string(),
    body: v.string(),
    cover: v.string(),
    tag: v.string(),
    author: v.string(),
    status: v.union(v.literal("draft"), v.literal("scheduled"), v.literal("published")),
    publishedAt: v.number(),
    views: v.number(),
    readMin: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_status_publishedAt", ["status", "publishedAt"]),

  portfolio: defineTable({
    slug: v.string(),
    title: v.string(),
    category: v.string(),
    cover: v.string(),
    blurb: v.string(),
    problem: v.string(),
    approach: v.string(),
    result: v.string(),
    publishedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_publishedAt", ["publishedAt"]),

  services: defineTable({
    slug: v.string(),
    name: v.string(),
    description: v.string(),
    priceLabel: v.string(),
    period: v.string(),
    bullets: v.array(v.string()),
    featured: v.boolean(),
    // Commerce (additive): priceNumber = fixed IDR. Services without it are
    // retainer/quote (book-only) and can't be added to the cart.
    priceNumber: v.optional(v.number()),
  }).index("by_slug", ["slug"]),

  // Guest checkout orders (storefront-checkout + doku-payment). orderId is
  // the unguessable capability token for /order/[id]; joins paymentOrders.
  pbOrders: defineTable({
    orderId: v.string(),
    buyer: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.optional(v.string()),
    }),
    items: v.array(
      v.object({
        slug: v.string(),
        name: v.string(),
        qty: v.number(),
        price: v.number(),
        priceLabel: v.string(),
      }),
    ),
    totalLabel: v.string(),
    status: v.string(),
    ts: v.number(),
  }).index("by_orderId", ["orderId"]),

  resources: defineTable({
    title: v.string(),
    description: v.string(),
    fileLabel: v.string(),
    gated: v.boolean(),
    downloads: v.number(),
  }),

  leads: defineTable({
    name: v.string(),
    email: v.string(),
    topic: v.string(),
    source: v.string(),
    message: v.optional(v.string()),
    ts: v.number(),
    status: v.union(v.literal("new"), v.literal("contacted"), v.literal("closed")),
  })
    .index("by_status_ts", ["status", "ts"])
    .index("by_email", ["email"]),

  comments: defineTable({
    postId: v.id("posts"),
    postTitle: v.string(),
    author: v.string(),
    email: v.string(),
    body: v.string(),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("spam")),
    aiFlag: v.optional(v.union(v.literal("spam"), v.literal("toxic"), v.null())),
    ts: v.number(),
  })
    .index("by_post", ["postId", "ts"])
    .index("by_status_ts", ["status", "ts"]),

  subscribers: defineTable({
    email: v.string(),
    status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("unsubscribed")),
    source: v.string(),
    ts: v.number(),
  }).index("by_email", ["email"]),

  chatSessions: defineTable({
    visitorId: v.string(),
    startedAt: v.number(),
    flagged: v.boolean(),
  })
    .index("by_visitor", ["visitorId"])
    .index("by_flagged_startedAt", ["flagged", "startedAt"]),

  chatMessages: defineTable({
    sessionId: v.id("chatSessions"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    ts: v.number(),
  }).index("by_session_ts", ["sessionId", "ts"]),

  // Page-builder + landing: complex nested structures stored as blobs keyed by
  // the frontend's string id (PageEntry.id / LandingSection.id).
  pages: defineTable({
    entryId: v.string(),
    slug: v.string(),
    data: v.any(),
  })
    .index("by_entryId", ["entryId"])
    .index("by_slug", ["slug"]),

  landingSections: defineTable({
    sectionId: v.string(),
    data: v.any(),
  }).index("by_sectionId", ["sectionId"]),

  // Singleton site config — everything the owner sets via the onboarding wizard
  // and admin Settings. One row. Favicon/logo are Convex storage ids.
  siteSettings: defineTable({
    siteName: v.optional(v.string()),
    tagline: v.optional(v.string()),
    ownerName: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    brandColor: v.optional(v.string()),
    themeDefault: v.optional(v.string()), // "light" | "dark" | "system"
    themePreset: v.optional(v.string()), // tweakcn preset name (site-wide default)
    logoUrl: v.optional(v.string()),
    faviconUrl: v.optional(v.string()),
    socials: v.optional(v.string()), // JSON string
    seoDescription: v.optional(v.string()),
    analyticsId: v.optional(v.string()),
    // About-page content (JSON string): { timeline: [{year,milestone}], mentions: [string] }
    aboutContent: v.optional(v.string()),
    onboardedAt: v.optional(v.number()),
  }),
});

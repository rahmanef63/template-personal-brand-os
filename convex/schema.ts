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

  // Fixed-window rate-limit counters for anonymous public mutations. Additive +
  // empty on deploy; rows reused in place per key. See convex/_shared/rateLimit.ts.
  rateLimits: defineTable({
    key: v.string(),
    count: v.number(),
    windowStart: v.number(),
  }).index("by_key", ["key"]),
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
    ownerRole: v.optional(v.string()),
    ownerInitials: v.optional(v.string()),
    profileImageUrl: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    contactAddress: v.optional(v.string()),
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

  // Admin-panel "AI config" block. Singleton row holding the active model +
  // sampling config (mirrors the AiConfig type). One row.
  adminAiConfig: defineTable({
    activeModelId: v.string(),
    systemPrompt: v.string(),
    temperature: v.number(),
    maxOutputTokens: v.number(),
  }),

  // Admin-panel "AI config" moderation rules. One row per rule, keyed by the
  // frontend's stable string id (ModerationRule.id).
  adminModerationRules: defineTable({
    ruleId: v.string(),
    label: v.string(),
    description: v.string(),
    enabled: v.boolean(),
    threshold: v.optional(v.number()),
  }).index("by_ruleId", ["ruleId"]),

  // Admin-panel "Settings" block — WORKSPACE settings (distinct from the
  // public siteSettings singleton). Identity = one row; integrations + apiKeys
  // = one row each keyed by their stable frontend string id.
  adminWorkspaceSettings: defineTable({
    name: v.string(),
    slug: v.string(),
    timezone: v.string(),
    language: v.string(),
    contactEmail: v.string(),
  }),

  adminIntegrations: defineTable({
    integrationId: v.string(),
    label: v.string(),
    category: v.union(
      v.literal("messaging"),
      v.literal("email"),
      v.literal("payments"),
      v.literal("deploy"),
      v.literal("vcs"),
    ),
    status: v.union(
      v.literal("connected"),
      v.literal("disconnected"),
      v.literal("error"),
    ),
    detail: v.string(),
    docsUrl: v.string(),
  }).index("by_integrationId", ["integrationId"]),

  adminApiKeys: defineTable({
    keyId: v.string(),
    label: v.string(),
    tail: v.string(),
    createdAt: v.string(),
    lastUsedAt: v.optional(v.string()),
    scope: v.union(v.literal("read"), v.literal("read-write"), v.literal("admin")),
  }).index("by_keyId", ["keyId"]),

  // Admin-panel "Webhooks" block — endpoints + deliveries (auth-guarded). Keyed
  // by a stable frontend string id (whId / dlId) so the binding's `id: string`
  // contract holds without leaking Convex _id into the view.
  adminWebhooks: defineTable({
    whId: v.string(),
    url: v.string(),
    description: v.string(),
    events: v.array(v.string()),
    status: v.union(
      v.literal("active"),
      v.literal("paused"),
      v.literal("failing"),
    ),
    secretTail: v.string(),
    lastDeliveryAt: v.union(v.string(), v.null()),
    failingRetries: v.number(),
  }).index("by_whId", ["whId"]),

  adminWebhookDeliveries: defineTable({
    dlId: v.string(),
    endpointId: v.string(), // the endpoint's whId
    event: v.string(),
    at: v.string(),
    httpCode: v.number(),
    status: v.union(
      v.literal("delivered"),
      v.literal("failed"),
      v.literal("pending"),
      v.literal("retry"),
    ),
    durationMs: v.number(),
    attempt: v.number(),
  }).index("by_endpointId", ["endpointId"]),

  // Admin-panel "Audit log" block — real admin-activity stream. Rows are
  // appended by the other admin mutations (users.changeRole/revoke,
  // webhooks.add/remove/fire, aiConfig.setConfig/reset, settings.setIdentity/
  // revokeKey) via the shared logAudit() helper. Keyed by a stable frontend
  // string id (evId) so the binding's `id: string` contract holds.
  adminAuditEvents: defineTable({
    evId: v.string(),
    at: v.string(), // ISO datetime
    actorId: v.string(),
    actorName: v.string(),
    actorInitials: v.string(),
    actorRole: v.union(
      v.literal("owner"),
      v.literal("admin"),
      v.literal("editor"),
      v.literal("viewer"),
      v.literal("system"),
    ),
    action: v.union(
      v.literal("create"),
      v.literal("update"),
      v.literal("delete"),
      v.literal("publish"),
      v.literal("unpublish"),
      v.literal("invite"),
      v.literal("revoke"),
      v.literal("login"),
      v.literal("logout"),
      v.literal("export"),
    ),
    entityType: v.union(
      v.literal("page"),
      v.literal("user"),
      v.literal("role"),
      v.literal("webhook"),
      v.literal("setting"),
      v.literal("post"),
      v.literal("workflow"),
      v.literal("session"),
    ),
    entityId: v.string(),
    entityLabel: v.string(),
    severity: v.union(v.literal("info"), v.literal("warn"), v.literal("alert")),
    diffSummary: v.optional(v.string()),
  }).index("by_at", ["at"]),

  // Admin-panel "Users" block — role mapping over the @convex-dev/auth `users`
  // table (which stays untouched). One row per user whose role has been changed
  // from the derived default. revoke = delete the row (user drops to default).
  adminRoles: defineTable({
    userId: v.id("users"),
    role: v.union(
      v.literal("owner"),
      v.literal("admin"),
      v.literal("editor"),
      v.literal("viewer"),
    ),
  }).index("by_userId", ["userId"]),
});

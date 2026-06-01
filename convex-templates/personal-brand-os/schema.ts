// Personal Brand OS — Convex schema.
// Drop into convex/ at the root of your Next.js project. Adjust if you already
// have a schema; merge tables into your existing `defineSchema({...})`.
//
// Tables mirror the localStorage shape used in the preview, so the same
// frontend slices wire up to Convex with minimal changes.

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
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
  }).index("by_slug", ["slug"]),

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
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("unsubscribed"),
    ),
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
});

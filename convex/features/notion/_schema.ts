import { defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * notion feature — whole-document persistence for the notion-shell page
 * editor ("page" kind) and the notion-database surface ("database" kind).
 *
 * Docs are single-owner admin tools (dashboard Notes / Database pages), so
 * we persist the full JSON blob per slug — no per-block rows, no merge
 * conflicts to resolve. `data` is the host state verbatim:
 *   kind "page"     → { icon, title, blocks, font, fullWidth, smallText, locked }
 *   kind "database" → { db, rows }
 */
export const notionTables = {
  notion_docs: defineTable({
    slug: v.string(),
    kind: v.union(v.literal("page"), v.literal("database")),
    data: v.any(),
    updatedAt: v.number(),
  }).index("by_slug", ["slug"]),
};

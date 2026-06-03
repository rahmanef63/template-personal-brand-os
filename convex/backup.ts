import { v, ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// One-click backup / restore for the owner. Exports a structured JSON snapshot
// of ALL content (NOT auth tables — never export credentials), which the owner
// downloads from the admin panel; restore wipes content and re-inserts from a
// snapshot. Data lives in Convex, so this is the owner's portable copy.

// Content tables only. Auth tables (users, authAccounts, authSessions, …) are
// deliberately excluded — secrets never leave the backend.
const CONTENT_TABLES = [
  "posts",
  "portfolio",
  "services",
  "resources",
  "leads",
  "comments",
  "subscribers",
  "chatSessions",
  "chatMessages",
  "pages",
  "landingSections",
  "siteSettings",
] as const;

const SNAPSHOT_VERSION = 1;

export const exportAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Harus login sebagai admin.");
    const tables: Record<string, unknown[]> = {};
    for (const t of CONTENT_TABLES) {
      tables[t] = await ctx.db.query(t).collect();
    }
    return { snapshotVersion: SNAPSHOT_VERSION, exportedAt: Date.now(), tables };
  },
});

// Strip Convex system fields so a doc can be re-inserted cleanly.
function clean<T extends Record<string, unknown>>(doc: T): Omit<T, "_id" | "_creationTime"> {
  const { _id, _creationTime, ...rest } = doc as Record<string, unknown>;
  void _id;
  void _creationTime;
  return rest as Omit<T, "_id" | "_creationTime">;
}

export const importAll = mutation({
  args: { snapshot: v.any() },
  handler: async (ctx, { snapshot }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Harus login sebagai admin.");
    const tables = (snapshot?.tables ?? {}) as Record<string, Array<Record<string, unknown>>>;

    // 1. Wipe existing content (replace semantics — the owner is restoring).
    for (const t of CONTENT_TABLES) {
      const existing = await ctx.db.query(t).collect();
      for (const row of existing) await ctx.db.delete(row._id);
    }

    let inserted = 0;
    // 2. Insert independent tables first; capture id remaps for FK tables.
    const postIdMap = new Map<string, unknown>(); // old posts._id -> new
    const sessionIdMap = new Map<string, unknown>(); // old chatSessions._id -> new

    for (const doc of tables.posts ?? []) {
      const oldId = doc._id as string;
      const newId = await ctx.db.insert("posts", clean(doc) as never);
      if (oldId) postIdMap.set(oldId, newId);
      inserted++;
    }
    for (const doc of tables.chatSessions ?? []) {
      const oldId = doc._id as string;
      const newId = await ctx.db.insert("chatSessions", clean(doc) as never);
      if (oldId) sessionIdMap.set(oldId, newId);
      inserted++;
    }

    // 3. Independent tables (no FK).
    for (const t of ["portfolio", "services", "resources", "leads", "subscribers", "pages", "landingSections", "siteSettings"] as const) {
      for (const doc of tables[t] ?? []) {
        await ctx.db.insert(t, clean(doc) as never);
        inserted++;
      }
    }

    // 4. FK tables — remap parent ids; drop orphans whose parent is missing.
    for (const doc of tables.comments ?? []) {
      const c = clean(doc) as Record<string, unknown>;
      const mapped = postIdMap.get(doc.postId as string);
      if (!mapped) continue;
      c.postId = mapped;
      await ctx.db.insert("comments", c as never);
      inserted++;
    }
    for (const doc of tables.chatMessages ?? []) {
      const m = clean(doc) as Record<string, unknown>;
      const mapped = sessionIdMap.get(doc.sessionId as string);
      if (!mapped) continue;
      m.sessionId = mapped;
      await ctx.db.insert("chatMessages", m as never);
      inserted++;
    }

    return { ok: true as const, inserted };
  },
});

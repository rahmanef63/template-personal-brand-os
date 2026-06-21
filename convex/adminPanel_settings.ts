import { v, ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { logAudit } from "./adminPanel_auditLog";

// Admin-panel "Settings" block — WORKSPACE settings (distinct from siteSettings).
// Persists the singleton workspace identity + integration rows + API-key rows.
// Mirrors convex/settings.ts: singleton get via .first() + auth-guarded upsert.
//
// SEED_* must mirror the frontend seed.ts (DEFAULT_IDENTITY / INTEGRATIONS /
// SEED_KEYS) so a fresh deploy (empty tables) renders the same UI as the demo.

const SEED_IDENTITY = {
  name: "Konsultan OS — Lumen",
  slug: "konsultan-lumen",
  timezone: "Asia/Jakarta",
  language: "id",
  contactEmail: "ops@lumen.dev",
};

type SeedIntegration = {
  integrationId: string;
  label: string;
  category: "messaging" | "email" | "payments" | "deploy" | "vcs";
  status: "connected" | "disconnected" | "error";
  detail: string;
  docsUrl: string;
};

const SEED_INTEGRATIONS: SeedIntegration[] = [
  {
    integrationId: "slack",
    label: "Slack",
    category: "messaging",
    status: "connected",
    detail: "Posting to #ops · 2 channels",
    docsUrl: "https://api.slack.com/messaging/webhooks",
  },
  {
    integrationId: "resend",
    label: "Resend",
    category: "email",
    status: "connected",
    detail: "Transactional · 12.4K sent (30d)",
    docsUrl: "https://resend.com/docs",
  },
  {
    integrationId: "stripe",
    label: "Stripe",
    category: "payments",
    status: "disconnected",
    detail: "Not connected",
    docsUrl: "https://stripe.com/docs",
  },
  {
    integrationId: "vercel",
    label: "Vercel",
    category: "deploy",
    status: "error",
    detail: "Token expired · reconnect",
    docsUrl: "https://vercel.com/docs",
  },
  {
    integrationId: "github",
    label: "GitHub",
    category: "vcs",
    status: "connected",
    detail: "lumen-dev/konsultan-site",
    docsUrl: "https://docs.github.com/en/apps",
  },
  {
    integrationId: "doku",
    label: "DOKU",
    category: "payments",
    status: "disconnected",
    detail: "Not connected",
    docsUrl: "https://developers.doku.com/",
  },
];

type SeedKey = {
  keyId: string;
  label: string;
  tail: string;
  createdAt: string;
  lastUsedAt: string | null;
  scope: "read" | "read-write" | "admin";
};

const SEED_KEYS: SeedKey[] = [
  {
    keyId: "key_1",
    label: "Production server",
    tail: "k7Q2",
    createdAt: "2026-03-12T08:00:00Z",
    lastUsedAt: "2026-05-21T07:14:00Z",
    scope: "admin",
  },
  {
    keyId: "key_2",
    label: "Read-only public dashboards",
    tail: "x12M",
    createdAt: "2026-04-02T10:14:00Z",
    lastUsedAt: "2026-05-21T06:42:00Z",
    scope: "read",
  },
  {
    keyId: "key_3",
    label: "CI integration tests",
    tail: "9b3F",
    createdAt: "2026-04-22T18:00:00Z",
    lastUsedAt: "2026-05-20T22:10:00Z",
    scope: "read-write",
  },
];

// Read identity + integrations + apiKeys. Queries can't write, so empty tables
// resolve to the SEED defaults (mutations lazily persist rows on first edit /
// revoke). Shape matches the frontend SettingsBindings exactly.
export const get = query({
  args: {},
  handler: async (ctx) => {
    // Admin-only: exposes workspace settings / webhook endpoints / AI config.
    if (!(await getAuthUserId(ctx))) throw new ConvexError("Admin only.");
    const identityRow = await ctx.db.query("adminWorkspaceSettings").first();
    const identity = identityRow
      ? {
          name: identityRow.name,
          slug: identityRow.slug,
          timezone: identityRow.timezone,
          language: identityRow.language,
          contactEmail: identityRow.contactEmail,
        }
      : SEED_IDENTITY;

    const integrationRows = await ctx.db.query("adminIntegrations").collect();
    const integrations =
      integrationRows.length > 0
        ? integrationRows.map((r) => ({
            id: r.integrationId,
            label: r.label,
            category: r.category,
            status: r.status,
            detail: r.detail,
            docsUrl: r.docsUrl,
          }))
        : SEED_INTEGRATIONS.map((s) => ({
            id: s.integrationId,
            label: s.label,
            category: s.category,
            status: s.status,
            detail: s.detail,
            docsUrl: s.docsUrl,
          }));

    const keyRows = await ctx.db.query("adminApiKeys").collect();
    // Revoke deletes a row, so once ANY key has been touched the table is the
    // source of truth. Empty table = fresh deploy → fall back to seed.
    const apiKeys =
      keyRows.length > 0
        ? keyRows.map((r) => ({
            id: r.keyId,
            label: r.label,
            tail: r.tail,
            createdAt: r.createdAt,
            lastUsedAt: r.lastUsedAt ?? null,
            scope: r.scope,
          }))
        : SEED_KEYS.map((s) => ({
            id: s.keyId,
            label: s.label,
            tail: s.tail,
            createdAt: s.createdAt,
            lastUsedAt: s.lastUsedAt,
            scope: s.scope,
          }));

    return { identity, integrations, apiKeys };
  },
});

// Upsert the singleton workspace identity. Admin-only. Only provided fields
// are patched (mirrors convex/settings.ts).
export const setIdentity = mutation({
  args: {
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    timezone: v.optional(v.string()),
    language: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Harus login sebagai admin.");

    const patch: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(args)) {
      if (val !== undefined) patch[k] = val;
    }

    await logAudit(ctx, {
      action: "update",
      entityType: "setting",
      entityId: "workspace-identity",
      entityLabel: "Workspace identity",
      severity: "info",
      diffSummary: Object.keys(patch).join(", ") || undefined,
    });

    const existing = await ctx.db.query("adminWorkspaceSettings").first();
    if (existing) {
      await ctx.db.patch(existing._id, patch);
      return existing._id;
    }
    // First write: start from seed so omitted fields are well-defined.
    return ctx.db.insert("adminWorkspaceSettings", { ...SEED_IDENTITY, ...patch });
  },
});

// Revoke (delete) an API key by its stable string id. Admin-only.
// On first revoke the seed keys are persisted (minus the revoked one) so the
// remaining rows survive — the table becomes the source of truth.
export const revokeKey = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Harus login sebagai admin.");

    const existing = await ctx.db
      .query("adminApiKeys")
      .withIndex("by_keyId", (q) => q.eq("keyId", args.id))
      .first();
    const label =
      existing?.label ??
      SEED_KEYS.find((s) => s.keyId === args.id)?.label ??
      args.id;
    await logAudit(ctx, {
      action: "revoke",
      entityType: "setting",
      entityId: args.id,
      entityLabel: `API key: ${label}`,
      severity: "alert",
    });

    if (existing) {
      await ctx.db.delete(existing._id);
      return;
    }

    // Empty/untouched table: materialise the seed keys (minus the revoked one)
    // so the revoke persists instead of being lost on the seed fallback.
    const rows = await ctx.db.query("adminApiKeys").collect();
    if (rows.length === 0) {
      for (const s of SEED_KEYS) {
        if (s.keyId === args.id) continue;
        await ctx.db.insert("adminApiKeys", {
          keyId: s.keyId,
          label: s.label,
          tail: s.tail,
          createdAt: s.createdAt,
          lastUsedAt: s.lastUsedAt ?? undefined,
          scope: s.scope,
        });
      }
    }
  },
});

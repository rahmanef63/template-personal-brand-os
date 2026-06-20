import { v, ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { logAudit } from "./adminPanel_auditLog";

// Admin-panel "AI config" block — persists the singleton model/sampling config
// + per-rule moderation toggles. Mirrors convex/settings.ts: singleton get via
// .first() + auth-guarded upsert. PROVIDERS/MODELS stay static seed on the
// client (read-only catalog) so only config + moderation are stored here.

// SEED defaults — must mirror frontend seed.ts DEFAULT_CONFIG / DEFAULT_MODERATION
// so a fresh deploy (empty tables) and `reset` produce the same UI as the demo.
const SEED_CONFIG = {
  activeModelId: "claude-sonnet-4-6",
  systemPrompt:
    "You are the workspace assistant for this template. Match the brand voice: clear, helpful, no fluff. Refuse questions outside the workspace scope.",
  temperature: 0.6,
  maxOutputTokens: 2048,
};

type SeedRule = {
  ruleId: string;
  label: string;
  description: string;
  enabled: boolean;
  threshold?: number;
};

const SEED_MODERATION: SeedRule[] = [
  {
    ruleId: "toxicity",
    label: "Toxicity filter",
    description: "Block responses with toxic language above the threshold.",
    enabled: true,
    threshold: 0.7,
  },
  {
    ruleId: "pii-redact",
    label: "PII redaction",
    description: "Strip emails, phone numbers, and credit-card patterns from outputs.",
    enabled: true,
  },
  {
    ruleId: "off-topic",
    label: "Off-topic refusal",
    description: "Refuse requests unrelated to the workspace domain.",
    enabled: true,
  },
  {
    ruleId: "competitor-mention",
    label: "Competitor mention",
    description: "Warn when responses mention listed competitor brands.",
    enabled: false,
    threshold: 0.5,
  },
  {
    ruleId: "external-links",
    label: "External link allowlist",
    description: "Only emit links to the workspace allowlisted domains.",
    enabled: false,
  },
];

// Read config + moderation. Queries can't write, so empty tables resolve to the
// SEED defaults (the mutations lazily persist rows on first edit).
export const get = query({
  args: {},
  handler: async (ctx) => {
    const configRow = await ctx.db.query("adminAiConfig").first();
    const config = configRow
      ? {
          activeModelId: configRow.activeModelId,
          systemPrompt: configRow.systemPrompt,
          temperature: configRow.temperature,
          maxOutputTokens: configRow.maxOutputTokens,
        }
      : SEED_CONFIG;

    const rows = await ctx.db.query("adminModerationRules").collect();
    const byId = new Map(rows.map((r) => [r.ruleId, r]));
    // Preserve seed order; overlay any persisted rows.
    const moderation = SEED_MODERATION.map((seed) => {
      const row = byId.get(seed.ruleId);
      return {
        id: seed.ruleId,
        label: row?.label ?? seed.label,
        description: row?.description ?? seed.description,
        enabled: row ? row.enabled : seed.enabled,
        threshold: row ? row.threshold : seed.threshold,
      };
    });

    return { config, moderation };
  },
});

// Upsert the singleton AI config. Admin-only. Only provided fields are patched.
export const setConfig = mutation({
  args: {
    activeModelId: v.optional(v.string()),
    systemPrompt: v.optional(v.string()),
    temperature: v.optional(v.number()),
    maxOutputTokens: v.optional(v.number()),
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
      entityId: "ai-config",
      entityLabel: "AI config",
      severity: "info",
      diffSummary: Object.keys(patch).join(", ") || undefined,
    });

    const existing = await ctx.db.query("adminAiConfig").first();
    if (existing) {
      await ctx.db.patch(existing._id, patch);
      return existing._id;
    }
    // First write: start from seed so omitted fields are well-defined.
    return ctx.db.insert("adminAiConfig", { ...SEED_CONFIG, ...patch });
  },
});

// Ensure a moderation row exists for ruleId, seeded from SEED_MODERATION.
async function ensureRule(ctx: any, ruleId: string) {
  const existing = await ctx.db
    .query("adminModerationRules")
    .withIndex("by_ruleId", (q: any) => q.eq("ruleId", ruleId))
    .first();
  if (existing) return existing;
  const seed = SEED_MODERATION.find((r) => r.ruleId === ruleId);
  if (!seed) throw new ConvexError(`Unknown moderation rule: ${ruleId}`);
  const id = await ctx.db.insert("adminModerationRules", {
    ruleId: seed.ruleId,
    label: seed.label,
    description: seed.description,
    enabled: seed.enabled,
    threshold: seed.threshold,
  });
  return await ctx.db.get(id);
}

export const toggleRule = mutation({
  args: { id: v.string(), enabled: v.boolean() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Harus login sebagai admin.");
    const row = await ensureRule(ctx, args.id);
    await ctx.db.patch(row._id, { enabled: args.enabled });
  },
});

export const setThreshold = mutation({
  args: { id: v.string(), threshold: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Harus login sebagai admin.");
    const row = await ensureRule(ctx, args.id);
    await ctx.db.patch(row._id, { threshold: args.threshold });
  },
});

// Restore SEED defaults: reset singleton config + every moderation row.
export const reset = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Harus login sebagai admin.");

    await logAudit(ctx, {
      action: "update",
      entityType: "setting",
      entityId: "ai-config",
      entityLabel: "AI config reset to defaults",
      severity: "warn",
    });

    const configRow = await ctx.db.query("adminAiConfig").first();
    if (configRow) await ctx.db.patch(configRow._id, SEED_CONFIG);
    else await ctx.db.insert("adminAiConfig", SEED_CONFIG);

    const rows = await ctx.db.query("adminModerationRules").collect();
    for (const row of rows) await ctx.db.delete(row._id);
    // Deleting all rows makes `get` fall back to SEED defaults — same as demo.
  },
});

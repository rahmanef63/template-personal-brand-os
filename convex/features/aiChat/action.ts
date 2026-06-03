"use node";

/**
 * ai-chat backend — real LLM call via the Vercel `ai` SDK + @ai-sdk/anthropic.
 *
 * Standardizes personal-brand-os onto the same reusable ai-chat used by the
 * other templates (agency-studio-os etc.), replacing the old canned,
 * store-coupled `ChatFab` that returned fake replies.
 *
 * Key-guarded: ANTHROPIC_API_KEY is set by the site owner on the Convex
 * deployment at deploy time. When it is NOT set the action does NOT throw —
 * it returns `{ ok: false, notice }` so the chat UI degrades gracefully and
 * the build / prerender never depends on the key being present.
 *
 * System prompt: personal-brand-os has no convex-side aiConfig singleton
 * (its admin ai-config block is a frontend mock), so we use a sensible
 * personal-brand assistant default.
 */

import { action } from "../../_generated/server";
import { v } from "convex/values";

const MODEL = "claude-3-5-haiku-latest";

const DEFAULT_SYSTEM =
  "You are the assistant for a personal-brand website. Speak in the owner's " +
  "voice: clear, warm, and concise — no fluff. Help visitors with questions " +
  "about services, pricing, the owner's writing/portfolio, and how to get in " +
  "touch or start working together. If a question is outside that scope, " +
  "answer briefly and steer back to how the owner can help.";

export const chat = action({
  args: {
    prompt: v.string(),
    history: v.optional(
      v.array(
        v.object({
          role: v.union(v.literal("user"), v.literal("assistant")),
          content: v.string(),
        }),
      ),
    ),
  },
  handler: async (
    _ctx,
    { prompt, history },
  ): Promise<{ ok: boolean; text?: string; notice?: string }> => {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) {
      return {
        ok: false,
        notice:
          "AI chat is not configured yet. The site owner must set ANTHROPIC_API_KEY on the Convex deployment to enable live replies.",
      };
    }

    try {
      const { generateText } = await import("ai");
      const { createAnthropic } = await import("@ai-sdk/anthropic");
      const anthropic = createAnthropic({ apiKey: key });

      const messages = [
        ...(history ?? []),
        { role: "user" as const, content: prompt },
      ];

      const { text } = await generateText({
        model: anthropic(MODEL),
        system: DEFAULT_SYSTEM,
        messages,
        maxTokens: 600,
      });

      return { ok: true, text };
    } catch (e) {
      return {
        ok: false,
        notice: `AI request failed: ${(e as Error).message}`,
      };
    }
  },
});

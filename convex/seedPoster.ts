import { internalMutation } from "./_generated/server";
import { HERO, PRICING, FAQS } from "./landingContent";

// One-shot patch aligning the LIVE demo's landing data with the marketing
// poster: real hero copy, + pricing & FAQ sections (renderers shipped
// 2026-06-05). Hero/pricing/faq content comes from convex/landingContent.ts —
// the SAME single source the seed and the frontend render read, so there is no
// drift. Idempotent upsert by sectionId — safe to re-run; only touches these
// three rows, never other content.
//   npx convex run seedPoster:apply
const ROWS = [
  { id: "ls-hero", order: 10, kind: "hero", title: HERO.title, subtitle: HERO.subtitle, enabled: true, config: JSON.stringify({ badge: HERO.badge }) },
  { id: "ls-pricing", order: 55, kind: "pricing", title: "Paket kerja sama", subtitle: "Harga transparan — pilih jalur yang pas, upgrade kapan saja.", enabled: true, config: JSON.stringify({ tiers: PRICING }) },
  { id: "ls-faq", order: 65, kind: "faq", title: "Pertanyaan yang sering muncul", subtitle: "Hal-hal yang biasanya ditanyakan sebelum mulai.", enabled: true, config: JSON.stringify({ items: FAQS }) },
];

export const apply = internalMutation({
  args: {},
  handler: async (ctx) => {
    let inserted = 0;
    let patched = 0;
    for (const r of ROWS) {
      const existing = await ctx.db
        .query("landingSections")
        .withIndex("by_sectionId", (q) => q.eq("sectionId", r.id))
        .first();
      if (existing) {
        await ctx.db.patch(existing._id, { data: r });
        patched++;
      } else {
        await ctx.db.insert("landingSections", { sectionId: r.id, data: r });
        inserted++;
      }
    }
    return { inserted, patched };
  },
});

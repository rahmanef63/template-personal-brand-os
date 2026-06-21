import { mutation, internalMutation } from "./_generated/server";
import { ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { requireUser } from "./_shared/auth";

// Demo seed for Personal Brand OS.
// - `seed:run`        — CLI/power use: wipes content then inserts (npx convex run seed:run).
// - `seed:seedSample` — in-app one-click for non-coders: requires login, inserts
//                       ONLY when the site is still empty (never wipes real work).
const now = 1_780_000_000_000;
const day = 86_400_000;

// Keep in sync with components/templates/personal-brand/shared/seed.ts
// SEED_LANDING_SECTIONS. `syncLanding` below pushes additions/order to an
// already-seeded deployment without touching admin-edited copy.
const LANDING = [
  { id: "ls-hero", order: 10, kind: "hero", title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.", subtitle: "Tempor incididunt ut labore et dolore magna aliqua — strategi produk, mentorship engineer, dan riset go-to-market untuk founder & tim Indonesia.", enabled: true, config: '{"badge":"2026 mentorship cohort open"}' },
  { id: "ls-stats", order: 20, kind: "stats", title: "Numbers", subtitle: "Quick credibility strip.", enabled: true },
  { id: "ls-features", order: 25, kind: "features", title: "Fokus yang saya kerjakan", subtitle: "Empat jalur utama: strategi produk, mentorship engineering, tulisan, dan sesi untuk tim.", enabled: true },
  { id: "ls-blog", order: 30, kind: "blog", title: "Tulisan terbaru", subtitle: "Catatan singkat tentang produk, riset, dan delivery.", enabled: true },
  { id: "ls-portfolio", order: 40, kind: "portfolio", title: "Karya pilihan", subtitle: "Proyek yang menggambarkan cara saya bekerja.", enabled: true },
  { id: "ls-services", order: 50, kind: "services", title: "Layanan", subtitle: "Tiga jalur kerja sama.", enabled: true },
  { id: "ls-pricing", order: 55, kind: "pricing", title: "Model kerja sama", subtitle: "Mulai dari sesi konsultasi tunggal sampai retainer bulanan.", enabled: false },
  { id: "ls-testimonials", order: 60, kind: "testimonials", title: "Apa kata mereka", subtitle: "Dari founder dan tim yang sudah bekerja sama.", enabled: true },
  { id: "ls-faq", order: 62, kind: "faq", title: "Pertanyaan yang sering masuk", subtitle: "Soal kolaborasi, jasa, timeline, dan harga — sebelum kamu kirim email.", enabled: true },
  { id: "ls-cta", order: 65, kind: "cta", title: "Punya proyek atau butuh sparring partner?", subtitle: "Ceritakan konteksmu — dibalas dalam 1×24 jam kerja.", enabled: true },
  { id: "ls-newsletter", order: 70, kind: "newsletter", title: "Newsletter", subtitle: "Sekali sebulan, kabar produk + sumber bacaan.", enabled: true },
];

// All demo content inserts (no wipe). Shared by `run` and `seedSample`.
async function insertAll(ctx: any, opts: { landing?: boolean } = {}) {
  const posts = [
    { slug: "designing-with-intent", title: "Designing With Intent", excerpt: "How constraints sharpen creative work.", tag: "Design", cover: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1400&q=70" },
    { slug: "building-a-personal-brand", title: "Building a Personal Brand That Lasts", excerpt: "Consistency beats virality over time.", tag: "Strategy", cover: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=70" },
    { slug: "shipping-side-projects", title: "Shipping Side Projects", excerpt: "A pragmatic loop for finishing things.", tag: "Build", cover: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1400&q=70" },
  ];
  for (let i = 0; i < posts.length; i++) {
    await ctx.db.insert("posts", {
      ...posts[i],
      body: "## Lorem ipsum\n\nDemo content. Edit in the admin panel.",
      author: "Owner",
      status: "published",
      publishedAt: now - i * day,
      views: 120 - i * 30,
      readMin: 4 + i,
    });
  }

  const portfolio = [
    { slug: "brand-refresh", title: "Brand Refresh", category: "Branding", blurb: "Full identity system." },
    { slug: "saas-dashboard", title: "SaaS Dashboard", category: "Product", blurb: "Analytics UI for a B2B tool." },
    { slug: "campaign-site", title: "Campaign Microsite", category: "Web", blurb: "Launch site in two weeks." },
  ];
  for (let i = 0; i < portfolio.length; i++) {
    await ctx.db.insert("portfolio", {
      ...portfolio[i],
      cover: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=70",
        "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1400&q=70",
        "https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=1400&q=70",
      ][i],
      problem: "Demo problem statement.",
      approach: "Demo approach.",
      result: "Demo outcome.",
      publishedAt: now - i * day,
    });
  }

  // priceNumber = fixed IDR amount → purchasable via guest checkout. Services
  // without it (Monthly Retainer) are book-only (lead.create), never carted.
  const services = [
    { slug: "consulting", name: "Consulting", priceLabel: "$2k", period: "/project", featured: true, bullets: ["Strategy session", "Roadmap", "Async support"], priceNumber: 2_000_000 },
    { slug: "design-sprint", name: "Design Sprint", priceLabel: "$5k", period: "/week", featured: false, bullets: ["5-day sprint", "Prototype", "User test"], priceNumber: 5_000_000 },
    { slug: "retainer", name: "Monthly Retainer", priceLabel: "$3k", period: "/mo", featured: false, bullets: ["Ongoing work", "Priority", "Monthly review"] },
  ];
  for (const s of services) {
    await ctx.db.insert("services", { ...s, description: "Demo service description." });
  }

  const resources = [
    { title: "Brand Checklist", description: "A starter checklist.", fileLabel: "PDF", gated: false, downloads: 42 },
    { title: "Pricing Template", description: "Spreadsheet template.", fileLabel: "XLSX", gated: true, downloads: 18 },
  ];
  for (const r of resources) await ctx.db.insert("resources", r);

  // landing sections — the public home composes from these (HomePage reads
  // useLandingSections → filter enabled → sort order). Without them home is blank.
  if (opts.landing !== false) for (const s of LANDING) await ctx.db.insert("landingSections", { sectionId: s.id, data: s });

  return { posts: posts.length, portfolio: portfolio.length, services: services.length, resources: resources.length, landing: LANDING.length };
}

// Power/CLI seed: wipes content tables first, then inserts. Destructive — only
// for terminal use where you explicitly want a reset.
export const run = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
    for (const t of ["posts", "portfolio", "services", "resources", "landingSections"] as const) {
      for (const row of await ctx.db.query(t).take(1000)) await ctx.db.delete(row._id);
    }
    return insertAll(ctx);
  },
});

// Demo/CLI seed (NO auth, internal — run via `npx convex run seed:seedDemo`).
// For SHOWCASE/demo deployments only. Refills the content tables for a full
// demo and ensures the hero landing image, WITHOUT wiping admin-edited landing
// copy. Idempotent.
export const seedDemo = internalMutation({
  args: {},
  handler: async (ctx) => {
    for (const t of ["posts", "portfolio", "services", "resources"] as const) {
      for (const row of await ctx.db.query(t).take(1000)) await ctx.db.delete(row._id);
    }
    const counts = await insertAll(ctx, { landing: false });
    // Seed landing only if the table is empty (preserve admin-edited copy).
    const hasLanding = await ctx.db.query("landingSections").first();
    if (!hasLanding) {
      for (const s of LANDING) await ctx.db.insert("landingSections", { sectionId: s.id, data: s });
    }
    return counts;
  },
});

// Additive landing sync for already-seeded deployments: inserts LANDING
// entries whose sectionId is missing and aligns `order` to the canonical
// lineup. Never touches admin-edited copy/enabled/config on existing rows.
export const syncLanding = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
    let inserted = 0;
    let reordered = 0;
    for (const s of LANDING) {
      const existing = await ctx.db
        .query("landingSections")
        .withIndex("by_sectionId", (q) => q.eq("sectionId", s.id))
        .unique();
      if (!existing) {
        await ctx.db.insert("landingSections", { sectionId: s.id, data: s });
        inserted++;
      } else if ((existing.data as { order?: number }).order !== s.order) {
        await ctx.db.patch(existing._id, {
          data: { ...(existing.data as Record<string, unknown>), order: s.order },
        });
        reordered++;
      }
    }
    return { inserted, reordered };
  },
});

// Additive commerce backfill for already-seeded deployments: gives existing
// `services` rows their `priceNumber` (and `slug` if somehow missing) from the
// seed lineup (matched by unique name) ONLY when missing. Idempotent; never
// overwrites an admin-set value.
export const syncServicesCommerce = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
    const SEED_SERVICES = [
      { slug: "consulting", name: "Consulting", priceNumber: 2_000_000 },
      { slug: "design-sprint", name: "Design Sprint", priceNumber: 5_000_000 },
      { slug: "retainer", name: "Monthly Retainer" },
    ];
    let patched = 0;
    const rows = await ctx.db.query("services").collect();
    for (const s of SEED_SERVICES) {
      const existing = rows.find((r) => r.name === s.name);
      if (!existing) continue;
      const patch: { slug?: string; priceNumber?: number } = {};
      if (!existing.slug && s.slug) patch.slug = s.slug;
      const seedPrice = (s as { priceNumber?: number }).priceNumber;
      if (!existing.priceNumber && seedPrice) patch.priceNumber = seedPrice;
      if (Object.keys(patch).length > 0) {
        await ctx.db.patch(existing._id, patch);
        patched++;
      }
    }
    return { patched };
  },
});

// In-app one-click seed for non-technical owners. Safe: requires an authenticated
// admin AND only runs on an empty site, so it can never wipe real content.
export const seedSample = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Harus login sebagai admin.");
    const hasPosts = await ctx.db.query("posts").first();
    const hasLanding = await ctx.db.query("landingSections").first();
    if (hasPosts || hasLanding) {
      return { seeded: false, reason: "already-has-content" as const };
    }
    const counts = await insertAll(ctx);
    return { seeded: true, ...counts };
  },
});

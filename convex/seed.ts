import { mutation, internalMutation } from "./_generated/server";
import { ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { requireUser } from "./_shared/auth";
import { HERO, STATS, CLIENTS, FEATURES, PRICING, FAQS, TESTIMONIALS } from "./landingContent";

// Demo seed for Personal Brand OS.
// - `seed:run`        — CLI/power use: wipes content then inserts (npx convex run seed:run).
// - `seed:seedSample` — in-app one-click for non-coders: requires login, inserts
//                       ONLY when the site is still empty (never wipes real work).
const now = 1_780_000_000_000;
const day = 86_400_000;

// Keep in sync with frontend/slices/_app/seed.ts SEED_LANDING_SECTIONS.
// `syncLanding` below pushes additions/order to an already-seeded deployment
// without touching admin-edited copy.
// Item-bearing sections (stats/features/pricing/testimonials/faq) seed their
// example content into `config` from convex/landingContent.ts — the SAME module
// the frontend render falls back to — so a fresh clone gets editable example
// data and there is no convex<->render drift. Table-backed kinds (portfolio/
// services/blog) render from their own tables and carry no config here.
const LANDING = [
  { id: "ls-hero", order: 10, kind: "hero", title: HERO.title, subtitle: HERO.subtitle, enabled: true, config: JSON.stringify({ badge: HERO.badge }), layers: [{ id: "hero-photo", type: "image", placement: "background", opacity: 100, enabled: true, url: "/hero.webp" }] },
  { id: "ls-stats", order: 20, kind: "stats", title: "Rekam jejak singkat", subtitle: "Angka yang menggambarkan praktik dan jangkauan kerja sampai hari ini.", enabled: true, config: JSON.stringify({ stats: STATS, clients: CLIENTS }) },
  { id: "ls-features", order: 25, kind: "features", title: "Fokus yang saya kerjakan", subtitle: "Empat jalur utama: strategi produk, mentorship engineering, tulisan, dan sesi untuk tim.", enabled: true, config: JSON.stringify({ items: FEATURES }) },
  { id: "ls-blog", order: 30, kind: "blog", title: "Tulisan terbaru", subtitle: "Catatan singkat tentang produk, riset, dan delivery.", enabled: true },
  { id: "ls-portfolio", order: 40, kind: "portfolio", title: "Karya pilihan", subtitle: "Proyek yang menggambarkan cara saya bekerja.", enabled: true },
  { id: "ls-services", order: 50, kind: "services", title: "Layanan", subtitle: "Tiga jalur kerja sama.", enabled: true },
  { id: "ls-pricing", order: 55, kind: "pricing", title: "Model kerja sama", subtitle: "Mulai dari sesi konsultasi tunggal sampai retainer bulanan.", enabled: false, config: JSON.stringify({ tiers: PRICING }) },
  { id: "ls-testimonials", order: 60, kind: "testimonials", title: "Apa kata mereka", subtitle: "Dari founder dan tim yang sudah bekerja sama.", enabled: true, config: JSON.stringify({ items: TESTIMONIALS }) },
  { id: "ls-faq", order: 62, kind: "faq", title: "Pertanyaan yang sering masuk", subtitle: "Soal kolaborasi, jasa, timeline, dan harga — sebelum kamu kirim email.", enabled: true, config: JSON.stringify({ items: FAQS }) },
  { id: "ls-cta", order: 65, kind: "cta", title: "Punya proyek atau butuh sparring partner?", subtitle: "Ceritakan konteksmu — dibalas dalam 1×24 jam kerja.", enabled: true },
  { id: "ls-newsletter", order: 70, kind: "newsletter", title: "Newsletter", subtitle: "Sekali sebulan, kabar produk + sumber bacaan.", enabled: true },
];

// All demo content inserts (no wipe). Shared by `run` and `seedSample`.
async function insertAll(ctx: any, opts: { landing?: boolean } = {}) {
  const posts = [
    { slug: "outcome-over-output", title: "Outcome di Atas Output: Cara Memprioritaskan Roadmap", excerpt: "Kenapa tim sering sibuk tapi tidak bergerak — dan kerangka prioritas yang saya pakai bareng founder.", tag: "Strategy", cover: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1400&q=70" },
    { slug: "mentorship-engineer-naik-level", title: "Pola Mentorship yang Bikin Engineer Naik Level Cepat", excerpt: "Tiga kebiasaan kerja yang membedakan engineer mid dari senior — dari pengalaman mentoring 1-on-1.", tag: "Engineering", cover: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=70" },
    { slug: "riset-go-to-market-lokal", title: "Riset Go-to-Market untuk Pasar Indonesia", excerpt: "Cara menemukan ICP yang benar sebelum membakar budget — kerangka JTBD yang ringkas dan bisa langsung dipakai.", tag: "Notes", cover: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1400&q=70" },
  ];
  for (let i = 0; i < posts.length; i++) {
    await ctx.db.insert("posts", {
      ...posts[i],
      body: `## ${posts[i].title}\n\nCatatan singkat dari praktik kerja sama dengan founder dan tim produk. Edit isi lengkapnya lewat panel admin → Blog.`,
      author: "Owner",
      status: "published",
      publishedAt: now - i * day,
      views: 120 - i * 30,
      readMin: 4 + i,
    });
  }

  const portfolio = [
    { slug: "sinar-ventures-activation", title: "Sinar Ventures — Perbaikan Aktivasi", category: "Product", blurb: "Onboarding di-redesign, aktivasi naik 31%.", problem: "Retensi turun 18% dalam dua kuartal; hipotesis: onboarding membingungkan.", approach: "Audit funnel + 14 wawancara user. Aktivasi diringkas dari 4 langkah jadi 1 langkah dengan bantuan AI.", result: "Aktivasi naik 31%. Retensi minggu-2 naik 12%. ARR proyeksi +Rp 4.2 milyar." },
    { slug: "nusantara-labs-reposition", title: "Nusantara Labs — Reposisi Brand", category: "Brand", blurb: "Avg deal size naik 2.4× setelah reposisi.", problem: "Persepsi pasar startup, padahal klien membeli enterprise.", approach: "Workshop pemegang saham. Brand archetype + reposisi visual.", result: "Avg deal size naik 2.4×. Sales cycle turun dari 90 hari ke 54." },
    { slug: "kode-kolektif-gtm", title: "Kode Kolektif — Strategi Go-to-Market", category: "Strategy", blurb: "Launch on-time, MRR 60 hari lampaui target.", problem: "Launch tertunda tiga kali — tim belum sepakat ICP.", approach: "Force-rank ICP via JTBD. Pangkas 5 segmen jadi 2.", result: "Launch tepat waktu. MRR 60 hari Rp 380jt vs target Rp 200jt." },
  ];
  for (let i = 0; i < portfolio.length; i++) {
    await ctx.db.insert("portfolio", {
      ...portfolio[i],
      cover: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=70",
        "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1400&q=70",
        "https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=1400&q=70",
      ][i],
      publishedAt: now - i * day,
    });
  }

  // priceNumber = fixed IDR amount → purchasable via guest checkout. Services
  // without it (Retainer) are book-only (lead.create), never carted.
  const services = [
    { slug: "office-hours", name: "Office Hours", priceLabel: "Rp 750k", period: "/sesi", featured: false, bullets: ["Booking minggu yang sama", "Prep brief via email", "Catatan follow-up"], priceNumber: 750_000, description: "Sesi 30–60 menit untuk pertanyaan spesifik — pricing, hiring, atau eksekusi." },
    { slug: "strategy-sprint", name: "Strategy Sprint", priceLabel: "Rp 18jt", period: "/sprint", featured: true, bullets: ["Wawancara stakeholder", "Fasilitasi workshop", "Deck akhir + recording"], priceNumber: 18_000_000, description: "Sprint intensif lima hari dengan deliverable jelas: roadmap + matriks prioritas." },
    { slug: "monthly-retainer", name: "Monthly Retainer", priceLabel: "Rp 4.5jt", period: "/bulan", featured: false, bullets: ["Call mingguan 60 menit", "Async review tanpa batas", "Akses resource library"], description: "Pendampingan berkelanjutan — mentoring atau advisory bulanan." },
  ];
  for (const s of services) {
    await ctx.db.insert("services", s);
  }

  const resources = [
    { title: "GTM Playbook Lokal 2026", description: "Kerangka lengkap go-to-market untuk founder early-stage di pasar Indonesia.", fileLabel: "PDF · 38 hal", gated: true, downloads: 412 },
    { title: "Pricing Calculator", description: "Template spreadsheet — variabel harga + simulator paket.", fileLabel: "Notion template", gated: false, downloads: 1280 },
    { title: "Hiring Rubric", description: "Scoring + prompt wawancara untuk merekrut engineer dan designer.", fileLabel: "Spreadsheet", gated: true, downloads: 96 },
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
      { slug: "office-hours", name: "Office Hours", priceNumber: 750_000 },
      { slug: "strategy-sprint", name: "Strategy Sprint", priceNumber: 18_000_000 },
      { slug: "monthly-retainer", name: "Monthly Retainer" },
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

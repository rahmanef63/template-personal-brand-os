import { internalMutation } from "./_generated/server";

// One-shot patch aligning the LIVE demo's landing data with the marketing
// poster: real hero copy (was lorem), + pricing & FAQ sections (renderers
// shipped 2026-06-05). Idempotent upsert by sectionId — safe to re-run;
// only touches these three rows, never other content.
//   npx convex run seedPoster:apply
const ROWS = [
  { id: "ls-hero", order: 10, kind: "hero", title: "Saya bantu brand bercerita dengan jelas — produk, konten, dan strategi.", subtitle: "Designer-developer untuk founder & tim Indonesia: strategi produk, mentorship engineer, dan riset go-to-market.", enabled: true, config: '{"badge":"Available for freelance work"}' },
  { id: "ls-pricing", order: 55, kind: "pricing", title: "Paket kerja sama", subtitle: "Harga transparan — pilih jalur yang pas, upgrade kapan saja.", enabled: true },
  { id: "ls-faq", order: 65, kind: "faq", title: "Pertanyaan yang sering muncul", subtitle: "Hal-hal yang biasanya ditanyakan sebelum mulai.", enabled: true, config: JSON.stringify({ items: [
    { q: "Berapa lama satu engagement biasanya?", a: "Consulting 2-4 minggu, design sprint 1 minggu, retainer bulanan berjalan minimal 3 bulan." },
    { q: "Apakah bisa remote sepenuhnya?", a: "Ya — semua kerja sama berjalan async-first dengan 1-2 call per minggu sesuai zona waktu kamu." },
    { q: "Bagaimana sistem pembayarannya?", a: "50% di depan, 50% saat serah terima. Retainer ditagih di awal bulan. Invoice + kontrak standar tersedia." },
    { q: "Apakah hasil kerja jadi milik saya?", a: "100%. Semua source file, dokumen riset, dan kode diserahkan penuh tanpa lisensi tambahan." },
  ] }) },
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

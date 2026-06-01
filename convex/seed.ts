import { mutation } from "./_generated/server";

// Demo seed for Personal Brand OS. Run once after deploy:
//   npx convex run seed:run
// Idempotent-ish: clears content tables first, then inserts demo rows.
// Replace with your own content via the admin panel (or edit this file).
const now = 1_780_000_000_000;
const day = 86_400_000;

export const run = mutation({
  args: {},
  handler: async (ctx) => {
    // wipe content tables (not auth tables)
    for (const t of ["posts", "portfolio", "services", "resources"] as const) {
      for (const row of await ctx.db.query(t).take(1000)) await ctx.db.delete(row._id);
    }

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

    const services = [
      { slug: "consulting", name: "Consulting", priceLabel: "$2k", period: "/project", featured: true, bullets: ["Strategy session", "Roadmap", "Async support"] },
      { slug: "design-sprint", name: "Design Sprint", priceLabel: "$5k", period: "/week", featured: false, bullets: ["5-day sprint", "Prototype", "User test"] },
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
    for (const row of await ctx.db.query("landingSections").take(1000)) await ctx.db.delete(row._id);
    const landing = [
      { id: "ls-hero", order: 10, kind: "hero", title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.", subtitle: "Tempor incididunt ut labore et dolore magna aliqua — strategi produk, mentorship engineer, dan riset go-to-market untuk founder & tim Indonesia.", enabled: true, config: '{"badge":"2026 mentorship cohort open"}' },
      { id: "ls-stats", order: 20, kind: "stats", title: "Numbers", subtitle: "Quick credibility strip.", enabled: true },
      { id: "ls-blog", order: 30, kind: "blog", title: "Tulisan terbaru", subtitle: "Catatan singkat tentang produk, riset, dan delivery.", enabled: true },
      { id: "ls-portfolio", order: 40, kind: "portfolio", title: "Karya pilihan", subtitle: "Proyek yang menggambarkan cara saya bekerja.", enabled: true },
      { id: "ls-services", order: 50, kind: "services", title: "Layanan", subtitle: "Tiga jalur kerja sama.", enabled: true },
      { id: "ls-testimonials", order: 60, kind: "testimonials", title: "Apa kata mereka", subtitle: "Dari founder dan tim yang sudah bekerja sama.", enabled: true },
      { id: "ls-newsletter", order: 70, kind: "newsletter", title: "Newsletter", subtitle: "Sekali sebulan, kabar produk + sumber bacaan.", enabled: true },
    ];
    for (const s of landing) await ctx.db.insert("landingSections", { sectionId: s.id, data: s });

    return { posts: posts.length, portfolio: portfolio.length, services: services.length, resources: resources.length, landing: landing.length };
  },
});

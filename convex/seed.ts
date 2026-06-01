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
      { slug: "designing-with-intent", title: "Designing With Intent", excerpt: "How constraints sharpen creative work.", tag: "Design", cover: "/window.svg" },
      { slug: "building-a-personal-brand", title: "Building a Personal Brand That Lasts", excerpt: "Consistency beats virality over time.", tag: "Strategy", cover: "/globe.svg" },
      { slug: "shipping-side-projects", title: "Shipping Side Projects", excerpt: "A pragmatic loop for finishing things.", tag: "Build", cover: "/file.svg" },
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
        cover: "/window.svg",
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

    return { posts: posts.length, portfolio: portfolio.length, services: services.length, resources: resources.length };
  },
});

import Hero from "./Hero";
import Stats from "./Stats";
import Logos from "./Logos";
import FeatureGrid from "./FeatureGrid";
import Steps from "./Steps";
import Collection from "./Collection";
import Pricing from "./Pricing";
import Testimonials from "./Testimonials";
import Faq from "./Faq";
import Cta from "./Cta";
import type { BlockDef, BlockInstance, Field, PageConfig } from "./types";

// SSOT — the canonical block set. Adding a block here makes it available in the
// builder palette AND renderable by BlockRenderer everywhere. `fields` drives
// the inspector form; `defaults` is the starting content for a fresh block.

// Valid icon keys for FeatureGrid (maps to Phosphor glyphs; unknown -> Sparkle).
const ICONS = [
  "auth", "data", "security", "design", "performance", "speed", "component",
  "stack", "analytics", "integration", "global", "code", "ai", "git",
  "database", "brand",
];

export const REGISTRY: Record<string, BlockDef> = {
  hero: {
    type: "hero",
    name: "Hero",
    description: "The opening headline and call to action.",
    component: Hero,
    fields: [
      { key: "label", label: "Eyebrow label", type: "text" },
      { key: "title", label: "Headline", type: "textarea" },
      { key: "subtitle", label: "Subhead", type: "textarea" },
      { key: "align", label: "Align", type: "select", options: ["left", "center"] },
      { key: "ctaLabel", label: "Primary button label", type: "text" },
      { key: "ctaHref", label: "Primary button link", type: "text" },
      { key: "secondaryLabel", label: "Secondary button label", type: "text" },
      { key: "secondaryHref", label: "Secondary button link", type: "text" },
    ],
    defaults: {
      label: "Production-ready templates",
      title: "Clone a template, brand it, ship it this weekend.",
      subtitle:
        "Next.js and Convex starters with auth, reactive data, and a Brand Kit wired before you clone. No account needed.",
      align: "left",
      ctaLabel: "Browse templates",
      ctaHref: "/#gallery",
      secondaryLabel: "Build your Brand Kit",
      secondaryHref: "/brand-kit",
    },
  },

  stats: {
    type: "stats",
    name: "Stats",
    description: "A row of headline numbers.",
    component: Stats,
    fields: [
      { key: "label", label: "Eyebrow label", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      {
        key: "stats",
        label: "Stats",
        type: "list",
        itemLabel: "stat",
        itemFields: [
          { key: "value", label: "Value", type: "text" },
          { key: "label", label: "Label", type: "text" },
        ],
      },
    ],
    defaults: {
      label: "",
      heading: "",
      stats: [
        { value: "10k+", label: "Users" },
        { value: "99.9%", label: "Uptime" },
        { value: "24/7", label: "Support" },
      ],
    },
  },

  logos: {
    type: "logos",
    name: "Logos",
    description: "A quiet strip of trust wordmarks.",
    component: Logos,
    fields: [
      { key: "label", label: "Label", type: "text" },
      {
        key: "names",
        label: "Names",
        type: "list",
        itemLabel: "name",
        item: { key: "", label: "Name", type: "text" },
      },
    ],
    defaults: {
      label: "Built by teams shipping with",
      names: ["Calmwater", "Northbound", "Ledgerwise", "Aperture", "Fieldnote", "Riverbank"],
    },
  },

  featureGrid: {
    type: "featureGrid",
    name: "Feature grid",
    description: "An asymmetric bento of features.",
    component: FeatureGrid,
    fields: [
      { key: "label", label: "Eyebrow label", type: "text" },
      { key: "title", label: "Heading", type: "text" },
      {
        key: "features",
        label: "Features",
        type: "list",
        itemLabel: "feature",
        itemFields: [
          { key: "icon", label: "Icon", type: "select", options: ICONS },
          { key: "title", label: "Title", type: "text" },
          { key: "body", label: "Body", type: "textarea" },
        ],
      },
    ],
    defaults: {
      label: "",
      title: "Everything you need",
      features: [
        { icon: "speed", title: "Fast by default", body: "Tuned for performance out of the box, no config required." },
        { icon: "security", title: "Secure", body: "Sensible defaults so you ship safe from day one." },
        { icon: "design", title: "On brand", body: "Drop in your Brand Kit and it follows everywhere." },
      ],
    },
  },

  steps: {
    type: "steps",
    name: "Steps",
    description: "A numbered how-it-works section.",
    component: Steps,
    fields: [
      { key: "label", label: "Eyebrow label", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      {
        key: "steps",
        label: "Steps",
        type: "list",
        itemLabel: "step",
        itemFields: [
          { key: "title", label: "Title", type: "text" },
          { key: "body", label: "Body", type: "textarea" },
        ],
      },
    ],
    defaults: {
      label: "How it works",
      heading: "From clone to deployed in three steps.",
      steps: [
        { title: "Clone a template", body: "Pick a vertical and clone its repo. Auth, data, and theme tokens are already wired." },
        { title: "Drop in your Brand Kit", body: "Import a portable Brand Kit and every block follows your colors and fonts." },
        { title: "Deploy", body: "Push to Vercel or self-host on your own Convex. Your data stays yours." },
      ],
    },
  },

  collection: {
    type: "collection",
    name: "Collection",
    description:
      "A shared list (services, work...) as cards. Point several blocks at one source to keep them in sync.",
    component: Collection,
    collection: true,
    fields: [
      { key: "label", label: "Eyebrow label", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      {
        key: "source",
        label: "Collection name",
        type: "text",
        placeholder: "services",
      },
      { key: "limit", label: "Show", type: "select", options: ["all", "3", "6", "9", "12"] },
      { key: "viewAllLabel", label: "View-all label", type: "text" },
      { key: "viewAllHref", label: "View-all link", type: "text" },
    ],
    defaults: {
      label: "",
      heading: "Services",
      source: "services",
      limit: "all",
      viewAllLabel: "",
      viewAllHref: "",
    },
  },

  pricing: {
    type: "pricing",
    name: "Pricing",
    description: "Tiered pricing cards.",
    component: Pricing,
    fields: [
      { key: "label", label: "Eyebrow label", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      {
        key: "tiers",
        label: "Tiers",
        type: "list",
        itemLabel: "tier",
        itemFields: [
          { key: "name", label: "Name", type: "text" },
          { key: "price", label: "Price", type: "text" },
          { key: "period", label: "Period", type: "text" },
          { key: "featured", label: "Featured", type: "boolean" },
          { key: "href", label: "Button link", type: "text" },
          {
            key: "features",
            label: "Features",
            type: "list",
            itemLabel: "feature",
            item: { key: "", label: "Feature", type: "text" },
          },
        ],
      },
    ],
    defaults: {
      label: "Pricing",
      heading: "Pick the plan that ships with you.",
      tiers: [
        { name: "Starter", price: "$0", period: "/forever", href: "#", features: ["Core features", "Community support"] },
        { name: "Pro", price: "$19", period: "/month", featured: true, href: "#", features: ["Everything in Starter", "Priority support", "Advanced features"] },
      ],
    },
  },

  testimonials: {
    type: "testimonials",
    name: "Testimonials",
    description: "Quote cards from customers.",
    component: Testimonials,
    fields: [
      { key: "label", label: "Eyebrow label", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      {
        key: "items",
        label: "Testimonials",
        type: "list",
        itemLabel: "testimonial",
        itemFields: [
          { key: "quote", label: "Quote", type: "textarea" },
          { key: "author", label: "Author", type: "text" },
          { key: "role", label: "Role", type: "text" },
        ],
      },
    ],
    defaults: {
      label: "Loved by builders",
      heading: "What people say.",
      items: [
        { quote: "This saved us weeks. We shipped a branded site in a single afternoon.", author: "Priya Nair", role: "Founder, Calmwater Studio" },
        { quote: "The cleanest starter I have used. Production patterns, not toy examples.", author: "Marcus Lehmann", role: "Engineer" },
      ],
    },
  },

  faq: {
    type: "faq",
    name: "FAQ",
    description: "An accordion of questions.",
    component: Faq,
    fields: [
      { key: "label", label: "Eyebrow label", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      {
        key: "items",
        label: "Questions",
        type: "list",
        itemLabel: "question",
        itemFields: [
          { key: "q", label: "Question", type: "text" },
          { key: "a", label: "Answer", type: "textarea" },
        ],
      },
    ],
    defaults: {
      label: "FAQ",
      heading: "Questions, answered",
      items: [
        { q: "How do I get started?", a: "Clone the template, run the setup, and deploy. It takes a few minutes." },
        { q: "Can I bring my own branding?", a: "Yes. Export a Brand Kit and import it into any template, entirely client-side." },
      ],
    },
  },

  cta: {
    type: "cta",
    name: "Call to action",
    description: "A closing CTA band.",
    component: Cta,
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "subtitle", label: "Subtitle", type: "textarea" },
      { key: "ctaLabel", label: "Primary button label", type: "text" },
      { key: "ctaHref", label: "Primary button link", type: "text" },
      { key: "secondaryLabel", label: "Secondary button label", type: "text" },
      { key: "secondaryHref", label: "Secondary button link", type: "text" },
    ],
    defaults: {
      title: "Ready to ship?",
      subtitle: "Start from a template, make it yours, and deploy today.",
      ctaLabel: "Get started",
      ctaHref: "/#gallery",
    },
  },
};

// Palette order.
export const BLOCK_ORDER = [
  "hero", "stats", "logos", "featureGrid", "steps",
  "collection", "pricing", "testimonials", "faq", "cta",
];

// The item shape inside a shared collection (the generic card). The builder's
// inspector edits collections[source] with this schema; blocks read these keys.
export const COLLECTION_ITEM_FIELDS: Field[] = [
  { key: "title", label: "Title", type: "text" },
  { key: "blurb", label: "Blurb", type: "textarea" },
  { key: "icon", label: "Icon", type: "select", options: ICONS },
  { key: "href", label: "Link", type: "text" },
];

// New block instance with a fresh id + a deep copy of its defaults (so edits
// never mutate the shared default object). crypto.randomUUID is called on a
// user action (client) — never during SSR render, so hydration stays stable.
export function createInstance(type: string): BlockInstance {
  const def = REGISTRY[type];
  return {
    id: `${type}-${crypto.randomUUID().slice(0, 8)}`,
    type,
    props: structuredClone(def.defaults),
  };
}

// Seed config — the starting canvas (also the all-blocks showcase). Static ids
// so SSR + hydration match.
export const DEFAULT_CONFIG: PageConfig = {
  version: 1,
  blocks: [
    {
      id: "hero-seed",
      type: "hero",
      props: {
        label: "The shared block library",
        title: "Compose a page from blocks, then ship it in every template.",
        subtitle:
          "These are the exact blocks each template renders. Add sections, edit content, point collections at one source, and export a portable config.",
        align: "left",
        ctaLabel: "Browse templates",
        ctaHref: "/#gallery",
        secondaryLabel: "Build your Brand Kit",
        secondaryHref: "/brand-kit",
      },
    },
    {
      id: "stats-seed",
      type: "stats",
      props: {
        stats: [
          { value: "7", label: "Verticals" },
          { value: "<5 min", label: "Clone to deploy" },
          { value: "100%", label: "Type-safe" },
          { value: "$0", label: "Account needed" },
        ],
      },
    },
    {
      id: "logos-seed",
      type: "logos",
      props: {
        label: "The same blocks, on brand in every template",
        names: ["Calmwater", "Northbound", "Ledgerwise", "Aperture", "Fieldnote", "Riverbank"],
      },
    },
    {
      id: "features-seed",
      type: "featureGrid",
      props: {
        title: "Everything wired before you clone it",
        features: [
          { icon: "auth", title: "Convex auth, already plumbed", body: "Email and OAuth sign-in, session handling, and per-user row ownership ship pre-configured. Swap your provider keys and you have a real account system, not a login page mockup." },
          { icon: "data", title: "Reactive data layer", body: "Convex queries push live updates to every open tab, no polling or websocket glue." },
          { icon: "security", title: "Authz at the mutation", body: "Every write checks the caller, so a fresh deploy is never silently read-only." },
          { icon: "design", title: "Drop-in Brand Kit", body: "Colors, fonts, and logo load from a portable kit, no rebuild to rebrand." },
          { icon: "performance", title: "Next.js 16 defaults", body: "Cache Components and streaming on by default, tuned for Vercel and self-host alike." },
        ],
      },
    },
    {
      id: "steps-seed",
      type: "steps",
      props: {
        label: "How it works",
        heading: "Clone, brand, deploy.",
        steps: [
          { title: "Clone a template", body: "Pick a vertical and clone its repo. Auth, data, and theme tokens are already wired." },
          { title: "Drop in your Brand Kit", body: "Import a portable Brand Kit and every block follows your colors and fonts." },
          { title: "Deploy", body: "Push to Vercel or self-host on your own Convex. Your data stays yours." },
        ],
      },
    },
    {
      id: "services-featured-seed",
      type: "collection",
      props: {
        label: "What we do",
        heading: "A few services, previewed on the landing page.",
        source: "services",
        limit: "3",
        viewAllLabel: "View all services",
        viewAllHref: "/services",
      },
    },
    {
      id: "pricing-seed",
      type: "pricing",
      props: {
        label: "Pricing",
        heading: "Pick the plan that ships with you.",
        tiers: [
          { name: "Solo", price: "$0", period: "/forever", href: "/#gallery", features: ["Clone any 1 template", "Brand Kit export, client-side", "Self-host on your own Convex", "Community support"] },
          { name: "Studio", price: "$24", period: "/month", featured: true, href: "/#gallery", features: ["All production templates", "Unlimited Brand Kits", "One-command deploy guide", "Priority issue triage", "Convex schema migrations"] },
          { name: "Agency", price: "$89", period: "/month", href: "/#gallery", features: ["Everything in Studio", "White-label the portal", "5 client workspaces", "Onboarding call"] },
        ],
      },
    },
    {
      id: "testimonials-seed",
      type: "testimonials",
      props: {
        label: "Shipped with it",
        heading: "Teams clone, brand, and deploy in an afternoon.",
        items: [
          { quote: "We forked the booking template on Monday and had a branded client portal live by Thursday. The Convex schema was the part I expected to fight, and it just worked.", author: "Priya Nair", role: "Founder, Calmwater Studio" },
          { quote: "The Brand Kit export is the trick. One color and logo pass, dropped into three different templates, and every site felt like ours instead of a starter.", author: "Marcus Lehmann", role: "Design lead, Northbound Agency" },
          { quote: "I am not a backend person. The setup guide got me from clone to deployed without a single Convex error, which has genuinely never happened to me before.", author: "Dao Tran", role: "Solo developer" },
          { quote: "We evaluated four boilerplates. This was the only one where the demo code matched production patterns instead of toy examples we had to rewrite.", author: "Elena Castro", role: "CTO, Ledgerwise" },
        ],
      },
    },
    {
      id: "faq-seed",
      type: "faq",
      props: {
        label: "FAQ",
        heading: "Questions, answered",
        items: [
          { q: "Do I need a Convex account to run a template locally?", a: "No. Every template runs against your own Convex deployment. Run npx convex dev once and it provisions a dev backend tied to your repo, no portal account required." },
          { q: "How does the Brand Kit get into a template?", a: "Build your Brand Kit here, export the portable JSON, and import it inside any template's settings. Colors, fonts, logo, and voice apply instantly, entirely client-side." },
          { q: "Can I deploy to Vercel instead of self-hosting?", a: "Yes. Each template ships a build:auto step that couples a Convex deploy with next build. Set NEXT_PUBLIC_CONVEX_URL and CONVEX_DEPLOY_KEY in Vercel and push." },
          { q: "Will updating a template overwrite my data?", a: "No. convex deploy migrates schema without touching documents. Pull the latest template code, redeploy, and your existing records stay intact." },
        ],
      },
    },
    {
      id: "services-all-seed",
      type: "collection",
      props: {
        label: "Services",
        heading: "The same source, rendered in full on its own page.",
        source: "services",
        limit: "all",
      },
    },
    {
      id: "cta-seed",
      type: "cta",
      props: {
        title: "Compose your own, ship it this weekend.",
        subtitle: "Start from any template, mix in the blocks you need, drop in your Brand Kit, and deploy. No account, no lock-in.",
        ctaLabel: "Browse templates",
        ctaHref: "/#gallery",
        secondaryLabel: "Build your Brand Kit",
        secondaryHref: "/brand-kit",
      },
    },
  ],
  // One shared source. Both collection blocks above read `services`, so editing
  // an item once updates the landing preview AND the full list together.
  collections: {
    services: [
      { title: "Product strategy", blurb: "From positioning to roadmap, shaped around what your users actually do.", icon: "brand", href: "/services" },
      { title: "Design systems", blurb: "A token-driven UI kit your team can extend without breaking the brand.", icon: "design", href: "/services" },
      { title: "Full-stack build", blurb: "Typed end to end, reactive data, shipped on Vercel or self-host.", icon: "code", href: "/services" },
      { title: "Performance audit", blurb: "Find the slow paths, fix the Core Web Vitals, prove it with numbers.", icon: "performance", href: "/services" },
      { title: "Auth and accounts", blurb: "Real sign-in, sessions, and per-user ownership wired from day one.", icon: "auth", href: "/services" },
      { title: "Analytics setup", blurb: "Event tracking and dashboards that answer the questions you ask.", icon: "analytics", href: "/services" },
    ],
  },
  // A dedicated page for the SAME `services` collection. The home preview block
  // and this page's full block read one source, so editing an item updates both.
  pages: [
    {
      id: "services-page",
      name: "Services",
      path: "/services",
      blocks: [
        {
          id: "svc-hero",
          type: "hero",
          props: {
            label: "Services",
            title: "Everything we do, on one page.",
            subtitle:
              "This dedicated page renders the full services collection. The landing page shows a preview of the very same source.",
            align: "left",
          },
        },
        {
          id: "svc-all",
          type: "collection",
          props: { heading: "All services", source: "services", limit: "all" },
        },
        {
          id: "svc-cta",
          type: "cta",
          props: {
            title: "Need something specific?",
            subtitle: "Tell us what you are building and we will scope it.",
            ctaLabel: "Get in touch",
            ctaHref: "/#gallery",
          },
        },
      ],
    },
  ],
};

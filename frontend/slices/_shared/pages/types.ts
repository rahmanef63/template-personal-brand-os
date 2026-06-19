// Page CRUD shared types — used by every website-template's admin Pages
// feature. Each template seeds its own SEED_PAGES; the schema is uniform.

export type PageStatus = "draft" | "published";

export type CtaLink = { label: string; href: string };

export type PageBlock =
  | { kind: "hero"; headline: string; sub?: string; cta?: CtaLink }
  | { kind: "text"; heading?: string; body: string }
  | { kind: "feature-list"; heading?: string; items: { title: string; body: string }[] }
  | { kind: "cta"; headline: string; sub?: string; cta: CtaLink }
  | { kind: "logo-cloud"; heading?: string; logos: { label: string; alt?: string }[] }
  | { kind: "testimonial"; quote: string; author: string; role?: string }
  | { kind: "video"; heading?: string; src: string; caption?: string }
  | { kind: "image-gallery"; heading?: string; images: { src: string; alt: string }[] }
  | { kind: "faq"; heading?: string; items: { q: string; a: string }[] }
  | { kind: "stats"; heading?: string; items: { value: string; label: string }[] }
  | {
      kind: "pricing-table";
      heading?: string;
      tiers: { name: string; price: string; period?: string; bullets: string[]; cta?: CtaLink; featured?: boolean }[];
    };

export type PageBlockKind = PageBlock["kind"];

export const PAGE_BLOCK_KINDS: PageBlockKind[] = [
  "hero",
  "text",
  "feature-list",
  "cta",
  "logo-cloud",
  "testimonial",
  "video",
  "image-gallery",
  "faq",
  "stats",
  "pricing-table",
];

export const BLOCK_KIND_LABEL: Record<PageBlockKind, string> = {
  hero: "Hero",
  text: "Text",
  "feature-list": "Feature list",
  cta: "CTA band",
  "logo-cloud": "Logo cloud",
  testimonial: "Testimonial",
  video: "Video",
  "image-gallery": "Image gallery",
  faq: "FAQ",
  stats: "Stats",
  "pricing-table": "Pricing table",
};

export type PageEntry = {
  id: string;
  slug: string;
  title: string;
  description: string;
  blocks: PageBlock[];
  status: PageStatus;
  createdAt: number;
  updatedAt: number;
  duplicatedFrom?: string;
  /** System pages = JSX-based originals. Listed read-only in admin; can be
   *  duplicated to custom, can never be deleted/edited via the page editor. */
  systemPage?: boolean;
  /** BE-wave forward-compat — exactly ONE page per template should be
   *  marked as landing. Admin sidebar's "Landing" link routes to this
   *  page's editor. BF-wave will migrate `state.landingSections[]` to
   *  live on this page as `sections[]`. */
  isLanding?: boolean;
  /** BE-wave forward-compat — section-based composition (richer than
   *  blocks). LandingSection schema with image / ratio / bg / className
   *  / config / order. Optional today; will replace `blocks[]` in BF. */
  sections?: import("../landing/types").LandingSection[];
};

export type PagesSlice = {
  pages: PageEntry[];
};

export type PagesAction =
  | { type: "PAGE_CREATE"; payload: PageEntry }
  | { type: "PAGE_UPDATE"; payload: { id: string; patch: Partial<Omit<PageEntry, "id" | "createdAt">> } }
  | { type: "PAGE_DELETE"; payload: { id: string } }
  | { type: "PAGE_REORDER_BLOCK"; payload: { id: string; from: number; to: number } }
  // BI-wave — section CRUD inside a page. Same LandingSection schema
  // used by the landing slice — landing-as-page unification.
  | { type: "PAGE_SECTION_UPSERT"; payload: { pageId: string; section: import("../landing/types").LandingSection } }
  | { type: "PAGE_SECTION_DELETE"; payload: { pageId: string; sectionId: string } };

/** Default empty block for the +Add block dropdown. */
export function emptyBlock(kind: PageBlockKind): PageBlock {
  switch (kind) {
    case "hero":
      return { kind: "hero", headline: "New hero", sub: "" };
    case "text":
      return { kind: "text", heading: "", body: "Lorem ipsum…" };
    case "feature-list":
      return { kind: "feature-list", heading: "Features", items: [{ title: "Item", body: "Description" }] };
    case "cta":
      return { kind: "cta", headline: "Get started", cta: { label: "Sign up", href: "#" } };
    case "logo-cloud":
      return { kind: "logo-cloud", heading: "Trusted by", logos: [{ label: "Brand" }] };
    case "testimonial":
      return { kind: "testimonial", quote: "Quote here.", author: "Name" };
    case "video":
      return { kind: "video", src: "https://example.com/video.mp4", caption: "" };
    case "image-gallery":
      return { kind: "image-gallery", images: [{ src: "https://placehold.co/600x400", alt: "" }] };
    case "faq":
      return { kind: "faq", heading: "FAQ", items: [{ q: "Question?", a: "Answer." }] };
    case "stats":
      return { kind: "stats", heading: "By the numbers", items: [{ value: "100+", label: "Customers" }] };
    case "pricing-table":
      return {
        kind: "pricing-table",
        heading: "Pricing",
        tiers: [{ name: "Free", price: "$0", bullets: ["Feature one"] }],
      };
  }
}

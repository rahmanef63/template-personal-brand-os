import { TESTIMONIALS as LC_TESTIMONIALS } from "@/convex/landingContent";

export const HERO_IMG = "/hero.webp";

/** Testimonials render fallback, derived from the single source
 *  (convex/landingContent.ts). The seed writes the same items into the
 *  testimonials section config; here we map the module's `author` field to the
 *  `name` key this template's TestimonialsGrid expects. Edit content in the
 *  module, not here. */
export const TESTIMONIALS = LC_TESTIMONIALS.map((t) => ({
  quote: t.quote,
  name: t.author,
  role: t.role,
}));

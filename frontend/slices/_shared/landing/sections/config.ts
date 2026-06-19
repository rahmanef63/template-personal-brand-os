/**
 * Shared config parsing for the landing sections library. Every section
 * reads `LandingSection.config` (free-form JSON, editable in the admin
 * landing editor) and merges it OVER the template-provided defaults, so
 * content stays dashboard-controlled without code edits.
 *
 * Recognized keys per kind (all optional):
 *   stats        { "stats": [{ "value": 120, "suffix": "+", "label": "Klien" }], "clients": ["Acme", …] }
 *   testimonials { "items": [{ "quote": "…", "author": "…", "role": "…", "rating": 5 }], "limit": 9 }
 *   faq          { "items": [{ "q": "…", "a": "…" }], "ctaLabel": "…", "ctaHref": "/contact" }
 *   pricing      { "tiers": [{ "name": "…", "price": "…", "period": "/bln", "features": ["…"], "featured": true, "ctaLabel": "…", "ctaHref": "…" }] }
 *   newsletter   { "placeholder": "…", "buttonLabel": "…", "successText": "…" }
 *   custom       { "body": ["paragraf 1", "paragraf 2"], "ctaLabel": "…", "ctaHref": "…" }
 */

export type StatItem = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

export type TestimonialItem = {
  quote: string;
  author: string;
  role?: string;
  rating?: number;
};

export type FaqItem = { q: string; a: string };

export type PricingTier = {
  name: string;
  price: string;
  period?: string;
  blurb?: string;
  features: string[];
  ctaLabel?: string;
  ctaHref?: string;
  featured?: boolean;
};

/** Safe parse — returns {} on empty/invalid JSON, never throws. */
export function parseConfigObject(config?: string): Record<string, unknown> {
  if (!config) return {};
  try {
    const parsed = JSON.parse(config);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

export function cfgString(cfg: Record<string, unknown>, key: string): string | undefined {
  return typeof cfg[key] === "string" ? (cfg[key] as string) : undefined;
}

export function cfgNumber(cfg: Record<string, unknown>, key: string): number | undefined {
  return typeof cfg[key] === "number" && Number.isFinite(cfg[key] as number)
    ? (cfg[key] as number)
    : undefined;
}

/** Array-of-objects extractor: keeps items passing the row guard. Returns
 *  undefined when the key is absent/not an array/yields zero valid rows —
 *  callers fall back to template defaults. */
export function cfgArray<T>(
  cfg: Record<string, unknown>,
  key: string,
  rowGuard: (row: unknown) => row is T,
): T[] | undefined {
  const raw = cfg[key];
  if (!Array.isArray(raw)) return undefined;
  const rows = raw.filter(rowGuard);
  return rows.length > 0 ? rows : undefined;
}

const isObj = (v: unknown): v is Record<string, unknown> =>
  Boolean(v) && typeof v === "object" && !Array.isArray(v);

export const isStatItem = (v: unknown): v is StatItem =>
  isObj(v) && typeof v.value === "number" && typeof v.label === "string";

export const isTestimonialItem = (v: unknown): v is TestimonialItem =>
  isObj(v) && typeof v.quote === "string" && typeof v.author === "string";

export const isFaqItem = (v: unknown): v is FaqItem =>
  isObj(v) && typeof v.q === "string" && typeof v.a === "string";

export const isPricingTier = (v: unknown): v is PricingTier =>
  isObj(v) &&
  typeof v.name === "string" &&
  typeof v.price === "string" &&
  Array.isArray(v.features) &&
  v.features.every((f) => typeof f === "string");

export const isString = (v: unknown): v is string => typeof v === "string";

// Feature-section config resolver for the personal-brand LandingRenderer.
// Icons can't live in JSON config, so admin feature items carry a lucide
// icon NAME (string) which we map back to a component here. Unknown/missing
// names fall back to Sparkles so the grid never renders an empty cell.

import {
  Code2,
  Compass,
  Mic,
  PenLine,
  Sparkles,
} from "lucide-react";
import type { FeatureItem } from "@/features/_shared";
import {
  cfgArray,
  parseConfigObject,
} from "@/features/_shared/landing/sections";
import { FEATURES } from "@/convex/landingContent";

const FEATURE_ICONS: Record<string, NonNullable<FeatureItem["icon"]>> = {
  Compass,
  Code2,
  PenLine,
  Mic,
  Sparkles,
};

// Render fallback, derived from the single source (convex/landingContent.ts).
// The seed writes the same FEATURES (icon NAMES) into Convex config; here the
// names map back to lucide components for the local fallback.
export const BRAND_FEATURES: FeatureItem[] = FEATURES.map((f) => ({
  icon: FEATURE_ICONS[f.icon] ?? Sparkles,
  title: f.title,
  blurb: f.blurb,
}));

type FeatureConfigItem = { icon?: string; title: string; blurb: string };

const isFeatureConfigItem = (v: unknown): v is FeatureConfigItem =>
  Boolean(v) &&
  typeof v === "object" &&
  typeof (v as FeatureConfigItem).title === "string" &&
  typeof (v as FeatureConfigItem).blurb === "string";

/** Resolve admin `{ items: [{ icon?, title, blurb }] }` from config, mapping
 *  icon names to components; falls back to the template defaults
 *  (BRAND_FEATURES) when config has no valid items. */
export function resolveFeatureItems(config?: string): FeatureItem[] {
  const rows = cfgArray(parseConfigObject(config), "items", isFeatureConfigItem);
  if (!rows) return BRAND_FEATURES;
  return rows.map((r) => ({
    icon: (r.icon && FEATURE_ICONS[r.icon]) || Sparkles,
    title: r.title,
    blurb: r.blurb,
  }));
}

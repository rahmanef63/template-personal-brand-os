import type { LandingSection } from "./types";

/**
 * Sensible defaults — every website template ships with these 5 sections
 * so the admin UI never shows an empty list. Templates override per-flavor
 * by passing a custom array to seed instead of calling this factory.
 */
export function defaultLandingSections(): LandingSection[] {
  return [
    {
      id: "ls-hero",
      order: 10,
      kind: "hero",
      title: "Welcome — start here.",
      subtitle: "Tagline for the visitor's first scroll.",
      enabled: true,
    },
    {
      id: "ls-features",
      order: 20,
      kind: "features",
      title: "What you get",
      subtitle: "Three to six items the visitor needs to scan in 10 seconds.",
      enabled: true,
    },
    {
      id: "ls-pricing",
      order: 30,
      kind: "pricing",
      title: "Pricing",
      subtitle: "Simple, transparent tiers.",
      enabled: false,
    },
    {
      id: "ls-changelog",
      order: 40,
      kind: "changelog",
      title: "What's new",
      subtitle: "Recent updates.",
      enabled: false,
    },
    {
      id: "ls-cta",
      order: 50,
      kind: "cta",
      title: "Ready to start?",
      subtitle: "Drop-in call-to-action that closes the page.",
      enabled: true,
    },
  ];
}

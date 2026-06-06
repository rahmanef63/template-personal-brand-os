// Contracts for the onboarding-wizard slice. PROPS-DRIVEN (R3): no
// convex/react import anywhere in this slice — the host wires its own
// backend calls (settings.upsert, seed.seedSample, setup.status) into props.

import type * as React from "react";

/** Site identity fields collected by the wizard. All optional — the backend
 *  `settings.upsert` patches only what is provided. */
export interface OnboardingFields {
  siteName: string;
  tagline: string;
  ownerName: string;
  contactEmail: string;
  brandColor: string;
  themeDefault: string;
  /** tweakcn preset name — the site-wide color preset ("" = template default). */
  themePreset: string;
  logoUrl: string;
  faviconUrl: string;
  analyticsId: string;
}

/** Image upload control injected into the wizard (backend-coupled in the
 *  host repo — e.g. a Convex `ImageField`). */
export type ImageFieldComponent = React.ComponentType<{
  label: string;
  onUploaded: (url: string) => void;
}>;

/** One theme preset offered by the Branding step picker. The host builds
 *  these from its theme system (e.g. the theme-presets slice registry +
 *  `tweakcnSwatches`). Plain strings also accepted upstream — see
 *  `normalizePresetOptions`. */
export interface PresetOption {
  /** Stable preset id stored in `themePreset` (e.g. "cosmic-night"). */
  name: string;
  /** Human label; falls back to `name`. */
  label?: string;
  /** Optional group header (e.g. "Profesional", "Gelap"). */
  group?: string;
  /** Tiny color swatches rendered next to the label (any CSS color). */
  swatches?: string[];
}

/** Hosts may pass bare preset names; normalize to PresetOption[]. */
export function normalizePresetOptions(
  options: ReadonlyArray<string | PresetOption> | undefined,
): PresetOption[] {
  if (!options) return [];
  return options.map((o) => (typeof o === "string" ? { name: o } : o));
}

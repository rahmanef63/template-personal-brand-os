/**
 * Shared `landingSections` slice — admin-editable composition of the
 * public landing page. Mount into a template by:
 *
 *   • importing `LandingSection` into State + reducer (state.landingSections)
 *   • dispatching LANDING_UPSERT / LANDING_DELETE actions
 *   • wrapping StoreProvider with LandingProvider (landing-context.tsx)
 *   • registering /admin/landing routes that render <LandingView/> + <LandingEditorView id/>
 *
 * Per-template public renderers map `kind` → canonical slice components.
 * See saas-marketing/slices/home/LandingRenderer.tsx for the reference impl.
 */

export type LandingSectionKind =
  | "hero"
  | "features"
  | "testimonials"
  | "pricing"
  | "blog"
  | "changelog"
  | "faq"
  | "portfolio"
  | "services"
  | "stats"
  | "newsletter"
  | "cta"
  | "custom";

export type LandingSection = {
  id: string;
  /** Render order on the home page. Lower numbers render first. */
  order: number;
  /** Section type — picks which canonical slice renders. */
  kind: LandingSectionKind;
  /** Section heading (also used as admin label). */
  title: string;
  /** Optional subtitle / lead paragraph. */
  subtitle?: string;
  /** Toggle to hide on / without deleting. */
  enabled: boolean;
  /** Optional foreground image (hero illustration, feature graphic, etc.).
   *  Threaded into the per-template renderer for the matching kind. */
  imageUrl?: string;
  /** Aspect ratio for the foreground image. Renders via Tailwind
   *  aspect-* utilities. Defaults to 16:9 if unset. */
  imageRatio?: AspectRatio;
  /** Optional decorative background image (full-bleed band behind the
   *  section). Renderer composes with overlay/gradient. */
  bgImageUrl?: string;
  /** Custom Tailwind classes appended to the section wrapper. Use for
   *  one-off spacing / color / typography tweaks without touching code.
   *  Example: "py-24 bg-gradient-to-b from-background to-muted/40". */
  className?: string;
  /** Free-form JSON the renderer can interpret (kind-specific extras).
   *  Common keys: { badge: string } for hero badge override. */
  config?: string;
  /** Stacked hero background / foreground layers (images + custom HTML/CSS),
   *  each with its own opacity + on/off toggle. Empty / undefined => the
   *  template's built-in hero background (back-compat). Only the hero kind
   *  renders these. */
  layers?: HeroLayer[];
};

/** A single hero composition layer. `image` = a picture; `html` = a raw
 *  HTML block + optional CSS (author-controlled, admin-only). `placement`
 *  decides z-order: background sits behind the hero content, foreground
 *  above it (click-through). `opacity` (0-100) is the dashboard control
 *  that replaces the old hardcoded hero opacity. */
export type HeroLayer = {
  /** Stable id (React key + editor rows). */
  id: string;
  type: "image" | "html";
  /** Off => skipped at render (the "optional" toggle). */
  enabled: boolean;
  placement: "background" | "foreground";
  /** 0-100, applied as CSS opacity. */
  opacity: number;
  /** type=image: image URL or /public path. */
  url?: string;
  /** type=html: raw HTML injected into the layer. */
  html?: string;
  /** type=html: extra CSS injected in a <style> tag for this layer
   *  (global — scope your selectors). */
  css?: string;
};

export type AspectRatio =
  | "16:9"
  | "4:3"
  | "1:1"
  | "3:2"
  | "21:9"
  | "auto";

/** Tailwind aspect-* class for each ratio. Empty for "auto". */
export const ASPECT_RATIO_CLASS: Record<AspectRatio, string> = {
  "16:9": "aspect-video",
  "4:3": "aspect-[4/3]",
  "1:1": "aspect-square",
  "3:2": "aspect-[3/2]",
  "21:9": "aspect-[21/9]",
  "auto": "",
};

export type LandingAction =
  | { type: "LANDING_UPSERT"; payload: LandingSection }
  | { type: "LANDING_DELETE"; payload: { id: string } };

export interface LandingSlice {
  landingSections: LandingSection[];
}

import * as React from "react";
import type { FieldDef } from "@/components/templates/_shared/crud/types";
import { LandingConfigField } from "./landing-config-field";
import type { LandingSection } from "./types";

/** Single source of truth for the landing-section editor schema. Used
 *  by both list-dialog (LandingView) and full-page (LandingEditorView).
 *
 *  Layout strategy:
 *    • short structural fields (kind, order, enabled) live in the top
 *      2-col row,
 *    • everything content-bearing (title, subtitle, images, className,
 *      config) is `wide: true` so it spans both columns and gives the
 *      author room to type.
 *
 *  Hints carry usage examples so authors don't need to read code. */
export const LANDING_FIELDS: FieldDef<LandingSection>[] = [
  {
    kind: "select",
    key: "kind",
    label: "Kind",
    options: [
      { value: "hero", label: "Hero" },
      { value: "features", label: "Features grid" },
      { value: "testimonials", label: "Testimonials" },
      { value: "pricing", label: "Pricing tiers" },
      { value: "blog", label: "Blog cards" },
      { value: "changelog", label: "Changelog feed" },
      { value: "faq", label: "FAQ accordion" },
      { value: "portfolio", label: "Portfolio grid" },
      { value: "services", label: "Services band" },
      { value: "stats", label: "Stats strip" },
      { value: "newsletter", label: "Newsletter signup" },
      { value: "cta", label: "Call-to-action" },
      { value: "custom", label: "Custom" },
    ],
    hint: "Decides which renderer the template picks for this section.",
  },
  {
    kind: "position",
    key: "order",
    label: "Order",
    hint: "1 = top of the page. Dropdown lists all valid positions for this template; picking one auto-shifts the others to keep ordering consistent. Up/down arrows in the list also re-order.",
  },
  {
    kind: "switch",
    key: "enabled",
    label: "Visible on /",
    hint: "Toggle off to hide from public without deleting.",
  },

  {
    kind: "text",
    key: "title",
    label: "Title",
    wide: true,
    placeholder: "Section heading (e.g. \"Built for indie founders\")",
    hint: "Main heading shown on the public page. Also the admin label in the list.",
  },
  {
    kind: "textarea",
    key: "subtitle",
    label: "Subtitle / lead paragraph",
    rows: 3,
    hint: "Supporting copy under the title. Keep ~1–2 sentences for hero, ~1 line for other sections.",
  },

  {
    kind: "image",
    key: "imageUrl",
    label: "Foreground image",
    wide: true,
    placeholder: "https://images.unsplash.com/… or /covers/hero.jpg",
    hint: "Hero illustration, feature graphic, portfolio cover, etc. URL or /public path. Leave blank for text-only sections.",
  },
  {
    kind: "select",
    key: "imageRatio",
    label: "Image aspect ratio",
    options: [
      { value: "16:9", label: "16:9 (widescreen, default)" },
      { value: "4:3", label: "4:3 (classic)" },
      { value: "1:1", label: "1:1 (square)" },
      { value: "3:2", label: "3:2 (photo)" },
      { value: "21:9", label: "21:9 (ultrawide)" },
      { value: "auto", label: "auto (use the image's natural ratio)" },
    ],
    hint: "Controls how the foreground image is cropped. \"auto\" keeps the natural ratio.",
  },
  {
    kind: "image",
    key: "bgImageUrl",
    label: "Background image",
    wide: true,
    placeholder: "https://… (subtle textures work best)",
    hint: "Full-bleed background behind the section. A soft gradient scrim keeps text readable.",
  },

  {
    kind: "text",
    key: "className",
    label: "Custom style (Tailwind classNames)",
    wide: true,
    mono: true,
    placeholder: "py-24 bg-gradient-to-b from-background to-muted/40",
    hint: "Appended to the section wrapper. Use for one-off spacing / color / typography tweaks. Standard Tailwind utilities — same syntax as className= in JSX.",
  },
  {
    kind: "custom",
    key: "config",
    label: "Content / items",
    wide: true,
    hint:
      "Edit the section's items (features, FAQ, testimonials, pricing tiers, stats) " +
      "as structured rows. Leave empty to use the template's built-in sample content. " +
      "Use Advanced (raw JSON) for renderer extras like badge/columns/limit.",
    render: (value, onChange, ctx) =>
      React.createElement(LandingConfigField, {
        config: String(value ?? ""),
        kind: (ctx?.row as Record<string, unknown> | undefined)?.kind as string | undefined,
        onChange,
      }),
  },
];

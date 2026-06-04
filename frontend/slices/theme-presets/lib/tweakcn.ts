/**
 * Tweakcn theme preset loader — barrel.
 *
 * Public API:
 *   DEFAULT_PRESET / STORAGE_KEY / STYLE_ID
 *   applyTweakcnPreset / previewTweakcnPreset / restoreTweakcnPreset
 *   getSavedTweakcnPreset / clearTweakcnPreset / bootTweakcnPreset
 *   loadTweakcnRegistry / findTweakcnPreset / tweakcnSwatches
 *   groupTweakcnPresets / TWEAKCN_PRESET_GROUPS / HIDDEN_PRESETS
 *
 * ⚠ HOST GLOBALS.CSS CONTRACT — READ HOST-SETUP.md
 *
 * Adopters MUST configure their `app/globals.css` so the runtime
 * preset injection actually re-paints utility classes. Recap:
 *
 *   GOOD:
 *     @theme inline { --color-background: var(--background); }
 *     :root          { --background: hsl(0 0% 100%); }
 *
 *   BAD (Tailwind utilities silently ignore preset overrides):
 *     @theme inline { --color-background: hsl(var(--background)); }
 *     :root          { --background: 0 0% 100%; }
 *
 * Why: Tailwind 4 `@theme inline` INLINES the mapping expression at
 * each utility-class compile site. `bg-background` compiles to
 * literally `background-color: hsl(var(--background))`. When this
 * slice writes `:root { --background: oklch(...); }` at runtime,
 * the browser sees `hsl(oklch(...))` which is invalid CSS and gets
 * silently dropped — utility classes keep the base palette. Only
 * `--radius` / `--font-*` (not wrapped) survive, so adopters report
 * "only border radius and font change when I pick a preset".
 *
 * For alpha mixing inside global CSS use `color-mix(in oklab, var(--X)
 * N%, transparent)` instead of `hsl(var(--X) / N)` — `color-mix` is
 * format-agnostic so HSL defaults AND OKLCH presets both work.
 */

export {
  DEFAULT_PRESET, STORAGE_KEY, STYLE_ID,
} from "./tweakcn/types";

export type {
  TweakcnPresetItem, TweakcnRegistry, TweakcnPresetMeta, TweakcnPresetGroup,
} from "./tweakcn/types";

export {
  loadTweakcnRegistry, findTweakcnPreset, tweakcnSwatches,
} from "./tweakcn/registry";

export {
  applyTweakcnPreset, previewTweakcnPreset, restoreTweakcnPreset,
  getSavedTweakcnPreset, clearTweakcnPreset, bootTweakcnPreset,
} from "./tweakcn/apply";

export { TWEAKCN_PRESET_GROUPS, groupTweakcnPresets, HIDDEN_PRESETS } from "./tweakcn/groups";

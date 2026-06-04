/** theme-presets — bundled tweakcn-style color preset system + unified
 *  switcher. Drop ThemePresetProvider near the app root (inside
 *  next-themes' ThemeProvider), then mount ThemePresetSwitcher anywhere
 *  in the header / sidebar / settings. Registry ships INSIDE the slice
 *  (no consumer public/ setup needed; loaded lazily via dynamic import). */

export {
  ThemePresetProvider,
  useThemePreset,
  DEFAULT_PRESET_NAME,
} from "./components/ThemePresetProvider";
export { ThemePresetSwitcher } from "./components/ThemePresetSwitcher";
export { ThemeColorSync } from "./components/ThemeColorSync";
export { ThemeProviders } from "./components/ThemeProviders";

export {
  applyTweakcnPreset,
  bootTweakcnPreset,
  clearTweakcnPreset,
  findTweakcnPreset,
  getSavedTweakcnPreset,
  groupTweakcnPresets,
  HIDDEN_PRESETS,
  loadTweakcnRegistry,
  previewTweakcnPreset,
  restoreTweakcnPreset,
  tweakcnSwatches,
  TWEAKCN_PRESET_GROUPS,
} from "./lib/tweakcn";
export type {
  TweakcnPresetGroup,
  TweakcnPresetItem,
  TweakcnPresetMeta,
  TweakcnRegistry,
} from "./lib/tweakcn";

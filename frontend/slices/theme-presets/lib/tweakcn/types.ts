export interface TweakcnPresetItem {
  name: string;
  title: string;
  type?: string;
  description?: string;
  cssVars?: {
    theme?: Record<string, string>;
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
}

export interface TweakcnRegistry {
  name: string;
  items: TweakcnPresetItem[];
}

export interface TweakcnPresetMeta {
  name: string;
  title: string;
}

export interface TweakcnPresetGroup<
  T extends TweakcnPresetMeta = TweakcnPresetMeta,
> {
  id: string;
  label: string;
  items: T[];
}

export const STORAGE_KEY = "host:theme-preset";
export const STYLE_ID = "tweakcn-vars";

/** First-time visitors land on this preset. Pick something opinionated
 *  so the session is never "empty / unstyled" and the switcher's value
 *  is discoverable from the first paint. Override by forking this
 *  constant — must match a `name` in registry-data.json. Recommended
 *  default = `"claude"` (warm minimal, works for both light + dark). */
export const DEFAULT_PRESET = "claude";

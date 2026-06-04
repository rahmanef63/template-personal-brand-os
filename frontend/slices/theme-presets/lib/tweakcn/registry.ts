import type { TweakcnPresetItem, TweakcnRegistry } from "./types";

let registryCache: TweakcnRegistry | null = null;
let registryPromise: Promise<TweakcnRegistry> | null = null;

/** Loads the bundled registry-data.json via dynamic import — Next.js +
 *  most bundlers code-split this into its own chunk, so the ~240KB JSON
 *  is fetched only when a consumer mounts the switcher (or otherwise
 *  calls `loadTweakcnRegistry`). No network roundtrip to a hosted URL,
 *  no consumer-side public/ setup required. */
export async function loadTweakcnRegistry(): Promise<TweakcnRegistry> {
  if (registryCache) return registryCache;
  if (registryPromise) return registryPromise;
  registryPromise = import("./registry-data.json")
    .then((mod) => {
      const data = (mod.default ?? mod) as TweakcnRegistry;
      const items = data.items.filter(
        (i) => i.cssVars?.light && i.cssVars?.dark,
      );
      registryCache = { ...data, items };
      return registryCache;
    });
  return registryPromise;
}

export function findTweakcnPreset(
  registry: TweakcnRegistry,
  name: string,
): TweakcnPresetItem | undefined {
  return registry.items.find((i) => i.name === name);
}

export function tweakcnSwatches(preset: TweakcnPresetItem): string[] {
  const v = preset.cssVars?.light ?? preset.cssVars?.dark ?? {};
  return [
    v.background ?? "oklch(1 0 0)",
    v.foreground ?? "oklch(0 0 0)",
    v.primary ?? "oklch(0.5 0.1 259)",
    v.accent ?? "oklch(0.5 0.1 200)",
    v.destructive ?? "oklch(0.6 0.2 25)",
  ];
}

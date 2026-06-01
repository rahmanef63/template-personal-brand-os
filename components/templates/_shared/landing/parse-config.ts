// LandingSection.config helpers — shared across 8 template LandingRenderers.
// Operasi Mise M4-BO (2026-05-20) — extracted from 5 templates with
// identical `parseConfigBadge` definitions.

/** Extract `{"badge": "…"}` from a section's optional config JSON.
 *  Returns undefined when config is empty, invalid JSON, or badge
 *  field is not a string. Never throws — used inline in JSX. */
export function parseConfigBadge(config?: string): string | undefined {
  return parseConfigField<string>(config, "badge", (v): v is string => typeof v === "string");
}

/** Generic single-field extractor with a runtime guard. Returns the
 *  value when present and matching the guard, undefined otherwise.
 *  Use this when a renderer wants to pull `{"variant": "…"}` or
 *  `{"orientation": "…"}` etc. from the same config field. */
export function parseConfigField<T>(
  config: string | undefined,
  key: string,
  guard: (v: unknown) => v is T,
): T | undefined {
  if (!config) return undefined;
  try {
    const parsed = JSON.parse(config) as Record<string, unknown>;
    return guard(parsed[key]) ? parsed[key] : undefined;
  } catch {
    return undefined;
  }
}

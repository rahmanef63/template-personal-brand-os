// Stable URL slug for a collection item: an explicit `slug` wins, otherwise it is
// derived from the title. Shared by the Collection block (card links) and the
// per-item detail route so both resolve the same path. Plain function, no deps —
// safe to import from a server route or a client block.
export function itemSlug(item: { slug?: unknown; title?: unknown }): string {
  const explicit = typeof item.slug === "string" ? item.slug.trim() : "";
  if (explicit) return explicit;
  const title = typeof item.title === "string" ? item.title : "";
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

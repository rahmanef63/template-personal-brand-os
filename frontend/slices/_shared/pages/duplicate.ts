import type { PageEntry } from "./types";

/** Clone a page entry. New id, " (copy)" suffix on title, fresh slug,
 *  draft status, systemPage cleared, links source via duplicatedFrom. */
export function duplicatePage(source: PageEntry, opts?: { slug?: string; title?: string }): PageEntry {
  const id = `page-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
  const slug = opts?.slug ?? `${source.slug}-copy`;
  const title = opts?.title ?? `${source.title} (copy)`;
  const now = Date.now();
  return {
    id,
    slug,
    title,
    description: source.description,
    blocks: JSON.parse(JSON.stringify(source.blocks)),
    status: "draft",
    createdAt: now,
    updatedAt: now,
    duplicatedFrom: source.id,
    systemPage: false,
  };
}

export function blankPage(seedSlug = "untitled"): PageEntry {
  const id = `page-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
  const now = Date.now();
  return {
    id,
    slug: seedSlug,
    title: "Untitled",
    description: "",
    blocks: [],
    status: "draft",
    createdAt: now,
    updatedAt: now,
    systemPage: false,
  };
}

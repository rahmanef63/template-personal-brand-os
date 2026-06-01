import { FileText } from "lucide-react";
import type { AdminNavItem } from "../types/common";
import type { PageEntry } from "./types";

/**
 * BF-wave — derive sidebar nav items from the Pages CRUD store. Every
 * non-system page becomes a Pages-group menu item linking to its
 * editor. Pure function — call inside `buildAdminNav` / `buildAdminPrimaryNav`
 * so the sidebar re-renders the moment a new page is created in admin.
 *
 * @param pages    current `state.pages[]`
 * @param baseHref absolute prefix to the page editor (usually `${ADMIN_BASE}/pages`)
 * @param opts.icon    override lucide icon (default FileText)
 * @param opts.status  "all" (default) shows drafts + published; "published" hides drafts
 * @param opts.sort    "alpha" (default), "updated" (newest first), "created" (newest first)
 */
export function buildCustomPageNavItems(
  pages: PageEntry[],
  baseHref: string,
  opts?: {
    icon?: any;
    status?: "all" | "published";
    sort?: "alpha" | "updated" | "created";
  },
): AdminNavItem[] {
  const icon = opts?.icon ?? FileText;
  const statusFilter = opts?.status ?? "all";
  const sortMode = opts?.sort ?? "alpha";

  const list = pages.filter((p) => !p.systemPage);
  const filtered =
    statusFilter === "all" ? list : list.filter((p) => p.status === "published");

  filtered.sort((a, b) => {
    if (sortMode === "alpha") return (a.title || "").localeCompare(b.title || "");
    if (sortMode === "updated") return b.updatedAt - a.updatedAt;
    return b.createdAt - a.createdAt;
  });

  return filtered.map((p) => ({
    id: `pages-custom-${p.id}`,
    label: p.title || "Untitled",
    href: `${baseHref}/${p.id}`,
    icon,
    count: p.status === "draft" ? null : null, // count slot reserved for future status badge
  }));
}

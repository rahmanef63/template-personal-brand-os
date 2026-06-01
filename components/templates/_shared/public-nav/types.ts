/**
 * BG-wave — public-nav CRUD primitives. Templates that opt in expose
 * a state-driven PUBLIC_NAV (instead of the legacy hard-coded array
 * in nav-config.ts), letting operators add / rename / reorder / bind
 * nav items to any page (system or custom) via the admin UI.
 *
 * Chassis only — per-template wiring deferred to BH-wave.
 */

export type PublicNavItem = {
  id: string;
  label: string;
  /** Either an absolute href (external) OR a page-binding via pageRef. */
  href?: string;
  /** Binds to a PageEntry.id — admin can swap pages without rewriting
   *  href. Renderer resolves: pageRef → /<page-slug>. */
  pageRef?: string;
  order: number;
  enabled: boolean;
  /** Open external link in new tab when href is absolute. */
  external?: boolean;
};

export type PublicNavSlice = {
  publicNav: PublicNavItem[];
};

export type PublicNavAction =
  | { type: "PUBLIC_NAV_UPSERT"; payload: PublicNavItem }
  | { type: "PUBLIC_NAV_DELETE"; payload: { id: string } }
  | { type: "PUBLIC_NAV_REORDER"; payload: { id: string; direction: "up" | "down" } };

// Shared types consumed by all website-templates (T1, T2, T3+).
// Keep this file framework-agnostic — no React imports.

export type Brand = {
  brandLetter: string;
  brandName: string;
  tagline: string;
  description: string;
  baseUrl: string;
  twitter: string;
  email: string;
  defaultLocale: "id-ID" | "en-US";
  themeColor: string;
};

export type NavItem = {
  label: string;
  href: string;
};

export type AdminNavItem = NavItem & {
  id: string;
  /** lucide icon component — passed as React.ComponentType to admin shell */
  icon?: any;
  /** small badge count next to nav label */
  count?: number | null;
  /** Nested sub-items. When present, the entry renders as a
   *  Collapsible parent inside the admin SidebarMenu with a
   *  SidebarMenuSub for the children. The parent's `href` is still
   *  navigable (e.g. clicking "Pages" can hit /admin/pages); the
   *  chevron handles expand/collapse independently. */
  children?: AdminNavItem[];
};

/**
 * BE-wave — grouped admin nav. Each group renders as a labeled
 * `<SidebarGroup>` in the admin sidebar. Templates that want the
 * Pages/Features/Settings split return an array of these instead of
 * a flat AdminNavItem[]. Flat shape stays supported for backwards compat.
 */
export type AdminNavGroup = {
  id: string;
  label: string;
  items: AdminNavItem[];
  /** When true, first item gets home-aware active matching (root link). */
  homeAware?: boolean;
};

export type User = {
  name: string;
  role: string;
  initials: string;
  email?: string;
};

export type Cta = {
  label: string;
  href: string;
};

/**
 * BG-wave (Advanced archetype) — workspace context. Templates that
 * opt into multi-tenant workspaces (e.g. notion-page-clone-os) expose
 * an array of these to the WorkspaceSwitcher in the sidebar header.
 * Generic shape — per-template entity (workspace / project / org)
 * adapts to this contract.
 */
export type WorkspaceContext = {
  id: string;
  name: string;
  /** Emoji or short string rendered in the avatar tile. */
  icon?: string;
  /** Optional sublabel (role / plan / tier). */
  sublabel?: string;
};

/**
 * BG-wave — secondary sidebar item (three-column layout). Narrow
 * contextual sub-nav shown between the primary sidebar and main content.
 * Used by admin pages that have rich sub-navigation (e.g. RBAC config,
 * notion-style page tree). Simpler shape than AdminNavItem — no nested
 * children, no counts.
 */
export type SecondaryNavItem = {
  id: string;
  label: string;
  href: string;
  icon?: any;
  /** Optional small descriptor under the label. */
  meta?: string;
};

export type FooterColumn = {
  heading: string;
  items: { label: string; href: string }[];
};

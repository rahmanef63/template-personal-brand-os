// Per-template nav config. Imported by app/preview layouts and any slice
// that needs PUBLIC_BASE / ADMIN_BASE constants.
//
// NOTE: `/*` is the rr sandbox path. Consumers
// installing via `npx rr add personal-brand-os` (default `--at root`) get
// these constants auto-rewritten to "" / "/admin" by the CLI's
// `rewritePreviewPaths()` step — so edits below stay on the rr side.

import {
  BookOpen,
  Bot,
  Briefcase,
  Database,
  FileText,
  Inbox,
  LayoutDashboard,
  LayoutTemplate,
  LineChart,
  Mail,
  MessageSquare,
  NotebookPen,
  Newspaper,
  ShoppingCart,
  Sparkles,
  UserRound,
  Users,
  Wand2,
} from "lucide-react";
import type { AdminNavGroup, AdminNavItem, FooterColumn, NavItem, User } from "@/components/templates/_shared/types/common";
import type { State } from "./types";
import { DEFAULT_SITE_CONFIG, TEMPLATE_SLUG } from "./site-config";
import { buildCustomPageNavItems } from "@/components/templates/_shared/pages/nav-builder";
import { buildAdminPanelNav } from "@/components/templates/_shared/admin-panel/feature-blocks";
import { buildTemplatePaths } from "@/components/templates/_shared/config/template-paths";

const paths = buildTemplatePaths(TEMPLATE_SLUG);
export const PUBLIC_BASE = paths.publicBase;
export const DASHBOARD_BASE = paths.dashboardBase;
export const ADMIN_PANEL_BASE = paths.adminPanelBase;
export const WORKSPACE_BASE = paths.workspaceBase;
/** @deprecated use ADMIN_PANEL_BASE */
export const ADMIN_BASE = ADMIN_PANEL_BASE;

export const PUBLIC_NAV: NavItem[] = [
  { label: "About", href: `${PUBLIC_BASE}/about` },
  { label: "Blog", href: `${PUBLIC_BASE}/blog` },
  { label: "Portfolio", href: `${PUBLIC_BASE}/portfolio` },
  { label: "Services", href: `${PUBLIC_BASE}/services` },
  { label: "Resources", href: `${PUBLIC_BASE}/resources` },
  { label: "Contact", href: `${PUBLIC_BASE}/contact` },
];

export const PUBLIC_CTA = { label: "Book a call", href: `${PUBLIC_BASE}/services` };

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Site",
    items: PUBLIC_NAV,
  },
  {
    heading: "Legal",
    items: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "RSS", href: "#" },
      { label: "llms.txt", href: "#" },
    ],
  },
];

export const FOOTER_TAGLINE = "Built with Personal Brand OS";

export const OWNER_USER: User = {
  name: DEFAULT_SITE_CONFIG.ownerName,
  role: DEFAULT_SITE_CONFIG.ownerRole,
  initials: DEFAULT_SITE_CONFIG.ownerInitials,
  email: DEFAULT_SITE_CONFIG.email,
};

/**
 * Build admin primary nav with live counts from the store. Pass the current
 * state from useStore() inside the layout (sidebar reads these reactively).
 */
export function buildAdminPrimaryNav(state: State): AdminNavItem[] {
  const draftCount = state.posts.filter((p) => p.status !== "published").length;
  const pendingComments = state.comments.filter((c) => c.status === "pending").length;
  const newLeads = state.leads.filter((l) => l.status === "new").length;
  const flaggedChats = state.chatSessions.filter((s) => s.flagged).length;
  const pendingSubs = state.subscribers.filter((s) => s.status === "pending").length;
  const customPages = state.pages.filter((p) => !p.systemPage).length;
  const enabledLanding = state.landingSections.filter((s) => s.enabled).length;
  return [
    { id: "dashboard", label: "Dashboard", href: ADMIN_BASE,                  icon: LayoutDashboard, count: null },
    // "Pages" parent — collapsible group bundling every content surface
    // that maps to a public page (landing, blog, portfolio, services,
    // resources). Each child reuses an existing CRUD route.
    {
      id: "pages",
      label: "Pages",
      href: `${ADMIN_BASE}/pages`,
      icon: Newspaper,
      count: customPages || null,
      children: [
        { id: "pages-all",       label: "All pages",    href: `${ADMIN_BASE}/pages`,     icon: Newspaper,      count: customPages || null },
        { id: "pages-landing",   label: "Landing page", href: `${ADMIN_BASE}/landing`,   icon: LayoutTemplate, count: enabledLanding || null },
        { id: "pages-blog",      label: "Blog",         href: `${ADMIN_BASE}/posts`,     icon: FileText,       count: draftCount || null },
        { id: "pages-portfolio", label: "Portfolio",    href: `${ADMIN_BASE}/portfolio`, icon: Briefcase,      count: state.portfolio.length || null },
        { id: "pages-services",  label: "Services",     href: `${ADMIN_BASE}/services`,  icon: Sparkles,       count: state.services.length || null },
        { id: "pages-resources", label: "Resources",    href: `${ADMIN_BASE}/resources`, icon: BookOpen,       count: state.resources.length || null },
        // BF-wave — dynamic custom pages (every admin-created page shows here).
        ...buildCustomPageNavItems(state.pages, `${ADMIN_BASE}/pages`),
      ],
    },
    { id: "leads",     label: "Leads",     href: `${ADMIN_BASE}/leads`,       icon: Inbox,           count: newLeads || null },
    { id: "orders",    label: "Orders",    href: `${ADMIN_BASE}/orders`,      icon: ShoppingCart,    count: null },
    { id: "newsletter",label: "Newsletter",href: `${ADMIN_BASE}/newsletter`,  icon: Mail,            count: pendingSubs || null },
    { id: "comments",  label: "Comments",  href: `${ADMIN_BASE}/comments`,    icon: MessageSquare,   count: pendingComments || null },
    { id: "chatbot",   label: "Chatbot",   href: `${ADMIN_BASE}/chatbot`,     icon: Bot,             count: flaggedChats || null },
    { id: "analytics", label: "Analytics", href: `${ADMIN_BASE}/analytics`,   icon: LineChart,       count: null },
    { id: "notes",     label: "Notes",     href: `${ADMIN_BASE}/notes`,       icon: NotebookPen,     count: null },
    { id: "database",  label: "Database",  href: `${ADMIN_BASE}/database`,    icon: Database,        count: null },
  ];
}

export const ADMIN_SETTINGS_NAV: AdminNavItem[] = [
  { id: "profile", label: "Profile",   href: `${ADMIN_BASE}/settings/site`, icon: UserRound },
  { id: "ai",   label: "AI Config", href: `${ADMIN_BASE}/settings/ai`,   icon: Wand2 },
  { id: "team", label: "Team",      href: `${ADMIN_BASE}/settings/team`, icon: Users },
];


/**
 * BG-wave — grouped admin nav: [Overview, Pages, Features, Admin Panel].
 * Pages = CMS items (every admin route bound to a public surface).
 * Features = template-specific domain entities (clients / leads / etc).
 * Admin Panel = cross-template operational tools (AI / Analytics /
 * Users / Audit / Webhooks / Settings) — same blocks every template.
 *
 * Derives from the legacy flat `buildAdminPrimaryNav` so the source
 * of truth for per-template items stays in one place.
 */
export function buildAdminNav(state: State): AdminNavGroup[] {
  const flat = buildAdminPrimaryNav(state);
  const dashboard = flat.find((i) => i.id === "dashboard");
  const pagesParent = flat.find((i) => i.id === "pages");
  const features = flat.filter((i) => i.id !== "dashboard" && i.id !== "pages");
  const groups: AdminNavGroup[] = [];
  if (dashboard) groups.push({ id: "overview", label: "Overview", homeAware: true, items: [dashboard] });
  if (pagesParent?.children?.length) {
    groups.push({ id: "pages", label: "Pages", items: pagesParent.children });
  }
  if (features.length) groups.push({ id: "features", label: "Features", items: features });
  groups.push({ id: "admin-panel", label: "Admin Panel", items: buildAdminPanelNav(ADMIN_BASE) });
  return groups;
}

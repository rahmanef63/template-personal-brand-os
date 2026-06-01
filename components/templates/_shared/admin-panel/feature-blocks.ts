import {
  Activity,
  Bot,
  History,
  Settings2,
  Users,
  Webhook,
} from "lucide-react";
import type { AdminNavItem } from "../types/common";

/**
 * BG-wave — operational features that live in the Admin Panel group
 * of the sidebar. Distinct from CMS (Pages group) and Domain Features
 * (template-specific business entities). These blocks are CROSS-TEMPLATE
 * — every website-template ships the same Admin Panel feature set so
 * operators have a consistent admin surface regardless of the
 * underlying template.
 *
 * Each block is a route stub today; BH-wave wires real implementations
 * (sync from notion-page-clone / superspace slices).
 */
export type FeatureBlock = {
  id: string;
  /** URL segment under /dashboard/admin/admin-panel/ */
  segment: string;
  label: string;
  description: string;
  icon: any;
  /** Future: which rr slice powers this block (for /rr lift) */
  poweredBy?: string;
};

export const ADMIN_PANEL_BLOCKS: FeatureBlock[] = [
  {
    id: "ai-config",
    segment: "ai-config",
    label: "AI Config",
    description: "Model selection, system prompts, content moderation rules.",
    icon: Bot,
    poweredBy: "ai-router",
  },
  {
    id: "analytics",
    segment: "analytics",
    label: "Analytics",
    description: "Page views, event funnels, traffic sources.",
    icon: Activity,
    poweredBy: "event-tracking",
  },
  {
    id: "users",
    segment: "users",
    label: "User Management",
    description: "Roles, permissions, invitations, sessions.",
    icon: Users,
    poweredBy: "rbac-roles",
  },
  {
    id: "audit-log",
    segment: "audit-log",
    label: "Audit Log",
    description: "Who changed what, when. Filter by actor / entity / action.",
    icon: History,
    poweredBy: "audit-log",
  },
  {
    id: "webhooks",
    segment: "webhooks",
    label: "Webhooks",
    description: "Outbound HTTP hooks for entity events. Signed payloads.",
    icon: Webhook,
  },
  {
    id: "settings",
    segment: "settings",
    label: "Settings",
    description: "Workspace settings, integrations, API keys.",
    icon: Settings2,
  },
];

/**
 * Build the Admin Panel sidebar items from the registry, prefixed with
 * the template's admin base. Called inside each template's
 * `buildAdminNav` so all 8 templates share the exact same Admin Panel
 * group composition.
 */
export function buildAdminPanelNav(adminBase: string): AdminNavItem[] {
  const base = `${adminBase}/admin-panel`;
  return ADMIN_PANEL_BLOCKS.map((b) => ({
    id: `admin-panel-${b.id}`,
    label: b.label,
    href: `${base}/${b.segment}`,
    icon: b.icon,
    count: null,
  }));
}

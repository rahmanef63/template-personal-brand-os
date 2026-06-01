"use client";

import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";
import type { AdminNavGroup, AdminNavItem, Brand, User } from "../types/common";

/**
 * Simple-archetype dashboard shell mounted under
 * `/preview/<template>/dashboard/admin/`. Single sidebar, no workspace
 * switcher, no secondary sidebar. Used by every template whose admin
 * surface is just CMS work (Pages, Posts, …).
 *
 * Templates with multi-workspace context OR many non-CMS surfaces
 * (e.g. notion-page-clone-os) should opt into `DashboardShellAdvanced`
 * once BE-wave ships it (three-column layout + workspace switcher +
 * secondary sidebar). See docs/architecture/dashboard-vision.md.
 */
export function DashboardShell({
  brand,
  appLabel,
  homeHref,
  primaryNav,
  primaryNavGroups,
  settingsNav,
  user,
  searchPlaceholder,
  notifCount,
  topbarActions,
  children,
}: {
  brand: Brand;
  appLabel: string;
  homeHref: string;
  /** Flat legacy nav (renders as one "Workspace" group). */
  primaryNav?: AdminNavItem[];
  /** Grouped nav (Pages / Features / etc). Takes precedence when set. */
  primaryNavGroups?: AdminNavGroup[];
  settingsNav?: AdminNavItem[];
  user: User;
  searchPlaceholder?: string;
  notifCount?: number;
  topbarActions?: ReactNode;
  children: ReactNode;
}) {
  // Topbar needs a flat list for the mobile sheet — flatten groups when present.
  const topbarNav: AdminNavItem[] =
    primaryNavGroups?.flatMap((g) => g.items) ?? primaryNav ?? [];
  return (
    <SidebarProvider defaultOpen>
      <AdminSidebar
        brand={brand}
        appLabel={appLabel}
        homeHref={homeHref}
        primaryNav={primaryNav}
        primaryNavGroups={primaryNavGroups}
        settingsNav={settingsNav}
        user={user}
      />
      <SidebarInset className="bg-background text-foreground min-w-0">
        <AdminTopbar
          brand={brand}
          appLabel={appLabel}
          homeHref={homeHref}
          primaryNav={topbarNav}
          settingsNav={settingsNav}
          user={user}
          searchPlaceholder={searchPlaceholder}
          notifCount={notifCount}
          actions={topbarActions}
        />
        <main className="flex-1 overflow-auto p-4 md:p-6 min-w-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

/** @deprecated use {@link DashboardShell} — kept for AZ-wave migration */
export const AdminShell = DashboardShell;

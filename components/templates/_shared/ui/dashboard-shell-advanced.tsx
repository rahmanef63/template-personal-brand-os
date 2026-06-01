"use client";

import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";
import type {
  AdminNavGroup,
  AdminNavItem,
  Brand,
  User,
  WorkspaceContext,
} from "../types/common";

/**
 * BG-wave — Advanced archetype shell. Mounts the same primary
 * AdminSidebar as `DashboardShell` PLUS a `<WorkspaceSwitcher>` in the
 * header AND leaves room for a page-level `<SecondarySidebar>` inside
 * main. Use this for templates that have multi-tenant workspaces
 * and/or many non-CMS surfaces (notion-page-clone-os is the canary).
 *
 * Simple-archetype templates (most) should keep using `DashboardShell`.
 * See docs/architecture/dashboard-vision.md for the decision matrix.
 */
export function DashboardShellAdvanced({
  brand,
  appLabel,
  homeHref,
  primaryNavGroups,
  primaryNav,
  settingsNav,
  user,
  searchPlaceholder,
  notifCount,
  topbarActions,
  workspaceSwitcher,
  children,
}: {
  brand: Brand;
  appLabel: string;
  homeHref: string;
  primaryNavGroups?: AdminNavGroup[];
  primaryNav?: AdminNavItem[];
  settingsNav?: AdminNavItem[];
  user: User;
  searchPlaceholder?: string;
  notifCount?: number;
  topbarActions?: ReactNode;
  /** Pre-built WorkspaceSwitcher node — template builds it with its
   *  own onSwitch / onCreate / onManage handlers so the chassis stays
   *  store-agnostic. */
  workspaceSwitcher?: ReactNode;
  children: ReactNode;
}) {
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
        headerSlot={workspaceSwitcher}
      />
      <SidebarInset className="min-w-0 bg-background text-foreground">
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
        <div className="min-w-0 flex-1 overflow-hidden">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

/** Re-export the WorkspaceContext alias so consumers only import from
 *  this file when adopting the Advanced shell. */
export type { WorkspaceContext };

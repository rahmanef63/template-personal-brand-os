"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LeafNavItem,
  ParentNavItem,
  isPathActive,
} from "./admin-nav-items";
import { NavUser } from "./nav-user";
import type {
  AdminNavGroup,
  AdminNavItem,
  Brand,
  User,
} from "../types/common";

type SidebarProps = {
  brand: Pick<Brand, "brandLetter" | "brandName">;
  appLabel: string;
  homeHref: string;
  /** Flat nav — legacy single-group shape (renders as "Workspace"). */
  primaryNav?: AdminNavItem[];
  /** Grouped nav — Pages / Features / Settings split. When provided,
   *  takes precedence over `primaryNav`. */
  primaryNavGroups?: AdminNavGroup[];
  settingsNav?: AdminNavItem[];
  user: User;
  /** BG-wave (Advanced archetype) — override the sidebar header
   *  (defaults to BrandHeader). Used by DashboardShellAdvanced to
   *  mount a `<WorkspaceSwitcher>` instead. */
  headerSlot?: React.ReactNode;
};

function NavGroup({
  label,
  items,
  homeAware = false,
}: {
  label: string;
  items: AdminNavItem[];
  homeAware?: boolean;
}) {
  const pathname = usePathname() ?? "";
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((n, i) =>
            n.children && n.children.length > 0 ? (
              <ParentNavItem key={n.id} item={n} pathname={pathname} />
            ) : (
              <LeafNavItem
                key={n.id}
                item={n}
                active={isPathActive(pathname, n.href, homeAware && i === 0)}
              />
            ),
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function BrandHeader({ brand, appLabel, homeHref }: Pick<SidebarProps, "brand" | "appLabel" | "homeHref">) {
  return (
    <Link
      href={homeHref}
      className="group/brand flex items-center gap-2 px-2 py-1.5 transition-colors hover:bg-sidebar-accent rounded-md"
    >
      <div className="grid size-8 shrink-0 place-items-center rounded-md bg-foreground text-sm font-bold text-background transition-transform group-hover/brand:scale-105">
        {brand.brandLetter}
      </div>
      <div className="min-w-0 group-data-[collapsible=icon]:hidden">
        <p className="truncate text-sm font-semibold">{brand.brandName}</p>
        <p className="truncate text-[11px] text-muted-foreground">{appLabel}</p>
      </div>
    </Link>
  );
}

/**
 * Template admin sidebar. Wraps shadcn `Sidebar` primitive — inherits
 * cmd/ctrl+B toggle, cookie-persisted open state, and auto-built mobile
 * Sheet drawer. Consumer must wrap parent in `<SidebarProvider>` (the
 * `<AdminShell>` does this for you).
 */
export function AdminSidebar(props: SidebarProps) {
  return (
    <Sidebar collapsible="icon" className="border-r border-border/60">
      <SidebarHeader>
        {props.headerSlot ?? (
          <BrandHeader brand={props.brand} appLabel={props.appLabel} homeHref={props.homeHref} />
        )}
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        {props.primaryNavGroups && props.primaryNavGroups.length > 0 ? (
          props.primaryNavGroups.map((g) => (
            <NavGroup key={g.id} label={g.label} items={g.items} homeAware={g.homeAware} />
          ))
        ) : (
          <NavGroup label="Workspace" items={props.primaryNav ?? []} homeAware />
        )}
        {props.settingsNav && props.settingsNav.length > 0 && (
          <NavGroup label="Settings" items={props.settingsNav} />
        )}
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <NavUser user={props.user} homeHref={props.homeHref} />
      </SidebarFooter>
    </Sidebar>
  );
}

/**
 * Sidebar collapse trigger. Renders at ALL breakpoints — under md it
 * toggles the offcanvas sheet, at md+ it toggles between expanded and
 * the icon-rail (collapsible="icon" on Sidebar). Previously `md:hidden`
 * meant desktop users had no way to collapse the sidebar; that's fixed.
 */
export function AdminSidebarMobileTrigger(_props: SidebarProps) {
  return <SidebarTrigger />;
}

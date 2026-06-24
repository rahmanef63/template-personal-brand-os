"use client";

import * as React from "react";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminSidebarMobileTrigger } from "./admin-sidebar";
import type { AdminNavItem, Brand, User } from "../types/common";

/**
 * Shared admin topbar — search + notifications + actions slot.
 *
 * Per-template: pass `actions` slot for things like "New post", "Reset demo",
 * profile menu. Notification count is rendered if > 0.
 */
export function AdminTopbar({
  searchPlaceholder = "Search…",
  notifCount = 0,
  actions,
  // Sidebar trigger props (passes through to mobile sheet)
  brand,
  appLabel,
  homeHref,
  primaryNav,
  settingsNav,
  user,
}: {
  searchPlaceholder?: string;
  notifCount?: number;
  actions?: React.ReactNode;
  brand: Pick<Brand, "brandLetter" | "brandName">;
  appLabel: string;
  homeHref: string;
  primaryNav: AdminNavItem[];
  settingsNav?: AdminNavItem[];
  user: User;
}) {
  return (
    <header className="flex h-14 items-center gap-2 border-b border-border/60 bg-background px-4">
      <AdminSidebarMobileTrigger
        brand={brand}
        appLabel={appLabel}
        homeHref={homeHref}
        primaryNav={primaryNav}
        settingsNav={settingsNav}
        user={user}
      />
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event("cmdk:open"))}
        className="relative flex max-w-md flex-1 items-center gap-2 rounded-md border border-border/60 bg-background px-2.5 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-accent/40"
        aria-label="Open command palette"
      >
        <Search className="size-4 shrink-0" />
        <span className="flex-1 truncate">{searchPlaceholder}</span>
        <kbd className="pointer-events-none hidden select-none rounded border border-border/60 bg-muted px-1.5 font-mono text-[10px] sm:inline">
          ⌘K
        </kbd>
      </button>
      <div className="flex items-center gap-1.5">
        {actions}
        <Button size="icon" variant="ghost" className="relative size-9" aria-label="Notifications">
          <Bell className="size-4" />
          {notifCount > 0 && (
            <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-amber-500 text-[9px] font-medium text-background">
              {notifCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SecondaryNavItem } from "../types/common";

/**
 * BG-wave (Advanced archetype) — narrow contextual sub-nav rendered
 * between the primary sidebar and main content. Wrap content with
 * `<SecondarySidebarLayout>` to get the three-column composition:
 * primary sidebar (handled by DashboardShellAdvanced) | this | <main>.
 *
 * Inspired by superspace `FeatureThreeColumnLayout` — same idiom,
 * leaner shape (no right inspector by default, BH wave can add).
 */
export function SecondarySidebar({
  title,
  items,
  footer,
  className,
}: {
  title?: string;
  items: SecondaryNavItem[];
  footer?: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname() ?? "";
  return (
    <aside
      className={cn(
        "hidden w-60 shrink-0 border-r border-border/60 bg-muted/20 md:flex md:flex-col",
        className,
      )}
    >
      {title ? (
        <div className="border-b border-border/60 px-4 py-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </h2>
        </div>
      ) : null}
      <ScrollArea className="flex-1">
        <nav className="space-y-0.5 p-2">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-foreground/5 font-medium text-foreground"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                )}
              >
                {Icon ? <Icon className="size-3.5" /> : null}
                <span className="truncate">{item.label}</span>
                {item.meta ? (
                  <span className="ml-auto text-[10px] text-muted-foreground">
                    {item.meta}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      {footer ? (
        <div className="border-t border-border/60 px-3 py-2">{footer}</div>
      ) : null}
    </aside>
  );
}

/**
 * Layout wrapper for admin pages that opt into the secondary sidebar.
 * Mount inside `<main>` of `DashboardShellAdvanced` (or just
 * `DashboardShell`). Renders `<SecondarySidebar>` to the left and
 * `<children>` to the right.
 */
export function SecondarySidebarLayout({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-w-0">
      {sidebar}
      <div className="min-w-0 flex-1 overflow-auto p-4 md:p-6">{children}</div>
    </div>
  );
}

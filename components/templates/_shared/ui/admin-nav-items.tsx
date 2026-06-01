"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import type { AdminNavItem } from "../types/common";

export function isPathActive(pathname: string, href: string, isHome: boolean): boolean {
  return isHome ? pathname === href : pathname === href || pathname.startsWith(href + "/");
}

function itemContainsActive(item: AdminNavItem, pathname: string): boolean {
  if (isPathActive(pathname, item.href, false)) return true;
  return Boolean(item.children?.some((c) => isPathActive(pathname, c.href, false)));
}

/** Collapsible parent — follows the canonical shadcn `NavMain` pattern
 *  (group/collapsible + group-data-[state=open]/collapsible:rotate-90)
 *  so the chevron rotates via CSS without per-instance state. Children
 *  use `next/link` (rr best practice: never raw <a> for internal nav). */
export function ParentNavItem({
  item,
  pathname,
}: {
  item: AdminNavItem;
  pathname: string;
}) {
  const Icon = item.icon;
  const containsActive = itemContainsActive(item, pathname);
  return (
    <Collapsible
      asChild
      defaultOpen={containsActive}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton isActive={containsActive} tooltip={item.label}>
            {Icon && <Icon className="size-4" />}
            <span className="flex-1 truncate">{item.label}</span>
            <ChevronRight className="ml-auto size-3.5 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        {item.count != null && item.count > 0 && (
          <SidebarMenuBadge className="right-7">{item.count}</SidebarMenuBadge>
        )}
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children!.map((child) => {
              const childActive = isPathActive(pathname, child.href, false);
              const ChildIcon = child.icon;
              return (
                <SidebarMenuSubItem key={child.id}>
                  <SidebarMenuSubButton asChild isActive={childActive}>
                    <Link href={child.href}>
                      {ChildIcon && <ChildIcon className="size-3.5" />}
                      <span className="flex-1 truncate">{child.label}</span>
                      {child.count != null && child.count > 0 && (
                        <SidebarMenuBadge>{child.count}</SidebarMenuBadge>
                      )}
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

/** Plain link item — no children. */
export function LeafNavItem({
  item,
  active,
}: {
  item: AdminNavItem;
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
        <Link href={item.href}>
          {Icon && <Icon className="size-4" />}
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
      {item.count != null && item.count > 0 && (
        <SidebarMenuBadge>{item.count}</SidebarMenuBadge>
      )}
    </SidebarMenuItem>
  );
}

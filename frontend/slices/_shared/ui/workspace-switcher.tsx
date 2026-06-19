"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { WorkspaceContext } from "../types/common";

/**
 * BG-wave (Advanced archetype) — workspace CONTEXT switcher mounted in
 * the sidebar header of templates that opt into multi-tenant
 * workspaces. Distinct from any earlier "section toggle" — this swaps
 * the active workspace inside one section, not the section itself.
 *
 * Pattern lifted from notion-page-clone WorkspaceSwitcher (role-gated
 * actions, composable trigger) + shadcn sidebar-07 (size="lg" + ChevronsUpDown).
 *
 * Opt-in: templates that have a single workspace render BrandHeader
 * instead and don't import this.
 */
export function WorkspaceSwitcher({
  workspaces,
  activeId,
  onSwitch,
  onCreate,
  onManage,
}: {
  workspaces: WorkspaceContext[];
  activeId: string;
  onSwitch: (id: string) => void;
  /** When set, shows a "New workspace…" item in the dropdown footer. */
  onCreate?: () => void;
  /** When set, shows a "Manage workspaces" item in the dropdown footer. */
  onManage?: () => void;
}) {
  const { isMobile } = useSidebar();
  const active = workspaces.find((w) => w.id === activeId) ?? workspaces[0];
  if (!active) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="grid aspect-square size-8 shrink-0 place-items-center rounded-md bg-foreground text-base text-background">
                {active.icon ?? active.name.slice(0, 1).toUpperCase()}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{active.name}</span>
                {active.sublabel ? (
                  <span className="truncate text-xs text-muted-foreground">
                    {active.sublabel}
                  </span>
                ) : null}
              </div>
              <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-60" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-64"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Workspaces
            </DropdownMenuLabel>
            {workspaces.map((w) => {
              const isActive = w.id === active.id;
              return (
                <DropdownMenuItem
                  key={w.id}
                  onSelect={() => onSwitch(w.id)}
                  className={cn(
                    "gap-2 px-2 py-2",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                  )}
                >
                  <div className="grid size-7 shrink-0 place-items-center rounded-md border bg-background text-sm">
                    {w.icon ?? w.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{w.name}</p>
                    {w.sublabel ? (
                      <p className="truncate text-[11px] text-muted-foreground">
                        {w.sublabel}
                      </p>
                    ) : null}
                  </div>
                  {isActive ? <Check className="size-3.5 shrink-0" /> : null}
                </DropdownMenuItem>
              );
            })}
            {(onCreate || onManage) && <DropdownMenuSeparator />}
            {onCreate ? (
              <DropdownMenuItem onSelect={onCreate}>
                <Plus className="size-3.5" />
                <span className="text-sm">New workspace…</span>
              </DropdownMenuItem>
            ) : null}
            {onManage ? (
              <DropdownMenuItem onSelect={onManage}>
                <Settings className="size-3.5" />
                <span className="text-sm">Manage workspaces</span>
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

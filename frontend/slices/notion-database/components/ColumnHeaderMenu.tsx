"use client";

/** ColumnHeaderMenu — per-column dropdown, config-driven per property
 *  type (à la nosion). The visible items + their order come from
 *  `PROPERTY_TYPE_MENU_CONFIG[prop.type]` (./column-header/menu-config),
 *  so a number column shows Calculate, select/status show Group,
 *  computed types drop irrelevant ops — instead of one hardcoded list
 *  for every column. Items also self-hide when their host callback is
 *  absent, and section separators are inserted automatically between
 *  the items that actually render.
 *
 *  Pure callbacks — host wires each to its property-schema / view-config
 *  mutations. Pass only what the column should offer; omit the rest. */

import { Fragment, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type {
  Database, DatabaseViewConfig, Property, PropertyType,
} from "../types";
import { buildColumnHeaderActions } from "./column-header/actions";
import { PROPERTY_TYPE_MENU_CONFIG, sectionOf } from "./column-header/menu-config";
import { renderMenuItem } from "./column-header/items";

export interface ColumnHeaderMenuProps {
  prop: Property;
  /** Active view — drives filter / sort / group / calculate state. */
  view: DatabaseViewConfig;
  /** Column position within `db.properties` (move-left/right bounds). */
  index: number;
  propertyCount: number;
  /** Override the trigger. Defaults to the column name + chevron. */
  trigger?: ReactNode;
  /** Host database + workspace catalog — relation / rollup config panels
   *  need them to populate target pickers. Optional. */
  db?: Database;
  databases?: Database[];
  /** Merge a partial Property — backs the Edit-property panel (name,
   *  description, per-type config). */
  onPatch?: (patch: Partial<Property>) => void;
  onTypeChange?: (type: PropertyType) => void;
  onHide?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  /** offset -1 = insert left, +1 = insert right. */
  onInsert?: (offset: -1 | 1) => void;
  /** offset -1 = move left, +1 = move right. */
  onMove?: (offset: -1 | 1) => void;
  /** Patches the active view (filter / sort / group / calculate). */
  onViewConfigChange?: (patch: Partial<DatabaseViewConfig>) => void;
}

export function ColumnHeaderMenu({
  prop, view, index, propertyCount, trigger, db, databases,
  onPatch, onTypeChange, onHide, onDelete, onDuplicate, onInsert, onMove,
  onViewConfigChange,
}: ColumnHeaderMenuProps) {
  const { actions, flags } = buildColumnHeaderActions({
    prop, view, index, propertyCount,
    onPatch, onTypeChange, onHide, onDelete, onDuplicate, onInsert, onMove,
    onViewConfigChange,
  });
  const config = PROPERTY_TYPE_MENU_CONFIG[prop.type] ?? PROPERTY_TYPE_MENU_CONFIG.text;
  const ctx = { type: prop.type, prop, actions, flags, db, databases };

  // Render items first, drop the self-hidden ones, then place a
  // separator only between rendered items whose section differs.
  const rendered = config.mainMenu
    .map((key) => ({ key, node: renderMenuItem(key, ctx) }))
    .filter((r) => r.node !== null);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger ?? (
          <Button
            variant="ghost"
            type="button"
            className="flex h-auto w-full items-center justify-start gap-1 truncate px-0 text-left text-xs font-normal text-muted-foreground hover:bg-transparent hover:text-foreground"
            aria-label="Column menu"
          >
            <span className="truncate">{prop.name}</span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="bottom" className="w-56">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {prop.name} · {prop.type}
        </DropdownMenuLabel>
        {rendered.map((r, i) => {
          const prev = rendered[i - 1];
          const needsSeparator = prev !== undefined && sectionOf(prev.key) !== sectionOf(r.key);
          return (
            <Fragment key={r.key}>
              {needsSeparator && <DropdownMenuSeparator />}
              {r.node}
            </Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

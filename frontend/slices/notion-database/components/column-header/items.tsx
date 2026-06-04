"use client";

/** Registry of every column-header menu item. Each `MenuItemKey` maps
 *  to a render fn that reads `ctx.actions` / `ctx.flags` and self-hides
 *  when its capability is absent. To add an item: extend `MenuItemKey`
 *  (../types), add a renderer + registry entry here, then reference the
 *  key from any type's `mainMenu` (./menu-config). */

import {
  Sliders, Repeat, Filter, ArrowUpDown, Group, Sigma, EyeOff, Copy,
  ArrowLeftToLine, ArrowRightToLine, ArrowLeft, ArrowRight, Trash2, Check,
} from "lucide-react";
import {
  DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { calcLabel } from "../../lib/calcAggregate";
import { PROPERTY_TYPE_META, PROPERTY_TYPES_USER_ADDABLE } from "../../types";
import { EditPropertyPanel } from "./panels/EditPropertyPanel";
import type { MenuItemContext, MenuItemKey, MenuItemRenderer } from "./types";

const Spacer = () => <span className="mr-2 inline-block w-3.5" />;
const Mark = ({ on }: { on: boolean }) =>
  on ? <Check className="mr-2 h-3.5 w-3.5" /> : <Spacer />;
const Badge = ({ text }: { text: string }) => (
  <span className="ml-auto truncate text-[10px] text-muted-foreground">{text}</span>
);

const EditPropertyItem: MenuItemRenderer = ({ prop, actions, db, databases }) =>
  actions.patch ? (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Sliders className="mr-2 h-3.5 w-3.5" /> Edit property
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent
        className="w-auto p-0"
        sideOffset={2}
        onKeyDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <EditPropertyPanel prop={prop} onPatch={actions.patch} db={db} databases={databases} />
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  ) : null;

const ChangeTypeItem: MenuItemRenderer = ({ type, actions }) =>
  actions.changeType ? (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Repeat className="mr-2 h-3.5 w-3.5" /> Change type
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="max-h-72 overflow-y-auto">
        {PROPERTY_TYPES_USER_ADDABLE.map((t) => (
          <DropdownMenuItem key={t} onClick={() => actions.changeType?.(t)}>
            <Mark on={t === type} />
            {PROPERTY_TYPE_META[t].label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  ) : null;

const FilterItem: MenuItemRenderer = ({ actions, flags }) =>
  actions.filter ? (
    <DropdownMenuItem onClick={actions.filter}>
      <Filter className="mr-2 h-3.5 w-3.5" /> Filter
      {flags.filtered && <Badge text="on" />}
    </DropdownMenuItem>
  ) : null;

const SortItem: MenuItemRenderer = ({ actions, flags }) =>
  actions.setSortDir ? (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <ArrowUpDown className="mr-2 h-3.5 w-3.5" /> Sort
        {flags.currentSort && <Badge text={flags.currentSort} />}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem onClick={() => actions.setSortDir?.("asc")}>
          <Mark on={flags.currentSort === "asc"} /> Ascending
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => actions.setSortDir?.("desc")}>
          <Mark on={flags.currentSort === "desc"} /> Descending
        </DropdownMenuItem>
        {flags.currentSort && actions.clearSort && (
          <DropdownMenuItem onClick={actions.clearSort}>
            <Spacer /> Clear sort
          </DropdownMenuItem>
        )}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  ) : null;

const GroupItem: MenuItemRenderer = ({ actions, flags }) =>
  actions.group && flags.groupable ? (
    <DropdownMenuItem onClick={actions.group}>
      <Group className="mr-2 h-3.5 w-3.5" /> {flags.grouped ? "Ungroup" : "Group by"}
      {flags.grouped && <Check className="ml-auto h-3.5 w-3.5" />}
    </DropdownMenuItem>
  ) : null;

const CalculateItem: MenuItemRenderer = ({ actions, flags }) => {
  if (!actions.setCalc || !flags.isTable || flags.calcs.length === 0) return null;
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Sigma className="mr-2 h-3.5 w-3.5" /> Calculate
        {flags.currentCalc !== "none" && <Badge text={calcLabel(flags.currentCalc)} />}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="max-h-72 overflow-y-auto">
        <DropdownMenuItem onClick={() => actions.setCalc?.("none")}>
          <Mark on={flags.currentCalc === "none"} /> None
        </DropdownMenuItem>
        {flags.calcs.map((c) => (
          <DropdownMenuItem key={c} onClick={() => actions.setCalc?.(c)}>
            <Mark on={flags.currentCalc === c} /> {calcLabel(c)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
};

const HideItem: MenuItemRenderer = ({ actions }) =>
  actions.hide ? (
    <DropdownMenuItem onClick={actions.hide}>
      <EyeOff className="mr-2 h-3.5 w-3.5" /> Hide
    </DropdownMenuItem>
  ) : null;

const DuplicateItem: MenuItemRenderer = ({ actions }) =>
  actions.duplicate ? (
    <DropdownMenuItem onClick={actions.duplicate}>
      <Copy className="mr-2 h-3.5 w-3.5" /> Duplicate
    </DropdownMenuItem>
  ) : null;

const InsertLeftItem: MenuItemRenderer = ({ actions }) =>
  actions.insertLeft ? (
    <DropdownMenuItem onClick={actions.insertLeft}>
      <ArrowLeftToLine className="mr-2 h-3.5 w-3.5" /> Insert left
    </DropdownMenuItem>
  ) : null;

const InsertRightItem: MenuItemRenderer = ({ actions }) =>
  actions.insertRight ? (
    <DropdownMenuItem onClick={actions.insertRight}>
      <ArrowRightToLine className="mr-2 h-3.5 w-3.5" /> Insert right
    </DropdownMenuItem>
  ) : null;

const MoveLeftItem: MenuItemRenderer = ({ actions, flags }) =>
  actions.moveLeft && flags.canMoveLeft ? (
    <DropdownMenuItem onClick={actions.moveLeft}>
      <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Move left
    </DropdownMenuItem>
  ) : null;

const MoveRightItem: MenuItemRenderer = ({ actions, flags }) =>
  actions.moveRight && flags.canMoveRight ? (
    <DropdownMenuItem onClick={actions.moveRight}>
      <ArrowRight className="mr-2 h-3.5 w-3.5" /> Move right
    </DropdownMenuItem>
  ) : null;

const DeleteItem: MenuItemRenderer = ({ actions }) =>
  actions.remove ? (
    <DropdownMenuItem
      onClick={actions.remove}
      className="text-destructive focus:text-destructive"
    >
      <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete property
    </DropdownMenuItem>
  ) : null;

export const MENU_ITEM_REGISTRY: Record<MenuItemKey, MenuItemRenderer> = {
  edit_property: EditPropertyItem,
  change_type: ChangeTypeItem,
  filter: FilterItem,
  sort: SortItem,
  group: GroupItem,
  calculate: CalculateItem,
  hide: HideItem,
  duplicate: DuplicateItem,
  insert_left: InsertLeftItem,
  insert_right: InsertRightItem,
  move_left: MoveLeftItem,
  move_right: MoveRightItem,
  delete: DeleteItem,
};

/** Render one menu item by key against a shared context. */
export function renderMenuItem(key: MenuItemKey, ctx: MenuItemContext) {
  const Renderer = MENU_ITEM_REGISTRY[key];
  return Renderer ? Renderer(ctx) : null;
}

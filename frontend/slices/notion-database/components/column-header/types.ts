/** Column-header menu type contracts (config-driven, à la nosion).
 *
 *  Each PropertyType declares which menu items appear — and in what
 *  order — via `PROPERTY_TYPE_MENU_CONFIG` (`./menu-config.ts`). Each
 *  `MenuItemKey` resolves to a render fn via `MENU_ITEM_REGISTRY`
 *  (`./items.tsx`). Every item receives a uniform `MenuItemContext`,
 *  so the parent menu never branches on property type.
 *
 *  rr adaptation vs upstream nosion: actions are PROP-DRIVEN (host
 *  wires callbacks) instead of pulled from a `useDbAdapter` store —
 *  so every action is optional and items self-hide when their
 *  callback is absent. Adding an item:
 *    1. extend `MenuItemKey`
 *    2. add a renderer + registry entry in `./items.tsx`
 *    3. reference the key from any type's `mainMenu` in `./menu-config.ts`
 */

import type { ReactElement } from "react";
import type {
  CalcKind, Database, Property, PropertyType,
} from "../../types";

/** Every supported main-menu item. Keep in sync with `MENU_ITEM_REGISTRY`. */
export type MenuItemKey =
  | "edit_property"
  | "change_type"
  | "filter"
  | "sort"
  | "group"
  | "calculate"
  | "hide"
  | "duplicate"
  | "insert_left"
  | "insert_right"
  | "move_left"
  | "move_right"
  | "delete";

/** Action dispatcher built from the menu's callback props. Each is
 *  optional — when the host omits the underlying callback the matching
 *  menu item renders nothing. */
export interface ColumnHeaderActions {
  /** Merge a partial Property — backs the Edit-property panel (name,
   *  description, + every per-type config field). */
  patch?: (patch: Partial<Property>) => void;
  changeType?: (t: PropertyType) => void;
  filter?: () => void;
  setSortDir?: (dir: "asc" | "desc") => void;
  clearSort?: () => void;
  group?: () => void;
  setCalc?: (c: CalcKind) => void;
  hide?: () => void;
  duplicate?: () => void;
  insertLeft?: () => void;
  insertRight?: () => void;
  moveLeft?: () => void;
  moveRight?: () => void;
  remove?: () => void;
}

/** Computed flags used by items to render checks / badges / disabled. */
export interface ColumnHeaderFlags {
  filtered: boolean;
  currentSort: "asc" | "desc" | null;
  grouped: boolean;
  groupable: boolean;
  currentCalc: CalcKind;
  calcs: CalcKind[];
  isTable: boolean;
  canMoveLeft: boolean;
  canMoveRight: boolean;
}

/** Uniform render context handed to every menu-item renderer. */
export interface MenuItemContext {
  type: PropertyType;
  /** The full property — the Edit-property panel reads every field. */
  prop: Property;
  actions: ColumnHeaderActions;
  flags: ColumnHeaderFlags;
  /** Host database + workspace catalog — relation / rollup config need them. */
  db?: Database;
  databases?: Database[];
}

export type MenuItemRenderer = (ctx: MenuItemContext) => ReactElement | null;

/** Per-PropertyType menu wiring. `mainMenu` is the ordered list of
 *  items to render; separator placement is automatic via `sectionOf`
 *  in `./menu-config.ts`. */
export interface PropertyTypeMenuConfig {
  mainMenu: MenuItemKey[];
}

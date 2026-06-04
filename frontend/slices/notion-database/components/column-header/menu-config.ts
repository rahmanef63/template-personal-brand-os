/** Per-PropertyType column-header menu config.
 *
 *  `PROPERTY_TYPE_MENU_CONFIG[type].mainMenu` is the ordered list of
 *  items the dropdown renders for that property type — this is what
 *  makes the menu DYNAMIC per type (number gets Calculate, select/
 *  status get Group, computed types drop irrelevant ops, …) instead
 *  of one hardcoded list for every column.
 *
 *  Items also self-hide at render time (e.g. Calculate only in table
 *  view, Group only for groupable types, any action whose host
 *  callback is absent) — the config sets intent, `flags`/`actions`
 *  enforce capability. Adding a property type? Map it below; unmapped
 *  types fall through to TEXTLIKE. */

import type { DatabaseFilterOp, PropertyType } from "../../types";
import type { MenuItemKey, PropertyTypeMenuConfig } from "./types";

const HEAD: MenuItemKey[] = ["edit_property", "change_type"];
const TAIL: MenuItemKey[] = [
  "hide", "duplicate", "insert_left", "insert_right", "move_left", "move_right", "delete",
];

/** Compose an editable-column menu: HEAD + the type-specific view ops + TAIL. */
const editable = (...viewOps: MenuItemKey[]): PropertyTypeMenuConfig => ({
  mainMenu: [...HEAD, ...viewOps, ...TAIL],
});

const TEXTLIKE = editable("filter", "sort");
const NUMERIC = editable("filter", "sort", "calculate");
const SELECTLIKE = editable("filter", "sort", "group", "calculate");
const COUNTABLE = editable("filter", "sort", "calculate");

export const PROPERTY_TYPE_MENU_CONFIG: Record<PropertyType, PropertyTypeMenuConfig> = {
  text: TEXTLIKE,
  url: TEXTLIKE,
  email: TEXTLIKE,
  phone: TEXTLIKE,
  person: TEXTLIKE,
  files: TEXTLIKE,
  unique_id: TEXTLIKE,
  created_by: TEXTLIKE,
  last_edited_by: TEXTLIKE,
  relation: TEXTLIKE,
  number: NUMERIC,
  select: SELECTLIKE,
  status: SELECTLIKE,
  multi_select: COUNTABLE,
  checkbox: COUNTABLE,
  date: COUNTABLE,
  created_time: COUNTABLE,
  last_edited_time: COUNTABLE,
  formula: COUNTABLE,
  rollup: COUNTABLE,
};

/** Logical sections — a separator is inserted whenever the section
 *  changes between two consecutive items, so per-type configs need not
 *  place dividers by hand. */
const SECTION_OF: Record<MenuItemKey, number> = {
  edit_property: 0,
  change_type: 0,
  filter: 1,
  sort: 1,
  group: 1,
  calculate: 1,
  hide: 2,
  duplicate: 3,
  insert_left: 3,
  insert_right: 3,
  move_left: 3,
  move_right: 3,
  delete: 4,
};

export function sectionOf(key: MenuItemKey): number {
  return SECTION_OF[key] ?? 0;
}

/** Seed-filter operator inferred from the property type. */
export function inferFilterOp(t: PropertyType): DatabaseFilterOp {
  if (t === "checkbox") return "checked";
  if (t === "select" || t === "status" || t === "multi_select") return "equals";
  return "contains";
}

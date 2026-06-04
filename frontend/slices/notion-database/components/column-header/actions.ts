/** Builds the `{ actions, flags }` a `ColumnHeaderMenu` hands to its
 *  items, from the menu's callback props. This is rr's prop-driven
 *  stand-in for nosion's `useColumnHeaderActions` hook — instead of
 *  talking to a `useDbAdapter` store, it closes over the host
 *  callbacks. Any action whose callback is absent stays `undefined`
 *  so the matching item self-hides. Pure (no hooks) — safe to call in
 *  render. */

import { validCalcs } from "../../lib/calcAggregate";
import type {
  CalcKind, DatabaseViewConfig, Property, PropertyType,
} from "../../types";
import { inferFilterOp } from "./menu-config";
import type { ColumnHeaderActions, ColumnHeaderFlags } from "./types";

export interface BuildActionsArgs {
  prop: Property;
  view: DatabaseViewConfig;
  /** Position of this column within `db.properties` (move bounds). */
  index: number;
  propertyCount: number;
  /** Merge a partial Property — backs the Edit-property panel. */
  onPatch?: (patch: Partial<Property>) => void;
  onTypeChange?: (type: PropertyType) => void;
  onHide?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  /** offset -1 = insert left, +1 = insert right. */
  onInsert?: (offset: -1 | 1) => void;
  /** offset -1 = move left, +1 = move right. */
  onMove?: (offset: -1 | 1) => void;
  /** Drives filter / sort / group / calculate — patches the active view. */
  onViewConfigChange?: (patch: Partial<DatabaseViewConfig>) => void;
}

export function buildColumnHeaderActions(args: BuildActionsArgs): {
  actions: ColumnHeaderActions;
  flags: ColumnHeaderFlags;
} {
  const {
    prop, view, index, propertyCount,
    onPatch, onTypeChange, onHide, onDelete, onDuplicate, onInsert, onMove,
    onViewConfigChange: onView,
  } = args;

  const flags: ColumnHeaderFlags = {
    filtered: view.filters.some((f) => f.propertyId === prop.id),
    currentSort: view.sorts.find((s) => s.propertyId === prop.id)?.direction ?? null,
    grouped: view.groupBy === prop.id,
    groupable: prop.type === "select" || prop.type === "status",
    currentCalc: (view.tableCalcs?.[prop.id] ?? "none") as CalcKind,
    calcs: validCalcs(prop),
    isTable: view.type === "table",
    canMoveLeft: index > 0,
    canMoveRight: index < propertyCount - 1,
  };

  const actions: ColumnHeaderActions = {
    patch: onPatch,
    changeType: onTypeChange,
    hide: onHide,
    remove: onDelete,
    duplicate: onDuplicate,
    insertLeft: onInsert ? () => onInsert(-1) : undefined,
    insertRight: onInsert ? () => onInsert(1) : undefined,
    moveLeft: onMove ? () => onMove(-1) : undefined,
    moveRight: onMove ? () => onMove(1) : undefined,
    filter: onView
      ? () => onView({
          filters: [
            ...view.filters,
            { propertyId: prop.id, op: inferFilterOp(prop.type), value: "" },
          ],
        })
      : undefined,
    setSortDir: onView
      ? (dir) => onView({
          sorts: [
            ...view.sorts.filter((s) => s.propertyId !== prop.id),
            { propertyId: prop.id, direction: dir },
          ],
        })
      : undefined,
    clearSort: onView
      ? () => onView({ sorts: view.sorts.filter((s) => s.propertyId !== prop.id) })
      : undefined,
    group: onView
      ? () => onView({ groupBy: view.groupBy === prop.id ? undefined : prop.id })
      : undefined,
    setCalc: onView
      ? (c) => {
          const calcs = { ...(view.tableCalcs ?? {}) };
          if (c === "none") delete calcs[prop.id];
          else calcs[prop.id] = c;
          onView({ tableCalcs: calcs });
        }
      : undefined,
  };

  return { actions, flags };
}

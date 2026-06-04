import type { Database, DatabaseViewConfig, Property } from "../types";

/** Effective visible properties for a view. Per-view `hiddenPropIds` is
 *  the source of truth so hiding a column in one view never bleeds into
 *  another. */
export function getVisibleProps(
  db: Database,
  view: DatabaseViewConfig | undefined,
): Property[] {
  const hidden = new Set(view?.hiddenPropIds ?? []);
  return db.properties.filter((p) => !hidden.has(p.id));
}

export function isHiddenInView(
  view: DatabaseViewConfig | undefined,
  propId: string,
): boolean {
  return !!view?.hiddenPropIds?.includes(propId);
}

export function isVisibleInView(
  view: DatabaseViewConfig | undefined,
  prop: Property,
): boolean {
  return !isHiddenInView(view, prop.id);
}

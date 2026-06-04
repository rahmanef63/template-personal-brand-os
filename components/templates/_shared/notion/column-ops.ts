/** Column-mutation transforms backing the ColumnHeaderMenu Duplicate /
 *  Insert / Move items. Pure (db|rows) → next — the host wires them
 *  into setDoc. Lifted from the rr notion-database preview. */

import type { Database, Page } from "@/features/notion-shell";

/** Move a column one slot. offset -1 = left, +1 = right. No-op at edges. */
export function reorderProperty(db: Database, propId: string, offset: -1 | 1): Database {
  const idx = db.properties.findIndex((p) => p.id === propId);
  const target = idx + offset;
  if (idx < 0 || target < 0 || target >= db.properties.length) return db;
  const props = [...db.properties];
  [props[idx], props[target]] = [props[target], props[idx]];
  return { ...db, properties: props, updatedAt: Date.now() };
}

/** Insert a fresh text column next to `propId`. offset -1 = left, +1 = right. */
export function insertPropertyNear(db: Database, propId: string, offset: -1 | 1, id: string): Database {
  const idx = db.properties.findIndex((p) => p.id === propId);
  if (idx < 0) return db;
  const at = offset === -1 ? idx : idx + 1;
  const props = [...db.properties];
  props.splice(at, 0, { id, name: "New text", type: "text" });
  return { ...db, properties: props, updatedAt: Date.now() };
}

/** Clone a column's schema directly after it (under `copyId`). */
export function duplicatePropertyInDb(db: Database, propId: string, copyId: string): Database {
  const idx = db.properties.findIndex((p) => p.id === propId);
  if (idx < 0) return db;
  const props = [...db.properties];
  props.splice(idx + 1, 0, { ...db.properties[idx], id: copyId, name: `${db.properties[idx].name} copy` });
  return { ...db, properties: props, updatedAt: Date.now() };
}

/** Copy each row's value for `propId` onto the duplicated `copyId`. */
export function copyPropertyValues(rows: Page[], propId: string, copyId: string): Page[] {
  return rows.map((r) =>
    r.rowProps && propId in r.rowProps
      ? { ...r, rowProps: { ...r.rowProps, [copyId]: r.rowProps[propId] } }
      : r);
}

"use client";

/** Full NotionDatabase callback surface over a single `{ db, rows }` doc.
 *  Pure state transforms — persistence is whatever `setDoc` does
 *  (useNotionDoc → convex). Adapted from the rr notion-database preview. */

import type {
  Database,
  DatabaseViewConfig,
  DbView,
  Property,
  PropertyType,
  PropertyValue,
  SelectOption,
} from "@/features/notion-shell";
import type { DatabaseDoc } from "./defaults";
import { makeRow, newId } from "./defaults";
import {
  reorderProperty,
  insertPropertyNear,
  duplicatePropertyInDb,
  copyPropertyValues,
} from "./column-ops";

type SetDoc = (next: DatabaseDoc | ((prev: DatabaseDoc) => DatabaseDoc)) => void;

export function useDatabaseCallbacks(setDoc: SetDoc) {
  const setDb = (f: (d: Database) => Database) =>
    setDoc((doc) => ({ ...doc, db: f(doc.db) }));
  const setRows = (f: (rs: DatabaseDoc["rows"]) => DatabaseDoc["rows"]) =>
    setDoc((doc) => ({ ...doc, rows: f(doc.rows) }));

  const onPropertyAdd = (type: PropertyType) => {
    const prop: Property = { id: newId(), name: `New ${type}`, type };
    setDb((d) => ({ ...d, properties: [...d.properties, prop], updatedAt: Date.now() }));
  };
  const onPropertyUpdate = (propId: string, patch: Partial<Property>) =>
    setDb((d) => ({
      ...d,
      properties: d.properties.map((p) => (p.id === propId ? { ...p, ...patch } : p)),
      updatedAt: Date.now(),
    }));
  const onPropertyRemove = (propId: string) =>
    setDb((d) => ({
      ...d,
      properties: d.properties.filter((p) => p.id !== propId),
      updatedAt: Date.now(),
    }));
  const onPropertyDuplicate = (propId: string) => {
    const copyId = newId();
    setDoc((doc) => ({
      ...doc,
      db: duplicatePropertyInDb(doc.db, propId, copyId),
      rows: copyPropertyValues(doc.rows, propId, copyId),
    }));
  };
  const onPropertyInsert = (propId: string, offset: -1 | 1) =>
    setDb((d) => insertPropertyNear(d, propId, offset, newId()));
  const onPropertyMove = (propId: string, offset: -1 | 1) =>
    setDb((d) => reorderProperty(d, propId, offset));

  const onRowAdd = () => {
    const id = newId();
    setDoc((doc) => ({
      db: { ...doc.db, rowIds: [...doc.db.rowIds, id], updatedAt: Date.now() },
      rows: [...doc.rows, makeRow(id, "", {})],
    }));
  };
  const onRowUpdate = (rowId: string, propId: string, value: PropertyValue) =>
    setRows((rs) => rs.map((r) => {
      if (r.id !== rowId) return r;
      const nextProps = { ...(r.rowProps ?? {}), [propId]: value };
      const nextTitle = propId === "title" && typeof value === "string" ? value : r.title;
      return { ...r, title: nextTitle, rowProps: nextProps, updatedAt: Date.now() };
    }));
  const onRowRemove = (rowId: string) =>
    setDoc((doc) => ({
      db: { ...doc.db, rowIds: doc.db.rowIds.filter((id) => id !== rowId), updatedAt: Date.now() },
      rows: doc.rows.filter((r) => r.id !== rowId),
    }));
  const onRowCreate = ({ title, rowProps }: { title: string; rowProps: Record<string, PropertyValue> }) => {
    const id = newId();
    setDoc((doc) => ({
      db: { ...doc.db, rowIds: [...doc.db.rowIds, id], updatedAt: Date.now() },
      rows: [...doc.rows, makeRow(id, title, rowProps)],
    }));
  };

  const onViewActivate = (viewId: string) => setDb((d) => ({ ...d, activeViewId: viewId }));
  const onViewAdd = (type: DbView) => {
    const view: DatabaseViewConfig = {
      id: newId(),
      name: type.charAt(0).toUpperCase() + type.slice(1),
      type, filters: [], sorts: [], search: "",
    };
    setDb((d) => ({ ...d, views: [...d.views, view], activeViewId: view.id, updatedAt: Date.now() }));
  };
  const onViewRemove = (viewId: string) =>
    setDb((d) => {
      const views = d.views.filter((v) => v.id !== viewId);
      const activeViewId = d.activeViewId === viewId ? (views[0]?.id ?? d.activeViewId) : d.activeViewId;
      return { ...d, views, activeViewId, updatedAt: Date.now() };
    });
  const onViewConfigChange = (viewId: string, patch: Partial<DatabaseViewConfig>) =>
    setDb((d) => ({
      ...d,
      views: d.views.map((v) => (v.id === viewId ? { ...v, ...patch } : v)),
      updatedAt: Date.now(),
    }));

  /** CSV / JSON import — applies new properties + rows in one transform. */
  const onImport = async ({
    newProperties, rows: importedRows,
  }: {
    newProperties: Array<{ tempId: string; type: PropertyType; name: string; options?: SelectOption[] }>;
    rows: Array<{ title: string; rowProps: Record<string, PropertyValue> }>;
  }) => {
    setDoc((doc) => {
      const tempToReal: Record<string, string> = {};
      const newProps: Property[] = newProperties.map((np) => {
        const id = newId();
        tempToReal[np.tempId] = id;
        return { id, name: np.name, type: np.type, options: np.options };
      });
      const added = importedRows.map((r) => {
        const remapped: Record<string, PropertyValue> = {};
        for (const [k, v] of Object.entries(r.rowProps)) remapped[tempToReal[k] ?? k] = v;
        return makeRow(newId(), r.title, remapped);
      });
      return {
        db: {
          ...doc.db,
          properties: [...doc.db.properties, ...newProps],
          rowIds: [...doc.db.rowIds, ...added.map((r) => r.id)],
          updatedAt: Date.now(),
        },
        rows: [...doc.rows, ...added],
      };
    });
  };

  return {
    onPropertyAdd, onPropertyUpdate, onPropertyRemove, onPropertyDuplicate,
    onPropertyInsert, onPropertyMove,
    onRowAdd, onRowUpdate, onRowRemove, onRowCreate,
    onViewActivate, onViewAdd, onViewRemove, onViewConfigChange,
    onImport,
  };
}

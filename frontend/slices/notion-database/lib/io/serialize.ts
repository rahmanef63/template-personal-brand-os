/** JSON serialization. Wire format v1 carries db schema (name, icon,
 *  properties, views) + row payloads. On import, the dialog returns the
 *  same shape as CsvImportResult so consumers can reuse a single
 *  onImport handler for both CSV + JSON. */

import type {
  Database, DatabaseViewConfig, Page, Property,
  PropertyType, PropertyValue, SelectOption,
} from "../../types";

const WIRE_VERSION = 1;

export interface DatabaseExportV1 {
  version: 1;
  exportedAt: string;
  database: {
    name: string;
    icon: string;
    properties: Property[];
    views: DatabaseViewConfig[];
    activeViewId: string;
  };
  rows: RowExport[];
}

export interface RowExport {
  title: string;
  icon: string;
  rowProps?: Record<string, PropertyValue>;
}

export interface JsonImportResult {
  /** New properties shape matches CsvNewProperty so host can use a
   *  single import handler for both CSV + JSON. `tempId` is the
   *  rowProps key to remap when persisting. */
  newProperties: { tempId: string; type: PropertyType; name: string; options?: SelectOption[] }[];
  rows: { title: string; rowProps: Record<string, PropertyValue> }[];
  importedDb: { name: string; icon: string; propertyCount: number; viewCount: number };
}

export function exportDatabase(db: Database, rows: Page[]): string {
  const payload: DatabaseExportV1 = {
    version: WIRE_VERSION,
    exportedAt: new Date().toISOString(),
    database: {
      name: db.name,
      icon: db.icon,
      properties: db.properties,
      views: db.views,
      activeViewId: db.activeViewId,
    },
    rows: rows.map((r) => ({
      title: r.title || "Untitled",
      icon: r.icon,
      rowProps: r.rowProps,
    })),
  };
  return JSON.stringify(payload, null, 2);
}

export function downloadJson(filename: string, content: string) {
  const blob = new Blob([content], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".json") ? filename : `${filename}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function parseExport(text: string): DatabaseExportV1 {
  const data: unknown = JSON.parse(text);
  if (
    typeof data !== "object" || !data
    || (data as DatabaseExportV1).version !== WIRE_VERSION
    || typeof (data as DatabaseExportV1).database !== "object"
    || !Array.isArray((data as DatabaseExportV1).rows)
  ) {
    throw new Error("Not a database export (v1) — file shape mismatch.");
  }
  return data as DatabaseExportV1;
}

export function diffSchema(
  incoming: Property[],
  existing: Property[],
): {
  newProperties: { tempId: string; type: PropertyType; name: string; options?: SelectOption[] }[];
  idMap: Map<string, string>;
} {
  const newProperties: { tempId: string; type: PropertyType; name: string; options?: SelectOption[] }[] = [];
  const idMap = new Map<string, string>();
  for (const inc of incoming) {
    const match = existing.find(
      (e) => e.name.toLowerCase() === inc.name.toLowerCase() && e.type === inc.type,
    );
    if (match) { idMap.set(inc.id, match.id); continue; }
    const tempId = `new:${inc.id}`;
    idMap.set(inc.id, tempId);
    newProperties.push({ tempId, type: inc.type, name: inc.name, options: inc.options });
  }
  return { newProperties, idMap };
}

export function buildImportResult(
  parsed: DatabaseExportV1,
  existing: Property[],
): JsonImportResult {
  const { newProperties, idMap } = diffSchema(parsed.database.properties, existing);
  const rows = parsed.rows.map((r) => {
    const remapped: Record<string, PropertyValue> = {};
    for (const [origId, v] of Object.entries(r.rowProps ?? {})) {
      const localId = idMap.get(origId) ?? origId;
      remapped[localId] = v as PropertyValue;
    }
    return { title: r.title, rowProps: remapped };
  });
  return {
    newProperties,
    rows,
    importedDb: {
      name: parsed.database.name,
      icon: parsed.database.icon,
      propertyCount: parsed.database.properties.length,
      viewCount: parsed.database.views.length,
    },
  };
}

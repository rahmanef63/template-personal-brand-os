/** Dynamic template generators. CSV + JSON templates reflect the live
 *  db.properties — headers/schema match the current column set, with one
 *  placeholder row showing the expected format per property type. */

import type { Database, Property, PropertyValue } from "../../types";
import { exportDatabaseToCsv } from "./csv";
import { exportDatabase, type DatabaseExportV1 } from "./serialize";

function csvHint(prop: Property): string {
  switch (prop.type) {
    case "number": return "0";
    case "checkbox": return "false";
    case "date": return "2026-01-01";
    case "url": return "https://example.com";
    case "email": return "name@example.com";
    case "phone": return "+1-555-0100";
    case "select":
    case "status":
      return prop.options?.[0]?.name ?? "Option";
    case "multi_select":
      return prop.options?.slice(0, 2).map((o) => o.name).join("; ") || "Option1; Option2";
    case "person": return "User Name";
    case "files": return "https://example.com/file.pdf";
    case "formula":
    case "created_time":
    case "last_edited_time":
    case "unique_id":
      return "(computed — ignored on import)";
    default: return "sample text";
  }
}

function jsonHint(prop: Property): PropertyValue {
  switch (prop.type) {
    case "number": return 0;
    case "checkbox": return false;
    case "date": return { date: "2026-01-01" };
    case "select":
    case "status":
      return prop.options?.[0]?.id ?? "option_id";
    case "multi_select":
      return prop.options?.slice(0, 2).map((o) => o.id) ?? [];
    case "person":
    case "files":
      return [];
    case "url": return "https://example.com";
    case "email": return "name@example.com";
    case "phone": return "+1-555-0100";
    case "formula":
    case "created_time":
    case "last_edited_time":
    case "unique_id":
      return null;
    default: return "sample text";
  }
}

export function buildCsvTemplate(db: Database): string {
  const sampleRow = {
    id: "__template_sample__",
    parentId: null,
    title: "Sample row — replace or delete me",
    icon: "",
    blocks: [],
    favorite: false,
    trashed: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    rowOfDatabaseId: db.id,
    rowProps: Object.fromEntries(
      db.properties.map((p) => {
        const hint = csvHint(p);
        if (p.type === "checkbox") return [p.id, hint === "true"];
        if (p.type === "number") return [p.id, Number(hint)];
        if (p.type === "date") return [p.id, { date: hint }];
        if (p.type === "select" || p.type === "status") {
          const opt = p.options?.find((o) => o.name === hint);
          return [p.id, opt?.id ?? hint];
        }
        if (p.type === "multi_select") {
          const names = hint.split(/;\s*/);
          const ids = names
            .map((n) => p.options?.find((o) => o.name === n)?.id)
            .filter((x): x is string => !!x);
          return [p.id, ids.length > 0 ? ids : names];
        }
        if (p.type === "person" || p.type === "files") return [p.id, [hint]];
        return [p.id, hint];
      }),
    ) as Record<string, PropertyValue>,
  };
  return exportDatabaseToCsv(db, [sampleRow]);
}

export function buildJsonTemplate(db: Database): string {
  const parsed = JSON.parse(exportDatabase(db, [])) as DatabaseExportV1;
  parsed.rows = [{
    title: "Sample row — replace or delete me",
    icon: "",
    rowProps: Object.fromEntries(
      db.properties.map((p) => [p.id, jsonHint(p)]),
    ),
  }];
  return JSON.stringify(parsed, null, 2);
}

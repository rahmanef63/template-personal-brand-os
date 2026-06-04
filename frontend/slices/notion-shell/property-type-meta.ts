/**
 * Single source of truth for property-type metadata.
 *
 * Every UI surface that needs to LIST property types (Add Column
 * menu, CSV "Create new of <type>" picker, Form view field type
 * selector, etc) reads from here — never hardcoded.
 *
 * Adding a new PropertyType (e.g. relation / rollup in v0.6):
 *   1. extend the `PropertyType` union in `./types.ts`
 *   2. add an entry to `PROPERTY_TYPE_META` below
 *   3. add a `case` in `notion-database/components/property-cells.tsx`
 *   4. (optional) add a dedicated cell in `notion-database/components/cells/`
 *
 * Every picker auto-discovers the new type via this registry — zero
 * drift across slices.
 *
 * Lives in a sibling file (not `types.ts`) to keep the type module
 * under the 200-LOC pre-commit gate.
 */

import type { PropertyType } from "./types";

export interface PropertyTypeMeta {
  label: string;
  category: "basic" | "advanced" | "computed";
  /** Shown in the "Add column" / "Change type" menus. */
  userAddable: boolean;
  /** Shown in CSV "Create new of <type>" picker. Computed types are
   *  excluded because CSV import cannot write to derived values. */
  csvImportable: boolean;
  /** Value derived (no client-side setter — formula evaluates, timestamps
   *  auto-stamp, unique_id auto-increments). */
  computed: boolean;
}

export const PROPERTY_TYPE_META: Record<PropertyType, PropertyTypeMeta> = {
  text:             { label: "Text",             category: "basic",    userAddable: true,  csvImportable: true,  computed: false },
  number:           { label: "Number",           category: "basic",    userAddable: true,  csvImportable: true,  computed: false },
  select:           { label: "Select",           category: "basic",    userAddable: true,  csvImportable: true,  computed: false },
  multi_select:     { label: "Multi-select",     category: "basic",    userAddable: true,  csvImportable: true,  computed: false },
  status:           { label: "Status",           category: "basic",    userAddable: true,  csvImportable: true,  computed: false },
  date:             { label: "Date",             category: "basic",    userAddable: true,  csvImportable: true,  computed: false },
  checkbox:         { label: "Checkbox",         category: "basic",    userAddable: true,  csvImportable: true,  computed: false },
  url:              { label: "URL",              category: "basic",    userAddable: true,  csvImportable: true,  computed: false },
  email:            { label: "Email",            category: "basic",    userAddable: true,  csvImportable: true,  computed: false },
  phone:            { label: "Phone",            category: "basic",    userAddable: true,  csvImportable: true,  computed: false },
  person:           { label: "Person",           category: "advanced", userAddable: true,  csvImportable: true,  computed: false },
  files:            { label: "Files",            category: "advanced", userAddable: true,  csvImportable: true,  computed: false },
  formula:          { label: "Formula",          category: "advanced", userAddable: true,  csvImportable: false, computed: true  },
  relation:         { label: "Relation",         category: "advanced", userAddable: true,  csvImportable: false, computed: false },
  rollup:           { label: "Rollup",           category: "computed", userAddable: true,  csvImportable: false, computed: true  },
  created_time:     { label: "Created time",     category: "computed", userAddable: true,  csvImportable: false, computed: true  },
  last_edited_time: { label: "Last edited time", category: "computed", userAddable: true,  csvImportable: false, computed: true  },
  unique_id:        { label: "Unique ID",        category: "computed", userAddable: true,  csvImportable: false, computed: true  },
  created_by:       { label: "Created by",       category: "computed", userAddable: true,  csvImportable: false, computed: true  },
  last_edited_by:   { label: "Last edited by",   category: "computed", userAddable: true,  csvImportable: false, computed: true  },
};

const META_ENTRIES = Object.entries(PROPERTY_TYPE_META) as [PropertyType, PropertyTypeMeta][];

/** All types that appear in "Add column" / "Change type" menus. */
export const PROPERTY_TYPES_USER_ADDABLE: PropertyType[] = META_ENTRIES
  .filter(([, m]) => m.userAddable)
  .map(([t]) => t);

/** All types that appear in CSV "Create new of <type>" picker. */
export const PROPERTY_TYPES_CSV_IMPORTABLE: PropertyType[] = META_ENTRIES
  .filter(([, m]) => m.csvImportable)
  .map(([t]) => t);

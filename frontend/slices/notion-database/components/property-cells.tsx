"use client";

/** Per-type property cell renderers. Pure controlled inputs — every
 *  cell takes `value` + `onChange` + `prop` (for options) + `readOnly`. */

import type { ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { Database, Page, Property, PropertyValue } from "../types";
import { FilesCell } from "./cells/FilesCell";
import { PersonCell } from "./cells/PersonCell";
import { FormulaCell } from "./cells/FormulaCell";
import { MultiSelectCell } from "./cells/MultiSelectCell";
import { SelectCell } from "./cells/SelectCell";
import { NumberCell } from "./cells/NumberCell";
import { LinkCell } from "./cells/LinkCell";
import { DateCell } from "./cells/DateCell";
import { RelationCell } from "./cells/RelationCell";
import { RollupCell } from "./cells/RollupCell";
import {
  CreatedTimeCell, LastEditedTimeCell, UniqueIdCell,
  CreatedByCell, LastEditedByCell,
} from "./cells/timestamps";

export interface UserLite { id: string; name: string; icon?: string }
export type UserLookup = (userId: string) => UserLite | null;

interface CellArgs {
  prop: Property;
  value: PropertyValue;
  readOnly: boolean;
  onChange?: (next: PropertyValue) => void;
  row?: Page;
  db?: Database;
  onPropertyChange?: (patch: Partial<Property>) => void;
  /** Resolves user id → display info for `person` / `created_by` /
   *  `last_edited_by` cells. Optional — falls back to raw id. */
  userLookup?: UserLookup;
  /** All workspace pages — required by `relation` (link picker) +
   *  `rollup` (aggregate). Cells gracefully no-op when omitted. */
  pages?: Page[];
  /** All workspace databases — required by `relation` (target picker)
   *  + `rollup` (target props). Cells gracefully no-op when omitted. */
  databases?: Database[];
  /** Creates a new row in the relation's target db and returns its id —
   *  wires the "+ Create new row" button in RelationCell. */
  onCreateRelatedRow?: (dbId: string, draft?: { title?: string }) => Promise<string>;
}

export function renderPropertyCell({
  prop, value, readOnly, onChange, row, db, onPropertyChange, userLookup,
  pages, databases, onCreateRelatedRow,
}: CellArgs): ReactNode {
  switch (prop.type) {
    case "checkbox":
      return <Checkbox checked={!!value} disabled={readOnly} onCheckedChange={(v) => onChange?.(!!v)} />;

    case "number":
      return (
        <NumberCell
          prop={prop} value={value} readOnly={readOnly}
          onChange={onChange ? (n) => onChange(n) : undefined}
        />
      );

    case "select":
    case "status":
      return (
        <SelectCell
          options={prop.options ?? []}
          value={value as string | null}
          readOnly={readOnly}
          onChange={onChange ? (next) => onChange(next) : undefined}
          onOptionsChange={onPropertyChange ? (nextOptions) => onPropertyChange({ options: nextOptions }) : undefined}
        />
      );

    case "multi_select":
      return (
        <MultiSelectCell
          options={prop.options ?? []}
          value={(Array.isArray(value) ? value : []) as string[]}
          readOnly={readOnly}
          onChange={onChange ? (next) => onChange(next) : undefined}
          onOptionsChange={onPropertyChange ? (nextOptions) => onPropertyChange({ options: nextOptions }) : undefined}
        />
      );

    case "date":
      return (
        <DateCell
          value={value as { date?: string; end?: string } | null}
          readOnly={readOnly}
          onChange={onChange ? (next) => onChange(next) : undefined}
          prop={prop}
          onPropPatch={onPropertyChange ? (patch) => onPropertyChange(patch) : undefined}
        />
      );

    case "url":
    case "email":
    case "phone":
      return (
        <LinkCell
          kind={prop.type}
          value={value as string | null}
          readOnly={readOnly}
          onChange={onChange ? (s) => onChange(s) : undefined}
        />
      );

    case "files":
      return (
        <FilesCell
          value={(Array.isArray(value) ? value : []) as string[]}
          readOnly={readOnly}
          onChange={onChange ? (next) => onChange(next) : undefined}
        />
      );

    case "person":
      return (
        <PersonCell
          value={(Array.isArray(value) ? value : []) as string[]}
          readOnly={readOnly}
          onChange={onChange ? (next) => onChange(next) : undefined}
        />
      );

    case "formula":
      if (!row || !db) return <span className="text-xs text-muted-foreground/60">—</span>;
      return (
        <FormulaCell
          db={db} row={row} prop={prop} readOnly={readOnly} pages={pages}
          onExpressionChange={onPropertyChange ? (formulaExpression) => onPropertyChange({ formulaExpression }) : undefined}
        />
      );

    case "relation":
      if (!row) return <span className="text-xs text-muted-foreground/60">—</span>;
      return (
        <RelationCell
          prop={prop} row={row}
          value={(Array.isArray(value) ? value : []) as string[]}
          readOnly={readOnly}
          pages={pages} databases={databases}
          onChange={onChange ? (next) => onChange(next) : undefined}
          onPropertyChange={onPropertyChange}
          onCreateRelatedRow={onCreateRelatedRow}
        />
      );

    case "rollup":
      if (!row || !db) return <span className="text-xs text-muted-foreground/60">—</span>;
      return (
        <RollupCell
          db={db} prop={prop} row={row}
          pages={pages} databases={databases}
          onPropertyChange={onPropertyChange}
        />
      );

    case "created_time":
      return row ? <CreatedTimeCell row={row} /> : <span className="text-xs text-muted-foreground/60">—</span>;

    case "last_edited_time":
      return row ? <LastEditedTimeCell row={row} /> : <span className="text-xs text-muted-foreground/60">—</span>;

    case "unique_id":
      return (row && db) ? <UniqueIdCell db={db} row={row} prop={prop} /> : <span className="text-xs text-muted-foreground/60">—</span>;

    case "created_by":
      return row ? <CreatedByCell row={row} userLookup={userLookup} /> : <span className="text-xs text-muted-foreground/60">—</span>;

    case "last_edited_by":
      return row ? <LastEditedByCell row={row} userLookup={userLookup} /> : <span className="text-xs text-muted-foreground/60">—</span>;

    default:
      return (
        <Input
          value={String(value ?? "")} disabled={readOnly}
          onChange={(e) => onChange?.(e.target.value)} className="h-7 text-sm"
        />
      );
  }
}

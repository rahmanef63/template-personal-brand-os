"use client";

/** RelationCell — popover-driven picker to link rows from another
 *  database (or any DB row when target is unset). Strip vs upstream:
 *  the host supplies `pages` + `databases` + an optional
 *  `onCreateRelatedRow` callback (no useDbAdapter / Convex coupling).
 *  Lifted from notion-page-clone CK-1D Phase 2. */

import { useState } from "react";
import { AlertTriangle, Check, Link2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { filterRelationCandidates } from "../../lib/relationCandidates";
import type { Database, Page, Property } from "../../types";

export interface RelationCellProps {
  prop: Property;
  row: Page;
  value: string[];
  readOnly?: boolean;
  pages?: Page[];
  databases?: Database[];
  onChange?: (next: string[]) => void;
  onPropertyChange?: (patch: Partial<Property>) => void;
  /** Called when user clicks "+ Create new row in <db>". Should return
   *  the new row id so the cell can append it to the linked list. */
  onCreateRelatedRow?: (dbId: string, draft?: { title?: string }) => Promise<string>;
}

export function RelationCell({
  prop, row, value, readOnly,
  pages = [], databases = [],
  onChange, onPropertyChange, onCreateRelatedRow,
}: RelationCellProps) {
  const [query, setQuery] = useState("");
  const linkedIds = value;
  const linkedResolved = linkedIds.map((id) => ({
    id,
    page: pages.find((p) => p.id === id && !p.trashed) ?? null,
  }));
  const linkedExisting = linkedResolved.filter((x) => x.page).map((x) => x.page!) as Page[];
  const linkedStale = linkedResolved.filter((x) => !x.page);

  const targetDbConfigured = !!prop.relationDatabaseId;
  const targetDb = prop.relationDatabaseId
    ? databases.find((d) => d.id === prop.relationDatabaseId)
    : null;
  const targetDbMissing = targetDbConfigured && !targetDb;

  const candidates = filterRelationCandidates({
    pages, selfRowId: row.id,
    targetDbId: prop.relationDatabaseId, targetDbMissing,
    query,
  });

  const toggle = (id: string) => {
    if (!onChange) return;
    onChange(linkedIds.includes(id) ? linkedIds.filter((x) => x !== id) : [...linkedIds, id]);
  };
  const stripStale = () => onChange?.(linkedIds.filter((id) => pages.some((p) => p.id === id && !p.trashed)));
  const handleCreate = async () => {
    if (!targetDb || !onCreateRelatedRow || !onChange) return;
    const title = query.trim();
    const newId = await onCreateRelatedRow(targetDb.id, title ? { title } : undefined);
    onChange([...linkedIds, newId]);
    setQuery("");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          disabled={readOnly}
          className="h-auto w-full justify-start gap-1 rounded px-2 py-1 text-left font-normal hover:bg-accent/50 [&_svg]:size-3.5"
        >
          {targetDbMissing ? (
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
          ) : (
            <Link2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          )}
          {targetDbMissing ? (
            <span className="text-xs text-amber-600">Database removed</span>
          ) : linkedExisting.length || linkedStale.length ? (
            <span className="flex min-w-0 flex-wrap gap-1">
              {linkedExisting.slice(0, 2).map((p) => (
                <span key={p.id} className="inline-flex max-w-28 items-center gap-1 rounded border border-border bg-muted/60 px-1.5 py-0.5 text-xs">
                  <span className="truncate">{p.title || "Untitled"}</span>
                </span>
              ))}
              {linkedStale.length > 0 && (
                <span className="inline-flex items-center gap-1 rounded border border-amber-400/40 bg-amber-100/40 px-1.5 py-0.5 text-xs text-amber-600">
                  <AlertTriangle className="h-3 w-3" /> {linkedStale.length} removed
                </span>
              )}
              {linkedExisting.length > 2 && <span className="text-xs text-muted-foreground">+{linkedExisting.length - 2}</span>}
            </span>
          ) : (
            <span className="text-muted-foreground">Link rows</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2" align="start">
        <div className="space-y-2">
          {linkedStale.length > 0 && !targetDbMissing && (
            <Button
              variant="ghost"
              onClick={stripStale}
              className="h-auto w-full justify-start gap-2 rounded-md border border-amber-400/40 bg-amber-100/40 px-2 py-1.5 text-[11px] font-normal text-amber-700 hover:bg-amber-100"
            >
              <X className="h-3 w-3" />
              Remove {linkedStale.length} stale link{linkedStale.length === 1 ? "" : "s"}
            </Button>
          )}
          {onPropertyChange && (
            <Select
              value={prop.relationDatabaseId ?? "__none"}
              onValueChange={(v) => onPropertyChange({ relationDatabaseId: v === "__none" ? null : v })}
            >
              <SelectTrigger className="h-7 w-full text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none">All database rows</SelectItem>
                {databases.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search rows"
            className="h-7 text-xs"
          />
          <div className="max-h-56 space-y-0.5 overflow-y-auto">
            {candidates.map((p) => {
              const selected = linkedIds.includes(p.id);
              return (
                <Button
                  key={p.id}
                  variant="ghost"
                  onClick={() => toggle(p.id)}
                  className="h-auto w-full justify-start gap-2 rounded px-2 py-1.5 text-left text-xs font-normal"
                >
                  {selected ? <Check className="h-3.5 w-3.5 text-primary" /> : <span className="w-3.5" />}
                  <span className="min-w-0 flex-1 truncate">{p.title || "Untitled"}</span>
                </Button>
              );
            })}
            {candidates.length === 0 && (
              <div className="px-2 py-6 text-center text-xs text-muted-foreground">No matching rows</div>
            )}
          </div>
          {targetDb && onCreateRelatedRow && (
            <Button
              variant="ghost"
              onClick={handleCreate}
              className="h-auto w-full justify-start gap-2 rounded-md border border-dashed border-border px-2 py-1.5 text-xs font-normal text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
              {query.trim() ? `Create "${query.trim()}" in ${targetDb.name}` : `Create new row in ${targetDb.name}`}
            </Button>
          )}
          {linkedIds.length > 0 && (
            <Button
              variant="ghost"
              onClick={() => onChange?.([])}
              className="h-auto p-0 text-xs font-normal text-muted-foreground hover:bg-transparent hover:text-foreground"
            >
              Clear relation
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

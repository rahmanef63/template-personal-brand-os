"use client";

/** RollupCell — read-only computed cell that pulls values from a
 *  relation's target property and folds them via the chosen aggregate
 *  (count / sum / avg / min / max / values / earliest / latest /
 *  checked / percent_checked). Strip vs upstream: host supplies
 *  `pages` + `databases`; no useDbAdapter coupling.
 *
 *  Lifted from notion-page-clone CK-1D Phase 2. */

import { AlertTriangle, Sigma } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { computeRollup } from "../../lib/computeRollup";
import type { Database, Page, Property, RollupAggregate } from "../../types";

const AGGREGATE_LABELS: Record<RollupAggregate, string> = {
  count: "Count",
  count_unique: "Count unique",
  values: "Show values",
  sum: "Sum",
  avg: "Average",
  min: "Min",
  max: "Max",
  earliest: "Earliest date",
  latest: "Latest date",
  checked: "Checked count",
  percent_checked: "Percent checked",
};

export interface RollupCellProps {
  db: Database;
  prop: Property;
  row: Page;
  pages?: Page[];
  databases?: Database[];
  onPropertyChange?: (patch: Partial<Property>) => void;
}

export function RollupCell({
  db, prop, row,
  pages = [], databases = [],
  onPropertyChange,
}: RollupCellProps) {
  const relationProps = db.properties.filter((p) => p.type === "relation");
  const configuredRelationId = prop.rollupRelationPropertyId;
  const relationProp = configuredRelationId
    ? relationProps.find((p) => p.id === configuredRelationId)
    : relationProps[0];
  const relationMissing = !!configuredRelationId && !relationProp;

  const linkedIds = relationProp && Array.isArray(row.rowProps?.[relationProp.id])
    ? (row.rowProps[relationProp.id] as string[])
    : [];
  const linkedPages = linkedIds
    .map((id) => pages.find((p) => p.id === id))
    .filter((p): p is Page => !!p && !p.trashed);

  const targetDb = databases.find((d) => d.id === relationProp?.relationDatabaseId) ?? db;
  const targetProps = targetDb.properties.filter((p) => p.type !== "rollup" && p.type !== "formula");
  const configuredTargetId = prop.rollupTargetPropertyId;
  const targetProp = configuredTargetId
    ? targetProps.find((p) => p.id === configuredTargetId)
    : undefined;
  const targetMissing = !!configuredTargetId && !targetProp;

  const aggregate: RollupAggregate = prop.rollupAggregate ?? "count";
  const errored = relationMissing || targetMissing;
  const display = errored
    ? "Property removed"
    : relationProp
      ? computeRollup(aggregate, linkedPages, targetProp)
      : "Pick relation";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto w-full justify-start gap-1 rounded px-2 py-1 text-left font-normal hover:bg-accent/50 [&_svg]:size-3.5"
        >
          {errored ? (
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
          ) : (
            <Sigma className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          )}
          <span className={cn("min-w-0 truncate", (!relationProp || errored) && "text-muted-foreground")}>
            {display}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2" align="start">
        <div className="space-y-2">
          {(relationMissing || targetMissing) && (
            <div className="flex items-start gap-2 rounded-md border border-amber-400/40 bg-amber-100/40 p-2 text-[11px] text-amber-700">
              <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
              <span>
                {relationMissing && "The relation property feeding this rollup was removed. "}
                {targetMissing && "The target property was removed. "}
                Pick a replacement below.
              </span>
            </div>
          )}

          <label className="block text-[11px] font-medium text-muted-foreground">Relation</label>
          <Select
            value={relationProp?.id ?? "__none"}
            onValueChange={(v) => onPropertyChange?.({ rollupRelationPropertyId: v === "__none" ? null : v })}
          >
            <SelectTrigger className="h-7 w-full text-xs"><SelectValue placeholder="Choose relation" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none">Choose relation</SelectItem>
              {relationProps.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>

          <label className="block text-[11px] font-medium text-muted-foreground">Aggregate</label>
          <Select
            value={aggregate}
            onValueChange={(v) => onPropertyChange?.({ rollupAggregate: v as RollupAggregate })}
          >
            <SelectTrigger className="h-7 w-full text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.keys(AGGREGATE_LABELS) as RollupAggregate[]).map((k) => (
                <SelectItem key={k} value={k}>{AGGREGATE_LABELS[k]}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <label className="block text-[11px] font-medium text-muted-foreground">Target property</label>
          <Select
            value={targetProp?.id ?? "__title"}
            onValueChange={(v) => onPropertyChange?.({ rollupTargetPropertyId: v === "__title" ? null : v })}
          >
            <SelectTrigger className="h-7 w-full text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__title">Page title</SelectItem>
              {targetProps.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>

          {!relationProps.length && (
            <div className="rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">
              Add a Relation property to feed this rollup.
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

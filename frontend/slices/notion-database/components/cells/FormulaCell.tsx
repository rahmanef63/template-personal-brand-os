"use client";

/** FormulaCell — readonly display of evaluated formula expression.
 *  Click to edit expression in popover; host owns persistence via
 *  onExpressionChange (typically wired to onPropertyUpdate).
 *
 *  Expression syntax (parsed by lib/formulaEngine):
 *    - `{{title}}` / `{{Property Name}}` — template interpolation
 *    - `=expr` — math expression (`= 1 + {{Price}} * 0.1`)
 *    - `fn(arg, …)` — call form (`concat`, `upper`, `if`, `dateAdd`, …)
 *  Errors surface inline as muted "Invalid formula" + tooltip. */

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import type { Database, Page, Property } from "../../types";
import { evalFormula, formatFormulaValue } from "../../lib/formulaEngine";

interface FormulaCellProps {
  db: Database;
  row: Page;
  prop: Property;
  readOnly?: boolean;
  /** Workspace pages — required when the formula references a relation
   *  property. Pass [] when no relation refs are used. */
  pages?: Page[];
  onExpressionChange?: (next: string) => void;
}

export function FormulaCell({ db, row, prop, readOnly, pages, onExpressionChange }: FormulaCellProps) {
  const expression = prop.formulaExpression ?? "{{title}}";
  const [draft, setDraft] = useState(expression);

  const live = useMemo(
    () => evalFormula(expression, { row, db, pages: pages ?? [] }),
    [expression, row, db, pages],
  );
  const preview = useMemo(
    () => evalFormula(draft, { row, db, pages: pages ?? [] }),
    [draft, row, db, pages],
  );

  const save = () => {
    const next = draft.trim() || "{{title}}";
    if (next !== expression) onExpressionChange?.(next);
  };

  const display = (
    <span className="flex items-center gap-1 text-xs" title={live.error?.message}>
      <Calculator className={cn(
        "h-3.5 w-3.5 shrink-0",
        live.error ? "text-destructive" : "text-muted-foreground",
      )} />
      <span className={cn("min-w-0 truncate", live.error && "italic text-destructive")}>
        {live.error ? "Invalid formula" : (formatFormulaValue(live.value) || "—")}
      </span>
    </span>
  );

  if (readOnly || !onExpressionChange) return display;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          type="button"
          className={cn("flex h-auto w-full items-center justify-start gap-1 rounded px-2 py-1 text-left font-normal hover:bg-accent/50")}
          aria-label="Edit formula"
        >
          {display}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2" align="start">
        <form onSubmit={(e) => { e.preventDefault(); save(); }} className="space-y-2">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Expression</div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="h-20 w-full resize-none rounded-md border border-border bg-background px-2 py-1 font-mono text-xs"
            placeholder="{{title}} · {{Property}} · upper(x) · if(...) · = 1 + 2"
          />
          {preview.error && (
            <div className="rounded border border-destructive/40 bg-destructive/5 px-2 py-1 text-[10px] text-destructive">
              {preview.error.message} (pos {preview.error.pos})
            </div>
          )}
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>
              Preview: <span className="font-mono text-foreground">
                {preview.error ? "—" : (formatFormulaValue(preview.value) || "—")}
              </span>
            </span>
            <Button type="submit" variant="outline" size="sm" className="h-7 px-2 text-xs">
              Save
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}

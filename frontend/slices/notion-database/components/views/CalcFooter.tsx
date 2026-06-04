"use client";

/** CalcFooter — TableView footer row. Reads `view.tableCalcs[propId]`,
 *  delegates value computation to `lib/calcAggregate`. Pure render;
 *  the per-column calc picker lives in `ColumnHeaderMenu` (set via
 *  the "Calculate" submenu). */

import { cn } from "@/lib/utils";
import { calcLabel, computeCalc } from "../../lib/calcAggregate";
import type { CalcKind, DatabaseViewConfig, Page, Property } from "../../types";

export interface CalcFooterProps {
  view: DatabaseViewConfig;
  rows: Page[];
  visibleProps: Property[];
  /** True when the table also renders a trailing "remove row" column;
   *  the footer adds a matching spacer cell so column widths line up. */
  hasRowActions?: boolean;
}

export function CalcFooter({ view, rows, visibleProps, hasRowActions }: CalcFooterProps) {
  const calcs = view.tableCalcs ?? {};
  const hasAny = Object.values(calcs).some((c) => c && c !== "none");
  if (!hasAny) return null;
  return (
    <tfoot className="border-t border-border bg-muted/20 text-[11px] text-muted-foreground">
      <tr>
        {visibleProps.map((p) => {
          const c = (calcs[p.id] ?? "none") as CalcKind;
          const display = c === "none" ? "" : computeCalc(rows, p, c);
          return (
            <td
              key={p.id}
              className={cn("px-3 py-1 truncate")}
              title={display ? `${calcLabel(c)}: ${display}` : ""}
            >
              {display && (
                <div className="flex flex-col gap-0">
                  <span className="text-[9px] uppercase tracking-wider opacity-60">{calcLabel(c)}</span>
                  <span className="text-foreground tabular-nums truncate">{display}</span>
                </div>
              )}
            </td>
          );
        })}
        {hasRowActions && <td aria-hidden />}
      </tr>
    </tfoot>
  );
}

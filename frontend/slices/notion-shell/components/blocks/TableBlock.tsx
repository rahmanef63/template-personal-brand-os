"use client";

/** TableBlock — block-type "table". A plain (non-database) editable grid
 *  backed by `block.tableRows: string[][]`. Add row / column, toggle a
 *  header row. Each cell is a borderless input; pure callback — writes
 *  the whole `tableRows` matrix back through `onUpdate`. For a database
 *  surface use the notion-database slice instead. */

import { Plus, Rows3, Columns3, Heading } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { BlockRendererProps } from "../../types";

const EMPTY: string[][] = [["", ""], ["", ""]];

export function TableBlock({ block, onUpdate }: BlockRendererProps) {
  const rows = block.tableRows?.length ? block.tableRows : EMPTY;
  const header = !!block.tableHeader;
  const cols = Math.max(1, ...rows.map((r) => r.length));

  const write = (next: string[][]) => onUpdate({ tableRows: next });

  const setCell = (r: number, c: number, val: string) =>
    write(rows.map((row, ri) => (ri === r ? row.map((cell, ci) => (ci === c ? val : cell)) : row)));

  const addRow = () => write([...rows, Array.from({ length: cols }, () => "")]);
  const addCol = () => write(rows.map((row) => [...row, ""]));

  return (
    <div className="my-1 space-y-1">
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {rows.map((row, r) => (
              <tr key={r} className={cn(header && r === 0 && "bg-muted/50")}>
                {Array.from({ length: cols }, (_, c) => (
                  <td key={c} className="border border-border p-0">
                    <input
                      value={row[c] ?? ""}
                      onChange={(e) => setCell(r, c, e.target.value)}
                      placeholder={header && r === 0 ? "Header" : ""}
                      className={cn(
                        "w-full min-w-24 bg-transparent px-2 py-1 outline-none focus:bg-accent/30",
                        header && r === 0 && "font-medium",
                      )}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={addRow} className="h-6 gap-1 px-2 text-[11px] text-muted-foreground">
          <Rows3 className="h-3 w-3" /> <Plus className="h-2.5 w-2.5" /> Row
        </Button>
        <Button variant="ghost" size="sm" onClick={addCol} className="h-6 gap-1 px-2 text-[11px] text-muted-foreground">
          <Columns3 className="h-3 w-3" /> <Plus className="h-2.5 w-2.5" /> Column
        </Button>
        <Button
          variant="ghost" size="sm"
          onClick={() => onUpdate({ tableHeader: !header })}
          className={cn("h-6 gap-1 px-2 text-[11px]", header ? "text-foreground" : "text-muted-foreground")}
        >
          <Heading className="h-3 w-3" /> Header row
        </Button>
      </div>
    </div>
  );
}

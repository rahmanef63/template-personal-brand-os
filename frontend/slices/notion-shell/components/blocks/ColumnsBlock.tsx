"use client";

/** ColumnsBlock — block-types "columns2" / "columns3" / "columns4". Lays
 *  its `block.columns` (Block[][]) out side by side; each column is an
 *  independent block list rendered through the SAME registry (so any
 *  block — incl. nested toggles/columns — works inside). Column CRUD
 *  patches back via `onUpdate({ columns })`. Bound to the registry by
 *  createDefaultBlockRenderers. */

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Block, BlockRenderers, BlockRendererProps, BlockType } from "../../types";
import { NotionBlock } from "../NotionBlock";

const newId = () => (typeof crypto !== "undefined" && crypto.randomUUID
  ? crypto.randomUUID()
  : `col-${Math.round(performance.now() * 1000)}`);

export function makeColumnsBlock(renderers: BlockRenderers) {
  return function ColumnsBlock({ block, onUpdate }: BlockRendererProps) {
    const count = Number(block.type.replace("columns", "")) || 2;
    const cols: Block[][] = block.columns?.length
      ? block.columns
      : Array.from({ length: count }, () => [] as Block[]);

    const setCols = (next: Block[][]) => onUpdate({ columns: next });
    const mapCol = (ci: number, fn: (col: Block[]) => Block[]) =>
      setCols(cols.map((col, i) => (i === ci ? fn(col) : col)));
    const patchIn = (ci: number, id: string, patch: Partial<Block>) =>
      mapCol(ci, (col) => col.map((b) => (b.id === id ? { ...b, ...patch } : b)));
    const turnIn = (ci: number, id: string, type: BlockType) =>
      mapCol(ci, (col) => col.map((b) => (b.id === id ? { ...b, type } : b)));
    const removeIn = (ci: number, id: string) =>
      mapCol(ci, (col) => col.filter((b) => b.id !== id));
    const dupIn = (ci: number, id: string) =>
      mapCol(ci, (col) => {
        const k = col.findIndex((b) => b.id === id);
        if (k < 0) return col;
        const nx = [...col];
        nx.splice(k + 1, 0, { ...col[k]!, id: newId() });
        return nx;
      });
    const addIn = (ci: number) =>
      mapCol(ci, (col) => [...col, { id: newId(), type: "paragraph", text: "" }]);

    return (
      <div className="my-1 flex flex-col gap-3 sm:flex-row">
        {cols.map((col, ci) => (
          <div key={ci} className="min-w-0 flex-1 space-y-1 rounded-md">
            {col.map((b) => (
              <NotionBlock
                key={b.id}
                block={b}
                blockRenderers={renderers}
                onUpdate={(p) => patchIn(ci, b.id, p)}
                onTurnInto={(t) => turnIn(ci, b.id, t)}
                onDuplicate={() => dupIn(ci, b.id)}
                onRemove={() => removeIn(ci, b.id)}
              />
            ))}
            <Button
              variant="ghost" size="sm" onClick={() => addIn(ci)}
              className="h-6 gap-1 px-2 text-[11px] text-muted-foreground"
            >
              <Plus className="h-3 w-3" /> Add
            </Button>
          </div>
        ))}
      </div>
    );
  };
}

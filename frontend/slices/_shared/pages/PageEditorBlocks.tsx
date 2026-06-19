"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BlockEditor } from "./block-editor";
import {
  BLOCK_KIND_LABEL,
  PAGE_BLOCK_KINDS,
  type PageBlock,
  type PageBlockKind,
} from "./types";

export function PageEditorBlocks({
  blocks,
  addKind,
  setAddKind,
  onAdd,
  onPatch,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  blocks: PageBlock[];
  addKind: PageBlockKind;
  setAddKind: (k: PageBlockKind) => void;
  onAdd: () => void;
  onPatch: (idx: number, next: PageBlock) => void;
  onRemove: (idx: number) => void;
  onMoveUp: (idx: number) => void;
  onMoveDown: (idx: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Blocks ({blocks.length})</h2>
        <div className="flex items-center gap-1.5">
          <Select value={addKind} onValueChange={(v) => setAddKind(v as PageBlockKind)}>
            <SelectTrigger className="h-8 w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_BLOCK_KINDS.map((k) => (
                <SelectItem key={k} value={k} className="text-xs">
                  {BLOCK_KIND_LABEL[k]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" className="gap-1.5" onClick={onAdd}>
            <Plus className="size-3.5" /> Add block
          </Button>
        </div>
      </div>

      {blocks.length === 0 && (
        <div className="rounded-lg border border-dashed bg-muted/20 p-8 text-center text-xs text-muted-foreground">
          No blocks yet. Pick a kind above and click <span className="font-medium">Add block</span>.
        </div>
      )}

      {blocks.map((block, i) => (
        <div key={i} className="relative">
          <div className="absolute -left-7 top-2 flex flex-col gap-0.5">
            <Button
              size="icon"
              variant="ghost"
              className="size-6"
              disabled={i === 0}
              onClick={() => onMoveUp(i)}
              title="Move up"
            >
              <ArrowUp className="size-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="size-6"
              disabled={i === blocks.length - 1}
              onClick={() => onMoveDown(i)}
              title="Move down"
            >
              <ArrowDown className="size-3" />
            </Button>
          </div>
          <BlockEditor
            block={block}
            onChange={(next) => onPatch(i, next)}
            onRemove={() => onRemove(i)}
          />
        </div>
      ))}
    </div>
  );
}

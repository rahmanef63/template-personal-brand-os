"use client";

/** ToggleBlock — block-type "toggle". A collapsible section: chevron +
 *  inline-editable heading + nested child blocks (`block.children`). Each
 *  child renders through the SAME registry (so callouts / code / nested
 *  toggles all work inside), with child CRUD patched back via
 *  `onUpdate({ children })`. Bound to the registry by
 *  createDefaultBlockRenderers (it needs the registry to render children).
 */

import { ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Block, BlockRenderers, BlockRendererProps, BlockType } from "../../types";
import { NotionBlock } from "../NotionBlock";
import { EditableLine } from "./EditableLine";

const newId = () => (typeof crypto !== "undefined" && crypto.randomUUID
  ? crypto.randomUUID()
  : `tgl-${Math.round(performance.now() * 1000)}`);

export function makeToggleBlock(renderers: BlockRenderers) {
  return function ToggleBlock({ block, onUpdate }: BlockRendererProps) {
    const collapsed = !!block.collapsed;
    const children = block.children ?? [];
    const setChildren = (next: Block[]) => onUpdate({ children: next });

    const patchChild = (id: string, patch: Partial<Block>) =>
      setChildren(children.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    const turnChild = (id: string, type: BlockType) =>
      setChildren(children.map((c) => (c.id === id ? { ...c, type } : c)));
    const removeChild = (id: string) => setChildren(children.filter((c) => c.id !== id));
    const dupChild = (id: string) => {
      const i = children.findIndex((c) => c.id === id);
      if (i < 0) return;
      const next = [...children];
      next.splice(i + 1, 0, { ...children[i]!, id: newId() });
      setChildren(next);
    };
    const addChild = () => setChildren([...children, { id: newId(), type: "paragraph", text: "" }]);

    return (
      <div className="my-1">
        <div className="flex items-start gap-1">
          <Button
            variant="ghost" size="icon" type="button"
            aria-label={collapsed ? "Expand" : "Collapse"}
            onClick={() => onUpdate({ collapsed: !collapsed })}
            className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground"
          >
            <ChevronRight className={cn("h-3.5 w-3.5 transition-transform", !collapsed && "rotate-90")} />
          </Button>
          <EditableLine
            text={block.text}
            onChange={(text) => onUpdate({ text })}
            placeholder="Toggle"
            className="min-w-0 flex-1 whitespace-pre-wrap break-words py-0.5 font-medium outline-none empty:before:text-muted-foreground/40 empty:before:content-[attr(data-placeholder)]"
          />
        </div>
        {!collapsed && (
          <div className="ml-5 mt-1 space-y-1 border-l border-border pl-3">
            {children.map((c) => (
              <NotionBlock
                key={c.id}
                block={c}
                blockRenderers={renderers}
                onUpdate={(p) => patchChild(c.id, p)}
                onTurnInto={(t) => turnChild(c.id, t)}
                onDuplicate={() => dupChild(c.id)}
                onRemove={() => removeChild(c.id)}
              />
            ))}
            <Button
              variant="ghost" size="sm" onClick={addChild}
              className="h-6 gap-1 px-2 text-[11px] text-muted-foreground"
            >
              <Plus className="h-3 w-3" /> Add block inside
            </Button>
          </div>
        )}
      </div>
    );
  };
}

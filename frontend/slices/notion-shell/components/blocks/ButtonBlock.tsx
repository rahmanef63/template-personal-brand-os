"use client";

/** ButtonBlock — block-type "button". A CTA button with a label
 *  (`block.text`) that opens `block.url` on click. Hover reveals a gear
 *  to edit label + URL in a popover. Pure callback. */

import { MousePointerClick, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { BlockRendererProps } from "../../types";

export function ButtonBlock({ block, onUpdate }: BlockRendererProps) {
  const label = block.text || "Button";
  const url = block.url ?? "";
  const open = () => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="group/btn my-1 flex items-center gap-1">
      <Button variant="outline" size="sm" type="button" onClick={open} className="gap-1.5">
        <MousePointerClick className="h-3.5 w-3.5" />
        {label}
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost" size="icon" type="button" aria-label="Configure button"
            className="h-6 w-6 text-muted-foreground opacity-0 transition group-hover/btn:opacity-100"
          >
            <Settings2 className="h-3.5 w-3.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64 space-y-2 p-2">
          <div>
            <div className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">Label</div>
            <Input value={block.text} onChange={(e) => onUpdate({ text: e.target.value })} placeholder="Button" className="h-7 text-xs" />
          </div>
          <div>
            <div className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">Link URL</div>
            <Input value={url} onChange={(e) => onUpdate({ url: e.target.value })} placeholder="https://…" className="h-7 text-xs" />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

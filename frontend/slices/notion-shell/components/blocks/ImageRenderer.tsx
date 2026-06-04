"use client";

/** ImageRenderer — block-type "image". Edit mode: URL + caption inputs +
 *  preview. Read mode: <img> + caption. Pure callback — caller decides
 *  where the URL lives (block.url, block.text fallback). */

import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BlockRendererProps } from "../../types";

export function ImageRenderer({ block, onUpdate }: BlockRendererProps) {
  const [editing, setEditing] = useState(!block.url);
  const url = block.url ?? "";

  if (editing || !url) {
    return (
      <div className="rounded-md border border-dashed border-border bg-muted/20 p-3">
        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          <ImagePlus className="h-3.5 w-3.5" />
          Image URL
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            autoFocus
            type="url"
            inputMode="url"
            value={url}
            onChange={(e) => onUpdate({ url: e.target.value })}
            placeholder="https://example.com/image.jpg"
            className="h-8 text-xs"
          />
          <Button
            size="sm"
            disabled={!url}
            onClick={() => setEditing(false)}
            className="h-8 text-xs"
          >
            Done
          </Button>
        </div>
        <Input
          value={block.caption ?? ""}
          onChange={(e) => onUpdate({ caption: e.target.value })}
          placeholder="Optional caption"
          className="mt-2 h-8 text-xs"
        />
      </div>
    );
  }

  return (
    <figure className="my-2">
      <div className="overflow-hidden rounded-md border border-border bg-muted/20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={block.caption ?? ""}
          className={cn(
            "block max-h-[480px] w-full object-contain",
            block.align === "left" && "mr-auto",
            block.align === "right" && "ml-auto",
            block.align === "center" && "mx-auto",
          )}
          onClick={() => setEditing(true)}
        />
      </div>
      {block.caption && (
        <figcaption className="mt-1 text-center text-xs text-muted-foreground">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}

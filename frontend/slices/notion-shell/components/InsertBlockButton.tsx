"use client";

/** InsertBlockButton — "+" trigger that opens a SlashMenu popover.
 *  Caller fires `onInsert(type)` to append a new block. Used by hosts
 *  in place of fixed paragraph/h2/list buttons. Search input lives at
 *  the popover top — typed chars flow into the SlashMenu's `query`. */

import * as React from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SlashMenu, type SlashMenuProps } from "./SlashMenu";
import type { BlockType } from "../types";

export interface InsertBlockButtonProps
  extends React.ComponentProps<typeof Button> {
  onInsert: (type: BlockType) => void;
  /** Forwarded to <SlashMenu>. */
  specs?: SlashMenuProps["specs"];
  label?: string;
}

export function InsertBlockButton({
  onInsert,
  specs,
  label = "Add block",
  className,
  ...props
}: InsertBlockButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const handleSelect = (type: BlockType) => {
    onInsert(type);
    setOpen(false);
    setQuery("");
  };

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setQuery("");
      }}
    >
      <PopoverTrigger asChild>
        <Button
          {...props}
          variant="ghost"
          size="sm"
          className={cn("h-7 gap-1 px-2 text-xs text-muted-foreground", className)}
        >
          <Plus className="h-3 w-3" /> {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" side="bottom" className="w-72 p-0">
        <div className="border-b border-border p-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a block type…"
              className="w-full rounded-md border border-border bg-background pl-7 pr-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>
        <SlashMenu
          query={query}
          onSelect={handleSelect}
          onClose={() => setOpen(false)}
          specs={specs}
          className="border-0 shadow-none"
        />
      </PopoverContent>
    </Popover>
  );
}

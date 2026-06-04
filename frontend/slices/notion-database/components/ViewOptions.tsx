"use client";

/** ViewOptions — toolbar with search + sort popover + filter popover for
 *  the active view. Pure callback — emits the full DatabaseViewConfig
 *  partial on change so caller dispatches a single update. Sort + filter
 *  popovers delegate to <SortBuilder /> and <FilterBuilder />. */

import { ArrowUpDown, Filter, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import type { Database, DatabaseViewConfig } from "../types";
import { FilterBuilder } from "./FilterBuilder";
import { SortBuilder } from "./SortBuilder";

export interface ViewOptionsProps {
  db: Database;
  view: DatabaseViewConfig;
  onChange: (patch: Partial<DatabaseViewConfig>) => void;
  className?: string;
}

export function ViewOptions({ db, view, onChange, className }: ViewOptionsProps) {
  return (
    <div className={cn("flex items-center gap-1 border-b border-border bg-muted/20 px-2 py-1.5", className)}>
      <div className="relative flex-1">
        <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={view.search}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder="Search rows…"
          className="h-7 border-0 bg-transparent pl-7 text-xs shadow-none focus-visible:ring-0"
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs text-muted-foreground">
            <ArrowUpDown className="h-3 w-3" /> Sort
            {view.sorts.length > 0 && <span>· {view.sorts.length}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-72 p-0">
          <SortBuilder
            db={db}
            sorts={view.sorts}
            onChange={(sorts) => onChange({ sorts })}
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs text-muted-foreground">
            <Filter className="h-3 w-3" /> Filter
            {view.filters.length > 0 && <span>· {view.filters.length}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-96 p-0">
          <FilterBuilder
            db={db}
            filters={view.filters}
            onChange={(filters) => onChange({ filters })}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface PickerItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}

export function Picker({
  label, icon: Icon, value, items,
}: {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  value: string;
  items: PickerItem[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          type="button"
          className={cn(
            "flex h-auto items-center gap-1 px-2 py-1 text-sm font-normal hover:bg-accent",
          )}
          aria-label={label}
        >
          <span className="text-muted-foreground">{label}:</span>
          {Icon && <Icon className="h-3 w-3" />}
          <span className="font-medium">{value}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel className="text-xs">{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((it) => (
          <DropdownMenuItem key={it.id} onClick={it.onClick}>
            {it.icon && <it.icon className="mr-2 h-3.5 w-3.5" />}
            {it.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ChartEmpty({ msg }: { msg: string }) {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      {msg}
    </div>
  );
}

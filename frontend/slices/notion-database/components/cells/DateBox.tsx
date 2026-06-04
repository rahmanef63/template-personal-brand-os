"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/** A date field in the DateCell editor — a clickable button (range mode, with
 *  an active ring) or a plain read-only box (single mode). The calendar is the
 *  actual picker; this just displays the formatted value / placeholder. */
export function DateBox({
  label, placeholder, active, onClick,
}: {
  label: string;
  placeholder: string;
  active?: boolean;
  onClick?: () => void;
}) {
  if (onClick) {
    return (
      <Button
        variant="outline" type="button" onClick={onClick}
        className={cn(
          "h-8 min-w-0 flex-1 justify-start truncate bg-background px-2 text-sm font-normal",
          active && "ring-2 ring-ring",
          !label && "text-muted-foreground/60",
        )}
      >
        {label || placeholder}
      </Button>
    );
  }
  return (
    <div className={cn(
      "flex h-8 min-w-0 flex-1 items-center truncate rounded-md border border-border bg-background px-2 text-sm",
      !label && "text-muted-foreground/60",
    )}>
      {label || placeholder}
    </div>
  );
}

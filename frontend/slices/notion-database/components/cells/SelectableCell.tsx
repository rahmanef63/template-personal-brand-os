import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/** SelectableCell — wraps a table cell with click-to-select + a
 *  bottom-right fill handle (drag down to copy). Pairs with
 *  `useDragFill`. Folded in from the former `database-cell-selection`
 *  slice (v0.16); uses the theme `primary` token to match row-select. */
interface Props {
  rowId: string;
  propId: string;
  selected: boolean;
  inFillRange: boolean;
  showFillHandle: boolean;
  onSelect: () => void;
  onStartFill: (e: React.MouseEvent) => void;
  children: ReactNode;
}

export function SelectableCell({
  rowId, propId, selected, inFillRange, showFillHandle, onSelect, onStartFill, children,
}: Props) {
  return (
    <div
      data-fill-row-id={rowId}
      data-fill-prop-id={propId}
      onMouseDownCapture={(e) => {
        if ((e.target as HTMLElement).closest("[data-fill-handle]")) return;
        onSelect();
      }}
      className={cn(
        "relative h-full w-full",
        selected && "ring-1 ring-inset ring-primary",
        inFillRange && !selected && "bg-primary/10",
      )}
    >
      {children}
      {showFillHandle && (
        <Button
          variant="ghost"
          data-fill-handle
          type="button"
          size="icon"
          onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); onStartFill(e); }}
          className="absolute -bottom-1 -right-1 z-10 h-2 w-2 cursor-crosshair rounded-sm border border-background bg-primary p-0 hover:bg-primary"
          aria-label="Fill down"
        />
      )}
    </div>
  );
}

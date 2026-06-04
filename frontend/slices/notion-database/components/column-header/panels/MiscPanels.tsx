/** Lightweight per-type config panels: formula expression, unique-id
 *  prefix, and a select/multi-select/status options summary. */

import { Input } from "@/components/ui/input";
import { Label, type PanelProps } from "./atoms";

export function FormulaPanel({ prop, onPatch }: PanelProps) {
  return (
    <div>
      <Label>Expression</Label>
      <Input
        value={prop.formulaExpression ?? ""}
        onChange={(e) => onPatch({ formulaExpression: e.target.value || undefined })}
        placeholder="{{title}} or =round({{Price}} * 1.1, 2)"
        className="mt-1 h-8 font-mono text-xs"
      />
      <p className="mt-1 text-[11px] text-muted-foreground">
        <code>{"{{prop}}"}</code> interpolation + <code>=expr</code> math. Edit the live
        formula inline in any formula cell for autocomplete.
      </p>
    </div>
  );
}

export function UniqueIdPanel({ prop, onPatch }: PanelProps) {
  return (
    <div>
      <Label>Prefix (optional)</Label>
      <Input
        value={prop.uniqueIdPrefix ?? ""}
        onChange={(e) => onPatch({ uniqueIdPrefix: e.target.value || undefined })}
        placeholder="TASK"
        className="mt-1 h-8 text-sm"
      />
      <p className="mt-1 text-[11px] text-muted-foreground">
        New rows render as {prop.uniqueIdPrefix ? `${prop.uniqueIdPrefix}-N` : "N"}.
      </p>
    </div>
  );
}

export function SelectPanel({ prop }: PanelProps) {
  const count = prop.options?.length ?? 0;
  return (
    <div className="rounded-md border border-border px-2 py-1.5 text-[11px] text-muted-foreground">
      {count} option{count === 1 ? "" : "s"}. Add / rename / recolor options inline in any
      {prop.type === "status" ? " status" : " select"} cell.
    </div>
  );
}

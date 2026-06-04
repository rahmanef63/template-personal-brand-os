/** Relation + rollup config panels. Both need the workspace database
 *  catalog (`databases`) — when the host didn't wire it they degrade to
 *  a hint instead of an empty picker. */

import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { RollupAggregate } from "../../../types";
import { Label, type PanelProps } from "./atoms";

const NO_TARGET = "__no_target__";
const AGGREGATES: RollupAggregate[] = [
  "count", "count_unique", "values", "sum", "avg", "min", "max",
  "earliest", "latest", "checked", "percent_checked",
];

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border bg-muted/30 px-2 py-1.5 text-[11px] text-muted-foreground">
      {children}
    </div>
  );
}

export function RelationPanel({ prop, onPatch, db, databases }: PanelProps) {
  if (!databases) return <Hint>Wire <code>databases</code> on NotionDatabase to pick a target.</Hint>;
  const options = databases.filter((d) => d.id !== db?.id);
  return (
    <div>
      <Label>Target database</Label>
      <Select
        value={prop.relationDatabaseId ?? NO_TARGET}
        onValueChange={(v) => onPatch({ relationDatabaseId: v === NO_TARGET ? null : v })}
      >
        <SelectTrigger className="mt-1 h-8 text-sm"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value={NO_TARGET}>Any database row</SelectItem>
          {options.map((d) => (
            <SelectItem key={d.id} value={d.id}>{d.name || "Untitled database"}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function RollupPanel({ prop, onPatch, db, databases }: PanelProps) {
  const relationProps = db?.properties.filter((p) => p.type === "relation") ?? [];
  const relProp = relationProps.find((p) => p.id === prop.rollupRelationPropertyId);
  const targetDb = relProp?.relationDatabaseId
    ? databases?.find((d) => d.id === relProp.relationDatabaseId)
    : null;
  return (
    <div className="space-y-3">
      <div>
        <Label>Relation property</Label>
        <Select
          value={prop.rollupRelationPropertyId ?? undefined}
          onValueChange={(v) => onPatch({ rollupRelationPropertyId: v || null, rollupTargetPropertyId: null })}
        >
          <SelectTrigger className="mt-1 h-8 text-sm"><SelectValue placeholder="Pick a relation…" /></SelectTrigger>
          <SelectContent>
            {relationProps.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
        {relationProps.length === 0 && (
          <p className="mt-1 text-[11px] text-muted-foreground">Add a relation column first.</p>
        )}
      </div>
      {targetDb && (
        <div>
          <Label>Target property ({targetDb.name})</Label>
          <Select
            value={prop.rollupTargetPropertyId ?? undefined}
            onValueChange={(v) => onPatch({ rollupTargetPropertyId: v || null })}
          >
            <SelectTrigger className="mt-1 h-8 text-sm"><SelectValue placeholder="Pick a property…" /></SelectTrigger>
            <SelectContent>
              {targetDb.properties.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      )}
      <div>
        <Label>Aggregate</Label>
        <Select
          value={prop.rollupAggregate ?? "count"}
          onValueChange={(v) => onPatch({ rollupAggregate: v as RollupAggregate })}
        >
          <SelectTrigger className="mt-1 h-8 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            {AGGREGATES.map((a) => <SelectItem key={a} value={a}>{a.replace(/_/g, " ")}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

"use client";

import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { colorClass } from "../../lib/format";
import type { Page, Property } from "../../types";

export function GroupBreakdown({ prop, rows }: { prop: Property; rows: Page[] }) {
  const counts = new Map<string, number>();
  let unset = 0;
  for (const r of rows) {
    const v = r.rowProps?.[prop.id];
    if (!v) { unset += 1; continue; }
    counts.set(String(v), (counts.get(String(v)) ?? 0) + 1);
  }
  const max = Math.max(1, ...counts.values(), unset);
  const opts = prop.options ?? [];
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <Users className="h-3.5 w-3.5" /> {prop.name}
      </div>
      <div className="space-y-1.5">
        {opts.map((o) => {
          const c = counts.get(o.id) ?? 0;
          return (
            <div key={o.id} className="flex items-center gap-2 text-xs">
              <span className={cn(
                "inline-flex w-28 shrink-0 items-center truncate rounded-full border px-2 py-0.5 text-[10px]",
                colorClass(o.color),
              )}>
                {o.name}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded bg-muted">
                <div className="h-full bg-primary" style={{ width: `${(c / max) * 100}%` }} />
              </div>
              <span className="w-6 text-right text-muted-foreground">{c}</span>
            </div>
          );
        })}
        {unset > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex w-28 shrink-0 items-center truncate rounded-full border border-dashed px-2 py-0.5 text-[10px] text-muted-foreground">
              No {prop.name}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded bg-muted">
              <div className="h-full bg-muted-foreground/40" style={{ width: `${(unset / max) * 100}%` }} />
            </div>
            <span className="w-6 text-right text-muted-foreground">{unset}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function Stat({ label, value, sub, icon: Icon, accent }: {
  label: string;
  value: number | string;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: "primary" | "emerald" | "blue" | "purple";
}) {
  const tones = {
    primary: "text-primary bg-primary/10",
    emerald: "text-emerald-600 bg-emerald-500/10",
    blue: "text-blue-600 bg-blue-500/10",
    purple: "text-purple-600 bg-purple-500/10",
  };
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className={cn("inline-flex h-6 w-6 items-center justify-center rounded-md", tones[accent])}>
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
      {sub && <div className="mt-0.5 text-[11px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

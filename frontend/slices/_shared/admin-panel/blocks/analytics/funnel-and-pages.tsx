"use client";

import * as React from "react";
import { Clock, MousePointerClick } from "lucide-react";
import { useAnalyticsBindings } from "./bindings";

export function FunnelList() {
  const { funnel } = useAnalyticsBindings();
  const top = funnel[0]?.count || 1;
  return (
    <ol className="space-y-2">
      {funnel.map((s, i) => {
        const pct = (s.count / top) * 100;
        const dropPct =
          i === 0 ? null : 100 - (s.count / (funnel[i - 1]?.count || top)) * 100;
        return (
          <li key={s.id} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">{s.label}</span>
              <span className="font-mono tabular-nums text-muted-foreground">
                {s.count.toLocaleString()}
                {dropPct !== null && (
                  <span className="ml-2 text-rose-400">−{dropPct.toFixed(0)}%</span>
                )}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500/70 to-violet-500/30"
                style={{ width: `${pct}%` }}
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function TopPagesTable() {
  const { topPages } = useAnalyticsBindings();
  return (
    <div className="divide-y rounded-lg border bg-card">
      {topPages.map((p) => (
        <div key={p.path} className="flex items-center gap-3 px-3 py-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium">{p.title}</p>
            <p className="truncate font-mono text-[10px] text-muted-foreground">{p.path}</p>
          </div>
          <p className="hidden font-mono text-[10px] text-muted-foreground sm:flex items-center gap-1">
            <Clock className="size-3" />
            {formatDuration(p.avgDurationSec)}
          </p>
          <p className="hidden font-mono text-[10px] text-muted-foreground md:flex items-center gap-1">
            <MousePointerClick className="size-3" />
            {(p.bounceRate * 100).toFixed(0)}%
          </p>
          <p className="w-16 text-right font-mono text-xs tabular-nums">
            {p.views.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

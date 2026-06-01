"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";

/** CE-wave — expanded view under an audit event row. Shows each
 *  changed field as a key + before / after pair side-by-side.
 *  Values are pretty-printed; long primitives wrap; arrays /
 *  objects shown as compact JSON. */
export function DiffTree({
  diff,
}: {
  diff: Record<string, { before: unknown; after: unknown }>;
}) {
  const entries = Object.entries(diff);
  if (entries.length === 0) return null;
  return (
    <div className="mt-2 overflow-hidden rounded-md border bg-muted/30">
      <div className="grid grid-cols-[140px_1fr_auto_1fr] gap-2 px-3 py-1.5 text-[9px] uppercase tracking-wide text-muted-foreground">
        <span>Field</span>
        <span>Before</span>
        <span aria-hidden />
        <span>After</span>
      </div>
      <ul className="divide-y divide-border/50">
        {entries.map(([key, { before, after }]) => (
          <li
            key={key}
            className="grid grid-cols-[140px_1fr_auto_1fr] items-start gap-2 px-3 py-2 text-[11px]"
          >
            <span className="truncate font-mono text-muted-foreground">{key}</span>
            <DiffValue value={before} tone="rose" />
            <ArrowRight className="mt-1 size-3 text-muted-foreground/60" aria-hidden />
            <DiffValue value={after} tone="emerald" />
          </li>
        ))}
      </ul>
    </div>
  );
}

function DiffValue({ value, tone }: { value: unknown; tone: "rose" | "emerald" }) {
  const toneClass = tone === "rose" ? "text-rose-300" : "text-emerald-300";
  if (value === null) {
    return <span className="font-mono italic text-muted-foreground">null</span>;
  }
  if (value === undefined) {
    return <span className="font-mono italic text-muted-foreground">undefined</span>;
  }
  if (typeof value === "string") {
    return <span className={"break-all font-mono " + toneClass}>&ldquo;{value}&rdquo;</span>;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return <span className={"font-mono " + toneClass}>{String(value)}</span>;
  }
  // arrays / objects → compact JSON
  return (
    <pre className={"whitespace-pre-wrap break-words font-mono " + toneClass}>
      {JSON.stringify(value, null, 0)}
    </pre>
  );
}

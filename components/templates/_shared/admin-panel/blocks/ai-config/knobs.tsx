"use client";

import * as React from "react";
import { Slider } from "@/components/ui/slider";

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-background p-2">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-mono text-xs">{value}</p>
    </div>
  );
}

export function Knob({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (next: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">{label}</span>
        <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
          {format(value)}
        </span>
      </div>
      <Slider
        className="mt-2"
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0] ?? value)}
      />
    </div>
  );
}

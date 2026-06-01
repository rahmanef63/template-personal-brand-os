"use client";

import * as React from "react";
import { Shield } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { ModerationRule } from "./types";

export function ModerationRowItem({
  rule,
  onToggle,
  onThreshold,
}: {
  rule: ModerationRule;
  onToggle: (next: boolean) => void;
  onThreshold: (next: number) => void;
}) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <Shield className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{rule.label}</p>
          {rule.threshold !== undefined && rule.enabled && (
            <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
              ≥ {rule.threshold.toFixed(2)}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{rule.description}</p>
        {rule.threshold !== undefined && rule.enabled && (
          <div className="mt-2 max-w-xs">
            <Slider
              value={[rule.threshold]}
              min={0}
              max={1}
              step={0.05}
              onValueChange={(v) => onThreshold(v[0] ?? rule.threshold ?? 0)}
            />
          </div>
        )}
      </div>
      <Switch
        checked={rule.enabled}
        onCheckedChange={onToggle}
        aria-label={`Toggle ${rule.label}`}
      />
    </div>
  );
}

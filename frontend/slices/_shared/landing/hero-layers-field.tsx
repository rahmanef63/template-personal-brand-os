"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { HeroLayer } from "./types";

/**
 * Structured editor for a hero section's `layers` array. Each layer is an
 * image OR a raw HTML/CSS block, placed in the background (behind content)
 * or foreground (above it), with its own opacity slider + on/off toggle.
 * Only meaningful for the hero kind — shows a hint otherwise.
 */
export function HeroLayersField({
  value,
  onChange,
  kind,
}: {
  value: unknown;
  onChange: (next: unknown) => void;
  kind?: string;
}) {
  const layers: HeroLayer[] = Array.isArray(value) ? (value as HeroLayer[]) : [];

  if (kind !== "hero") {
    return (
      <p className="text-[10px] text-muted-foreground">
        Layers apply to the <b>hero</b> section — set Kind to “Hero” to compose
        background / foreground layers.
      </p>
    );
  }

  function set(next: HeroLayer[]) {
    onChange(next);
  }
  function patch(i: number, p: Partial<HeroLayer>) {
    set(layers.map((l, idx) => (idx === i ? { ...l, ...p } : l)));
  }
  function add(type: HeroLayer["type"]) {
    set([
      ...layers,
      {
        id: `layer-${type}-${layers.length + 1}`,
        type,
        enabled: true,
        placement: "background",
        opacity: type === "image" ? 30 : 100,
      },
    ]);
  }
  function remove(i: number) {
    set(layers.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-3">
      {layers.length === 0 && (
        <p className="rounded-md border border-dashed border-border/60 px-3 py-4 text-center text-xs text-muted-foreground">
          No layers — the hero uses the template&apos;s built-in background. Add
          one to override.
        </p>
      )}

      {layers.map((l, i) => (
        <div
          key={l.id}
          className="space-y-2 rounded-md border border-border/60 bg-muted/30 p-3"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-medium text-muted-foreground">
              Layer {i + 1} · {l.type === "image" ? "Image" : "HTML / CSS"}
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <Switch
                  checked={l.enabled}
                  onCheckedChange={(v) => patch(i, { enabled: v })}
                />
                On
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7 text-destructive"
                aria-label="Remove layer"
                onClick={() => remove(i)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <Label className="text-[10px] text-muted-foreground">Placement</Label>
              <Select
                value={l.placement}
                onValueChange={(v) =>
                  patch(i, { placement: v as HeroLayer["placement"] })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="background">Background (behind)</SelectItem>
                  <SelectItem value="foreground">Foreground (above)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[10px] text-muted-foreground">
                Opacity · {l.opacity}%
              </Label>
              <Slider
                className="mt-3"
                value={[l.opacity]}
                min={0}
                max={100}
                step={1}
                onValueChange={([v]) => patch(i, { opacity: v })}
              />
            </div>
          </div>

          {l.type === "image" ? (
            <div>
              <Label className="text-[10px] text-muted-foreground">
                Image URL or /path
              </Label>
              <Input
                value={l.url ?? ""}
                onChange={(e) => patch(i, { url: e.target.value })}
                placeholder="/hero.webp or https://…"
                className="mt-1 font-mono text-xs"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <div>
                <Label className="text-[10px] text-muted-foreground">HTML</Label>
                <Textarea
                  value={l.html ?? ""}
                  onChange={(e) => patch(i, { html: e.target.value })}
                  rows={3}
                  className="mt-1 font-mono text-xs"
                  placeholder='<div class="h-full w-full bg-gradient-to-br from-brand/30 to-transparent"></div>'
                />
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground">
                  CSS (injected globally — scope your selectors)
                </Label>
                <Textarea
                  value={l.css ?? ""}
                  onChange={(e) => patch(i, { css: e.target.value })}
                  rows={2}
                  className="mt-1 font-mono text-xs"
                  placeholder=".hero-glow { animation: pulse 4s infinite }"
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => add("image")}
        >
          <Plus className="size-3.5" /> Image layer
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => add("html")}
        >
          <Plus className="size-3.5" /> HTML / CSS layer
        </Button>
      </div>
    </div>
  );
}

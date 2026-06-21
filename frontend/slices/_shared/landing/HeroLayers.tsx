"use client";

import * as React from "react";
import type { HeroLayer } from "./types";

/**
 * Renders a hero's stacked composition layers for one band.
 *
 *  - `background` band sits behind the hero content (`-z-10`).
 *  - `foreground` band sits above it (`z-20`, click-through).
 *
 * Each layer carries its own opacity (0-100) + on/off toggle. When a hero
 * has no enabled background layer, falls back to `fallbackImg` so existing
 * heroes (no layers configured) look exactly as before.
 *
 * Call once per band inside the hero component.
 */
export function HeroLayers({
  layers,
  fallbackImg,
  placement,
  fallbackOpacity = 100,
}: {
  layers?: HeroLayer[];
  fallbackImg?: string;
  placement: "background" | "foreground";
  /** Opacity (0-100) for the back-compat fallback image. Full by default so
   *  the image shows in its real colors. */
  fallbackOpacity?: number;
}) {
  const all = layers ?? [];
  const active = all.filter((l) => l.enabled && l.placement === placement);
  const useFallback =
    placement === "background" &&
    Boolean(fallbackImg) &&
    !all.some((l) => l.enabled && l.placement === "background");

  if (active.length === 0 && !useFallback) return null;

  const band =
    placement === "background"
      ? "absolute inset-0 -z-10 overflow-hidden"
      : "pointer-events-none absolute inset-0 z-20 overflow-hidden";

  return (
    <div aria-hidden="true" className={band}>
      {useFallback && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={fallbackImg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: clamp01(fallbackOpacity) }}
        />
      )}
      {active.map((l) => (
        <HeroLayerView key={l.id} layer={l} />
      ))}
    </div>
  );
}

function HeroLayerView({ layer }: { layer: HeroLayer }) {
  const opacity = clamp01(layer.opacity ?? 100);
  if (layer.type === "image") {
    if (!layer.url) return null;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={layer.url}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }
  // type === "html": author-controlled markup + optional CSS (admin-only
  // landing editor, never visitor input) — safe to dangerouslySet.
  return (
    <div className="absolute inset-0" style={{ opacity }}>
      {layer.css ? <style dangerouslySetInnerHTML={{ __html: layer.css }} /> : null}
      {layer.html ? <div dangerouslySetInnerHTML={{ __html: layer.html }} /> : null}
    </div>
  );
}

function clamp01(pct: number): number {
  return Math.max(0, Math.min(100, pct)) / 100;
}

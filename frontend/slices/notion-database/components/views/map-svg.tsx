"use client";

/** SVG world + pin grid for MapView. Decorative continent outlines
 *  (equirectangular projection — NOT geographically precise). */

import { useState } from "react";
import { MapPin } from "lucide-react";
import type { Page } from "../../types";

export const MAP_VW = 720;
export const MAP_VH = 360;

export const MAP_COLOR_HEX: Record<string, string> = {
  gray: "#6b7280", brown: "#a16207", orange: "#f97316",
  yellow: "#eab308", green: "#10b981", blue: "#3b82f6",
  purple: "#a855f7", pink: "#ec4899", red: "#ef4444",
};

const CONTINENTS = [
  "M 100 80 L 170 70 L 210 95 L 230 130 L 200 165 L 160 175 L 140 155 L 120 130 Z",
  "M 200 200 L 245 195 L 260 230 L 250 280 L 220 300 L 205 270 Z",
  "M 350 90 L 410 85 L 425 110 L 405 130 L 365 125 L 350 105 Z",
  "M 360 145 L 425 140 L 445 195 L 420 250 L 380 240 L 360 195 Z",
  "M 430 80 L 580 75 L 620 110 L 615 165 L 555 175 L 480 160 L 440 130 Z",
  "M 555 230 L 620 225 L 640 255 L 605 270 L 570 260 Z",
  "M 290 50 L 320 45 L 335 75 L 310 90 L 285 75 Z",
];

export function projectLatLng(lat: number, lng: number): { x: number; y: number } {
  const cLat = Math.max(-85, Math.min(85, lat));
  const cLng = Math.max(-180, Math.min(180, lng));
  return {
    x: ((cLng + 180) / 360) * MAP_VW,
    y: ((90 - cLat) / 180) * MAP_VH,
  };
}

export interface MapPinData { row: Page; x: number; y: number; lat: number; lng: number; color: string }

export function MapSvg({
  pins, onPinClick,
}: {
  pins: MapPinData[];
  onPinClick?: (rowId: string) => void;
}) {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-[hsl(var(--accent)/0.3)]">
      <svg viewBox={`0 0 ${MAP_VW} ${MAP_VH}`} className="block h-auto w-full" role="img" aria-label="World map">
        <rect width={MAP_VW} height={MAP_VH} fill="hsl(var(--muted))" />
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`v${i}`} x1={(i / 12) * MAP_VW} y1={0} x2={(i / 12) * MAP_VW} y2={MAP_VH}
            stroke="hsl(var(--border))" strokeWidth={0.5} strokeDasharray="2 4" />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={(i / 6) * MAP_VH} x2={MAP_VW} y2={(i / 6) * MAP_VH}
            stroke="hsl(var(--border))" strokeWidth={0.5} strokeDasharray="2 4" />
        ))}
        <line x1={0} y1={MAP_VH / 2} x2={MAP_VW} y2={MAP_VH / 2} stroke="hsl(var(--border))" strokeWidth={1} />
        {CONTINENTS.map((d, i) => (
          <path key={i} d={d} fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth={1} />
        ))}
        {pins.map(({ row, x, y, color }) => {
          const isHover = hover === row.id;
          return (
            <g
              key={row.id}
              transform={`translate(${x},${y})`}
              className="cursor-pointer"
              onMouseEnter={() => setHover(row.id)}
              onMouseLeave={() => setHover((h) => (h === row.id ? null : h))}
              onClick={() => onPinClick?.(row.id)}
            >
              <circle r={isHover ? 7 : 5} fill={color} stroke="white" strokeWidth={1.5} className="transition-all" />
              <circle r={isHover ? 14 : 10} fill={color} opacity={0.2} />
            </g>
          );
        })}
      </svg>
      {hover && (() => {
        const p = pins.find((x) => x.row.id === hover);
        if (!p) return null;
        return (
          <div className="flex items-center gap-2 border-t border-border bg-card px-3 py-2 text-xs">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium">{p.row.icon} {p.row.title || "Untitled"}</span>
            <span className="tabular-nums text-muted-foreground">
              {p.lat.toFixed(3)}, {p.lng.toFixed(3)}
            </span>
          </div>
        );
      })()}
    </div>
  );
}

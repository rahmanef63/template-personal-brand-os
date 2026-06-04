/** Pure date / range math for TimelineView. */

export const TIMELINE_DAY_MS = 86400000;

export function msToYMD(ms: number): string {
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function ymdToMs(dateStr: string): number {
  return new Date(dateStr + "T00:00:00").getTime();
}

export function getBarStyle(
  x: { startMs: number; endMs: number },
  rangeStart: number,
  cellW: number,
  days: number,
): { left: number; width: number } {
  const left = Math.max(0, Math.floor((x.startMs - rangeStart) / TIMELINE_DAY_MS)) * cellW;
  const rawRight = Math.floor((x.endMs - rangeStart) / TIMELINE_DAY_MS + 1) * cellW;
  const right = Math.min(days * cellW, rawRight);
  const width = Math.max(cellW, right - left);
  return { left, width };
}

export function timelineCellMetrics(zoom: "day" | "week" | "month" | "quarter") {
  if (zoom === "day") return { cellW: 64, days: 14 };
  if (zoom === "week") return { cellW: 40, days: 28 };
  if (zoom === "quarter") return { cellW: 14, days: 90 };
  return { cellW: 32, days: 28 };
}

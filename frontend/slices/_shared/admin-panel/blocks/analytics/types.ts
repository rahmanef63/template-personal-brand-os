// Analytics types — mirrors what an event-tracking slice would expose
// (frontend/slices/event-tracking/ today is config-only — to be filled
// during real-impl wave).
//
// BV-wave (2026-05-21) — fourth admin-panel block with real impl.

export type DayPoint = {
  /** ISO date (yyyy-mm-dd). */
  date: string;
  views: number;
  sessions: number;
};

export type TrafficSource = {
  id: string;
  label: string;
  /** Hex color for the donut segment. */
  color: string;
  visits: number;
};

export type PageStat = {
  path: string;
  title: string;
  views: number;
  avgDurationSec: number;
  /** 0-1 (e.g. 0.32 = 32% bounced). */
  bounceRate: number;
};

export type FunnelStep = {
  id: string;
  label: string;
  count: number;
};

export type KpiCardData = {
  id: string;
  label: string;
  value: string;
  /** Signed percent delta vs previous period. */
  deltaPct: number;
  hint: string;
};

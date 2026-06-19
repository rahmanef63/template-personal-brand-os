import type {
  DayPoint,
  FunnelStep,
  KpiCardData,
  PageStat,
  TrafficSource,
} from "./types";

/** Deterministic pseudo-random series so every visitor sees the same
 *  chart shape (demo isn't expected to vary across hits). 30 days,
 *  weekly seasonality, slight upward trend. */
function buildSeries(): DayPoint[] {
  const out: DayPoint[] = [];
  const today = new Date("2026-05-20T00:00:00Z");
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const dow = d.getUTCDay();
    const seasonal = dow === 0 || dow === 6 ? 0.55 : 1; // weekends slower
    const trend = 1 + (29 - i) * 0.012;
    const noise = 0.85 + (((i * 37) % 30) / 100); // 0.85..1.15
    const views = Math.round(420 * seasonal * trend * noise);
    const sessions = Math.round(views * (0.62 + ((i * 13) % 8) / 100));
    out.push({ date: d.toISOString().slice(0, 10), views, sessions });
  }
  return out;
}

export const SERIES_30D: DayPoint[] = buildSeries();

export const KPI_CARDS: KpiCardData[] = [
  {
    id: "views",
    label: "Page views",
    value: SERIES_30D.reduce((s, p) => s + p.views, 0).toLocaleString(),
    deltaPct: 18.4,
    hint: "vs previous 30 days",
  },
  {
    id: "sessions",
    label: "Sessions",
    value: SERIES_30D.reduce((s, p) => s + p.sessions, 0).toLocaleString(),
    deltaPct: 12.1,
    hint: "unique visits",
  },
  {
    id: "conv",
    label: "Conversion",
    value: "3.4%",
    deltaPct: 0.6,
    hint: "form fill / view",
  },
  {
    id: "bounce",
    label: "Bounce rate",
    value: "41.2%",
    deltaPct: -2.8,
    hint: "lower is better",
  },
];

export const SOURCES: TrafficSource[] = [
  { id: "direct", label: "Direct", color: "#a78bfa", visits: 4280 },
  { id: "search", label: "Organic search", color: "#34d399", visits: 3920 },
  { id: "referral", label: "Referral", color: "#fbbf24", visits: 1480 },
  { id: "social", label: "Social", color: "#60a5fa", visits: 1180 },
  { id: "email", label: "Email", color: "#f87171", visits: 620 },
];

export const TOP_PAGES: PageStat[] = [
  { path: "/", title: "Homepage", views: 4860, avgDurationSec: 142, bounceRate: 0.32 },
  { path: "/case-studies", title: "Case studies index", views: 1420, avgDurationSec: 188, bounceRate: 0.28 },
  { path: "/pricing", title: "Pricing", views: 1180, avgDurationSec: 96, bounceRate: 0.51 },
  { path: "/blog/may-launch-recap", title: "May launch recap", views: 980, avgDurationSec: 224, bounceRate: 0.22 },
  { path: "/contact", title: "Contact", views: 640, avgDurationSec: 88, bounceRate: 0.44 },
  { path: "/about", title: "About", views: 520, avgDurationSec: 116, bounceRate: 0.38 },
];

export const FUNNEL: FunnelStep[] = [
  { id: "visit", label: "Landing visit", count: 11480 },
  { id: "scroll", label: "Scrolled past hero", count: 8120 },
  { id: "cta-view", label: "Saw primary CTA", count: 4680 },
  { id: "cta-click", label: "Clicked CTA", count: 1240 },
  { id: "form-submit", label: "Form submit", count: 390 },
];

export const RANGE_LABELS = ["7d", "30d", "90d"] as const;
export type RangeLabel = (typeof RANGE_LABELS)[number];

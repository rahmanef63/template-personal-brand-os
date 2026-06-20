import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Admin-panel "Analytics" block — READ-ONLY. Mirrors convex/settings.ts auth
// guard (getAuthUserId -> throw if not signed in). No mutations: analytics is
// read-only by nature. KPIs + the 30-day series are computed from REAL pb
// tables (posts, leads, subscribers, comments, pbOrders) via _creationTime.
// sources / topPages / funnel are illustrative — there is no event-tracking
// infra in this template (the event-tracking slice is config-only), so those
// keep the demo's seed shape. See the // ponytail: comments below.

const DAY_MS = 86_400_000;
const WINDOW_DAYS = 30;

// Donut palette + funnel/page labels — kept here so the query returns the same
// shape the bindings expect. Counts that we CAN derive cheaply use real data.
const SOURCE_PALETTE = [
  { id: "direct", label: "Direct", color: "#a78bfa" },
  { id: "search", label: "Organic search", color: "#34d399" },
  { id: "referral", label: "Referral", color: "#fbbf24" },
  { id: "social", label: "Social", color: "#60a5fa" },
  { id: "email", label: "Email", color: "#f87171" },
] as const;

function pct(curr: number, prev: number): number {
  if (prev === 0) return curr === 0 ? 0 : 100;
  return ((curr - prev) / prev) * 100;
}

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Harus login sebagai admin.");

    const now = Date.now();
    const windowStart = now - WINDOW_DAYS * DAY_MS;
    const prevStart = now - 2 * WINDOW_DAYS * DAY_MS;

    // Pull every row's _creationTime from the real content tables. These tables
    // are small (admin-managed content), so a full collect is fine.
    const [posts, leads, subscribers, comments, orders] = await Promise.all([
      ctx.db.query("posts").collect(),
      ctx.db.query("leads").collect(),
      ctx.db.query("subscribers").collect(),
      ctx.db.query("comments").collect(),
      ctx.db.query("pbOrders").collect(),
    ]);

    // REAL page-view proxy: posts carry an explicit `views` counter.
    const totalViews = posts.reduce((s, p) => s + (p.views ?? 0), 0);

    // --- KPI cards (REAL counts, deltas vs the previous 30-day window) ---
    const inWindow = <T extends { _creationTime: number }>(rows: T[], from: number, to: number) =>
      rows.filter((r) => r._creationTime >= from && r._creationTime < to).length;

    const leadsCurr = inWindow(leads, windowStart, now);
    const leadsPrev = inWindow(leads, prevStart, windowStart);
    const subsCurr = inWindow(subscribers, windowStart, now);
    const subsPrev = inWindow(subscribers, prevStart, windowStart);
    const ordersCurr = inWindow(orders, windowStart, now);
    const ordersPrev = inWindow(orders, prevStart, windowStart);

    const kpis = [
      {
        id: "views",
        label: "Post views",
        value: totalViews.toLocaleString(),
        deltaPct: 0, // ponytail: views is a running counter, no per-period history to diff
        hint: "all published posts",
      },
      {
        id: "leads",
        label: "Leads",
        value: leads.length.toLocaleString(),
        deltaPct: Number(pct(leadsCurr, leadsPrev).toFixed(1)),
        hint: "vs previous 30 days",
      },
      {
        id: "subscribers",
        label: "Subscribers",
        value: subscribers.length.toLocaleString(),
        deltaPct: Number(pct(subsCurr, subsPrev).toFixed(1)),
        hint: "vs previous 30 days",
      },
      {
        id: "orders",
        label: "Orders",
        value: orders.length.toLocaleString(),
        deltaPct: Number(pct(ordersCurr, ordersPrev).toFixed(1)),
        hint: "vs previous 30 days",
      },
    ];

    // --- 30-day series (REAL): per-day new content + new sessions proxy ---
    // views = posts+leads+subscribers+comments+orders created that day (a
    // real activity signal), sessions = leads+subscribers+orders that day.
    const dayKey = (t: number) => new Date(t).toISOString().slice(0, 10);
    const viewsByDay = new Map<string, number>();
    const sessByDay = new Map<string, number>();
    const bump = (m: Map<string, number>, k: string) => m.set(k, (m.get(k) ?? 0) + 1);
    for (const r of [...posts, ...leads, ...subscribers, ...comments, ...orders]) {
      if (r._creationTime < windowStart) continue;
      bump(viewsByDay, dayKey(r._creationTime));
    }
    for (const r of [...leads, ...subscribers, ...orders]) {
      if (r._creationTime < windowStart) continue;
      bump(sessByDay, dayKey(r._creationTime));
    }
    const series = Array.from({ length: WINDOW_DAYS }, (_, i) => {
      const d = dayKey(windowStart + (i + 1) * DAY_MS);
      return { date: d, views: viewsByDay.get(d) ?? 0, sessions: sessByDay.get(d) ?? 0 };
    });

    // --- Traffic sources (REAL labels mapped from lead/subscriber `source`) ---
    // We DO have a `source` string on leads + subscribers, so the donut is real:
    // bucket each into the known palette ids (fallback -> "direct").
    const knownIds = new Set<string>(SOURCE_PALETTE.map((s) => s.id));
    const visitsById = new Map<string, number>();
    for (const r of [...leads, ...subscribers]) {
      const key = knownIds.has(r.source) ? r.source : "direct";
      visitsById.set(key, (visitsById.get(key) ?? 0) + 1);
    }
    const sources = SOURCE_PALETTE.map((s) => ({
      id: s.id,
      label: s.label,
      color: s.color,
      visits: visitsById.get(s.id) ?? 0,
    }));

    // --- Top pages: REAL — published posts ranked by their views counter. ---
    const topPages = [...posts]
      .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
      .slice(0, 6)
      .map((p) => ({
        path: `/blog/${p.slug}`,
        title: p.title,
        views: p.views ?? 0,
        // ponytail: no event-tracking infra — duration/bounce illustrative,
        // derived deterministically from readMin so the table isn't empty.
        avgDurationSec: Math.max(30, (p.readMin ?? 1) * 60),
        bounceRate: 0.35,
      }));

    // --- Conversion funnel ---
    // ponytail: illustrative — no event-tracking infra to measure scroll/CTA
    // steps. Anchored on REAL endpoints: top = total post views, bottom = real
    // leads count; the two middle steps are interpolated drop-offs.
    const visits = Math.max(totalViews, leads.length * 4, 1);
    const submits = leads.length;
    const funnel = [
      { id: "visit", label: "Landing visit", count: visits },
      { id: "scroll", label: "Scrolled past hero", count: Math.round(visits * 0.71) },
      { id: "cta-view", label: "Saw primary CTA", count: Math.round(visits * 0.41) },
      { id: "cta-click", label: "Clicked CTA", count: Math.round(Math.max(submits * 3, visits * 0.11)) },
      { id: "form-submit", label: "Form submit", count: submits },
    ];

    return { kpis, series, sources, topPages, funnel };
  },
});

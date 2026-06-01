// Pure utility helpers shared across all website-templates.

export function nid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

export function fmtDate(ts: number, locale: string = "id-ID"): string {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
}

export function rel(ts: number, locale: string = "id-ID"): string {
  if (!ts) return "—";
  const diff = Date.now() - ts;
  if (diff < 0) {
    const future = Math.abs(diff);
    if (future < 60_000) return "in a few seconds";
    if (future < 60 * 60_000) return `in ${Math.round(future / 60_000)} min`;
    if (future < 24 * 60 * 60_000) return `in ${Math.round(future / (60 * 60_000))} h`;
    return new Date(ts).toLocaleDateString(locale, { day: "numeric", month: "short" });
  }
  if (diff < 60_000) return "just now";
  if (diff < 60 * 60_000) return `${Math.round(diff / 60_000)} min ago`;
  if (diff < 24 * 60 * 60_000) return `${Math.round(diff / (60 * 60_000))} h ago`;
  if (diff < 7 * 24 * 60 * 60_000) return `${Math.round(diff / (24 * 60 * 60_000))}d ago`;
  return fmtDate(ts, locale);
}

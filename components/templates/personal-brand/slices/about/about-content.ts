// About-page content resolver. The admin Settings form stores a free-form
// JSON string in siteSettings.aboutContent; AboutPage reads it and falls back
// to these template defaults whenever the field is empty/invalid.

export type TimelineEntry = { year: string; milestone: string };

export const DEFAULT_TIMELINE: TimelineEntry[] = [
  { year: "2026", milestone: "Founder, Lorem Studio. Mentor Y Combinator W22 cohort." },
  { year: "2024", milestone: "Lead PM, Foobar Inc. — scale dari 5K ke 80K MAU." },
  { year: "2022", milestone: "Sr. Engineer, Acme Tech. Lead 4-engineer team, ship checkout v3." },
  { year: "2019", milestone: "Co-founder, Beta Labs. Bootstrap dari Rp 0 ke profitable in 18mo." },
  { year: "2017", milestone: "First job — junior dev di Gamma Corp. Belajar production reality." },
  { year: "2014", milestone: "Lulus S1 Teknik Informatika ITB — magang Tokopedia summer." },
];

export const DEFAULT_MENTIONS: string[] = [
  "Forbes Indonesia 30 Under 30 — 2024",
  "Speaker — TEDx Jakarta 2023",
  "Co-host — Sit Podcast (200K downloads)",
  "Author — “Ipsum Notes” newsletter (60K subs)",
  "Investor — Dolor Ventures (early-stage SaaS)",
  "Open-source maintainer — lorem-utils 12K stars",
];

type AboutContent = { timeline: TimelineEntry[]; mentions: string[] };

const isTimelineEntry = (v: unknown): v is TimelineEntry =>
  Boolean(v) &&
  typeof v === "object" &&
  typeof (v as TimelineEntry).year === "string" &&
  typeof (v as TimelineEntry).milestone === "string";

const isString = (v: unknown): v is string => typeof v === "string";

/** Parse siteSettings.aboutContent JSON into timeline + mentions, falling back
 *  to template defaults per-field when missing or malformed. */
export function resolveAboutContent(raw?: string | null): AboutContent {
  let parsed: Record<string, unknown> = {};
  if (raw) {
    try {
      const p = JSON.parse(raw);
      if (p && typeof p === "object" && !Array.isArray(p)) {
        parsed = p as Record<string, unknown>;
      }
    } catch {
      // ignore — use defaults
    }
  }
  const timeRaw = parsed.timeline;
  const timeline =
    Array.isArray(timeRaw) && timeRaw.filter(isTimelineEntry).length > 0
      ? timeRaw.filter(isTimelineEntry)
      : DEFAULT_TIMELINE;
  const mentRaw = parsed.mentions;
  const mentions =
    Array.isArray(mentRaw) && mentRaw.filter(isString).length > 0
      ? mentRaw.filter(isString)
      : DEFAULT_MENTIONS;
  return { timeline, mentions };
}

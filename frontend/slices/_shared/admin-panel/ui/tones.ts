// Single source of truth for the semantic Tailwind color palette
// used by every admin-panel block. Each tone returns a triple so
// consumers don't re-roll the recipe in per-block seed.ts files.
//
// SEMANTICS (locked, BY-wave 2026-05-21):
//   success   emerald   active / connected / delivered / ok
//   warn      amber     pending / rate-limited / warning / invited
//   danger    rose      failing / error / alert / revoked / deleted
//   neutral   zinc      paused / info severity / viewer / default
//   info      sky       transient state change / fast tier / export
//   accent    violet    publish action / frontier tier / admin role
//   elevated  amber     owner role / premium scope (visual alias of
//                       warn but distinct semantic key so downstream
//                       can re-theme without affecting warnings)
//
// Usage:
//   import { TONES } from "@/features/_shared/admin-panel/ui/tones";
//   <Badge variant="outline" className={"text-[10px] uppercase " + TONES.success.badge} />
//   <span className={"size-1.5 rounded-full " + TONES.danger.dot} />
//   <span className={TONES.warn.text}>...</span>

export type ToneKey =
  | "success"
  | "warn"
  | "danger"
  | "neutral"
  | "info"
  | "accent"
  | "elevated";

type ToneTriple = {
  /** Full badge classes (bg + text + border). Pair with shadcn Badge variant="outline". */
  badge: string;
  /** Solid swatch (e.g. for a leading dot in a list item). */
  dot: string;
  /** Plain text color only. */
  text: string;
};

export const TONES: Record<ToneKey, ToneTriple> = {
  success: {
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    dot: "bg-emerald-500",
    text: "text-emerald-300",
  },
  warn: {
    badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    dot: "bg-amber-500",
    text: "text-amber-300",
  },
  danger: {
    badge: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    dot: "bg-rose-500",
    text: "text-rose-300",
  },
  neutral: {
    badge: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
    dot: "bg-zinc-500",
    text: "text-zinc-300",
  },
  info: {
    badge: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    dot: "bg-sky-500",
    text: "text-sky-300",
  },
  accent: {
    badge: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    dot: "bg-violet-500",
    text: "text-violet-300",
  },
  elevated: {
    badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    dot: "bg-amber-500",
    text: "text-amber-300",
  },
};

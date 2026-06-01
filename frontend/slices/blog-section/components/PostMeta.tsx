import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type PostMetaProps = {
  author?: string;
  /** ms timestamp. */
  publishedAt: number;
  tags?: string[];
  /** Limit tag count rendered (rest collapsed into "+N"). */
  maxTags?: number;
  className?: string;
};

const RTF = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const ABS_FMT = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const UNITS: Array<{ unit: Intl.RelativeTimeFormatUnit; ms: number }> = [
  { unit: "year", ms: 31_536_000_000 },
  { unit: "month", ms: 2_592_000_000 },
  { unit: "week", ms: 604_800_000 },
  { unit: "day", ms: 86_400_000 },
  { unit: "hour", ms: 3_600_000 },
  { unit: "minute", ms: 60_000 },
];

function relative(ts: number, now: number): string {
  const diff = ts - now;
  const abs = Math.abs(diff);
  for (const { unit, ms } of UNITS) {
    if (abs >= ms) {
      return RTF.format(Math.round(diff / ms), unit);
    }
  }
  return RTF.format(Math.round(diff / 1000), "second");
}

export function PostMeta({
  author,
  publishedAt,
  tags,
  maxTags = 3,
  className,
}: PostMetaProps) {
  const now = Date.now();
  const rel = relative(publishedAt, now);
  const abs = ABS_FMT.format(new Date(publishedAt));
  const shown = tags?.slice(0, maxTags) ?? [];
  const extra = tags && tags.length > maxTags ? tags.length - maxTags : 0;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground",
        className,
      )}
    >
      {author ? <span className="font-medium text-foreground">{author}</span> : null}
      {author ? <span aria-hidden>·</span> : null}
      <time dateTime={new Date(publishedAt).toISOString()} title={abs}>
        {rel}
      </time>
      {shown.length > 0 ? (
        <>
          <span aria-hidden>·</span>
          <span className="flex flex-wrap items-center gap-1">
            {shown.map((tag) => (
              <Badge key={tag} variant="secondary" className="font-normal">
                {tag}
              </Badge>
            ))}
            {extra > 0 ? (
              <Badge variant="outline" className="font-normal">
                +{extra}
              </Badge>
            ) : null}
          </span>
        </>
      ) : null}
    </div>
  );
}

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { resolveIcon } from "./FeatureGrid";

export interface CollectionItem {
  title: string;
  blurb?: string;
  icon?: string;
  href?: string;
}

export interface CollectionProps {
  /** Optional small mono eyebrow above the heading. */
  label?: string;
  /** Optional section heading. */
  heading?: string;
  /** Name of the shared PageConfig.collections entry this block renders. */
  source?: string;
  /** "all" or a number string — how many items to show (preview vs full). */
  limit?: string;
  /** Optional link to the dedicated page for this collection (e.g. /services). */
  viewAllLabel?: string;
  viewAllHref?: string;
  /** Injected by BlockRenderer from collections[source]; never stored in props. */
  items?: CollectionItem[];
}

/**
 * Collection — renders a SHARED list (services, work, packages...) as cards.
 * Its items come from PageConfig.collections[source], not its own props, so a
 * limited preview block and a full-list block pointed at the same source stay
 * in sync. `limit` switches between the landing preview and the full page view.
 */
export default function Collection({
  label,
  heading,
  limit = "all",
  viewAllLabel,
  viewAllHref,
  items = [],
}: CollectionProps) {
  const n = limit === "all" ? items.length : Number(limit) || items.length;
  const shown = items.slice(0, n);
  if (shown.length === 0) return null;
  const hasViewAll = Boolean(viewAllLabel && viewAllHref);

  return (
    <section className="reveal mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      {(label || heading || hasViewAll) && (
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            {label ? (
              <p className="font-mono text-[11px] uppercase tracking-wider text-primary">
                {label}
              </p>
            ) : null}
            {heading ? (
              <h2 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
                {heading}
              </h2>
            ) : null}
          </div>
          {hasViewAll ? (
            <Link
              href={viewAllHref!}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              {viewAllLabel}
              <ArrowRight weight="bold" className="size-4" />
            </Link>
          ) : null}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((item, i) => {
          const Icon = resolveIcon(item.icon);
          const cls =
            "flex flex-col rounded-xl border border-border bg-muted/30 p-6 transition-colors hover:border-primary/50";
          const inner = (
            <>
              {item.icon ? (
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon weight="bold" className="size-5" />
                </span>
              ) : null}
              <h3 className="mt-5 font-semibold tracking-tight">{item.title}</h3>
              {item.blurb ? (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.blurb}
                </p>
              ) : null}
              {item.href ? (
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Learn more
                  <ArrowRight weight="bold" className="size-3.5" />
                </span>
              ) : null}
            </>
          );
          return item.href ? (
            <Link key={`${i}`} href={item.href} className={cls}>
              {inner}
            </Link>
          ) : (
            <div key={`${i}`} className={cls}>
              {inner}
            </div>
          );
        })}
      </div>
    </section>
  );
}

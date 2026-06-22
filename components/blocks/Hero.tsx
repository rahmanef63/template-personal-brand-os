import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export interface HeroProps {
  /** Optional small mono eyebrow above the title. Omit for none. */
  label?: string;
  /** Big headline. Required; the block returns null without it. */
  title?: string;
  /** Optional supporting paragraph under the title. */
  subtitle?: string;
  /** Content alignment. Defaults to "left". */
  align?: "left" | "center";
  /** Label for the primary, filled CTA. */
  ctaLabel?: string;
  /** Destination for the primary CTA. Required when ctaLabel is set. */
  ctaHref?: string;
  /** Optional label for a secondary, outlined button. */
  secondaryLabel?: string;
  /** Destination for the secondary button. Required when secondaryLabel is set. */
  secondaryHref?: string;
}

export default function Hero({
  label,
  title,
  subtitle,
  align = "left",
  ctaLabel,
  ctaHref,
  secondaryLabel,
  secondaryHref,
}: HeroProps) {
  if (!title) return null;

  const isCenter = align === "center";
  const hasPrimary = Boolean(ctaLabel && ctaHref);
  const hasSecondary = Boolean(secondaryLabel && secondaryHref);

  return (
    <section className="reveal mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div
        className={
          isCenter
            ? "mx-auto flex max-w-3xl flex-col items-center text-center"
            : "flex flex-col"
        }
      >
        {label ? (
          <p className="font-mono text-[11px] uppercase tracking-wider text-primary">
            {label}
          </p>
        ) : null}

        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          {title}
        </h1>

        {subtitle ? (
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
            {subtitle}
          </p>
        ) : null}

        {(hasPrimary || hasSecondary) ? (
          <div
            className={
              isCenter
                ? "mt-8 flex flex-wrap justify-center gap-3"
                : "mt-8 flex flex-wrap gap-3"
            }
          >
            {hasPrimary ? (
              <Link
                href={ctaHref!}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                {ctaLabel}
                <ArrowRight weight="bold" className="size-4" />
              </Link>
            ) : null}

            {hasSecondary ? (
              <Link
                href={secondaryHref!}
                className="inline-flex items-center rounded-lg border border-border px-5 py-3 text-sm font-semibold transition-colors hover:border-primary/50 hover:bg-muted"
              >
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

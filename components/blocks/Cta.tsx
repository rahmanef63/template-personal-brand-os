import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export interface CtaProps {
  /** Headline of the closing band. */
  title: string;
  /** Optional supporting line under the title. */
  subtitle?: string;
  /** Label for the primary, filled CTA. */
  ctaLabel: string;
  /** Destination for the primary CTA. */
  ctaHref: string;
  /** Optional label for a secondary, outlined button. */
  secondaryLabel?: string;
  /** Destination for the secondary button. Required when secondaryLabel is set. */
  secondaryHref?: string;
}

export default function Cta({
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  secondaryLabel,
  secondaryHref,
}: CtaProps) {
  const hasSecondary = Boolean(secondaryLabel && secondaryHref);

  return (
    <section className="reveal mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="flex flex-col items-center gap-6 rounded-xl border border-border bg-muted/30 px-6 py-12 text-center sm:px-10 sm:py-14">
        <div className="flex max-w-2xl flex-col gap-3">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          {subtitle ? (
            <p className="text-balance text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            {ctaLabel}
            <ArrowRight weight="bold" className="size-4" />
          </Link>

          {hasSecondary ? (
            <Link
              href={secondaryHref!}
              className="inline-flex items-center rounded-lg border border-border px-5 py-3 text-sm font-semibold transition-colors hover:border-primary/50 hover:bg-muted"
            >
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

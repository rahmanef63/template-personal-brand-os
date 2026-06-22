import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";

export interface NewsletterProps {
  /** Optional small mono eyebrow above the heading. Omit for none. */
  label?: string;
  /** Section heading. */
  heading?: string;
  /** Optional supporting line under the heading. */
  subtitle?: string;
  /** Email input placeholder. */
  placeholder?: string;
  /** Submit button label. */
  ctaLabel?: string;
}

// ponytail: presentational only. Every template renders a newsletter band, so the
// library needs this block for parity + the builder palette. The form is inert
// here (no Convex coupling) — real templates wire their own NewsletterSection to
// subscribers.subscribe; this is the canonical visual the library exposes.
export default function Newsletter({
  label,
  heading = "Stay in the loop",
  subtitle = "One email when something ships. No spam, unsubscribe anytime.",
  placeholder = "you@company.com",
  ctaLabel = "Subscribe",
}: NewsletterProps) {
  return (
    <section className="reveal mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-muted/30 px-6 py-12 text-center sm:px-10 sm:py-14">
        <span className="grid size-11 place-items-center rounded-full border border-border bg-background">
          <EnvelopeSimple weight="bold" className="size-5 text-primary" />
        </span>

        {label ? (
          <p className="font-mono text-[11px] uppercase tracking-wider text-primary">
            {label}
          </p>
        ) : null}

        <div className="flex max-w-md flex-col gap-2">
          {heading ? (
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {heading}
            </h2>
          ) : null}
          {subtitle ? (
            <p className="text-balance text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>

        <form className="mt-2 flex w-full max-w-md flex-col gap-2 sm:flex-row">
          <input
            type="email"
            placeholder={placeholder}
            aria-label="Email address"
            className="h-11 flex-1 rounded-lg border border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          />
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            {ctaLabel}
          </button>
        </form>
      </div>
    </section>
  );
}

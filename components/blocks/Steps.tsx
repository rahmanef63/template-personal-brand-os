export interface StepsProps {
  /** Optional small mono eyebrow above the heading. Omit for none. */
  label?: string;
  /** Optional section heading. Omit for a bare grid. */
  heading?: string;
  /** Ordered process steps rendered as a numbered grid. */
  steps?: { title: string; body: string }[];
}

export default function Steps({ label, heading, steps = [] }: StepsProps) {
  if (steps.length === 0) return null;

  return (
    <section className="reveal mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      {(label || heading) ? (
        <div className="mb-10 flex flex-col gap-2">
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
      ) : null}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {steps.map((step, i) => (
          <div
            key={`${step.title}-${i}`}
            className="rounded-xl border border-border bg-muted/30 p-6 transition-colors hover:border-primary/50"
          >
            <span className="font-mono text-2xl font-semibold text-primary">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 font-semibold tracking-tight">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

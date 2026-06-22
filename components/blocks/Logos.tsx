export interface LogosProps {
  /** Optional small mono label above the strip, e.g. "Trusted by teams at". */
  label?: string;
  /** Wordmark names rendered as plain text, no images. */
  names?: string[];
}

export default function Logos({ label, names = [] }: LogosProps) {
  if (names.length === 0) return null;

  return (
    <section className="reveal mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      {label ? (
        <p className="mb-8 text-center font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {names.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="text-lg font-semibold text-muted-foreground/80 transition-colors hover:text-foreground"
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}

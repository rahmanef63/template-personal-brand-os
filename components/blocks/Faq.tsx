import { CaretDown } from "@phosphor-icons/react/dist/ssr";

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqProps {
  /** Optional small mono label above the heading. */
  label?: string;
  /** Section heading. */
  heading?: string;
  /** Question / answer pairs rendered as native disclosure rows. */
  items: FaqItem[];
}

/**
 * FAQ accordion built on native <details>/<summary>, no JS, no client boundary.
 * The caret rotates on open via the `group-open` variant.
 */
export default function Faq({
  label = "FAQ",
  heading = "Questions, answered",
  items,
}: FaqProps) {
  return (
    <section className="reveal mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          {label ? (
            <p className="font-mono text-[11px] uppercase tracking-wider text-primary">
              {label}
            </p>
          ) : null}
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {heading}
          </h2>
        </div>

        <div className="border-t border-border">
          {items.map((item, i) => (
            <details
              key={i}
              className="group border-b border-border [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-medium transition-colors hover:text-primary">
                {item.q}
                <CaretDown
                  weight="bold"
                  className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180 group-open:text-primary"
                />
              </summary>
              <p className="pb-5 pr-8 leading-relaxed text-muted-foreground">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

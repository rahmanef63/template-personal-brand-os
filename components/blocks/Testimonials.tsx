import { Quotes } from "@phosphor-icons/react/dist/ssr";

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
}

export interface TestimonialsProps {
  /** Optional small mono label above the grid. Omit for none. */
  label?: string;
  /** Optional section heading. */
  heading?: string;
  items: TestimonialItem[];
}

export default function Testimonials({
  label,
  heading,
  items = [],
}: TestimonialsProps) {
  return (
    <section className="reveal mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      {(label || heading) && (
        <div className="mb-10 flex flex-col gap-2">
          {label && (
            <p className="font-mono text-[11px] uppercase tracking-wider text-primary">
              {label}
            </p>
          )}
          {heading && (
            <h2 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
              {heading}
            </h2>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {items.map((item, i) => (
          <figure
            key={`${item.author}-${i}`}
            className="flex flex-col rounded-xl border border-border bg-muted/30 p-6 transition-colors hover:border-primary/50 sm:p-7"
          >
            <Quotes
              weight="fill"
              aria-hidden
              className="size-5 shrink-0 text-primary/40"
            />
            <blockquote className="mt-4 flex-1">
              <p className="line-clamp-3 text-[15px] leading-relaxed text-foreground">
                &ldquo;{item.quote}&rdquo;
              </p>
            </blockquote>
            <figcaption className="mt-6 flex flex-col gap-0.5">
              <span className="font-medium text-foreground">{item.author}</span>
              <span className="text-sm text-muted-foreground">{item.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

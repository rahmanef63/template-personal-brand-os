import { cn } from "@/lib/utils";

import { TestimonialCard } from "../components/TestimonialCard";

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatar?: { src: string; alt: string };
  rating?: 1 | 2 | 3 | 4 | 5;
  featured?: boolean;
};

export type TestimonialsGridSectionProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  items: Testimonial[];
  /** Grid columns at lg breakpoint. Default 3. */
  columns?: 1 | 2 | 3;
  /** Visual layout variant. */
  layout?: "cards" | "quote-stack" | "masonry";
  /** Header + card alignment. */
  align?: "left" | "center";
  className?: string;
};

const COLS: Record<NonNullable<TestimonialsGridSectionProps["columns"]>, string> = {
  1: "lg:grid-cols-1",
  2: "sm:grid-cols-2 lg:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
};

const MASONRY_COLS: Record<NonNullable<TestimonialsGridSectionProps["columns"]>, string> = {
  1: "columns-1",
  2: "columns-1 sm:columns-2",
  3: "columns-1 sm:columns-2 lg:columns-3",
};

export function TestimonialsGridSection({
  eyebrow,
  title,
  subtitle,
  items,
  columns = 3,
  layout = "cards",
  align = "left",
  className,
}: TestimonialsGridSectionProps) {
  const headerAlign = align === "center" ? "items-center text-center" : "items-start text-left";
  const showHeader = Boolean(eyebrow || title || subtitle);

  return (
    <section className={cn("w-full px-6 py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl">
        {showHeader ? (
          <header className={cn("mb-12 flex flex-col gap-3", headerAlign)}>
            {eyebrow ? (
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {eyebrow}
              </span>
            ) : null}
            {title ? (
              <h2 className="text-3xl font-semibold leading-tight md:text-4xl">{title}</h2>
            ) : null}
            {subtitle ? (
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                {subtitle}
              </p>
            ) : null}
          </header>
        ) : null}

        {layout === "quote-stack" ? (
          <div className="mx-auto flex max-w-3xl flex-col gap-12 md:gap-16">
            {items.map((item) => (
              <TestimonialCard
                key={item.id}
                quote={item.quote}
                author={item.author}
                role={item.role}
                company={item.company}
                avatar={item.avatar}
                rating={item.rating}
                featured={item.featured}
                variant="quote-stack"
                align={align === "center" ? "center" : "left"}
              />
            ))}
          </div>
        ) : layout === "masonry" ? (
          <div className={cn("gap-6", MASONRY_COLS[columns])}>
            {items.map((item) => (
              <TestimonialCard
                key={item.id}
                quote={item.quote}
                author={item.author}
                role={item.role}
                company={item.company}
                avatar={item.avatar}
                rating={item.rating}
                featured={item.featured}
                variant="masonry"
                align={align}
              />
            ))}
          </div>
        ) : (
          <div className={cn("grid grid-cols-1 gap-6", COLS[columns])}>
            {items.map((item) => (
              <TestimonialCard
                key={item.id}
                quote={item.quote}
                author={item.author}
                role={item.role}
                company={item.company}
                avatar={item.avatar}
                rating={item.rating}
                featured={item.featured}
                variant="cards"
                align={align}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

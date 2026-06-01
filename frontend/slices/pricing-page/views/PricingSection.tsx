import { PricingTierCard } from "../components/PricingTier";
import { PricingFAQ } from "../components/PricingFAQ";
import { cn } from "@/lib/utils";

export type PricingTier = {
  id: string;
  name: string;
  price: string;
  period?: string;
  blurb?: string;
  bullets: string[];
  cta?: { label: string; href: string };
  featured?: boolean;
  badge?: string;
};

export type PricingFAQItem = { q: string; a: string };

export type PricingSectionProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  tiers: PricingTier[];
  columns?: 2 | 3 | 4;
  faq?: PricingFAQItem[];
  faqTitle?: string;
  className?: string;
  /** Override the "featured" visual style. */
  featuredVariant?: "ring" | "scale" | "tint";
  /** Per-tier CTA override. Return custom JSX (e.g. modal trigger button) to replace the default Link-based CTA. */
  renderTierCta?: (tier: PricingTier) => React.ReactNode;
};

const colClass: Record<2 | 3 | 4, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

function clampCols(n: number): 2 | 3 | 4 {
  if (n <= 2) return 2;
  if (n === 3) return 3;
  return 4;
}

export function PricingSection({
  eyebrow,
  title,
  subtitle,
  tiers,
  columns,
  faq,
  faqTitle,
  className,
  featuredVariant = "ring",
  renderTierCta,
}: PricingSectionProps) {
  const cols = columns ?? clampCols(tiers.length);
  return (
    <section className={cn("w-full px-4 py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto max-w-2xl text-center">
          {eyebrow ? (
            <span className="inline-block rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {eyebrow}
            </span>
          ) : null}
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              {subtitle}
            </p>
          ) : null}
        </header>

        <div
          className={cn(
            "mt-12 grid grid-cols-1 gap-6 md:mt-16",
            colClass[cols],
          )}
        >
          {tiers.map((tier) => (
            <PricingTierCard
              key={tier.id}
              name={tier.name}
              price={tier.price}
              period={tier.period}
              blurb={tier.blurb}
              bullets={tier.bullets}
              cta={tier.cta}
              customCta={renderTierCta?.(tier)}
              featured={tier.featured}
              badge={tier.badge}
              featuredVariant={featuredVariant}
            />
          ))}
        </div>

        {faq && faq.length > 0 ? (
          <div className="mt-20">
            <PricingFAQ items={faq} title={faqTitle} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

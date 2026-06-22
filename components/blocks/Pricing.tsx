import { ArrowRight, Check } from "@phosphor-icons/react/dist/ssr";

export interface PricingTier {
  name: string;
  price: string;
  period: string;
  features: string[];
  featured?: boolean;
  href?: string;
}

export interface PricingProps {
  tiers: PricingTier[];
}

export default function Pricing({ tiers }: PricingProps) {
  return (
    <section className="reveal mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-10 flex flex-col gap-2">
        <p className="font-mono text-[11px] uppercase tracking-wider text-primary">
          Pricing
        </p>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Pick the plan that ships with you.
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tiers.map((tier) => {
          const featured = tier.featured ?? false;
          return (
            <div
              key={tier.name}
              className={`flex flex-col rounded-xl border p-6 transition-colors sm:p-8 ${
                featured
                  ? "border-primary bg-muted/50"
                  : "border-border bg-muted/30 hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold tracking-tight">{tier.name}</h3>
                {featured ? (
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-primary">
                    Popular
                  </span>
                ) : null}
              </div>

              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-3xl font-semibold tracking-tight">
                  {tier.price}
                </span>
                <span className="font-mono text-sm text-muted-foreground">
                  {tier.period}
                </span>
              </div>

              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check
                      weight="bold"
                      className="mt-0.5 size-4 shrink-0 text-primary"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href={tier.href ?? "#"}
                className={`mt-8 inline-flex items-center justify-center gap-1.5 rounded-lg px-5 py-3 text-sm font-semibold transition-all ${
                  featured
                    ? "bg-primary text-primary-foreground hover:-translate-y-0.5"
                    : "border border-border hover:border-primary/50 hover:bg-muted"
                }`}
              >
                Choose {tier.name}
                <ArrowRight weight="bold" className="size-4" />
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}

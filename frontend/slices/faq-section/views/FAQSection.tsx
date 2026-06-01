import Link from "next/link";

import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { FAQItemRow } from "../components/FAQItem";

export type FAQItem = {
  id: string;
  q: string;
  a: string;
  category?: string;
};

export type FAQSectionProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  items: FAQItem[];
  /** Layout. Default "single". */
  layout?: "single" | "two-column" | "grouped";
  /** When true, multiple items can be open at once. Default false. */
  multiple?: boolean;
  /** Default open item ids. */
  defaultOpen?: string[];
  align?: "left" | "center";
  className?: string;
  /** Optional CTA below the FAQ ("Still have questions?"). */
  footerCta?: { label: string; href: string; question?: string };
};

/**
 * Accordion wrapper that branches on `multiple` to satisfy the radix
 * discriminated `type` prop. Single mode uses `collapsible` so the open
 * row can be closed by re-clicking.
 */
function FAQAccordion({
  multiple,
  defaultOpen,
  children,
  className,
}: {
  multiple: boolean;
  defaultOpen?: string[];
  children: React.ReactNode;
  className?: string;
}) {
  if (multiple) {
    return (
      <Accordion
        type="multiple"
        defaultValue={defaultOpen ?? []}
        className={className}
      >
        {children}
      </Accordion>
    );
  }
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen?.[0]}
      className={className}
    >
      {children}
    </Accordion>
  );
}

function splitColumns<T>(items: T[]): [T[], T[]] {
  const mid = Math.ceil(items.length / 2);
  return [items.slice(0, mid), items.slice(mid)];
}

function groupByCategory(items: FAQItem[]): Array<[string, FAQItem[]]> {
  const map = new Map<string, FAQItem[]>();
  for (const item of items) {
    const key = item.category ?? "General";
    const bucket = map.get(key) ?? [];
    bucket.push(item);
    map.set(key, bucket);
  }
  return Array.from(map.entries());
}

export function FAQSection({
  eyebrow,
  title = "Frequently asked questions",
  subtitle,
  items,
  layout = "single",
  multiple = false,
  defaultOpen,
  align = "left",
  className,
  footerCta,
}: FAQSectionProps) {
  const headerAlign =
    align === "center" ? "items-center text-center" : "items-start text-left";
  const showHeader = Boolean(eyebrow || title || subtitle);

  return (
    <section className={cn("w-full px-6 py-16 md:py-24", className)}>
      <div className="mx-auto max-w-4xl">
        {showHeader ? (
          <header className={cn("mb-12 flex flex-col gap-3", headerAlign)}>
            {eyebrow ? (
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {eyebrow}
              </span>
            ) : null}
            {title ? (
              <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
                {title}
              </h2>
            ) : null}
            {subtitle ? (
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                {subtitle}
              </p>
            ) : null}
          </header>
        ) : null}

        {layout === "two-column" ? (
          <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
            {splitColumns(items).map((col, idx) => (
              <FAQAccordion
                key={idx}
                multiple={multiple}
                defaultOpen={defaultOpen}
              >
                {col.map((item) => (
                  <FAQItemRow key={item.id} id={item.id} q={item.q} a={item.a} />
                ))}
              </FAQAccordion>
            ))}
          </div>
        ) : layout === "grouped" ? (
          <div className="flex flex-col gap-10">
            {groupByCategory(items).map(([group, groupItems]) => (
              <div key={group} className="flex flex-col gap-3">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {group}
                </h3>
                <FAQAccordion multiple={multiple} defaultOpen={defaultOpen}>
                  {groupItems.map((item) => (
                    <FAQItemRow
                      key={item.id}
                      id={item.id}
                      q={item.q}
                      a={item.a}
                    />
                  ))}
                </FAQAccordion>
              </div>
            ))}
          </div>
        ) : (
          <FAQAccordion multiple={multiple} defaultOpen={defaultOpen}>
            {items.map((item) => (
              <FAQItemRow key={item.id} id={item.id} q={item.q} a={item.a} />
            ))}
          </FAQAccordion>
        )}

        {footerCta ? (
          <div
            className={cn(
              "mt-12 flex flex-col gap-3 border-t pt-8",
              align === "center" ? "items-center text-center" : "items-start",
            )}
          >
            {footerCta.question ? (
              <p className="text-sm text-muted-foreground">
                {footerCta.question}
              </p>
            ) : null}
            <Button asChild size="sm">
              <Link href={footerCta.href}>{footerCta.label}</Link>
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

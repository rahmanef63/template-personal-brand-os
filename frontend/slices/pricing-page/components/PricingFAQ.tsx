"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export type PricingFAQItem = { q: string; a: string };

export type PricingFAQProps = {
  items: PricingFAQItem[];
  title?: string;
  className?: string;
};

export function PricingFAQ({
  items,
  title = "Frequently asked questions",
  className,
}: PricingFAQProps) {
  if (!items.length) return null;
  return (
    <section className={cn("mx-auto w-full max-w-3xl", className)}>
      {title ? (
        <h3 className="mb-6 text-center text-2xl font-semibold tracking-tight">
          {title}
        </h3>
      ) : null}
      <Accordion type="single" collapsible className="w-full">
        {items.map((item, idx) => (
          <AccordionItem key={item.q} value={`faq-${idx}`}>
            <AccordionTrigger className="text-left text-sm font-medium">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

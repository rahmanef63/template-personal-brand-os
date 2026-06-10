"use client";

import * as React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Stagger } from "@/components/templates/_shared/motion";
import { cn } from "@/lib/utils";
import type { Service } from "../../shared/types";

export interface FaqItem {
  q: string;
  a: string;
}

/** Parse FAQ items from a landing section's config JSON:
 *  `{"items":[{"q":"…","a":"…"}]}`. Admin-editable via the landing editor. */
export function parseFaqItems(config?: string): FaqItem[] {
  if (!config) return [];
  try {
    const parsed = JSON.parse(config) as { items?: FaqItem[] };
    return (parsed.items ?? []).filter((i) => i?.q && i?.a);
  } catch {
    return [];
  }
}

export function FaqList({ items }: { items: FaqItem[] }) {
  if (items.length === 0) {
    return (
      <p className="mx-auto max-w-xl px-6 text-center text-sm text-muted-foreground">
        Tambahkan pertanyaan lewat Dashboard → Landing (config JSON{" "}
        <code>{'{"items":[{"q":"…","a":"…"}]}'}</code>).
      </p>
    );
  }
  return (
    <div className="mx-auto max-w-2xl px-6">
      <Accordion type="single" collapsible className="w-full">
        {items.map((item, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

/** Pricing tiers rendered from the REAL `services` table (priceLabel /
 *  period / bullets / featured) — same rows the admin CRUDs at
 *  /dashboard/admin/services. No separate pricing data to maintain. */
export function PricingTiers({ services }: { services: Service[] }) {
  const tiers = services.slice(0, 3);
  if (tiers.length === 0) {
    return (
      <p className="mx-auto max-w-xl px-6 text-center text-sm text-muted-foreground">
        Belum ada layanan — isi lewat Dashboard → Services.
      </p>
    );
  }
  return (
    <div className="mx-auto grid max-w-5xl gap-4 px-6 md:grid-cols-3">
      <Stagger itemClassName="h-full">
        {tiers.map((s) => (
          <Card
            key={s.id}
            className={cn(
              "h-full transition-[translate,box-shadow] duration-300 hover:-translate-y-1",
              s.featured
                ? "border-brand/50 shadow-[0_0_0_1px_var(--brand)] relative"
                : "border-border/60 hover:shadow-lg",
            )}
          >
            <CardContent className="flex h-full flex-col gap-4 p-6">
              {s.featured ? (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
                  Populer
                </span>
              ) : null}
              <div>
                <h3 className="font-medium">{s.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
              </div>
              <p className="text-3xl font-semibold tracking-tight">
                {s.priceLabel}
                {s.period ? (
                  <span className="ml-1 text-sm font-normal text-muted-foreground">{s.period}</span>
                ) : null}
              </p>
              <ul className="flex-1 space-y-2 text-sm">
                {(s.bullets ?? []).map((b, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                    <span className="text-muted-foreground">{b}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant={s.featured ? "default" : "outline"} className="w-full">
                <Link href="/contact">Mulai</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </Stagger>
    </div>
  );
}

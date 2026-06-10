"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Quote, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { SectionHead } from "../../ui/section-head";
import {
  cfgArray,
  cfgNumber,
  isTestimonialItem,
  parseConfigObject,
  type TestimonialItem,
} from "./config";
import type { LandingSection } from "../types";

/**
 * Testimonials carousel (autoplay, loop). Content priority:
 * section.config { items, limit } > props.items (template store data or
 * defaults). Renders inside LandingSectionShell (caller wraps).
 */
export function TestimonialsSection({
  section,
  items,
  eyebrow = "Testimoni",
  className,
}: {
  section: LandingSection;
  items: TestimonialItem[];
  eyebrow?: string;
  className?: string;
}) {
  const cfg = parseConfigObject(section.config);
  const limit = cfgNumber(cfg, "limit") ?? 9;
  const list = (cfgArray(cfg, "items", isTestimonialItem) ?? items).slice(0, limit);
  if (list.length === 0) return null;

  return (
    <div className={cn("mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20", className)}>
      <Carousel
        opts={{ align: "start", loop: list.length > 3 }}
        plugins={[Autoplay({ delay: 4500, stopOnInteraction: true })]}
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <SectionHead
            eyebrow={eyebrow}
            title={section.title}
            subtitle={section.subtitle}
            className="mb-0"
          />
          <div className="flex items-center gap-2">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </div>
        <CarouselContent>
          {list.map((t, i) => (
            <CarouselItem key={`${t.author}-${i}`} className="basis-full sm:basis-1/2 lg:basis-1/3">
              <Card className="h-full border-border/60 bg-card/50">
                <CardContent className="flex h-full flex-col gap-3 p-5">
                  {typeof t.rating === "number" && (
                    <span className="inline-flex items-center gap-0.5" aria-label={`${t.rating} dari 5`}>
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star
                          key={s}
                          className={`size-4 ${s < (t.rating ?? 0) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`}
                        />
                      ))}
                    </span>
                  )}
                  <div className="relative flex-1">
                    <Quote className="absolute -left-1 -top-1 size-3 text-muted-foreground/40" />
                    <p className="pl-3 text-sm leading-relaxed text-muted-foreground">{t.quote}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.author}</p>
                    {t.role && <p className="text-xs text-muted-foreground">{t.role}</p>}
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

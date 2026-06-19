"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { PageBlock } from "./types";

/** Read-only renderer for a single PageBlock. Public surface uses this
 *  inside the [...slug] catch-all. Admin preview also uses this. */
export function BlockRenderer({ block }: { block: PageBlock }) {
  switch (block.kind) {
    case "hero":
      return (
        <section className="border-b bg-gradient-to-b from-muted/40 to-background py-16 text-center">
          <div className="mx-auto max-w-3xl px-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{block.headline}</h1>
            {block.sub && <p className="mt-4 text-lg text-muted-foreground">{block.sub}</p>}
            {block.cta && (
              <Button asChild className="mt-6">
                <Link href={block.cta.href}>{block.cta.label}</Link>
              </Button>
            )}
          </div>
        </section>
      );

    case "text":
      return (
        <section className="border-b py-10">
          <div className="mx-auto max-w-2xl px-4">
            {block.heading && <h2 className="text-2xl font-semibold tracking-tight">{block.heading}</h2>}
            <p className="mt-4 whitespace-pre-wrap text-base text-muted-foreground">{block.body}</p>
          </div>
        </section>
      );

    case "feature-list":
      return (
        <section className="border-b py-12">
          <div className="mx-auto max-w-5xl px-4">
            {block.heading && <h2 className="mb-6 text-2xl font-semibold tracking-tight">{block.heading}</h2>}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {block.items.map((it, i) => (
                <div key={i} className="rounded-lg border bg-card p-5">
                  <h3 className="text-sm font-semibold">{it.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{it.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "cta":
      return (
        <section className="border-y bg-foreground py-12 text-background">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight">{block.headline}</h2>
            {block.sub && <p className="mt-3 text-base opacity-80">{block.sub}</p>}
            <Button asChild variant="secondary" className="mt-6">
              <Link href={block.cta.href}>{block.cta.label}</Link>
            </Button>
          </div>
        </section>
      );

    case "logo-cloud":
      return (
        <section className="border-b py-12">
          <div className="mx-auto max-w-5xl px-4 text-center">
            {block.heading && <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{block.heading}</p>}
            <div className="mt-6 flex flex-wrap justify-center gap-x-10 gap-y-4">
              {block.logos.map((l, i) => (
                <span key={i} className="text-sm font-mono text-muted-foreground/70">{l.label}</span>
              ))}
            </div>
          </div>
        </section>
      );

    case "testimonial":
      return (
        <section className="border-b py-12">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <blockquote className="text-xl italic text-foreground">&ldquo;{block.quote}&rdquo;</blockquote>
            <p className="mt-4 text-sm font-medium">{block.author}{block.role ? `, ${block.role}` : ""}</p>
          </div>
        </section>
      );

    case "video":
      return (
        <section className="border-b py-12">
          <div className="mx-auto max-w-3xl px-4">
            {block.heading && <h2 className="mb-4 text-2xl font-semibold tracking-tight">{block.heading}</h2>}
            <div className="aspect-video overflow-hidden rounded-lg border bg-muted">
              <video src={block.src} controls className="size-full" />
            </div>
            {block.caption && <p className="mt-2 text-xs text-muted-foreground">{block.caption}</p>}
          </div>
        </section>
      );

    case "image-gallery":
      return (
        <section className="border-b py-12">
          <div className="mx-auto max-w-5xl px-4">
            {block.heading && <h2 className="mb-6 text-2xl font-semibold tracking-tight">{block.heading}</h2>}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {block.images.map((img, i) => (
                <div key={i} className="relative aspect-[4/3] w-full overflow-hidden rounded-md">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    unoptimized
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "faq":
      return (
        <section className="border-b py-12">
          <div className="mx-auto max-w-2xl px-4">
            {block.heading && <h2 className="mb-6 text-2xl font-semibold tracking-tight">{block.heading}</h2>}
            <dl className="space-y-4">
              {block.items.map((it, i) => (
                <div key={i} className="rounded-lg border bg-card p-4">
                  <dt className="text-sm font-semibold">{it.q}</dt>
                  <dd className="mt-2 text-sm text-muted-foreground">{it.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      );

    case "stats":
      return (
        <section className="border-b py-12">
          <div className="mx-auto max-w-5xl px-4">
            {block.heading && <h2 className="mb-6 text-center text-2xl font-semibold tracking-tight">{block.heading}</h2>}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {block.items.map((it, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl font-bold tabular-nums">{it.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{it.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "pricing-table":
      return (
        <section className="border-b py-12">
          <div className="mx-auto max-w-5xl px-4">
            {block.heading && <h2 className="mb-6 text-center text-2xl font-semibold tracking-tight">{block.heading}</h2>}
            <div className="grid gap-4 sm:grid-cols-3">
              {block.tiers.map((t, i) => (
                <div key={i} className={`rounded-lg border bg-card p-5 ${t.featured ? "border-foreground" : ""}`}>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="mt-2 text-3xl font-bold">{t.price}<span className="text-sm font-normal text-muted-foreground"> {t.period}</span></p>
                  <ul className="mt-4 space-y-1 text-sm">
                    {t.bullets.map((b, j) => <li key={j}>· {b}</li>)}
                  </ul>
                  {t.cta && (
                    <Button asChild variant={t.featured ? "default" : "outline"} className="mt-4 w-full">
                      <Link href={t.cta.href}>{t.cta.label}</Link>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      );
  }
}

export function BlocksRenderer({ blocks }: { blocks: PageBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => (
        <BlockRenderer key={i} block={b} />
      ))}
    </>
  );
}

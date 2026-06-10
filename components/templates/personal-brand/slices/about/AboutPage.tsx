"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "convex/react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal, Stagger } from "@/components/templates/_shared/motion";
import { DEFAULT_SITE_CONFIG } from "../../shared/site-config";
import { PUBLIC_BASE } from "../../shared/nav-config";

const TIMELINE = [
  { year: "2026", milestone: "Founder, Lorem Studio. Mentor Y Combinator W22 cohort." },
  { year: "2024", milestone: "Lead PM, Foobar Inc. — scale dari 5K ke 80K MAU." },
  { year: "2022", milestone: "Sr. Engineer, Acme Tech. Lead 4-engineer team, ship checkout v3." },
  { year: "2019", milestone: "Co-founder, Beta Labs. Bootstrap dari Rp 0 ke profitable in 18mo." },
  { year: "2017", milestone: "First job — junior dev di Gamma Corp. Belajar production reality." },
  { year: "2014", milestone: "Lulus S1 Teknik Informatika ITB — magang Tokopedia summer." },
];

const MENTIONS = [
  "Forbes Indonesia 30 Under 30 — 2024",
  "Speaker — TEDx Jakarta 2023",
  "Co-host — Sit Podcast (200K downloads)",
  "Author — “Ipsum Notes” newsletter (60K subs)",
  "Investor — Dolor Ventures (early-stage SaaS)",
  "Open-source maintainer — lorem-utils 12K stars",
];

export function AboutPage() {
  const s = useQuery(api.settings.get);
  const ownerName = s?.ownerName || DEFAULT_SITE_CONFIG.ownerName;
  const intro = s?.seoDescription || s?.tagline;
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <header className="grid gap-10 md:grid-cols-[1fr_2fr]">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-border/60">
          <Image
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=900&q=70"
            alt=""
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">About</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
            {ownerName} — strategist, builder, mentor.
          </h1>
          <p className="mt-4 text-muted-foreground">
            {intro ||
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante."}
          </p>
          <p className="mt-3 text-muted-foreground">
            Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper
            pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi.
          </p>
          <Button asChild className="mt-6">
            <Link href={`${PUBLIC_BASE}/contact`}>Get in touch <ArrowRight className="size-4" /></Link>
          </Button>
        </div>
      </header>

      <section className="mt-16">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight">Timeline</h2>
          <ol className="mt-6 space-y-3 border-l border-border/60 pl-6">
            {TIMELINE.map((t) => (
              <li key={t.year} className="relative">
                <span className="absolute -left-[29px] top-1.5 grid size-3 place-items-center rounded-full border border-border bg-background">
                  <span className="size-1 rounded-full bg-foreground" />
                </span>
                <p className="text-xs font-mono text-muted-foreground">{t.year}</p>
                <p className="text-sm text-foreground/85">{t.milestone}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section className="mt-16">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight">Achievements & mentions</h2>
        </Reveal>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <Stagger itemClassName="h-full">
            {MENTIONS.map((m) => (
              <Card
                key={m}
                className="h-full border-border/60 bg-card/60 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent className="flex items-start gap-3 p-4 text-sm">
                  <CheckCircle2 className="mt-0.5 size-4 text-foreground/70" />
                  <span className="text-foreground/85">{m}</span>
                </CardContent>
              </Card>
            ))}
          </Stagger>
        </div>
      </section>
    </section>
  );
}

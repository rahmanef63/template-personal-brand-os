"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Code2, Compass, Mic, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BlogListSection,
  type BlogPost as SliceBlogPost,
} from "@/features/blog-section";
import type { FeatureItem } from "@/components/templates/_shared";
import {
  cfgNumber,
  parseConfigObject,
  type FaqItem,
  type PricingTier,
  type StatItem,
} from "@/components/templates/_shared/landing/sections";
import type { LandingSection } from "@/components/templates/_shared/landing/types";
import { PUBLIC_BASE } from "../../shared/nav-config";
import type { Post } from "../../shared/types";

/** Personal-brand default content for the shared landing sections — every
 *  value overridable per-section via the admin landing editor's config
 *  JSON (see _shared/landing/sections/config.ts for keys). */

export const BRAND_STATS: StatItem[] = [
  { value: 120, suffix: "+", label: "Klien & student" },
  { value: 8, suffix: " thn", label: "Praktik industri" },
  { value: 60, suffix: "K", label: "Pembaca newsletter" },
  { value: 40, suffix: "+", label: "Proyek & kolaborasi" },
];

export const BRAND_CLIENTS = [
  "Acme Indonesia",
  "Foobar",
  "Beta Labs",
  "Gamma",
  "Lorem Weekly",
  "Ipsum Conf",
];

export const BRAND_FEATURES: FeatureItem[] = [
  { icon: Compass, title: "Strategi produk", blurb: "Positioning, roadmap, dan prioritas — dari riset sampai keputusan." },
  { icon: Code2, title: "Mentorship engineering", blurb: "1-on-1 untuk engineer: arah karir, technical depth, kebiasaan kerja." },
  { icon: PenLine, title: "Tulisan & riset", blurb: "Esai panjang dan catatan singkat, terbit rutin di blog & newsletter." },
  { icon: Mic, title: "Workshop & speaking", blurb: "Sesi privat untuk tim: alignment, go-to-market, product thinking." },
];

export const BRAND_FAQS: FaqItem[] = [
  { q: "Kolaborasi seperti apa yang terbuka?", a: "Konsultasi produk, mentorship engineer, guest writing, dan workshop privat untuk tim. Ajukan lewat halaman kontak — sertakan konteks singkat plus hasil yang kamu kejar." },
  { q: "Apa bedanya tiap jasa yang ditawarkan?", a: "Mentoring berjalan rutin bulanan, strategy sprint padat lima hari dengan deliverable jelas, dan office hours untuk konsultasi cepat 30 menit. Detail lengkap ada di halaman Services." },
  { q: "Berapa lama timeline kerja sama biasanya?", a: "Office hours selesai dalam satu sesi, sprint 1–2 minggu termasuk persiapan, dan mentoring minimal tiga bulan supaya progresnya terasa. Slot baru dibuka tiap awal bulan." },
  { q: "Bagaimana struktur harganya?", a: "Harga per paket tercantum di halaman Services. Untuk kebutuhan custom — workshop tim atau retainer — kirim brief dulu; penawaran menyesuaikan cakupan." },
  { q: "Cara tercepat menghubungi?", a: "Form di halaman kontak masuk langsung ke inbox saya dan biasanya dibalas dalam 1×24 jam kerja. Pertanyaan singkat? Balas saja email newsletter terbaru." },
];

export const BRAND_TIERS: PricingTier[] = [
  {
    name: "Konsultasi",
    price: "Rp 750k",
    period: "/sesi",
    blurb: "Sesi 30–60 menit untuk pertanyaan spesifik — pricing, hiring, eksekusi.",
    features: ["Booking minggu yang sama", "Prep brief via email", "Catatan follow-up"],
    ctaLabel: "Pesan sesi",
    ctaHref: `${PUBLIC_BASE}/contact`,
  },
  {
    name: "Kolaborasi",
    price: "Rp 18jt",
    period: "/proyek",
    blurb: "Sprint atau workshop dengan deliverable jelas untuk tim & founder.",
    features: ["Scoping call gratis", "Workshop + dokumen akhir", "Recording semua sesi", "Follow-up 2 minggu"],
    featured: true,
    ctaLabel: "Ajukan proyek",
    ctaHref: `${PUBLIC_BASE}/contact`,
  },
  {
    name: "Retainer",
    price: "Rp 4.5jt",
    period: "/bulan",
    blurb: "Pendampingan berkelanjutan — mentoring atau advisory bulanan.",
    features: ["Call mingguan 60 menit", "Async review tanpa batas", "Akses resource library"],
    ctaLabel: "Diskusi dulu",
    ctaHref: `${PUBLIC_BASE}/contact`,
  },
];

/** Latest published posts teaser — backs the "blog"/"changelog" landing
 *  kinds with real store data (admin CRUD via /admin → Blog). Honors
 *  config `{"limit":n}`; title/subtitle come from the section row. */
export function BlogTeaser({
  section,
  posts,
}: {
  section: LandingSection;
  posts: Post[];
}) {
  const limit = cfgNumber(parseConfigObject(section.config), "limit") ?? 3;
  const latest = [...posts]
    .sort((a, b) => b.publishedAt - a.publishedAt)
    .slice(0, limit);
  if (latest.length === 0) return null;

  const items: SliceBlogPost[] = latest.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    publishedAt: p.publishedAt,
    tags: [p.tag],
    cover: { src: p.cover, alt: p.title },
  }));

  return (
    <>
      <BlogListSection
        eyebrow="Blog"
        title={section.title}
        subtitle={section.subtitle}
        posts={items}
        hrefFor={(p) => `${PUBLIC_BASE}/blog/${p.slug}`}
        columns={3}
        layout="cards"
        limit={limit}
      />
      <div className="mx-auto -mt-12 max-w-6xl px-6 pb-8 text-right">
        <Button asChild variant="ghost" size="sm">
          <Link href={`${PUBLIC_BASE}/blog`}>
            Semua tulisan <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </>
  );
}

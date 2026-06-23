// SINGLE SOURCE of personal-brand's landing example content.
//
// Imported by BOTH:
//  - convex/seed.ts → seeds each item section's `config` into landingSections,
//    so a fresh clone gets EDITABLE example data in the admin landing editor
//    (not just code-only defaults).
//  - frontend/slices/home/* → the render fallback (used before the seed runs).
//
// MUST stay framework-pure: no convex/server, no convex/values, no React/lucide
// imports — only literals + plain types — so the Convex bundler AND the Next
// client can both import it. Feature icons are lucide NAMES (string), resolved
// to components in feature-config.ts. Hrefs are root-relative (publicBase = "").
//
// Edit content HERE once; the seed and the render both follow. No drift.

export type LcStat = { value: number; prefix?: string; suffix?: string; label: string };
export type LcFeature = { icon: string; title: string; blurb: string };
export type LcTier = {
  name: string;
  price: string;
  period?: string;
  blurb?: string;
  features: string[];
  ctaLabel?: string;
  ctaHref?: string;
  featured?: boolean;
};
export type LcFaq = { q: string; a: string };
export type LcTestimonial = { quote: string; author: string; role?: string };

export const HERO = {
  title: "Bantu founder & tim produk Indonesia ambil keputusan yang tepat — lebih cepat.",
  subtitle:
    "Strategi produk, mentorship engineering, dan riset go-to-market. Esai panjang dan catatan singkat, terbit rutin di blog dan newsletter.",
  badge: "2026 mentorship cohort open",
};

export const STATS: LcStat[] = [
  { value: 120, suffix: "+", label: "Klien & student" },
  { value: 8, suffix: " thn", label: "Praktik industri" },
  { value: 60, suffix: "K", label: "Pembaca newsletter" },
  { value: 40, suffix: "+", label: "Proyek & kolaborasi" },
];

export const CLIENTS: string[] = [
  "Sinar Ventures",
  "Nusantara Labs",
  "Kode Kolektif",
  "Padi Digital",
  "Terra Studio",
  "Lumina Tech",
];

export const FEATURES: LcFeature[] = [
  { icon: "Compass", title: "Strategi produk", blurb: "Positioning, roadmap, dan prioritas — dari riset sampai keputusan." },
  { icon: "Code2", title: "Mentorship engineering", blurb: "1-on-1 untuk engineer: arah karir, technical depth, kebiasaan kerja." },
  { icon: "PenLine", title: "Tulisan & riset", blurb: "Esai panjang dan catatan singkat, terbit rutin di blog & newsletter." },
  { icon: "Mic", title: "Workshop & speaking", blurb: "Sesi privat untuk tim: alignment, go-to-market, product thinking." },
];

export const PRICING: LcTier[] = [
  {
    name: "Konsultasi",
    price: "Rp 750k",
    period: "/sesi",
    blurb: "Sesi 30–60 menit untuk pertanyaan spesifik — pricing, hiring, eksekusi.",
    features: ["Booking minggu yang sama", "Prep brief via email", "Catatan follow-up"],
    ctaLabel: "Pesan sesi",
    ctaHref: "/contact",
  },
  {
    name: "Kolaborasi",
    price: "Rp 18jt",
    period: "/proyek",
    blurb: "Sprint atau workshop dengan deliverable jelas untuk tim & founder.",
    features: ["Scoping call gratis", "Workshop + dokumen akhir", "Recording semua sesi", "Follow-up 2 minggu"],
    featured: true,
    ctaLabel: "Ajukan proyek",
    ctaHref: "/contact",
  },
  {
    name: "Retainer",
    price: "Rp 4.5jt",
    period: "/bulan",
    blurb: "Pendampingan berkelanjutan — mentoring atau advisory bulanan.",
    features: ["Call mingguan 60 menit", "Async review tanpa batas", "Akses resource library"],
    ctaLabel: "Diskusi dulu",
    ctaHref: "/contact",
  },
];

export const FAQS: LcFaq[] = [
  { q: "Kolaborasi seperti apa yang terbuka?", a: "Konsultasi produk, mentorship engineer, guest writing, dan workshop privat untuk tim. Ajukan lewat halaman kontak — sertakan konteks singkat plus hasil yang kamu kejar." },
  { q: "Apa bedanya tiap jasa yang ditawarkan?", a: "Mentoring berjalan rutin bulanan, strategy sprint padat lima hari dengan deliverable jelas, dan office hours untuk konsultasi cepat 30 menit. Detail lengkap ada di halaman Services." },
  { q: "Berapa lama timeline kerja sama biasanya?", a: "Office hours selesai dalam satu sesi, sprint 1–2 minggu termasuk persiapan, dan mentoring minimal tiga bulan supaya progresnya terasa. Slot baru dibuka tiap awal bulan." },
  { q: "Bagaimana struktur harganya?", a: "Harga per paket tercantum di halaman Services. Untuk kebutuhan custom — workshop tim atau retainer — kirim brief dulu; penawaran menyesuaikan cakupan." },
  { q: "Cara tercepat menghubungi?", a: "Form di halaman kontak masuk langsung ke inbox saya dan biasanya dibalas dalam 1×24 jam kerja. Pertanyaan singkat? Balas saja email newsletter terbaru." },
];

export const TESTIMONIALS: LcTestimonial[] = [
  { quote: "Sesi strategi 90 menit lebih berguna dari tiga bulan kami muter sendiri. Roadmap-nya langsung kepakai.", author: "Asep Wijaya", role: "CEO, Sinar Ventures" },
  { quote: "Mentorship-nya bikin engineer kami naik level cepat — arah karier jelas, technical depth-nya kebangun.", author: "Putri Maharani", role: "Head of Product, Nusantara Labs" },
  { quote: "Workshop go-to-market-nya nge-reframe cara kami lihat pasar. Worth tiap menitnya.", author: "Bayu Setiawan", role: "Founder, Kode Kolektif" },
  { quote: "Esai dan catatannya jadi bacaan wajib tim produk kami tiap minggu.", author: "Linda Hartono", role: "VP Engineering, Padi Digital" },
];

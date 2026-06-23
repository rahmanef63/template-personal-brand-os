import type { LandingSection } from "@/features/_shared/landing/types";
import { HERO, STATS, CLIENTS, FEATURES, PRICING, FAQS, TESTIMONIALS } from "@/convex/landingContent";

export const SEED_LANDING_SECTIONS: LandingSection[] = [
  {
    id: "ls-hero",
    order: 10,
    kind: "hero",
    title: HERO.title,
    subtitle: HERO.subtitle,
    enabled: true,
    config: JSON.stringify({ badge: HERO.badge }),
    layers: [
      { id: "hero-photo", type: "image", placement: "background", opacity: 100, enabled: true, url: "/hero.webp" },
    ],
  },
  { id: "ls-stats",        order: 20, kind: "stats",        title: "Rekam jejak singkat", subtitle: "Angka yang menggambarkan praktik dan jangkauan kerja sampai hari ini.", enabled: true, config: JSON.stringify({ stats: STATS, clients: CLIENTS }) },
  {
    id: "ls-features",
    order: 25,
    kind: "features",
    title: "Fokus yang saya kerjakan",
    subtitle: "Empat jalur utama: strategi produk, mentorship engineering, tulisan, dan sesi untuk tim.",
    enabled: true,
    config: JSON.stringify({ items: FEATURES }),
  },
  { id: "ls-blog",         order: 30, kind: "blog",         title: "Tulisan terbaru", subtitle: "Catatan singkat tentang produk, riset, dan delivery.", enabled: true },
  { id: "ls-portfolio",    order: 40, kind: "portfolio",    title: "Karya pilihan", subtitle: "Proyek yang menggambarkan cara saya bekerja.", enabled: true },
  { id: "ls-services",     order: 50, kind: "services",     title: "Layanan", subtitle: "Tiga jalur kerja sama.", enabled: true },
  // Engagement-model tiers (Konsultasi / Kolaborasi / Retainer). Ships off
  // because Layanan di atas sudah menampilkan paket berharga — toggle on
  // dari /admin landing kalau mau dua framing sekaligus.
  {
    id: "ls-pricing",
    order: 55,
    kind: "pricing",
    title: "Model kerja sama",
    subtitle: "Mulai dari sesi konsultasi tunggal sampai retainer bulanan.",
    enabled: false,
    config: JSON.stringify({ tiers: PRICING }),
  },
  { id: "ls-testimonials", order: 60, kind: "testimonials", title: "Apa kata mereka", subtitle: "Dari founder dan tim yang sudah bekerja sama.", enabled: true, config: JSON.stringify({ items: TESTIMONIALS }) },
  {
    id: "ls-faq",
    order: 62,
    kind: "faq",
    title: "Pertanyaan yang sering masuk",
    subtitle: "Soal kolaborasi, jasa, timeline, dan harga — sebelum kamu kirim email.",
    enabled: true,
    config: JSON.stringify({ items: FAQS }),
  },
  {
    id: "ls-cta",
    order: 65,
    kind: "cta",
    title: "Punya proyek atau butuh sparring partner?",
    subtitle: "Ceritakan konteksmu — dibalas dalam 1×24 jam kerja.",
    enabled: true,
  },
  { id: "ls-newsletter",   order: 70, kind: "newsletter",   title: "Newsletter", subtitle: "Sekali sebulan, kabar produk + sumber bacaan.", enabled: true },
];
import { SEED_PAGES } from "./pages-seed";
import type { Post, PortfolioItem, Resource, Service, State } from "./types";

const now = Date.now();
const day = (n: number) => now - n * 24 * 60 * 60 * 1000;

const BODY_LONG = (heading: string) =>
  `## ${heading}\n\nCatatan dari praktik kerja sama dengan founder dan tim produk Indonesia. Tulisan ini merangkum kerangka yang saya pakai berulang kali di sesi strategi, sprint, dan mentoring.\n\nIntinya: outcome di atas output. Sebelum menentukan apa yang dikerjakan, sepakati dulu hasil yang ingin dicapai dan bagaimana mengukurnya. Sisanya — prioritas, eksekusi, review — mengikuti dari sana.\n\nEdit isi lengkap dan ganti contoh ini dengan tulisanmu sendiri lewat panel admin → Blog.`;

export const SEED_POSTS: Post[] = [
  {
    id: "post-1",
    slug: "outcome-over-output",
    title: "Outcome di Atas Output: Cara Memprioritaskan Roadmap",
    excerpt:
      "Kenapa tim sering sibuk tapi tidak bergerak — dan kerangka prioritas yang saya pakai bareng founder.",
    body: BODY_LONG("Outcome di Atas Output"),
    cover:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1400&q=70",
    tag: "Strategy",
    author: "Owner",
    status: "published",
    publishedAt: day(1),
    views: 3812,
    readMin: 6,
  },
  {
    id: "post-2",
    slug: "mentorship-engineer-naik-level",
    title: "Pola Mentorship yang Bikin Engineer Naik Level Cepat",
    excerpt:
      "Tiga kebiasaan kerja yang membedakan engineer mid dari senior — dari pengalaman mentoring 1-on-1.",
    body: BODY_LONG("Pola Mentorship yang Bikin Engineer Naik Level"),
    cover:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=70",
    tag: "Engineering",
    author: "Owner",
    status: "published",
    publishedAt: day(9),
    views: 2417,
    readMin: 8,
  },
  {
    id: "post-3",
    slug: "riset-go-to-market-lokal",
    title: "Riset Go-to-Market untuk Pasar Indonesia",
    excerpt:
      "Cara menemukan ICP yang benar sebelum membakar budget — kerangka JTBD yang ringkas dan bisa langsung dipakai.",
    body: BODY_LONG("Riset Go-to-Market untuk Pasar Indonesia"),
    cover:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=70",
    tag: "Notes",
    author: "Owner",
    status: "published",
    publishedAt: day(22),
    views: 1908,
    readMin: 4,
  },
  {
    id: "post-4",
    slug: "menulis-rutin-tanpa-burnout",
    title: "Menulis Rutin Tanpa Burnout",
    excerpt: "Sistem terbit mingguan yang ringan untuk operator sibuk — masih draf.",
    body: BODY_LONG("Menulis Rutin Tanpa Burnout"),
    cover:
      "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=1400&q=70",
    tag: "Strategy",
    author: "Owner",
    status: "draft",
    publishedAt: 0,
    views: 0,
    readMin: 5,
  },
];

export const SEED_PORTFOLIO: PortfolioItem[] = [
  {
    id: "case-1",
    slug: "sinar-ventures-activation",
    title: "Sinar Ventures — Perbaikan Aktivasi",
    category: "Product",
    cover:
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1600&q=70",
    blurb: "Onboarding di-redesign, aktivasi naik 31%.",
    problem:
      "Retensi turun 18% dalam dua kuartal. Hipotesis: onboarding yang membingungkan.",
    approach:
      "Audit funnel + 14 wawancara user. Aktivasi diringkas dari 4 langkah jadi 1 langkah dengan bantuan AI.",
    result:
      "Aktivasi naik 31%. Retensi minggu-2 naik 12%. ARR proyeksi +Rp 4.2 milyar.",
    publishedAt: day(40),
  },
  {
    id: "case-2",
    slug: "nusantara-labs-reposition",
    title: "Nusantara Labs — Reposisi Brand",
    category: "Brand",
    cover:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=70",
    blurb: "Avg deal size naik 2.4× setelah reposisi.",
    problem: "Persepsi pasar startup, padahal klien membeli enterprise.",
    approach: "Workshop pemegang saham. Brand archetype + reposisi visual.",
    result: "Avg deal size naik 2.4×. Sales cycle turun dari 90 hari ke 54.",
    publishedAt: day(70),
  },
  {
    id: "case-3",
    slug: "kode-kolektif-gtm",
    title: "Kode Kolektif — Strategi Go-to-Market",
    category: "Strategy",
    cover:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1600&q=70",
    blurb: "Launch on-time, MRR 60 hari lampaui target.",
    problem: "Launch tertunda tiga kali — tim belum sepakat ICP.",
    approach: "Force-rank ICP via JTBD. Pangkas 5 segmen jadi 2.",
    result: "Launch tepat waktu. MRR 60 hari Rp 380jt vs target Rp 200jt.",
    publishedAt: day(110),
  },
  {
    id: "case-4",
    slug: "padi-digital-workshop",
    title: "Padi Digital — Workshop Alignment",
    category: "Workshop",
    cover:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=70",
    blurb: "Sprint planning 2× lebih cepat, engineering NPS +18.",
    problem: "Tim engineering bingung product strategy. Roadmap berubah tiap sprint.",
    approach: "Workshop alignment 2 hari. Rumus: Outcome > Output > Activity.",
    result: "Sprint planning 2× lebih cepat. Engineering NPS +18.",
    publishedAt: day(160),
  },
];

export const SEED_SERVICES: Service[] = [
  {
    id: "svc-1",
    slug: "monthly-retainer",
    name: "Monthly Retainer",
    description:
      "Pendampingan berkelanjutan — mentoring atau advisory bulanan, fokus karier + technical depth.",
    priceLabel: "Rp 4.5jt",
    period: "/bulan",
    bullets: ["Call mingguan 60 menit", "Async review tanpa batas", "Akses resource library"],
    featured: false,
  },
  {
    id: "svc-2",
    slug: "strategy-sprint",
    name: "Strategy Sprint",
    description:
      "Sprint intensif lima hari dengan deliverable jelas: roadmap + matriks prioritas.",
    priceLabel: "Rp 18jt",
    period: "/sprint",
    bullets: ["Wawancara stakeholder", "Fasilitasi workshop", "Deck akhir + recording"],
    featured: true,
    priceNumber: 18_000_000,
  },
  {
    id: "svc-3",
    slug: "office-hours",
    name: "Office Hours",
    description:
      "Sesi 30–60 menit untuk pertanyaan spesifik — pricing, hiring, atau eksekusi.",
    priceLabel: "Rp 750k",
    period: "/sesi",
    bullets: ["Booking minggu yang sama", "Prep brief via email", "Catatan follow-up"],
    featured: false,
    priceNumber: 750_000,
  },
];

export const SEED_RESOURCES: Resource[] = [
  {
    id: "res-1",
    title: "GTM Playbook Lokal 2026",
    description: "Kerangka lengkap go-to-market untuk founder early-stage di pasar Indonesia.",
    fileLabel: "PDF · 38 hal",
    gated: true,
    downloads: 412,
  },
  {
    id: "res-2",
    title: "Pricing Calculator",
    description: "Template spreadsheet — variabel harga + simulator paket.",
    fileLabel: "Notion template",
    gated: false,
    downloads: 1280,
  },
  {
    id: "res-3",
    title: "Hiring Rubric",
    description: "Scoring + prompt wawancara untuk merekrut engineer dan designer.",
    fileLabel: "Spreadsheet",
    gated: true,
    downloads: 96,
  },
];

export const SEED_STATE: State = {
  posts: SEED_POSTS,
  portfolio: SEED_PORTFOLIO,
  services: SEED_SERVICES,
  resources: SEED_RESOURCES,
  leads: [
    {
      id: "lead-1",
      name: "Asep Wijaya",
      email: "asep@sinarventures.id",
      topic: "Monthly Retainer",
      source: "Contact form",
      ts: now - 12 * 60 * 1000,
      status: "new",
    },
    {
      id: "lead-2",
      name: "Putri Maharani",
      email: "putri@nusantaralabs.com",
      topic: "Strategy Sprint",
      source: "Newsletter",
      ts: now - 60 * 60 * 1000,
      status: "new",
    },
    {
      id: "lead-3",
      name: "Bayu Setiawan",
      email: "bayu@kodekolektif.io",
      topic: "Office Hours",
      source: "Lead magnet: GTM Playbook Lokal 2026",
      ts: now - 3 * 60 * 60 * 1000,
      status: "contacted",
    },
  ],
  comments: [
    {
      id: "com-1",
      postId: "post-1",
      postTitle: SEED_POSTS[0].title,
      author: "guest",
      email: "buy@spam.example",
      body: "Buy followers cheap http://spam.example — best service",
      status: "pending",
      aiFlag: "spam",
      ts: now - 30 * 60 * 1000,
    },
    {
      id: "com-2",
      postId: "post-2",
      postTitle: SEED_POSTS[1].title,
      author: "Reni",
      email: "reni@example.com",
      body: "Insightful post — terima kasih sudah berbagi.",
      status: "approved",
      aiFlag: null,
      ts: now - 4 * 60 * 60 * 1000,
    },
  ],
  subscribers: [
    { id: "sub-1", email: "early@example.com", status: "confirmed", source: "footer", ts: day(30) },
    { id: "sub-2", email: "fan@example.com",   status: "confirmed", source: "lead-magnet", ts: day(14) },
    { id: "sub-3", email: "new@example.com",   status: "pending",   source: "footer", ts: day(1) },
  ],
  chatSessions: [],
  pages: SEED_PAGES,
  landingSections: SEED_LANDING_SECTIONS,
};

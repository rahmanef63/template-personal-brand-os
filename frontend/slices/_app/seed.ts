import type { LandingSection } from "@/features/_shared/landing/types";

export const SEED_LANDING_SECTIONS: LandingSection[] = [
  {
    id: "ls-hero",
    order: 10,
    kind: "hero",
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.",
    subtitle:
      "Tempor incididunt ut labore et dolore magna aliqua — strategi produk, mentorship engineer, dan riset go-to-market untuk founder & tim Indonesia.",
    enabled: true,
    config: '{"badge":"2026 mentorship cohort open"}',
    layers: [
      { id: "hero-photo", type: "image", placement: "background", opacity: 100, enabled: true, url: "/hero.webp" },
    ],
  },
  { id: "ls-stats",        order: 20, kind: "stats",        title: "Numbers", subtitle: "Quick credibility strip.", enabled: true },
  {
    id: "ls-features",
    order: 25,
    kind: "features",
    title: "Fokus yang saya kerjakan",
    subtitle: "Empat jalur utama: strategi produk, mentorship engineering, tulisan, dan sesi untuk tim.",
    enabled: true,
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
  },
  { id: "ls-testimonials", order: 60, kind: "testimonials", title: "Apa kata mereka", subtitle: "Dari founder dan tim yang sudah bekerja sama.", enabled: true },
  {
    id: "ls-faq",
    order: 62,
    kind: "faq",
    title: "Pertanyaan yang sering masuk",
    subtitle: "Soal kolaborasi, jasa, timeline, dan harga — sebelum kamu kirim email.",
    enabled: true,
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

const LOREM_LONG =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper.\n\nAenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum.\n\nSed cursus turpis vitae tortor. Donec posuere vulputate arcu. Phasellus accumsan cursus velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed aliquam, nisi quis porttitor congue, elit erat euismod orci, ac placerat dolor lectus quis orci.";

export const SEED_POSTS: Post[] = [
  {
    id: "post-1",
    slug: "lorem-ipsum-pertama",
    title: "Lorem ipsum dolor sit amet, consectetur",
    excerpt:
      "Adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    body: LOREM_LONG,
    cover:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1400&q=70",
    tag: "Strategy",
    author: "Lorem D.",
    status: "published",
    publishedAt: day(1),
    views: 3812,
    readMin: 6,
  },
  {
    id: "post-2",
    slug: "kedua-quis-nostrud",
    title: "Quis nostrud exercitation ullamco laboris",
    excerpt:
      "Nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
    body: LOREM_LONG,
    cover:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=70",
    tag: "Engineering",
    author: "Lorem D.",
    status: "published",
    publishedAt: day(9),
    views: 2417,
    readMin: 8,
  },
  {
    id: "post-3",
    slug: "ketiga-excepteur-sint",
    title: "Excepteur sint occaecat cupidatat non proident",
    excerpt:
      "Sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error.",
    body: LOREM_LONG,
    cover:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=70",
    tag: "Notes",
    author: "Lorem D.",
    status: "published",
    publishedAt: day(22),
    views: 1908,
    readMin: 4,
  },
  {
    id: "post-4",
    slug: "draft-sed-perspiciatis",
    title: "Sed ut perspiciatis unde omnis iste natus",
    excerpt: "Doloremque laudantium totam rem aperiam — work-in-progress.",
    body: LOREM_LONG,
    cover:
      "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=1400&q=70",
    tag: "Strategy",
    author: "Lorem D.",
    status: "draft",
    publishedAt: 0,
    views: 0,
    readMin: 5,
  },
];

export const SEED_PORTFOLIO: PortfolioItem[] = [
  {
    id: "case-1",
    slug: "acme-rebrand",
    title: "Acme — Lorem case study",
    category: "Product",
    cover:
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1600&q=70",
    blurb: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
    problem:
      "Acme menghadapi penurunan retensi 18% selama 2 kuartal. Hipotesis: onboarding yang membingungkan.",
    approach:
      "Audit funnel + 14 wawancara user. Kerangka ulang aktivasi: 4-langkah → 1-langkah dengan bantuan AI.",
    result:
      "Aktivasi naik 31%. Retensi minggu-2 naik 12%. ARR proyeksi +Rp 4.2 milyar.",
    publishedAt: day(40),
  },
  {
    id: "case-2",
    slug: "foobar-rebrand",
    title: "Foobar — Ipsum rebrand",
    category: "Brand",
    cover:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=70",
    blurb: "Accusantium doloremque laudantium, totam rem aperiam, eaque ipsa.",
    problem: "Brand mismatch — pasar persepsikan startup, klien beli enterprise.",
    approach: "Workshop pemegang saham. Brand archetype + visual reposition.",
    result: "Avg deal size naik 2.4×. Sales cycle turun dari 90 hari ke 54.",
    publishedAt: day(70),
  },
  {
    id: "case-3",
    slug: "beta-gtm",
    title: "Beta Labs — Dolor GTM",
    category: "Strategy",
    cover:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1600&q=70",
    blurb: "Quae ab illo inventore veritatis et quasi architecto beatae vitae.",
    problem: "Launch tertunda 3× — tim ga sepakat ICP.",
    approach: "Force-rank ICP via JTBD. Prune 5 segment ke 2.",
    result: "Launch on-time. 60-day MRR Rp 380jt vs target Rp 200jt.",
    publishedAt: day(110),
  },
  {
    id: "case-4",
    slug: "gamma-workshop",
    title: "Gamma — Amet workshop",
    category: "Workshop",
    cover:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=70",
    blurb: "Dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit.",
    problem: "Tim engineering bingung product strategy. Roadmap berubah tiap sprint.",
    approach: "2-hari workshop alignment. Rumus: Outcome > Output > Activity.",
    result: "Sprint planning 2× lebih cepat. Engineering NPS +18.",
    publishedAt: day(160),
  },
];

export const SEED_SERVICES: Service[] = [
  {
    id: "svc-1",
    slug: "mentoring",
    name: "1-on-1 Mentoring",
    description:
      "Lorem ipsum dolor sit amet consectetur. 4 sesi per bulan, fokus karir + technical depth.",
    priceLabel: "Rp 4.5jt",
    period: "/bulan",
    bullets: ["Weekly 60-min call", "Async review unlimited", "Resource library access"],
    featured: false,
  },
  {
    id: "svc-2",
    slug: "strategy-sprint",
    name: "Strategy Sprint",
    description:
      "Adipiscing elit ut tellus dignissim. Intensive 5-hari deliverable: roadmap + prioritization matrix.",
    priceLabel: "Rp 18jt",
    period: "/sprint",
    bullets: ["Stakeholder interviews", "Workshop fasilitasi", "Final deck + recording"],
    featured: true,
    priceNumber: 18_000_000,
  },
  {
    id: "svc-3",
    slug: "office-hours",
    name: "Office Hours",
    description:
      "Curabitur ac eros vitae elit. Slot 30-menit untuk konsultasi cepat — pricing, hiring, eksekusi.",
    priceLabel: "Rp 750k",
    period: "/sesi",
    bullets: ["Same-week booking", "Prep brief by email", "Follow-up notes"],
    featured: false,
    priceNumber: 750_000,
  },
];

export const SEED_RESOURCES: Resource[] = [
  {
    id: "res-1",
    title: "Lorem Playbook 2026",
    description: "Framework lengkap GTM lokal untuk early-stage founder.",
    fileLabel: "PDF · 38 hal",
    gated: true,
    downloads: 412,
  },
  {
    id: "res-2",
    title: "Ipsum Pricing Calculator",
    description: "Template spreadsheet — variabel + simulator harga.",
    fileLabel: "Notion template",
    gated: false,
    downloads: 1280,
  },
  {
    id: "res-3",
    title: "Dolor Hiring Rubric",
    description: "Scoring + interview prompts untuk hire engineer + designer.",
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
      email: "asep@acme.id",
      topic: "1-on-1 Mentoring",
      source: "Contact form",
      ts: now - 12 * 60 * 1000,
      status: "new",
    },
    {
      id: "lead-2",
      name: "Putri Maharani",
      email: "putri@foobar.com",
      topic: "Strategy sprint",
      source: "Newsletter",
      ts: now - 60 * 60 * 1000,
      status: "new",
    },
    {
      id: "lead-3",
      name: "Bayu Setiawan",
      email: "bayu@beta.io",
      topic: "Office hours",
      source: "Lead magnet: Lorem Playbook 2026",
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

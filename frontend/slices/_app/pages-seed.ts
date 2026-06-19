import type { PageEntry } from "@/features/_shared/pages/types";
import { PUBLIC_BASE } from "./nav-config";

const now = Date.now();
const day = (n: number) => now - n * 24 * 60 * 60 * 1000;

/**
 * SEED_PAGES — system pages mirror existing public JSX routes (read-only
 * in admin, listed as reference). Custom seed pages show off the block
 * renderer end-to-end so operators see what "create + edit" looks like.
 */
export const SEED_PAGES: PageEntry[] = [
  // System pages (JSX-rendered) — listed read-only for navigation.
  {
    id: "sys-home",
    slug: "",
    title: "Home",
    description: "Personal landing — bio, latest, services, CTA.",
    blocks: [],
    status: "published",
    createdAt: day(180),
    updatedAt: day(180),
    systemPage: true,
    isLanding: true,
  },
  {
    id: "sys-about",
    slug: "about",
    title: "About",
    description: "Long-form bio, journey, values.",
    blocks: [],
    status: "published",
    createdAt: day(180),
    updatedAt: day(180),
    systemPage: true,
  },
  {
    id: "sys-blog",
    slug: "blog",
    title: "Blog",
    description: "Posts index.",
    blocks: [],
    status: "published",
    createdAt: day(180),
    updatedAt: day(180),
    systemPage: true,
  },
  {
    id: "sys-portfolio",
    slug: "portfolio",
    title: "Portfolio",
    description: "Case studies + projects.",
    blocks: [],
    status: "published",
    createdAt: day(180),
    updatedAt: day(180),
    systemPage: true,
  },
  {
    id: "sys-services",
    slug: "services",
    title: "Services",
    description: "Mentoring, sprints, office hours.",
    blocks: [],
    status: "published",
    createdAt: day(180),
    updatedAt: day(180),
    systemPage: true,
  },
  {
    id: "sys-resources",
    slug: "resources",
    title: "Resources",
    description: "Free + gated downloads.",
    blocks: [],
    status: "published",
    createdAt: day(180),
    updatedAt: day(180),
    systemPage: true,
  },
  {
    id: "sys-contact",
    slug: "contact",
    title: "Contact",
    description: "Email, booking, social.",
    blocks: [],
    status: "published",
    createdAt: day(180),
    updatedAt: day(180),
    systemPage: true,
  },
  // Custom starter page — fully editable, demonstrates renderer.
  {
    id: "custom-now",
    slug: "now",
    title: "Now",
    description: "What I'm focused on this month.",
    blocks: [
      { kind: "hero", headline: "What I'm up to right now", sub: "A living page — updated monthly." },
      { kind: "text", heading: "This month", body: "Mentoring 4 founders, writing a guide on pricing, prepping a strategy sprint for an AI startup." },
      { kind: "feature-list", heading: "Reading + watching", items: [
        { title: "Currently reading", body: "Working in Public — Nadia Asparouhova." },
        { title: "Currently watching", body: "Latent Space podcast back-catalog." },
        { title: "Currently writing", body: "Indonesia GTM playbook — Ch. 3 draft." },
      ]},
      { kind: "cta", headline: "Want to chat?", cta: { label: "Book a call", href: `${PUBLIC_BASE}/services` } },
    ],
    status: "published",
    createdAt: day(15),
    updatedAt: day(1),
    systemPage: false,
  },
];

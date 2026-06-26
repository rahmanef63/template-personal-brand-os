# Changelog

All notable changes to this template. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/).

## [1.1.0] — 2026-06-10

Landing v2, scroll-motion kit, and an onboarding contract that auto-seeds and
lets the owner pick a theme preset. Fleet guards keep siblings in sync.

### Added
- **Shared motion kit** (`frontend/slices/_shared/motion/`) — `Reveal`,
  `Stagger`, `CountUp`, `Marquee`, and `useInView` scroll-reveal primitives,
  all `prefers-reduced-motion` aware. Landing sections consume it via
  `data-reveal` / `is-inview` through `LandingSectionShell`.
- **Landing v2** — every landing kind (hero, stats, features, blog, changelog,
  portfolio, services, testimonials, pricing, faq, cta, newsletter, custom)
  now renders a real shared section component
  (`_shared/landing/sections/`) via `home/LandingRenderer`. Each section's copy
  and behavior is driven by admin-editable title/subtitle plus a per-section
  config JSON override (a typed parse layer in `sections/config.ts`) — no more
  hard-coded landing copy.
- **Landing seed lineup** (`convex/seed.ts`) — a `LANDING` array of sections
  (item-bearing kinds pre-filled from `landingContent.ts`) so a fresh clone
  gets a real editable home. Additive maintenance mutations `seed.syncLanding`
  (inserts missing sections + realigns `order`, preserves admin edits) and
  `seed.syncServicesCommerce` backfill already-deployed clones; internal
  `seed.seedDemo` refills only when empty.
- **Onboarding 0.1.0 contract** — Branding step adds a `themePreset` (tweakcn)
  picker persisted to `siteSettings.themePreset` (schema field +
  `settings.upsert` validator). The wizard's final step auto-seeds sample
  content (`seed.seedSample`, only-when-empty) before marking onboarded; the
  public home shows a friendly empty-state ("Situs sedang disiapkan" → Masuk
  admin) instead of a blank page.
- **UI primitives** — `components/ui/carousel.tsx`
  (`embla-carousel-react` + `embla-carousel-autoplay`) and
  `components/ui/accordion.tsx`, backing the animated shared landing blocks.

### Changed
- **Build pipeline** — `vercel.json` `buildCommand` is now a single
  `npm run build:auto` with a 3-way branch: `CONVEX_DEPLOY_KEY` →
  `setup-auth.mjs` + `convex deploy --cmd 'next build'`;
  `NEXT_PUBLIC_CONVEX_URL`-only → frontend-only build; `VERCEL` with neither →
  hard fail. The Build Command must be left at default; overriding it skips
  auth-key provisioning.
- `/admin` canonically redirects to `/dashboard/admin`; the admin gate shows the
  onboarding wizard until onboarding completes.

## [1.0.0] — 2026-06-03

First stable release. The clone owner now manages versioning, updates, backups,
team, and setup health entirely from the admin panel — no terminal.

### Added
- **headless-core** (`lib/headless-core/`) + `version.json` manifest — single
  source of version truth and the keystone for reuse across templates.
- **`/setup` health page** — self-diagnosing checklist (Convex connected →
  backend deployed → owner claimed → seeded → onboarded), each step linking to
  its fix. Plain language for non-coders.
- **In-app update channel** — admin sees current vs upstream version and can
  rebuild with one click (`VERCEL_DEPLOY_HOOK_URL`).
- **One-click backup / restore** — download a structured JSON snapshot of all
  content (no credentials); restore replaces content with FK id remapping.
- **Real owner + roles** — dashboard, nav-user dropdown, and Team settings show
  the actual signed-in admin; roles derived (first account = owner, invited = editor).
- Public **About / Contact** now read owner name, intro, and contact email from
  `siteSettings`.
- **Clone smoke-test** (`npm run smoke`) — verifies a clone can deploy; local,
  no GitHub Actions cost.
- Cross-template **core adoption** guide (`docs/CORE-ADOPTION.md`) + `apply-core` tool.

### Added (earlier in 0.x)
- One-button **image picker** (gallery · upload · link · curated Unsplash) for every
  image field — logo, favicon, post & portfolio covers.
- **Site Settings** editor wired to Convex `siteSettings`; branding (name, tagline,
  logo, favicon, colour) surfaces on the public site at runtime.
- **Zero-touch auth** — JWT keys auto-provision at build (`scripts/setup-auth.mjs`);
  optional `ADMIN_EMAIL` / `ADMIN_PASSWORD` auto-creates the owner.
- **Onboarding wizard** (identity → branding → seed) + first-run empty-state.
- **Demo / clone stages** — `NEXT_PUBLIC_DEMO` reveals a "Deploy your own" button.
- `vercel.json` auto-runs `convex deploy` on clones (conditional on `CONVEX_DEPLOY_KEY`).
- Production App Router: SSR metadata, true 404s, error/loading boundaries, splash loader.
- Open-source docs: README, USER-GUIDE (ID), AI-SETUP, LICENSE, CONTRIBUTING.

### Changed
- Keyless first-owner claim; signup auto-closes once an owner exists.
- Header logo links to `/`; smoother motion + distinct active sidebar item.

### Removed
- Unsplash API key requirement — picker uses the bundled curated set by default.

# Changelog

All notable changes to this template. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/).

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

# Changelog

All notable changes to this template. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added
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

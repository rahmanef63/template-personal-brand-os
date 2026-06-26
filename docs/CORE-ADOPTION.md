# Headless Core — adoption across templates

`personal-brand-os` is the **reference template**. The reusable engine that makes
a clone self-manageable by a non-coder lives in `lib/headless-core/` + a few
Convex functions. This doc explains what's portable to the other templates
(`agency-studio-os`, `konsultan-os`, `kreator-studio-os`, `notion-page-clone-os`,
`riset-kit`, `saas-marketing-os`, `wirausaha-os`) and how to roll it out.
(`cms-public-storefront` is a scaffold, not a catalog template — skipped in
fleet/apply-core ops; see `TEMPLATES.json`.)

## What the core is

| Piece | File(s) | Portable? |
|-------|---------|-----------|
| Version manifest | `version.json` | ✅ yes (copied verbatim) |
| Version + update plumbing | `lib/headless-core/version.ts` | ✅ yes |
| Settings type contract | `lib/headless-core/settings.ts` | ✅ yes |
| Update channel (backend) | `convex/update.ts` | ✅ yes (needs `convex/auth.ts`) |
| Setup health page | `app/setup/` + `components/setup/` | ⚠️ needs content schema |
| Settings / onboarding | `convex/settings.ts`, `setup.ts`, `seed.ts`, `users.ts` | ❌ per-template |
| Backup/restore | `convex/backup.ts` | ❌ per-template (content tables differ) |
| Admin Update/Backup cards | `components/admin/*` | ⚠️ needs a host in each admin settings |
| Motion primitives | `frontend/slices/_shared/motion` (Reveal, Stagger, CountUp, Marquee, `useInView`) | ✅ portable (reduced-motion-aware) |
| Landing sections | `frontend/slices/_shared/landing/sections` + `LandingRenderer` | ✅ portable (admin-editable title/subtitle + per-section config JSON) |

The **portable layer** is template-agnostic and can be dropped into any template
that already has `@convex-dev/auth` wired (all siblings do). The rest depends on
each template's own content schema, so it's part of that template's "Phase 2"
content migration (localStorage → Convex), not a copy-paste.

The dependency-light, Convex-free shared modules (`_shared/motion` and
`_shared/landing/sections` + `LandingRenderer`) were added fleet-wide on
2026-06-10 (`motionKit` / `landingV2` in `TEMPLATES.json`) and are part of the
cross-template core surface that siblings can adopt directly.

## Status (2026-06-10)

- `personal-brand-os` — canon/reference; full core (all rows above). ✅
- 7 siblings — now **headless-os** (portable layer + onboarding contract adopted,
  `onboardingSlice` 0.1.0 per `TEMPLATES.json`), no longer localStorage. On disk
  `agency-studio-os`, `konsultan-os`, `kreator-studio-os`, `notion-page-clone-os`,
  `riset-kit`, `saas-marketing-os`, and `wirausaha-os` each have `lib/headless-core/`
  + `convex/settings.ts` + `convex/schema.ts`.
- `cms-public-storefront` — **scaffold**, not a sibling: `state: scaffold`,
  `onboardingSlice: null`, no `lib/headless-core/` + `settings.ts`. Excluded from
  `apply-core`/fleet ops by design (`TEMPLATES.json`).

## Rolling out the portable layer

From the `_templates` fleet root (the directory containing all template repos):

```bash
node scripts/apply-core.mjs <slug>            # dry-run — shows planned writes
node scripts/apply-core.mjs <slug> --apply    # write the portable files
node scripts/apply-core.mjs --all --apply     # every Convex-wired sibling
```

Two sibling guards ship alongside `apply-core.mjs` at the fleet root:

```bash
node scripts/check-shared-sync.mjs            # _shared modules (incl. motion + landing/sections) stay in sync across siblings
node scripts/check-onboarding-contract.mjs    # onboarding contract is satisfied (see below)
```

All three scripts (`apply-core`, `check-shared-sync`, `check-onboarding-contract`)
live at the `_templates` fleet root, **not** in `scripts/` inside a template — the
canon template's own `scripts/` holds only `setup-auth.mjs` and `smoke-test.mjs`.

The tool rewrites the upstream repo slug in `version.ts` and `update.ts`
(`version.json` is copied verbatim) so each clone checks/updates from **its own**
`template-<slug>` repo.

Per repo, after `--apply`:

1. `npx convex codegen` — regenerate `_generated` (picks up `update.ts`).
2. `npx tsc --noEmit` — confirm clean.
3. Wire the **Update card** (`components/admin/update-card.tsx`) into that
   template's admin Settings (it's self-contained; only needs a host page).
4. Commit + push **deliberately** — each push triggers a Vercel/Dokploy rebuild.

## Full-core checklist (per template, when it does its content migration)

1. Add content tables + `siteSettings` singleton to `convex/schema.ts`.
2. Port `convex/settings.ts`, `setup.ts`, `seed.ts`, `users.ts` (adapt seed to
   the template's content shape).
3. Port `convex/backup.ts`, updating `CONTENT_TABLES` to that template's tables.
4. Add `app/setup/` + `components/setup/` (drop-in once `setup.status` exists).
5. Wire onboarding wizard, real owner in the dashboard shell, and public pages to
   `siteSettings` (mirror what `personal-brand-os` does).
6. Satisfy the onboarding contract enforced by `check-onboarding-contract.mjs` —
   `siteSettings.themePreset` in `convex/schema.ts` and a matching `themePreset`
   validator in the `convex/settings.ts` upsert, a HomePage empty-state, a wizard
   `finish()` that auto-seeds (`seed.seedSample`, only-when-empty) before
   `markOnboarded`, and the `/admin` → `/dashboard/admin` redirect.

Keeping the contract (`lib/headless-core/settings.ts`) identical across templates
means the admin UI + public chrome stay swappable.

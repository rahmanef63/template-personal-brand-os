# Headless Core — adoption across templates

`personal-brand-os` is the **reference template**. The reusable engine that makes
a clone self-manageable by a non-coder lives in `lib/headless-core/` + a few
Convex functions. This doc explains what's portable to the other templates
(`agency-studio-os`, `cms-public-storefront`, `konsultan-os`, `kreator-studio-os`,
`riset-kit`, `saas-marketing-os`, `wirausaha-os`) and how to roll it out.

## What the core is

| Piece | File(s) | Portable? |
|-------|---------|-----------|
| Version manifest | `version.json` | ✅ yes (slug rewritten per repo) |
| Version + update plumbing | `lib/headless-core/version.ts` | ✅ yes |
| Settings type contract | `lib/headless-core/settings.ts` | ✅ yes |
| Update channel (backend) | `convex/update.ts` | ✅ yes (needs `convex/auth.ts`) |
| Setup health page | `app/setup/` + `components/setup/` | ⚠️ needs content schema |
| Settings / onboarding | `convex/settings.ts`, `setup.ts`, `seed.ts`, `users.ts` | ❌ per-template |
| Backup/restore | `convex/backup.ts` | ❌ per-template (content tables differ) |
| Admin Update/Backup cards | `components/admin/*` | ⚠️ needs a host in each admin settings |

The **portable layer** is template-agnostic and can be dropped into any template
that already has `@convex-dev/auth` wired (all siblings do). The rest depends on
each template's own content schema, so it's part of that template's "Phase 2"
content migration (localStorage → Convex), not a copy-paste.

## Status (2026-06-03)

- `personal-brand-os` — full core (all rows above). ✅
- 7 siblings — minimal Convex (`auth.ts` + basic `schema.ts`); still localStorage
  for content. They get the **portable layer** now; full core lands as each one
  completes its content migration.

## Rolling out the portable layer

From `/home/rahman/projects/_templates`:

```bash
node scripts/apply-core.mjs <slug>            # dry-run — shows planned writes
node scripts/apply-core.mjs <slug> --apply    # write the portable files
node scripts/apply-core.mjs --all --apply     # every Convex-wired sibling
```

The tool rewrites the upstream repo slug in `version.json`, `version.ts`, and
`update.ts` so each clone checks/updates from **its own** `template-<slug>` repo.

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

Keeping the contract (`lib/headless-core/settings.ts`) identical across templates
means the admin UI + public chrome stay swappable.

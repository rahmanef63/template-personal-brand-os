# Personal Brand OS (personal-brand-os)

Per-template-base shared scaffolding for the `personal-brand-os` full-app template. Catalog entry: [`lib/content/layouts.ts`](../../../lib/content/layouts.ts).

## Layout

- `shared/` — site-config, nav-config, store, seed data, types shared across the template's public + admin route trees
- `slices/` — per-section UI grouped by route (home, blog, admin/posts, admin/leads, etc.)

The template's Next.js routes live at [`app/preview/personal-brand-os/{public,admin}/`](../../../app/preview/personal-brand-os/). The CLI installer copies them out of `preview/` into `app/(public)/` + `app/admin/` when consumers run `npx rr add personal-brand-os` (default `--at root`).

## Install

```bash
npx rr add personal-brand-os              # default --at root: app/(public)/ + app/admin/
npx rr add personal-brand-os --at preview # sandbox: keep /preview/personal-brand-os/* URLs
```

## Constraints (rr conventions)

Follows the full rr rule set — see [`frontend/slices/_templates/example-feature/README.md`](../../../frontend/slices/_templates/example-feature/README.md) for the canonical list. Key gates:
- shadcn primitives only — no raw `<button>`/`<dialog>`/`<input type=date|file>` (`audit:templates`)
- ≤200 LOC per file — sub-components must be extracted (`audit:file-size`)
- Hardcoded `/preview/personal-brand-os/` paths only in rewriter-handled files (`nav-config.ts`, `site-config.ts`, `robots.ts`, `sitemap.ts`); elsewhere → import from `nav-config` (`audit:templates`)
- Convex public fn require `args:` validator + auth gate when not intentional public endpoint

Run `npm run slices:check` before commit; pre-push hook re-runs the chain.

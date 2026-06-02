# Contributing

Thanks for helping improve **Personal Brand OS**! This is a clone-to-own website
template — fixes here flow to everyone who deploys it.

## Ground rules

- **shadcn/ui primitives only** — no raw `<dialog>`, `<input type="date|file">`, etc.
- **Auth is `@convex-dev/auth`** (Password). No Clerk.
- **Convex queries hit an index** (`.withIndex(...)`) — never bare `.collect()`.
- Keep source files reasonably small; extract when a file gets large.
- Don't break the **non-coder zero-touch flow** (deploy → `/admin` → claim → seed).

## Local setup

```bash
npm install --legacy-peer-deps
cp .env.example .env.local        # set NEXT_PUBLIC_CONVEX_URL
npx convex dev --once
npm run dev
```

## Before you open a PR

```bash
npx tsc --noEmit     # types must pass
npm run build        # must compile
```

- Keep the diff focused; one concern per PR.
- Conventional commit subjects (`feat:`, `fix:`, `docs:`, `chore:`).
- If you touch `convex/` (schema/functions), say so in the PR — clones run
  `convex deploy` at build, so additive schema changes are safest.
- Update `docs/` and `CHANGELOG.md` when behaviour changes.

## Reporting bugs

Open an issue with: what you expected, what happened, and your deploy context
(Vercel + Convex, or local). Console errors + the page URL help a lot.

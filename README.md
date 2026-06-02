# personal-brand-os

Scaffolded with [`rahman-resources`](https://www.npmjs.com/package/rahman-resources) — Next 16 + React 19 + Convex + Tailwind 4 + shadcn/ui.

> 📖 **Panduan lengkap (non-teknis): [`docs/USER-GUIDE.md`](docs/USER-GUIDE.md)** — deploy, panel admin, keamanan login admin, update, backup.
> 🤖 **Bantuan AI klik-demi-klik: [`docs/AI-SETUP.md`](docs/AI-SETUP.md)** — salin 1 prompt ke ChatGPT/Claude, dituntun sampai live.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rahmanef63/template-personal-brand-os)

## Setup

```bash
npm install --legacy-peer-deps
cp .env.example .env.local           # fill NEXT_PUBLIC_CONVEX_URL etc.
npx convex dev --once                 # generates convex/_generated
npm run dev
```

## Add a layout / recipe / feature

```bash
npx rahman-resources list
npx rahman-resources info <slug>
npx rahman-resources add personal-brand-os .   # full-app template (T1)
npx rahman-resources add ai-sdk-openrouter .   # feature (npm install)
```

## Hard rules

- **NO Clerk.** Auth = `@convex-dev/auth`.
- **shadcn primitives only** — no raw `<dialog>`, `<input type=date|file>`.
- Use `proxy.ts` (not `middleware.ts`) on Next 16.
- `convex/_generated` MUST be committed before deploy.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router + cacheComponents) |
| UI | React 19 + Tailwind 4 + shadcn |
| Backend | Convex (self-hosted compatible) |
| Auth | `@convex-dev/auth` (Password provider by default) |

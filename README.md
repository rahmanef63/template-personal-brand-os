<div align="center">

# Personal Brand OS

**A 100% headless personal-brand website you fully own.**
Clone it to your own Vercel + Convex, sign in, and run everything — blog, portfolio,
services, leads, newsletter — from one admin dashboard. No code required.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rahmanef63/template-personal-brand-os)

![Next.js 16](https://img.shields.io/badge/Next.js-16-black)
![React 19](https://img.shields.io/badge/React-19-149eca)
![Convex](https://img.shields.io/badge/Convex-cloud-orange)
![Tailwind 4](https://img.shields.io/badge/Tailwind-4-38bdf8)
![License: MIT](https://img.shields.io/badge/License-MIT-green)

[**Live demo**](https://personal-brand-os-ten.vercel.app) ·
[**Panduan (ID)**](docs/USER-GUIDE.md) ·
[**Setup dibantu AI**](docs/AI-SETUP.md)

</div>

---

## What is this?

A **clone-to-own** website template. Deploy it to **your** infrastructure and you get a
full personal-brand site whose content lives in **your** Convex database — managed entirely
from the admin panel. The frontend is stateless, so updates never touch your data.

- 🧑‍💻 **For visitors** — a fast, SEO-ready public site (blog, portfolio, services, resources).
- 🛠️ **For you** — an admin dashboard to edit everything, with zero coding.
- 🔒 **Yours** — your repo, your Vercel, your Convex. No vendor lock-in.

## ✨ Features

- **Headless CMS on Convex** — posts, portfolio, services, resources, pages, landing
  sections, leads, comments, subscribers, chat. Realtime, edited from `/admin`.
- **Zero-touch setup** — deploy → open `/admin` → claim owner → one-click sample content.
  No env editing, no terminal. Auth keys auto-provision at build.
- **Branding from the dashboard** — site name, tagline, logo, **favicon**, brand colour,
  light/dark/system theme. All stored in Convex and applied across the site at runtime.
- **One-button image picker** everywhere — gallery · upload · paste-URL · curated Unsplash.
- **Secure admin** — keyless first-owner claim, then signup auto-closes; optional invite
  key (`ADMIN_SIGNUP_KEY`) or auto-admin from env (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).
- **`/setup` health page** — a plain-language checklist of what's done and what's left,
  each step linking to its fix. No log-reading.
- **In-app updates** — admin sees current vs latest version and rebuilds in one click.
- **Backup & restore** — download / re-import all your content as JSON, no terminal.
- **Real team & roles** — dashboard shows the actual signed-in admin; first account is
  owner, invited admins are editors.
- **Production Next.js** — SSR metadata, true HTTP 404s, error/loading boundaries,
  branded not-found, a splash loader until data is ready.
- **Demo / clone stages** — a "Deploy your own" button shows on the demo only.
- **Tested clones** — `npm run smoke` checks a clone can deploy (local, no CI cost).

## 🚀 Quick start (non-coder)

1. Click **[Deploy with Vercel](https://vercel.com/new/clone?repository-url=https://github.com/rahmanef63/template-personal-brand-os)** → connect GitHub → add the **Convex** integration → Deploy.
2. Open `https://your-site.vercel.app/admin` → **"Daftar sebagai pemilik"** (first account = owner).
3. In the dashboard, click **"Isi konten contoh"** to fill the site. Done.

Need hand-holding? Open [`docs/AI-SETUP.md`](docs/AI-SETUP.md) — copy one prompt into
ChatGPT/Claude and it walks you through every click. Full manual: [`docs/USER-GUIDE.md`](docs/USER-GUIDE.md).

## 💻 Local development

```bash
npm install --legacy-peer-deps
cp .env.example .env.local        # set NEXT_PUBLIC_CONVEX_URL
npx convex dev --once             # generates convex/_generated
npm run dev                       # http://localhost:3000
```

## 🔐 Environment — two places

Variables live in **two** dashboards. The Deploy/clone button only fills the Vercel ones;
set the Convex ones in the Convex dashboard (or let the build do it).

| Variable | Where | Required | Purpose |
|----------|-------|----------|---------|
| `NEXT_PUBLIC_CONVEX_URL` | Vercel | ✅ | Convex deployment URL (`.convex.cloud`) |
| `CONVEX_DEPLOY_KEY` | Vercel | ✅ | deploys functions + schema at build — needs capabilities `deploy` + `env:view` + `env:write` (or full access) |
| `JWT_PRIVATE_KEY` / `JWKS` / `SITE_URL` | Convex | ✅ | login signing — **auto-set at build** (or `npx @convex-dev/auth`) |
| `ADMIN_SIGNUP_KEY` | Convex | – | invite key for extra admins |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Convex | – | auto-create the owner on first load |
| `NEXT_PUBLIC_DEMO` | Vercel | – | demo only — shows the "Deploy your own" button |

> `vercel.json` runs `convex deploy` automatically when `CONVEX_DEPLOY_KEY` is present —
> no manual build-command change needed.

## 🧱 Tech stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 · Tailwind CSS 4 · shadcn/ui |
| Backend / DB | Convex (Cloud) — realtime |
| Auth | `@convex-dev/auth` (Password) |
| Theme | next-themes (light / dark / system) |
| Images | `image-picker` slice (gallery · upload · link · Unsplash) |

## 🗂️ Project structure

```
app/
  (public)/        public site — home, blog, portfolio, services, … (+ loading/error/404)
  dashboard/admin/ admin CMS (gated)
  icon.tsx         default favicon
components/
  image-picker/    portable one-button image chooser
  image-field.tsx  Convex-wired adapter
  onboarding/      setup wizard
  public-chrome.tsx nav/footer with branding from siteSettings
  admin-gate.tsx · site-loader.tsx · brand-head.tsx · demo-ribbon.tsx
convex/
  schema.ts        auth + content + siteSettings
  auth.ts setup.ts settings.ts files.ts seed.ts  …function modules
scripts/setup-auth.mjs   build-time JWT key provisioning
docs/                    USER-GUIDE.md · AI-SETUP.md
```

## 🗺️ Roadmap

- [x] **headless-core** module + version manifest (`lib/headless-core/`)
- [x] One-click **"Update available"** in admin
- [x] One-click **backup / restore**
- [x] Roles (owner / editor) — derived, surfaced in dashboard + Team settings
- [x] **`/setup`** health page + clone **smoke-test**
- [ ] Roll the core across the other 7 templates (see [`docs/CORE-ADOPTION.md`](docs/CORE-ADOPTION.md))
- [ ] Viewer role tier + per-action RBAC
- [ ] Optional Resend "forgot password" flow

## 🤝 Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md). Issues and PRs welcome.

## 📄 License

[MIT](LICENSE) © Rahman ([rahmanef.com](https://rahmanef.com))

<div align="center"><sub>Built with <a href="https://resource.rahmanef.com">rahman-resources</a>.</sub></div>

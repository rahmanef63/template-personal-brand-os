# portfolio-section

Reusable, prop-driven portfolio surface covering BOTH list and detail views.
Server components only — every template's `/portfolio` and `/portfolio/[slug]`
route consumes this slice.

## Surface

| Component | Props | Notes |
|---|---|---|
| `PortfolioListSection` | `eyebrow?, title?, subtitle?, items, hrefFor, columns?, layout?, limit?, align?, className?` | List view: header + uniform grid / masonry / asymmetric. |
| `PortfolioDetailView` | `item, backHref?, renderBody?, related?, hrefForRelated?, className?` | Single project: cover hero + meta + body + gallery + link + related. |
| `PortfolioCard` | `item, href, variant?, className?` | Single card; usable standalone. |
| `ProjectMeta` | `year?, client?, role?, tags?, className?` | Year + client + role + tag badges. |

### `PortfolioItem` shape

```ts
type PortfolioItem = {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  body?: string;            // long description, only used by detail view
  year?: number;            // e.g. 2025
  client?: string;          // "Acme Corp"
  role?: string;            // "Lead designer"
  tags?: string[];          // ["branding", "web", "motion"]
  cover: { src: string; alt: string };
  gallery?: { src: string; alt: string }[]; // detail-view images
  link?: { label: string; href: string };   // external "view live"
};
```

### List layout variants

- `uniform` (default) — shadcn `Card` grid, 16:9 cover, title + summary below.
- `masonry` — CSS columns flow; variable image height preserved via
  `width/height` (not `fill`) so each card keeps its native aspect ratio.
- `asymmetric` — first item = featured 16:9 hero spanning full width, then
  rows of 3 uniform cards below.

### Detail rendering

- Optional back link (`backHref`).
- Title + summary + `ProjectMeta` row (year, client, role, tags up to 8).
- Cover hero (16:9 via `next/image`, `priority`).
- Body via `renderBody(item.body)`. Default: split on `\n\n` and wrap each
  paragraph in `<p>`. Pass a custom renderer for MDX / markdown.
- Optional `gallery` — 2-col image grid (4:3 each).
- Optional external `link` — shadcn `Button` (default variant) opening in a
  new tab.
- Optional `related` — "More work" 3-col grid using `hrefForRelated` (defaults
  to `/portfolio/${slug}`).

## Usage

### List

```tsx
import { PortfolioListSection } from "@/features/portfolio-section";

<PortfolioListSection
  eyebrow="Selected work"
  title="Portfolio"
  layout="asymmetric"
  limit={7}
  items={projects}
  hrefFor={(p) => `/portfolio/${p.slug}`}
/>
```

### Detail

```tsx
import { PortfolioDetailView } from "@/features/portfolio-section";

<PortfolioDetailView
  item={project}
  backHref="/portfolio"
  related={moreProjects}
  hrefForRelated={(p) => `/portfolio/${p.slug}`}
  renderBody={(body) => <Mdx source={body} />}
/>
```

## Convex tables

None — pure component slice. Consumer fetches projects however they want
(Convex query, CMS, MDX filesystem, etc.).

## Permissions

None.

## Dependencies

- npm: `next` (peer for `next/image` + `next/link`)
- shadcn primitives: `badge`, `button`, `card`, `separator`
- env vars: none

## Notes

- All copy is consumer-supplied. No English strings shipped beyond
  "More work", "All work", and "No projects yet."
- `hrefFor` keeps routing decisions in the template — slug-prefix, locale
  segments, anything.
- Cover and gallery images need `images.remotePatterns` allowlisted in
  `next.config.ts` if `src` is remote.
- Masonry uses native CSS `columns` (no JS) — variable heights flow.
- No `"use client"` anywhere — works as RSC by default.

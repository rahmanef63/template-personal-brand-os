# blog-section

Reusable, prop-driven blog surface covering BOTH list and detail views.
Server components only — every template's `/blog` and `/blog/[slug]` route
consumes this slice.

## Surface

| Component | Props | Notes |
|---|---|---|
| `BlogListSection` | `eyebrow?, title?, subtitle?, posts, hrefFor, columns?, layout?, showFeatured?, limit?, align?, className?` | List view: header + cards grid / text list / featured-split. |
| `BlogPostView` | `post, backHref?, renderBody?, className?` | Single post: title + meta + cover + body. |
| `BlogCard` | `post, href, variant?, className?` | Single card; usable standalone. |
| `PostMeta` | `author?, publishedAt, tags?, className?` | Author + relative date + tag badges. |

### `BlogPost` shape

```ts
type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  body?: string;             // markdown/plain — used only for detail view
  author?: string;
  publishedAt: number;       // ms timestamp
  tags?: string[];
  cover?: { src: string; alt: string };
};
```

### List layout variants

- `cards` (default) — shadcn `Card` grid, cover image + title + excerpt + meta.
- `list` — vertical text-first list, no card chrome, separator rules.
- `featured-split` — first post = large hero card (2/3 width on lg),
  remaining posts in a 1/3-width side column. Cap side column at 4.

### Detail rendering

- Title + `PostMeta` row.
- Optional cover image (16:9 via `next/image`).
- Body via `renderBody(post.body)`. Default: split on `\n\n` and wrap each
  paragraph in `<p>`. Pass a custom renderer for MDX / markdown.
- Optional "All posts" back link via `backHref` (`SmartLink`-style).

## Usage

### List

```tsx
import { BlogListSection } from "@/features/blog-section";

<BlogListSection
  eyebrow="Journal"
  title="Latest posts"
  layout="featured-split"
  limit={5}
  posts={posts}
  hrefFor={(p) => `/blog/${p.slug}`}
/>
```

### Detail

```tsx
import { BlogPostView } from "@/features/blog-section";

<BlogPostView
  post={post}
  backHref="/blog"
  renderBody={(body) => <Mdx source={body} />}
/>
```

## Convex tables

None — pure component slice. Consumer fetches posts however they want
(Convex query, CMS, MDX filesystem, etc.).

## Permissions

None.

## Dependencies

- npm: `next` (peer for `next/image` + `next/link`)
- shadcn primitives: `badge`, `button`, `card`, `separator`
- env vars: none

## Notes

- All copy is consumer-supplied. No English strings shipped.
- `hrefFor` keeps routing decisions in the template — slug-prefix, locale
  segments, anything.
- Cover images need `images.remotePatterns` allowlisted in `next.config.ts`
  if the `src` is remote.
- No `"use client"` anywhere — works as RSC by default.

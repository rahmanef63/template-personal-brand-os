# testimonials-grid

Reusable, prop-driven testimonials section. Two components — fully
composable from any template marketing page.

## Surface

| Component | Props | Notes |
|---|---|---|
| `TestimonialsGridSection` | `eyebrow?, title?, subtitle?, items, columns?, layout?, align?, className?` | Header + responsive grid (1-3 columns) of testimonial cards. |
| `TestimonialCard` | `quote, author, role?, company?, avatar?, rating?, featured?, variant?, align?, className?` | Single card; usable standalone outside the grid. |

### `Testimonial` shape

```ts
type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role?: string;          // "Head of Growth, Acme"
  company?: string;
  avatar?: { src: string; alt: string };
  rating?: 1 | 2 | 3 | 4 | 5;
  featured?: boolean;     // pinned/highlighted card (ring accent in `cards`)
};
```

### Layout variants

- `cards` (default) — uniform shadcn `Card` grid. `featured` items get a
  ring accent.
- `quote-stack` — borderless centered quote flow, large quote text.
  Best for 3-6 hero quotes.
- `masonry` — CSS `columns-2`/`columns-3` flow with variable heights.
  Cards use `break-inside-avoid`.

### Rating

Renders 1-5 filled `lucide-react` `Star` icons. Empty stars use
`text-muted-foreground/40`. Accessible label: `Rated N out of 5`.

### Avatar

Uses shadcn `Avatar` primitive. Falls back to author initials (first two
words) when `avatar` is omitted.

## Usage

```tsx
import { TestimonialsGridSection } from "@/features/testimonials-grid";

<TestimonialsGridSection
  eyebrow="Loved by teams"
  title="What our customers say"
  columns={3}
  layout="cards"
  items={[
    {
      id: "1",
      quote: "Shipped our new dashboard in 3 days, not 3 weeks.",
      author: "Maya Chen",
      role: "Head of Eng",
      company: "Acme",
      rating: 5,
      featured: true,
    },
    {
      id: "2",
      quote: "Finally a primitive set that doesn't fight me.",
      author: "Diego Ruiz",
      role: "Staff Designer",
      company: "Northwind",
      rating: 5,
    },
  ]}
/>
```

## Convex tables

None — pure component slice.

## Permissions

None.

## Dependencies

- npm: `lucide-react`, `next` (peer for `next/link` via Button asChild)
- shadcn primitives: `avatar`, `button`, `card`
- env vars: none

## Notes

- All copy is consumer-supplied. The slice ships no English strings.
- Uses neutral shadcn tokens (`bg-muted`, `text-muted-foreground`,
  `ring-foreground/10`) — works with any theme preset.
- Server component — the underlying `Avatar` hydrates as a client island
  but the section itself stays RSC.

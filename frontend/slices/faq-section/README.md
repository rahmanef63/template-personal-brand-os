# faq-section

Reusable, prop-driven FAQ section. Server component that mounts the
shadcn `Accordion` (client primitive) as a leaf. Composable from any
template marketing or support page.

## Surface

| Component | Props | Notes |
|---|---|---|
| `FAQSection` | `eyebrow?, title?, subtitle?, items, layout?, multiple?, defaultOpen?, align?, className?, footerCta?` | Header + accordion (1 col / 2 col / grouped) + optional CTA. |
| `FAQItemRow` | `id, q, a, className?` | Single `AccordionItem`. Must be rendered inside `<Accordion>`. |

### `FAQItem` shape

```ts
type FAQItem = {
  id: string;
  q: string;              // question (plain string)
  a: string;              // answer (plain string — line breaks preserved)
  category?: string;      // optional tag for grouped layout
};
```

### Layout variants

- `single` (default) — one column accordion stack.
- `two-column` — items split in half on `md+`. Each column is its own
  accordion (independent open state).
- `grouped` — items grouped by `item.category` (fallback `"General"`),
  each group becomes a labelled accordion section.

### Open behavior

- `multiple={false}` (default) → shadcn `type="single" collapsible`.
  `defaultOpen?.[0]` selects the initial open row.
- `multiple={true}` → shadcn `type="multiple"`. `defaultOpen` is the
  full set of initially open row ids.

## Usage

```tsx
import { FAQSection } from "@/features/faq-section";

<FAQSection
  eyebrow="Support"
  title="Frequently asked questions"
  subtitle="Everything you need to know about the product."
  layout="grouped"
  items={[
    { id: "1", q: "Is it free?", a: "Yes, the open tier is free forever.", category: "Billing" },
    { id: "2", q: "How do I cancel?", a: "Settings → Billing → Cancel.", category: "Billing" },
    { id: "3", q: "Do you support SSO?", a: "Yes, on the Team plan.", category: "Security" },
  ]}
  footerCta={{
    question: "Still have questions?",
    label: "Contact support",
    href: "/contact",
  }}
/>
```

## Convex tables

None — pure component slice. Admin-edited FAQ data is sourced upstream
(any CMS or `faqs` Convex table the template provides) and passed in
via the `items` prop.

## Permissions

None.

## Dependencies

- npm: `next` (peer for `next/link`)
- shadcn primitives: `accordion`, `button`
- env vars: none

## Notes

- The section component itself is a server component. The shadcn
  `Accordion` it renders is the client island; no `"use client"` is
  added at the slice boundary.
- Answers render with `whitespace-pre-line` so admin-pasted line breaks
  survive without needing rich-text.
- Uses neutral shadcn tokens (`text-muted-foreground`, `border`) —
  works with any theme preset.

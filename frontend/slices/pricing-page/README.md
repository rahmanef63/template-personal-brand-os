# pricing-page

Reusable prop-driven pricing section — header + responsive tier grid +
optional FAQ accordion. All copy comes from props; the slice ships no
business strings.

## Surface

| Component | Props (highlight) | Notes |
|---|---|---|
| `PricingSection` | `title, tiers[]`, optional `eyebrow, subtitle, columns, faq, faqTitle, featuredVariant, className` | Top-level composed section. |
| `PricingTierCard` | `name, price, bullets[]`, optional `period, blurb, cta, featured, badge, featuredVariant` | Single tier card. |
| `PricingFAQ` | `items[]`, optional `title, className` | Standalone FAQ accordion. |

### `tiers[]` shape

```ts
{
  id: string;
  name: string;
  price: string;          // "$49" or "Custom"
  period?: string;        // "per month" / "annual" / "forever"
  blurb?: string;
  bullets: string[];
  cta?: { label: string; href: string };
  featured?: boolean;
  badge?: string;         // e.g. "Most popular"
}
```

### `faq[]` shape

```ts
{ q: string; a: string }
```

### Visual variants

`featuredVariant` controls how a `featured: true` tier stands out:

- `ring` (default) — accent ring + shadow
- `scale` — ring + slight scale-up
- `tint` — soft primary-tinted background

## Convex tables

None — pure component slice.

## Permissions

None.

## Dependencies

- npm: `lucide-react`, `next` (peer)
- shadcn primitives: `button`, `card`, `accordion`
- env vars: none

## Example

```tsx
import { PricingSection } from "@/features/pricing-page";

<PricingSection
  eyebrow="Pricing"
  title="Pick a plan that scales with you"
  subtitle="Start free. Upgrade when you outgrow it."
  tiers={[
    { id: "free", name: "Free", price: "$0", period: "forever",
      bullets: ["1 project", "Community support"],
      cta: { label: "Start free", href: "/signup" } },
    { id: "pro", name: "Pro", price: "$49", period: "per month",
      featured: true, badge: "Most popular",
      bullets: ["Unlimited projects", "Priority email"],
      cta: { label: "Go Pro", href: "/checkout?plan=pro" } },
    { id: "team", name: "Team", price: "Custom",
      bullets: ["SSO", "SLA", "Dedicated CSM"],
      cta: { label: "Contact sales", href: "/contact" } },
  ]}
  faq={[
    { q: "Can I cancel anytime?", a: "Yes — month-to-month, no lock-in." },
  ]}
/>
```

## Origin

Authored 2026-05-18 as a generic prop-driven marketing slice. No
external harvest — designed to compose cleanly with `cta`, `hero`, and
`services` slices.

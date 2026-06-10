# `doku-payment` slice

DOKU Checkout (hosted) + Direct (VA/QRIS/e-Wallet/PayLater/Minimarket/CC)
payment integration for Indonesian merchants. Sibling slice to
`midtrans-payment` — both share the same `paymentOrders` schema so
swapping or stacking providers requires zero migration.

## What ships

```
frontend/slices/doku-payment/
├── slice.json
├── config.ts
├── README.md (this file)
├── components/
│   ├── providers/doku.tsx          ← <DokuCheckout> hosted-page button
│   ├── DokuDirectForm.tsx          ← channel picker + form
│   ├── DokuPaymentInstructions.tsx ← VA / QRIS / e-Wallet renderer
│   ├── DokuStatusBadge.tsx         ← reactive status badge
│   └── checkout-page.tsx           ← demo page composing the above
└── lib/
    ├── channels.ts                 ← 19-channel registry
    └── format.ts                   ← IDR + VA grouping + countdown

convex/features/payment/                         (shared with midtrans)
├── schema.ts                       (extended)
├── mutations.ts                    (extended)
├── http.ts                         (dokuWebhook added)
├── actions/
│   ├── midtrans.ts                 (existing)
│   └── doku.ts                     ★ createCheckout / createDirect / getStatus
└── doku/
    ├── client.ts                   ★ signed fetch wrapper
    ├── signature.ts                ★ HMAC sign + verify
    └── types.ts                    ★ DOKU request/response shapes
```

## Convex wiring (slice is props-driven)

The slice components don't import `convex/react` so the slice type-checks
inside this monorepo (which has no Convex dep). In your consumer app,
pass the action as a prop:

```tsx
"use client";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  DokuCheckout,
  DokuDirectForm,
  DokuPaymentInstructions,
  DokuStatusBadge,
} from "@/features/doku-payment";

export default function Page() {
  const checkout = useAction(api.features.payment.actions.doku.createCheckoutPayment);
  const direct = useAction(api.features.payment.actions.doku.createDirectPayment);
  const sync = useAction(api.features.payment.actions.doku.getPaymentStatus);
  const order = useQuery(api.features.payment.queries.getOrderByOrderId, { orderId });

  return (
    <DokuCheckout amount={amount} orderId={orderId} customer={c} onCheckout={checkout} />
  );
}
```

## Wiring (consumer)

```ts
// convex/schema.ts
import { paymentTables } from "./features/payment/_schema";
export default defineSchema({ ...paymentTables, /* others */ });
```

```ts
// convex/http.ts
import { httpRouter } from "convex/server";
import { dokuWebhook } from "./features/payment/http";
const http = httpRouter();
http.route({ path: "/webhooks/doku", method: "POST", handler: dokuWebhook });
export default http;
```

```tsx
// app/checkout/page.tsx
export { default } from "@/features/doku-payment/components/checkout-page";
```

Set the DOKU dashboard's **Notification URL** to
`https://<your-convex-deployment>.convex.site/webhooks/doku`.

## Env

```
DOKU_CLIENT_ID=…           # convex; merchant id
DOKU_SECRET_KEY=…          # convex; HMAC secret
DOKU_IS_PRODUCTION=false   # convex; sandbox by default
DOKU_NOTIFY_PATH=/webhooks/doku   # optional; defaults to request URL path
```

```bash
npx convex env set DOKU_CLIENT_ID …
npx convex env set DOKU_SECRET_KEY …
```

No `NEXT_PUBLIC_*` — DOKU is fully server-side (the only client-facing
URL is the hosted checkout link, which we open via `window.location.href`).

## Provider extensibility

`paymentOrders.provider` is a literal union including `midtrans | doku | stripe`. Wiring a third provider (e.g. Xendit) requires:

1. `convex/features/payment/action/<provider>.ts`
2. `convex/features/payment/<provider>/{client,signature,types}.ts`
3. `frontend/slices/<provider>-payment/` slice
4. Add literal to `paymentOrders.provider` union

The webhook handler in `http.ts` already supports multiple providers via
`paymentWebhookEvents.provider` discriminator.

## Picking between Checkout vs Direct

| Use Checkout when | Use Direct when |
|---|---|
| You want all channels on one page | You want a single-channel funnel (e.g. VA-only) |
| You don't want to design payment UI | You want the instructions inline with your brand |
| Conversion > pixel-perfect | UX consistency is critical (e.g. inside app shell) |
| AI agent generates link to share via chat | User journey is fully within your site |

You can also mix — render the Direct form, but include a "Belum
yakin? Bayar via halaman DOKU" fallback that calls Checkout.

## Idempotency model

- **Outbound** — every `createCheckoutPayment`/`createDirectPayment` call
  inserts a `paymentOrders` row first. Retries with the same `orderId`
  patch the existing row instead of duplicating.
- **Inbound** — the webhook handler stores `request_id` on
  `paymentWebhookEvents` and short-circuits on duplicates via the
  `by_provider_request` index. Order status transitions are also
  idempotent: re-paying an already-paid order is a no-op.

## Reading status

Three layers, pick what fits:

1. **Reactive query** — `useQuery(api.features.payment.queries.getOrderByOrderId, { orderId })` returns live status; rerenders when webhook fires.
2. **Manual sync** — `useAction(api.features.payment.actions.doku.getPaymentStatus)` polls DOKU directly. Use as a "Cek ulang" button when the webhook is delayed.
3. **Backend events** — read `paymentWebhookEvents` to debug or build an audit page.

## Security checklist

- [x] Server key / Client-Id never reach the client
- [x] Webhook signature verified with constant-time compare
- [x] Webhook idempotency via `request_id` index
- [x] Amount validated server-side before DOKU call
- [x] Sandbox vs production gated by `DOKU_IS_PRODUCTION`
- [ ] (Your job) Rate-limit `createCheckoutPayment` per authenticated user
- [ ] (Your job) Cross-check `amount` against the persisted order

## Sources

- `docs.doku.com/integration/api/signature`
- `docs.doku.com/integration/api/notification`
- `docs.doku.com/integration/checkout`
- `docs.doku.com/integration/direct`
- `docs.doku.com/integration/mcp-server`

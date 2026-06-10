"use client";

/**
 * Demo CheckoutPage for the DOKU slice. Two modes side-by-side:
 *   - "Quick checkout" → hosted page (DOKU UI)
 *   - "Pilih sendiri"  → Direct picker (custom UI, instructions inline)
 *
 * Wire in your consumer:
 *   // app/checkout/page.tsx
 *   export { default } from "@/features/doku-payment/components/checkout-page";
 *
 * The default amount + orderId are demo placeholders; swap for your cart.
 */

import * as React from "react";
import { DokuCheckout } from "./providers/doku";
import { DokuDirectForm } from "./DokuDirectForm";
import { DokuPaymentInstructions, type PaymentInstructions } from "./DokuPaymentInstructions";

export interface CheckoutPageCopy {
  heading: string;
  subheading: string;
  quickTitle: string;
  directTitle: string;
}

const DEFAULT_COPY: CheckoutPageCopy = {
  heading: "Checkout",
  subheading: "Pick the fast hosted flow, or choose your own channel.",
  quickTitle: "Quick checkout",
  directTitle: "Choose your own channel",
};

interface CheckoutPageProps {
  amount?: number;
  orderId?: string;
  customer?: { name: string; email: string; phone?: string };
  callbackUrl?: string;
  allowedChannels?: string[];
  /** Override any subset of the English default strings (i18n). */
  copy?: Partial<CheckoutPageCopy>;
}

export default function CheckoutPage({
  amount = 150_000,
  orderId,
  customer = { name: "Demo User", email: "demo@example.com" },
  callbackUrl,
  allowedChannels,
  copy,
}: CheckoutPageProps) {
  const c = { ...DEFAULT_COPY, ...copy };
  const id = React.useMemo(() => orderId ?? `ord_${Date.now()}`, [orderId]);
  const [result, setResult] = React.useState<{
    channel: string;
    instructions: PaymentInstructions;
    expiresAt?: number;
  } | null>(null);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">{c.heading}</h1>
        <p className="text-sm text-muted-foreground">{c.subheading}</p>
      </header>

      {result ? (
        <DokuPaymentInstructions
          channel={result.channel}
          instructions={result.instructions}
          expiresAt={result.expiresAt}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {c.quickTitle}
            </h2>
            <DokuCheckout
              amount={amount}
              orderId={id}
              customer={customer}
              callbackUrl={callbackUrl}
              paymentMethods={allowedChannels}
            />
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {c.directTitle}
            </h2>
            <DokuDirectForm
              amount={amount}
              orderId={id}
              defaultCustomer={customer}
              allowedChannels={allowedChannels}
              onSuccess={(r) => setResult(r as never)}
            />
          </section>
        </div>
      )}
    </main>
  );
}

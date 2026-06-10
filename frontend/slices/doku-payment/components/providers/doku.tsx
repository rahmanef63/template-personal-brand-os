"use client";

/**
 * DOKU Checkout button — server-driven redirect to DOKU's hosted page.
 *
 * Mirror of midtrans-payment/components/providers/midtrans.tsx so a parent
 * <CheckoutPage> can route between providers without UI churn.
 *
 * Convex is NOT imported here so the slice type-checks in the resources
 * monorepo (which has no convex dep). Wire-up in your consumer:
 *
 *   "use client";
 *   import { useAction } from "convex/react";
 *   import { api } from "@/convex/_generated/api";
 *   import { DokuCheckout } from "@/features/doku-payment/components/providers/doku";
 *
 *   export default function Page() {
 *     const create = useAction(api.features.payment.actions.doku.createCheckoutPayment);
 *     return (
 *       <DokuCheckout
 *         amount={150_000}
 *         orderId={`ord_${Date.now()}`}
 *         customer={{ name, email }}
 *         onCheckout={create}
 *       />
 *     );
 *   }
 */

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatIDR } from "../../lib/format";

export interface DokuCheckoutInput {
  orderId: string;
  amount: number;
  customer: { name: string; email: string; phone?: string };
  callbackUrl?: string;
  paymentMethods?: string[];
}

export interface DokuCheckoutResult {
  checkoutUrl: string;
  token?: string;
  expiresAt?: number;
}

interface DokuCheckoutProps {
  amount: number;
  orderId: string;
  customer: { name: string; email: string; phone?: string };
  callbackUrl?: string;
  paymentMethods?: string[];
  label?: string;
  /** Pass `useAction(api.features.payment.actions.doku.createCheckoutPayment)`. */
  onCheckout?: (input: DokuCheckoutInput) => Promise<DokuCheckoutResult>;
}

export function DokuCheckout({
  amount,
  orderId,
  customer,
  callbackUrl,
  paymentMethods,
  label = "Bayar dengan DOKU",
  onCheckout,
}: DokuCheckoutProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleClick() {
    if (!onCheckout) {
      alert(`(stub) DOKU Checkout would open for ${formatIDR(amount)} (${orderId})`);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await onCheckout({
        orderId,
        amount,
        customer,
        callbackUrl,
        paymentMethods,
      });
      if (!res?.checkoutUrl) throw new Error("No checkout URL returned");
      window.location.href = res.checkoutUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout gagal");
      setLoading(false);
    }
  }

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="text-sm text-muted-foreground">Order {orderId}</div>
      <div className="text-2xl font-semibold">{formatIDR(amount)}</div>
      <Button onClick={handleClick} disabled={loading}>
        {loading ? "Memproses…" : label}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </Card>
  );
}

"use client";

/**
 * Guest checkout — composes the storefront-checkout cart with the
 * doku-payment slice. Flow:
 *
 *   cart (client) → placeOrder action (re-prices server-side, creates the
 *   pbOrders row + DOKU Direct payment) → redirect to /order/[id]
 *   (persistent tracking page: instructions + reactive paid status).
 *
 * Without DOKU credentials the action returns { ok:false, notice } and the
 * form surfaces it — the page never crashes on demo/fresh clones.
 */

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { CheckoutSummary, useCart } from "@/features/storefront-checkout";
import { DokuDirectForm, type PaymentInstructions } from "@/features/doku-payment";
import { PUBLIC_BASE } from "@/features/_app/nav-config";

export function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const placeOrder = useAction(api.checkout.placeOrder);
  const router = useRouter();
  const [redirecting, setRedirecting] = React.useState(false);

  if (items.length === 0 && !redirecting) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Keranjang kosong</h1>
        <p className="text-sm text-muted-foreground">
          Pilih layanan dari halaman services dulu, lalu kembali ke sini untuk membayar.
        </p>
        <Button asChild>
          <Link href={`${PUBLIC_BASE}/services`}>Lihat layanan</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Checkout</h1>
      <div className="grid items-start gap-6 md:grid-cols-[1fr_1.2fr]">
        <CheckoutSummary />
        <div className="space-y-3">
          <DokuDirectForm
            amount={subtotal}
            onSubmit={async (input) => {
              const res = await placeOrder({
                items: items.map((i) => ({ slug: i.slug, qty: i.qty })),
                customer: input.customer,
                channel: input.channel,
              });
              if (!res.ok) throw new Error(res.notice);
              return {
                orderId: res.orderId,
                instructions: res.instructions as PaymentInstructions,
                expiresAt: res.expiresAt,
              };
            }}
            onSuccess={(r) => {
              if (!r.orderId) return;
              setRedirecting(true);
              clear();
              router.push(`${PUBLIC_BASE}/order/${r.orderId}`);
            }}
          />
          <p className="text-xs text-muted-foreground">
            Pembayaran online belum aktif? Hubungi via{" "}
            <Link className="underline underline-offset-2" href={`${PUBLIC_BASE}/about`}>
              halaman about
            </Link>{" "}
            — kami balas cepat.
          </p>
        </div>
      </div>
    </div>
  );
}

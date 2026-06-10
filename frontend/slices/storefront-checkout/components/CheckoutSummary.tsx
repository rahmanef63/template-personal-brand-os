"use client";

/** Order summary panel for the checkout page — reads the cart context. */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatIDR, useCart } from "../lib/cart";

export function CheckoutSummary({ title = "Ringkasan pesanan" }: { title?: string }) {
  const { items, subtotal } = useCart();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.slug} className="flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 truncate">
                {item.emoji && <span aria-hidden className="mr-1.5">{item.emoji}</span>}
                {item.name}
                <span className="ml-1 text-muted-foreground">× {item.qty}</span>
              </span>
              <span className="tabular-nums">{formatIDR(item.price * item.qty)}</span>
            </li>
          ))}
        </ul>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-lg font-semibold tabular-nums">{formatIDR(subtotal)}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Total final dihitung ulang di server saat pembayaran dibuat.
        </p>
      </CardContent>
    </Card>
  );
}

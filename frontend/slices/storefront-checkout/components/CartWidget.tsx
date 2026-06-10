"use client";

/**
 * Cart trigger button (icon + count badge) + slide-over sheet listing the
 * cart contents with qty steppers. The checkout CTA navigates to the
 * host-provided `checkoutHref`.
 */

import * as React from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatIDR, useCart } from "../lib/cart";

export function CartWidget({ checkoutHref = "/checkout" }: { checkoutHref?: string }) {
  const { items, count, subtotal, setQty, remove } = useCart();
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Keranjang (${count} item)`} className="relative">
          <ShoppingCart className="size-4" />
          {count > 0 && (
            <Badge
              variant="default"
              className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full px-1 text-[10px] leading-none"
            >
              {count > 99 ? "99+" : count}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Keranjang</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <p className="flex-1 px-4 text-sm text-muted-foreground">
            Keranjang masih kosong. Tambahkan produk dari katalog.
          </p>
        ) : (
          <ul className="flex-1 space-y-4 overflow-y-auto px-4">
            {items.map((item) => (
              <li key={item.slug} className="flex items-start gap-3">
                {item.emoji && (
                  <span aria-hidden className="text-2xl leading-none">
                    {item.emoji}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.priceLabel}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-6"
                      aria-label={`Kurangi ${item.name}`}
                      onClick={() => setQty(item.slug, item.qty - 1)}
                    >
                      <Minus className="size-3" />
                    </Button>
                    <span className="w-7 text-center text-sm tabular-nums">{item.qty}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-6"
                      aria-label={`Tambah ${item.name}`}
                      onClick={() => setQty(item.slug, item.qty + 1)}
                    >
                      <Plus className="size-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 text-muted-foreground"
                      aria-label={`Hapus ${item.name}`}
                      onClick={() => remove(item.slug)}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </div>
                <span className="text-sm font-medium tabular-nums">
                  {formatIDR(item.price * item.qty)}
                </span>
              </li>
            ))}
          </ul>
        )}

        <SheetFooter className="mt-auto">
          <div className="w-full space-y-3">
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-base font-semibold tabular-nums">{formatIDR(subtotal)}</span>
            </div>
            <Button asChild className="w-full" disabled={items.length === 0}>
              <Link href={checkoutHref} onClick={() => setOpen(false)}>
                Lanjut ke pembayaran
              </Link>
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

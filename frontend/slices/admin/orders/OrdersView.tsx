"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { ShoppingCart } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Read-only admin order list (guest checkout). Orders are created by the
 * public checkout flow (convex/checkout.ts placeOrder); payment status flips
 * via the DOKU webhook. Fulfilment CRUD is intentionally out of scope —
 * track per-order detail on the public /order/[id] page (orderId link).
 */

const PAYMENT_BADGE: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  paid: { label: "Lunas", variant: "default" },
  pending: { label: "Menunggu bayar", variant: "secondary" },
  expired: { label: "Kedaluwarsa", variant: "destructive" },
  failed: { label: "Gagal", variant: "destructive" },
};

function fmtDate(ts: number) {
  return new Date(ts).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

export function OrdersView() {
  const orders = useQuery(api.orders.list, {});

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ShoppingCart className="size-5" />
        <h1 className="text-lg font-semibold tracking-tight">Orders</h1>
        {orders && orders.length > 0 && (
          <Badge variant="secondary">{orders.length}</Badge>
        )}
      </div>

      {orders === undefined ? (
        <p className="text-sm text-muted-foreground">Memuat order…</p>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Belum ada order. Order masuk dari halaman pricing publik
            (checkout paket berlangsung di /checkout).
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => {
            const pay = o.paymentStatus ? PAYMENT_BADGE[o.paymentStatus] ?? { label: o.paymentStatus, variant: "outline" as const } : null;
            return (
              <Card key={o.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <Link href={`/order/${o.orderId}`} className="font-mono text-xs hover:underline" target="_blank">
                      {o.orderId}
                    </Link>
                    <span className="flex items-center gap-2">
                      {pay && <Badge variant={pay.variant}>{pay.label}</Badge>}
                      <Badge variant="outline">{o.status}</Badge>
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">{o.buyer.name}</span>{" "}
                    <span className="text-muted-foreground">· {o.buyer.email}{o.buyer.phone ? ` · ${o.buyer.phone}` : ""}</span>
                  </p>
                  <p className="text-muted-foreground">
                    {o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="font-semibold tabular-nums">{o.totalLabel}</span>
                    <span className="text-xs text-muted-foreground">{fmtDate(o.ts)}</span>
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

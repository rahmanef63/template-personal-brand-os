"use client";

/**
 * Public order tracking — /order/[id]. The unguessable orderId is the
 * capability token (shared via the post-checkout redirect). Reactive:
 * payment instructions show while pending; the page flips to "paid" the
 * moment the DOKU webhook lands, then walks the fulfilment steps.
 */

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, Clock } from "lucide-react";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  DokuPaymentInstructions,
  DokuStatusBadge,
  type DokuStatus,
  type PaymentInstructions,
} from "@/features/doku-payment";
import { PUBLIC_BASE } from "@/features/_app/nav-config";

const FULFILMENT_STEPS = [
  { key: "new", label: "Diterima" },
  { key: "processing", label: "Diproses" },
  { key: "shipped", label: "Dikirim" },
  { key: "delivered", label: "Selesai" },
] as const;

export function OrderTrackingPage({ orderId }: { orderId: string }) {
  const order = useQuery(api.checkout.trackOrder, { orderId });
  const resyncStatus = useAction(api.features.payment.actions.doku.getPaymentStatus);

  if (order === undefined) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center text-sm text-muted-foreground">
        Memuat pesanan…
      </div>
    );
  }

  if (order === null) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Pesanan tidak ditemukan</h1>
        <p className="text-sm text-muted-foreground">
          Periksa kembali tautan pesananmu, atau hubungi kami via halaman about.
        </p>
        <Button asChild variant="outline">
          <Link href={`${PUBLIC_BASE}/services`}>
            <ArrowLeft className="size-4" /> Kembali ke services
          </Link>
        </Button>
      </div>
    );
  }

  const paid = order.payment?.status === "paid";
  const stepIndex = FULFILMENT_STEPS.findIndex((s) => s.key === order.status);
  const cancelled = order.status === "cancelled";

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-6 py-12">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Lacak pesanan</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="font-mono">{order.orderId}</span>
          {order.payment && (
            <DokuStatusBadge
              status={order.payment.status as DokuStatus}
              onResync={async () => {
                await resyncStatus({ orderId });
              }}
            />
          )}
          {cancelled && <Badge variant="destructive">Dibatalkan</Badge>}
        </div>
        <p className="text-xs text-muted-foreground">
          Simpan tautan halaman ini untuk memantau status pesananmu.
        </p>
      </header>

      {!paid && order.payment?.status === "pending" && order.payment.instructions ? (
        <DokuPaymentInstructions
          channel={order.payment.channel ?? "QRIS"}
          instructions={order.payment.instructions as PaymentInstructions}
          expiresAt={order.payment.expiresAt ?? undefined}
        />
      ) : null}

      {!cancelled && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {FULFILMENT_STEPS.map((step, i) => {
                const reached = i <= stepIndex;
                const current = i === stepIndex;
                return (
                  <li key={step.key} className="flex items-center gap-3 text-sm">
                    {reached ? (
                      <CheckCircle2 className={`size-4 ${current ? "text-primary" : "text-muted-foreground"}`} />
                    ) : (
                      <Circle className="size-4 text-muted-foreground/40" />
                    )}
                    <span className={reached ? "" : "text-muted-foreground/60"}>{step.label}</span>
                    {current && !paid && step.key === "new" && (
                      <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3" /> menunggu pembayaran
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rincian pesanan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ul className="space-y-2">
            {order.items.map((item, i) => (
              <li key={i} className="flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0 truncate">
                  {item.name}
                  <span className="ml-1 text-muted-foreground">× {item.qty}</span>
                </span>
                <span className="tabular-nums text-muted-foreground">{item.priceLabel}</span>
              </li>
            ))}
          </ul>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-lg font-semibold tabular-nums">{order.totalLabel}</span>
          </div>
          {order.buyerName && (
            <p className="text-xs text-muted-foreground">Pemesan: {order.buyerName}</p>
          )}
        </CardContent>
      </Card>

      <Button asChild variant="outline" size="sm">
        <Link href={`${PUBLIC_BASE}/services`}>
          <ArrowLeft className="size-4" /> Lihat layanan lain
        </Link>
      </Button>
    </div>
  );
}

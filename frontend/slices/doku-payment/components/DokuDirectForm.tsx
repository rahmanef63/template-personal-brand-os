"use client";

/**
 * Channel picker + minimal form for DOKU Direct.
 *
 * Convex-agnostic: caller passes `onSubmit` (typically wired to
 * `useAction(api.features.payment.actions.doku.createDirectPayment)` or a
 * server-side place-order action that creates the orderId itself).
 *
 * `orderId` is OPTIONAL — server-generated-orderId flows (guest checkout)
 * omit it; the submit handler then returns the generated id via
 * `DokuDirectResult.orderId`.
 */

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DOKU_CHANNELS, GROUP_LABELS, type ChannelGroup } from "../lib/channels";
import { formatIDR } from "../lib/format";
import type { PaymentInstructions } from "./DokuPaymentInstructions";

export interface DokuDirectInput {
  orderId?: string;
  amount: number;
  channel: string;
  customer: { name: string; email: string; phone?: string };
}

export interface DokuDirectResult {
  /** Present when the submit handler generated the order id server-side. */
  orderId?: string;
  instructions: PaymentInstructions;
  expiresAt?: number;
}

interface DokuDirectFormProps {
  amount: number;
  orderId?: string;
  defaultCustomer?: { name?: string; email?: string; phone?: string };
  allowedChannels?: string[];
  /** Pass `useAction(api.features.payment.actions.doku.createDirectPayment)`. */
  onSubmit?: (input: DokuDirectInput) => Promise<DokuDirectResult>;
  onSuccess?: (result: {
    orderId?: string;
    channel: string;
    instructions: PaymentInstructions;
    expiresAt?: number;
  }) => void;
}

export function DokuDirectForm({
  amount,
  orderId,
  defaultCustomer,
  allowedChannels,
  onSubmit,
  onSuccess,
}: DokuDirectFormProps) {
  const [channel, setChannel] = React.useState<string>("QRIS");
  const [name, setName] = React.useState(defaultCustomer?.name ?? "");
  const [email, setEmail] = React.useState(defaultCustomer?.email ?? "");
  const [phone, setPhone] = React.useState(defaultCustomer?.phone ?? "");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const channels = React.useMemo(() => {
    const filtered = allowedChannels
      ? DOKU_CHANNELS.filter((c) => allowedChannels.includes(c.id))
      : DOKU_CHANNELS;
    const groups: Record<ChannelGroup, typeof DOKU_CHANNELS> = {
      va: [],
      qris: [],
      ewallet: [],
      card: [],
      paylater: [],
      retail: [],
    };
    for (const c of filtered) groups[c.group] = [...groups[c.group], c];
    return groups;
  }, [allowedChannels]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!onSubmit) {
      alert(`(stub) DOKU Direct for ${channel} ${formatIDR(amount)}`);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await onSubmit({
        orderId,
        amount,
        channel,
        customer: { name, email, phone: phone || undefined },
      });
      onSuccess?.({
        orderId: res.orderId ?? orderId,
        channel,
        instructions: res.instructions,
        expiresAt: res.expiresAt,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat pembayaran");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="flex flex-col gap-4 p-4">
      <header className="flex items-baseline justify-between">
        <div>
          {orderId && <div className="text-sm text-muted-foreground">Order {orderId}</div>}
          <div className="text-2xl font-semibold">{formatIDR(amount)}</div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="doku-name">Nama</Label>
            <Input id="doku-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="doku-email">Email</Label>
            <Input id="doku-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="doku-phone">Nomor HP (opsional)</Label>
            <Input id="doku-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="doku-channel">Metode pembayaran</Label>
          <Select value={channel} onValueChange={setChannel}>
            <SelectTrigger id="doku-channel" className="w-full">
              <SelectValue placeholder="Pilih metode" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(channels) as ChannelGroup[]).map((g) =>
                channels[g].length > 0 ? (
                  <SelectGroup key={g}>
                    <SelectLabel>{GROUP_LABELS[g]}</SelectLabel>
                    {channels[g].map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ) : null,
              )}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Memproses…" : "Lanjut Bayar"}
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </form>
    </Card>
  );
}

"use client";

/**
 * Renders post-creation payment instructions:
 *  - VA → big monospace number + copy button + "cara bayar" link
 *  - QRIS → render QR (image url OR data: string) + scan hint
 *  - e-Wallet → deep link button (mobile) + web URL fallback
 *  - PayLater / retail → simple "Lanjut ke pembayaran" link
 *
 * Shape mirrors what `actions/doku.ts:extractInstructions` returns.
 */

import * as React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { groupVa, timeLeft } from "../lib/format";
import { CHANNEL_BY_ID } from "../lib/channels";

export interface PaymentInstructions {
  vaNumber?: string;
  howToPayUrl?: string;
  qrString?: string;
  qrImageUrl?: string;
  deeplink?: string;
  webUrl?: string;
  paymentUrl?: string;
}

interface Props {
  channel: string;
  instructions: PaymentInstructions;
  expiresAt?: number;
}

export function DokuPaymentInstructions({ channel, instructions, expiresAt }: Props) {
  const meta = CHANNEL_BY_ID.get(channel);
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    if (!expiresAt) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const left = timeLeft(expiresAt);

  return (
    <Card className="flex flex-col gap-4 p-4">
      <header className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Bayar via
          </div>
          <div className="text-lg font-semibold">{meta?.label ?? channel}</div>
        </div>
        {left && (
          <div className="text-xs text-muted-foreground" data-tick={tick}>
            Berlaku {left}
          </div>
        )}
      </header>

      {instructions.vaNumber && (
        <VirtualAccountBlock va={instructions.vaNumber} howTo={instructions.howToPayUrl} />
      )}
      {(instructions.qrImageUrl || instructions.qrString) && (
        <QrisBlock imageUrl={instructions.qrImageUrl} qrString={instructions.qrString} />
      )}
      {(instructions.deeplink || instructions.webUrl) && (
        <EwalletBlock deeplink={instructions.deeplink} webUrl={instructions.webUrl} />
      )}
      {instructions.paymentUrl && !instructions.deeplink && !instructions.vaNumber && (
        <a
          href={instructions.paymentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Lanjut ke halaman pembayaran →
        </a>
      )}

      {meta?.hint && <p className="text-xs text-muted-foreground">{meta.hint}</p>}
    </Card>
  );
}

function VirtualAccountBlock({ va, howTo }: { va: string; howTo?: string }) {
  const [copied, setCopied] = React.useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(va);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // noop
    }
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-md bg-muted p-3 font-mono text-lg tracking-wider">
        {groupVa(va)}
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" variant="secondary" onClick={copy}>
          {copied ? "Tersalin ✓" : "Salin nomor VA"}
        </Button>
        {howTo && (
          <a
            href={howTo}
            target="_blank"
            rel="noreferrer"
            className="text-sm underline text-muted-foreground"
          >
            Cara bayar
          </a>
        )}
      </div>
    </div>
  );
}

function QrisBlock({ imageUrl, qrString }: { imageUrl?: string; qrString?: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="QRIS"
          width={224}
          height={224}
          unoptimized
          className="h-56 w-56 rounded-md border"
        />
      ) : (
        <pre className="max-w-full overflow-x-auto rounded-md border bg-muted p-3 text-[10px]">
          {qrString}
        </pre>
      )}
      <p className="text-xs text-muted-foreground">
        Scan dengan aplikasi e-wallet atau mobile banking apa pun.
      </p>
    </div>
  );
}

function EwalletBlock({ deeplink, webUrl }: { deeplink?: string; webUrl?: string }) {
  return (
    <div className="flex flex-col gap-2">
      {deeplink && (
        <Button asChild>
          <a href={deeplink} target="_blank" rel="noopener noreferrer">
            Buka aplikasi e-Wallet
          </a>
        </Button>
      )}
      {webUrl && (
        <Button asChild variant="secondary">
          <a href={webUrl} target="_blank" rel="noreferrer">
            Bayar di browser
          </a>
        </Button>
      )}
    </div>
  );
}

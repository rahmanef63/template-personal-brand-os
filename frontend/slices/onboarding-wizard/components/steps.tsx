"use client";

// Step bodies for OnboardingWizard (Identity / Content / Done) — split out
// to keep each file ≤200 lines. Branding lives in step-branding.tsx.

import * as React from "react";
import { Check, Download, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { OnboardingFields } from "../lib/types";

export type SetField = (k: keyof OnboardingFields, v: string) => void;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function StepIdentity({ f, set }: { f: OnboardingFields; set: SetField }) {
  const emailInvalid = f.contactEmail.length > 0 && !EMAIL_RE.test(f.contactEmail);
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Identitas situs</h1>
        <p className="text-sm text-muted-foreground">Bisa diganti kapan saja.</p>
      </div>
      <Field label="Nama situs / brand">
        <Input value={f.siteName} onChange={(e) => set("siteName", e.target.value)} placeholder="mis. Studio Saya" />
      </Field>
      <Field label="Tagline">
        <Input value={f.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="Satu kalimat tentang kamu" />
      </Field>
      <Field label="Nama pemilik">
        <Input value={f.ownerName} onChange={(e) => set("ownerName", e.target.value)} placeholder="Nama kamu" />
      </Field>
      <Field label="Email kontak">
        <Input
          type="email"
          value={f.contactEmail}
          onChange={(e) => set("contactEmail", e.target.value)}
          placeholder="halo@situ.kamu"
          aria-invalid={emailInvalid || undefined}
        />
        {emailInvalid && (
          <p className="text-xs text-destructive">Format email belum valid.</p>
        )}
      </Field>
    </div>
  );
}

export function StepContent({
  alreadySeeded,
  busy,
  onSeed,
  onExport,
  onImport,
  backupBusy,
  backupMessage,
}: {
  alreadySeeded: boolean;
  busy: boolean;
  onSeed: () => void;
  onExport?: () => void;
  onImport?: () => void;
  backupBusy?: "export" | "import" | null;
  backupMessage?: string | null;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Konten awal</h1>
        <p className="text-sm text-muted-foreground">Mulai dengan contoh, atau mulai kosong.</p>
      </div>
      <div className="rounded-lg border border-border/60 p-4">
        {alreadySeeded ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="size-4 text-primary" /> Konten sudah terisi.
          </p>
        ) : (
          <>
            <p className="mb-3 text-sm text-muted-foreground">
              Isi blog, portfolio, layanan, dan halaman depan dengan contoh biar langsung kelihatan.
            </p>
            <Button type="button" onClick={onSeed} disabled={busy} className="w-full">
              {busy ? <Loader2 className="size-4 animate-spin" /> : "Isi konten contoh"}
            </Button>
          </>
        )}
      </div>
      {onExport || onImport ? (
        <div className="rounded-lg border border-border/60 p-4">
          <p className="mb-3 text-sm text-muted-foreground">
            Punya backup JSON? Import untuk melanjutkan dari data lama, atau download data saat ini.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button type="button" variant="outline" onClick={onExport} disabled={busy || !onExport}>
              {backupBusy === "export" ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
              Download JSON
            </Button>
            <Button type="button" variant="outline" onClick={onImport} disabled={busy || !onImport}>
              {backupBusy === "import" ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
              Import JSON
            </Button>
          </div>
          {backupMessage ? (
            <p className="mt-3 text-xs text-muted-foreground">{backupMessage}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function StepDone({ siteName }: { siteName: string }) {
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold tracking-tight">Siap!</h1>
      <p className="text-sm text-muted-foreground">
        {siteName ? <><b>{siteName}</b> siap dikelola. </> : null}
        Klik selesai untuk masuk dashboard. Semua ini bisa kamu ubah lagi di menu Settings.
      </p>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

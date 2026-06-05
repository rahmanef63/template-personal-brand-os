"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { ArrowLeft, ArrowRight, Check, ExternalLink, Loader2, Sparkles } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ImageField } from "@/components/image-field";
import { useThemePreset } from "@/features/theme-presets";

type Fields = {
  siteName: string;
  tagline: string;
  ownerName: string;
  contactEmail: string;
  brandColor: string;
  themeDefault: string;
  themePreset: string;
  logoUrl: string;
  faviconUrl: string;
  analyticsId: string;
};

const STEPS = ["Identitas", "Branding", "Konten", "Selesai"];

/**
 * Post-claim onboarding wizard. Stores ALL site config in Convex (editable later
 * in admin Settings) so a non-coder configures their site with zero code. Shown
 * once (until siteSettings.onboardedAt is set). Skippable.
 */
export function OnboardingWizard({ onDone }: { onDone: () => void }) {
  const upsert = useMutation(api.settings.upsert);
  const seedSample = useMutation(api.seed.seedSample);
  const status = useQuery(api.setup.status);
  const { registry, preview } = useThemePreset();
  const [step, setStep] = React.useState(0);
  const [busy, setBusy] = React.useState(false);
  const [seeded, setSeeded] = React.useState(false);
  const [f, setF] = React.useState<Fields>({
    siteName: "",
    tagline: "",
    ownerName: "",
    contactEmail: "",
    brandColor: "#c4583a",
    themeDefault: "system",
    themePreset: "",
    logoUrl: "",
    faviconUrl: "",
    analyticsId: "",
  });
  const set = (k: keyof Fields, v: string) => setF((p) => ({ ...p, [k]: v }));
  const alreadySeeded = seeded || status?.seeded;

  async function finish(skip = false) {
    setBusy(true);
    try {
      await upsert({
        siteName: f.siteName || undefined,
        tagline: f.tagline || undefined,
        ownerName: f.ownerName || undefined,
        contactEmail: f.contactEmail || undefined,
        brandColor: f.brandColor || undefined,
        themeDefault: f.themeDefault || undefined,
        themePreset: f.themePreset || undefined,
        logoUrl: f.logoUrl || undefined,
        faviconUrl: f.faviconUrl || undefined,
        analyticsId: f.analyticsId || undefined,
        markOnboarded: true,
      });
      onDone();
    } finally {
      setBusy(false);
    }
  }

  async function doSeed() {
    setBusy(true);
    try {
      await seedSample();
      setSeeded(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background px-6 py-10">
      <Card className="w-full max-w-lg border-border/60 shadow-[var(--shadow-lift)]">
        <CardContent className="p-7">
          <div className="mb-1 flex items-center gap-2 text-brand">
            <Sparkles className="size-4" />
            <span className="text-xs font-medium uppercase tracking-[0.2em]">
              Setup · {step + 1}/{STEPS.length}
            </span>
          </div>
          <Progress value={((step + 1) / STEPS.length) * 100} className="mb-5 mt-2 h-1.5" />

          {step === 0 && (
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
                <Input type="email" value={f.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} placeholder="halo@situ.kamu" />
              </Field>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h1 className="text-xl font-semibold tracking-tight">Branding</h1>
                <p className="text-sm text-muted-foreground">Logo, favicon, warna — semua tersimpan di situs kamu.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Logo">
                  {f.logoUrl ? <img src={f.logoUrl} alt="logo" className="mb-2 h-10 rounded object-contain" /> : null}
                  <ImageField label="Upload logo" onUploaded={(u) => set("logoUrl", u)} />
                </Field>
                <Field label="Favicon">
                  {f.faviconUrl ? <img src={f.faviconUrl} alt="favicon" className="mb-2 size-8 rounded object-contain" /> : null}
                  <ImageField label="Upload favicon" onUploaded={(u) => set("faviconUrl", u)} />
                </Field>
              </div>
              <Field label="Warna brand">
                <div className="flex items-center gap-2">
                  <Input type="color" value={f.brandColor} onChange={(e) => set("brandColor", e.target.value)} className="h-10 w-16 p-1" />
                  <Input value={f.brandColor} onChange={(e) => set("brandColor", e.target.value)} className="flex-1" />
                </div>
              </Field>
              <Field label="Tema default">
                <div className="flex gap-2">
                  {["light", "dark", "system"].map((t) => (
                    <Button key={t} type="button" variant={f.themeDefault === t ? "default" : "outline"} size="sm" className="flex-1" onClick={() => set("themeDefault", t)}>
                      {t === "light" ? "Terang" : t === "dark" ? "Gelap" : "Sistem"}
                    </Button>
                  ))}
                </div>
              </Field>
              <Field label="Preset warna situs">
                <select
                  value={f.themePreset}
                  onChange={(e) => {
                    set("themePreset", e.target.value);
                    void preview(e.target.value || null);
                  }}
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <option value="">Bawaan template (cosmic-night)</option>
                  {(registry?.items ?? []).map((p) => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Google Analytics ID (opsional)">
                <div className="flex items-center gap-2">
                  <Input value={f.analyticsId} onChange={(e) => set("analyticsId", e.target.value)} placeholder="G-XXXXXXX" className="flex-1" />
                  <a href="https://analytics.google.com/analytics/web/" target="_blank" rel="noopener noreferrer">
                    <Button type="button" variant="outline" size="sm" className="gap-1 whitespace-nowrap">
                      Dapatkan <ExternalLink className="size-3" />
                    </Button>
                  </a>
                </div>
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h1 className="text-xl font-semibold tracking-tight">Konten awal</h1>
                <p className="text-sm text-muted-foreground">Mulai dengan contoh, atau mulai kosong.</p>
              </div>
              <div className="rounded-lg border border-border/60 p-4">
                {alreadySeeded ? (
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="size-4 text-brand" /> Konten contoh sudah terisi.
                  </p>
                ) : (
                  <>
                    <p className="mb-3 text-sm text-muted-foreground">
                      Isi blog, portfolio, layanan, dan halaman depan dengan contoh biar langsung kelihatan.
                    </p>
                    <Button type="button" onClick={doSeed} disabled={busy} className="w-full">
                      {busy ? <Loader2 className="size-4 animate-spin" /> : "Isi konten contoh"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <h1 className="text-xl font-semibold tracking-tight">Siap!</h1>
              <p className="text-sm text-muted-foreground">
                {f.siteName ? <><b>{f.siteName}</b> siap dikelola. </> : null}
                Klik selesai untuk masuk dashboard. Semua ini bisa kamu ubah lagi di menu Settings.
              </p>
            </div>
          )}

          <div className="mt-7 flex items-center justify-between gap-3">
            {step > 0 ? (
              <Button type="button" variant="ghost" size="sm" onClick={() => setStep((s) => s - 1)} disabled={busy}>
                <ArrowLeft className="size-4" /> Kembali
              </Button>
            ) : (
              <button type="button" onClick={() => finish(true)} disabled={busy} className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                Lewati setup
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={() => setStep((s) => s + 1)} disabled={busy}>
                Lanjut <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button type="button" onClick={() => finish(false)} disabled={busy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : "Selesai"} <Check className="size-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

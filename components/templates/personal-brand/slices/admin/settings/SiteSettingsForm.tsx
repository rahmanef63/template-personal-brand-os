"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ConvexImageUpload } from "@/components/templates/_shared/ui/convex-image-upload";

type Form = {
  siteName: string;
  tagline: string;
  ownerName: string;
  contactEmail: string;
  brandColor: string;
  themeDefault: string;
  analyticsId: string;
  logoUrl: string;
  faviconUrl: string;
};

const EMPTY: Form = {
  siteName: "",
  tagline: "",
  ownerName: "",
  contactEmail: "",
  brandColor: "",
  themeDefault: "system",
  analyticsId: "",
  logoUrl: "",
  faviconUrl: "",
};

/** Real editor for the Convex `siteSettings` singleton — the SAME row the
 *  onboarding wizard writes. Reads current values (so what you entered at
 *  setup shows here) and saves changes. */
export function SiteSettingsForm() {
  const settings = useQuery(api.settings.get);
  const upsert = useMutation(api.settings.upsert);
  const [f, setF] = React.useState<Form>(EMPTY);
  const [hydrated, setHydrated] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const set = (k: keyof Form, v: string) => setF((p) => ({ ...p, [k]: v }));

  React.useEffect(() => {
    if (settings === undefined || hydrated) return;
    setF({
      siteName: settings?.siteName ?? "",
      tagline: settings?.tagline ?? "",
      ownerName: settings?.ownerName ?? "",
      contactEmail: settings?.contactEmail ?? "",
      brandColor: settings?.brandColor ?? "",
      themeDefault: settings?.themeDefault ?? "system",
      analyticsId: settings?.analyticsId ?? "",
      logoUrl: settings?.logoUrl ?? "",
      faviconUrl: settings?.faviconUrl ?? "",
    });
    setHydrated(true);
  }, [settings, hydrated]);

  async function save() {
    setBusy(true);
    try {
      await upsert({
        siteName: f.siteName || undefined,
        tagline: f.tagline || undefined,
        ownerName: f.ownerName || undefined,
        contactEmail: f.contactEmail || undefined,
        brandColor: f.brandColor || undefined,
        themeDefault: f.themeDefault || undefined,
        analyticsId: f.analyticsId || undefined,
        logoUrl: f.logoUrl || undefined,
        faviconUrl: f.faviconUrl || undefined,
      });
      toast.success("Pengaturan situs tersimpan.");
    } catch {
      toast.error("Gagal menyimpan.");
    } finally {
      setBusy(false);
    }
  }

  if (settings === undefined) {
    return (
      <Card className="border-border/60">
        <CardContent className="grid h-40 place-items-center">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60">
      <CardContent className="space-y-4 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nama situs / brand">
            <Input value={f.siteName} onChange={(e) => set("siteName", e.target.value)} />
          </Field>
          <Field label="Tagline">
            <Input value={f.tagline} onChange={(e) => set("tagline", e.target.value)} />
          </Field>
          <Field label="Nama pemilik">
            <Input value={f.ownerName} onChange={(e) => set("ownerName", e.target.value)} />
          </Field>
          <Field label="Email kontak">
            <Input type="email" value={f.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} />
          </Field>
          <Field label="Warna brand">
            <div className="flex items-center gap-2">
              <Input type="color" value={f.brandColor || "#c4583a"} onChange={(e) => set("brandColor", e.target.value)} className="h-10 w-14 p-1" />
              <Input value={f.brandColor} onChange={(e) => set("brandColor", e.target.value)} placeholder="#c4583a" />
            </div>
          </Field>
          <Field label="Google Analytics ID">
            <Input value={f.analyticsId} onChange={(e) => set("analyticsId", e.target.value)} placeholder="G-XXXXXXX" />
          </Field>
          <Field label="Logo">
            {f.logoUrl ? <img src={f.logoUrl} alt="logo" className="mb-2 h-9 rounded object-contain" /> : null}
            <ConvexImageUpload label="Ganti logo" onUploaded={(u) => set("logoUrl", u)} />
          </Field>
          <Field label="Favicon">
            {f.faviconUrl ? <img src={f.faviconUrl} alt="favicon" className="mb-2 size-8 rounded object-contain" /> : null}
            <ConvexImageUpload label="Ganti favicon" onUploaded={(u) => set("faviconUrl", u)} />
          </Field>
        </div>
        <div className="flex justify-end">
          <Button onClick={save} disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : "Simpan"}
          </Button>
        </div>
      </CardContent>
    </Card>
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

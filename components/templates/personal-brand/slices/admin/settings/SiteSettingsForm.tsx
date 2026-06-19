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
import { Textarea } from "@/components/ui/textarea";
import { ImageField } from "@/components/image-field";
import { parseSocials } from "@/components/templates/_shared/ui/site-footer";

type Form = {
  siteName: string;
  tagline: string;
  ownerName: string;
  ownerRole: string;
  ownerInitials: string;
  profileImageUrl: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  brandColor: string;
  themeDefault: string;
  analyticsId: string;
  seoDescription: string;
  logoUrl: string;
  faviconUrl: string;
  socialX: string;
  socialLinkedin: string;
  socialGithub: string;
  socialYoutube: string;
};

const EMPTY: Form = {
  siteName: "",
  tagline: "",
  ownerName: "",
  ownerRole: "",
  ownerInitials: "",
  profileImageUrl: "",
  contactEmail: "",
  contactPhone: "",
  contactAddress: "",
  brandColor: "",
  themeDefault: "system",
  analyticsId: "",
  seoDescription: "",
  logoUrl: "",
  faviconUrl: "",
  socialX: "",
  socialLinkedin: "",
  socialGithub: "",
  socialYoutube: "",
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
    const sc = parseSocials(settings?.socials);
    setF({
      siteName: settings?.siteName ?? "",
      tagline: settings?.tagline ?? "",
      ownerName: settings?.ownerName ?? "",
      ownerRole: settings?.ownerRole ?? "",
      ownerInitials: settings?.ownerInitials ?? "",
      profileImageUrl: settings?.profileImageUrl ?? "",
      contactEmail: settings?.contactEmail ?? "",
      contactPhone: settings?.contactPhone ?? "",
      contactAddress: settings?.contactAddress ?? "",
      brandColor: settings?.brandColor ?? "",
      themeDefault: settings?.themeDefault ?? "system",
      analyticsId: settings?.analyticsId ?? "",
      seoDescription: settings?.seoDescription ?? "",
      logoUrl: settings?.logoUrl ?? "",
      faviconUrl: settings?.faviconUrl ?? "",
      socialX: sc.x ?? "",
      socialLinkedin: sc.linkedin ?? "",
      socialGithub: sc.github ?? "",
      socialYoutube: sc.youtube ?? "",
    });
    setHydrated(true);
  }, [settings, hydrated]);

  async function save() {
    setBusy(true);
    try {
      const socialsMap = Object.fromEntries(
        ([["x", f.socialX], ["linkedin", f.socialLinkedin], ["github", f.socialGithub], ["youtube", f.socialYoutube]] as const)
          .filter(([, v]) => v.trim()),
      );
      await upsert({
        socials: Object.keys(socialsMap).length ? JSON.stringify(socialsMap) : undefined,
        siteName: f.siteName || undefined,
        tagline: f.tagline || undefined,
        ownerName: f.ownerName || undefined,
        ownerRole: f.ownerRole || undefined,
        ownerInitials: f.ownerInitials || undefined,
        profileImageUrl: f.profileImageUrl || undefined,
        contactEmail: f.contactEmail || undefined,
        contactPhone: f.contactPhone || undefined,
        contactAddress: f.contactAddress || undefined,
        brandColor: f.brandColor || undefined,
        themeDefault: f.themeDefault || undefined,
        analyticsId: f.analyticsId || undefined,
        seoDescription: f.seoDescription || undefined,
        logoUrl: f.logoUrl || undefined,
        faviconUrl: f.faviconUrl || undefined,
      });
      toast.success("Profile tersimpan.");
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
          <Field label="Peran / headline pendek">
            <Input value={f.ownerRole} onChange={(e) => set("ownerRole", e.target.value)} placeholder="Strategist, builder, mentor" />
          </Field>
          <Field label="Initial avatar">
            <Input value={f.ownerInitials} onChange={(e) => set("ownerInitials", e.target.value)} placeholder="LD" maxLength={4} />
          </Field>
          <Field label="Email kontak">
            <Input type="email" value={f.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} />
          </Field>
          <Field label="Telepon / WhatsApp">
            <Input value={f.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} placeholder="+62 812 3456 7890" />
          </Field>
          <Field label="Alamat">
            <Input value={f.contactAddress} onChange={(e) => set("contactAddress", e.target.value)} placeholder="Jl. ... , Kota" />
          </Field>
          <Field label="Bio singkat">
            <Textarea value={f.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} placeholder="Ringkasan profil yang tampil di halaman About dan metadata SEO." />
          </Field>
          <Field label="Foto profil">
            {f.profileImageUrl ? <img src={f.profileImageUrl} alt="profile" className="mb-2 h-24 w-20 rounded-lg object-cover" /> : null}
            <ImageField label="Ganti foto profil" onUploaded={(u) => set("profileImageUrl", u)} />
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
            <ImageField label="Ganti logo" onUploaded={(u) => set("logoUrl", u)} />
          </Field>
          <Field label="Favicon">
            {f.faviconUrl ? <img src={f.faviconUrl} alt="favicon" className="mb-2 size-8 rounded object-contain" /> : null}
            <ImageField label="Ganti favicon" onUploaded={(u) => set("faviconUrl", u)} />
          </Field>
          <Field label="X / Twitter URL">
            <Input value={f.socialX} onChange={(e) => set("socialX", e.target.value)} placeholder="https://x.com/username" />
          </Field>
          <Field label="LinkedIn URL">
            <Input value={f.socialLinkedin} onChange={(e) => set("socialLinkedin", e.target.value)} placeholder="https://linkedin.com/in/username" />
          </Field>
          <Field label="GitHub URL">
            <Input value={f.socialGithub} onChange={(e) => set("socialGithub", e.target.value)} placeholder="https://github.com/username" />
          </Field>
          <Field label="YouTube URL">
            <Input value={f.socialYoutube} onChange={(e) => set("socialYoutube", e.target.value)} placeholder="https://youtube.com/@username" />
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

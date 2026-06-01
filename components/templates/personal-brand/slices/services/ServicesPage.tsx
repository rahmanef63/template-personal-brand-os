"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  PricingSection,
  type PricingTier as SliceTier,
} from "@/features/pricing-page";
import { FAQSection } from "@/features/faq-section";
import { nid, useServices, useStore } from "../../shared/store";

/**
 * Hybrid wrapper: tiers + FAQ delegated to canonical slices. Booking modal
 * (lead.create dispatch) preserved via renderTierCta slot — admin Service
 * CRUD propagates via createTemplateStore BroadcastChannel.
 */
export function ServicesPage() {
  const services = useServices();
  const [openSvc, setOpenSvc] = React.useState<string | null>(null);
  const active = services.find((s) => s.id === openSvc) ?? null;

  const tiers: SliceTier[] = services.map((s) => ({
    id: s.id,
    name: s.name,
    price: s.priceLabel,
    period: s.period,
    blurb: s.description,
    bullets: s.bullets,
    featured: s.featured,
    badge: s.featured ? "Most picked" : undefined,
  }));

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <PricingSection
        eyebrow="Services"
        title="Cara kerja sama"
        subtitle="Pilih sesuai konteks tim atau kariermu. Bisa kombinasi — strategy sprint dulu, lanjut mentoring bulanan."
        tiers={tiers}
        className="!px-0 !pt-0"
        renderTierCta={(t) => (
          <Button
            className="w-full"
            variant={t.featured ? "default" : "outline"}
            onClick={() => setOpenSvc(t.id)}
          >
            Book {t.name} <ArrowRight className="size-4" />
          </Button>
        )}
      />

      <BookDialog
        open={!!active}
        service={active}
        onOpenChange={(o) => !o && setOpenSvc(null)}
      />

      <FaqSection />
    </section>
  );
}

function BookDialog({
  open,
  service,
  onOpenChange,
}: {
  open: boolean;
  service: ReturnType<typeof useServices>[number] | null;
  onOpenChange: (o: boolean) => void;
}) {
  const { dispatch } = useStore();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!service) return;
    if (!name || !email.includes("@")) {
      toast.error("Nama + email wajib");
      return;
    }
    dispatch({
      type: "lead.create",
      lead: {
        id: nid("lead"),
        name,
        email,
        topic: service.name,
        source: `Service: ${service.name}`,
        message,
        status: "new",
        ts: Date.now(),
      },
    });
    toast.success("Booking diterima — akan dibalas dalam 24 jam kerja.");
    onOpenChange(false);
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book {service?.name}</DialogTitle>
          <DialogDescription>
            {service?.priceLabel}
            {service?.period} — saya akan reach out via email dengan slot kalender + deposit instructions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid gap-2 md:grid-cols-2">
            <div>
              <label className="text-xs text-muted-foreground">Nama</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Email</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-1" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Konteks (opsional)</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Bahas apa, tim/perusahaan, dst."
              className="mt-1"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Confirm booking <ArrowRight className="size-4" /></Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const FAQ_ITEMS = [
  { id: "nego", q: "Apakah pricing nego?", a: "Untuk strategy sprint, pricing fixed. Mentoring bisa dapet diskon kalau bayar 6 bulan di muka." },
  { id: "pay", q: "Pembayaran bagaimana?", a: "Bank transfer (BCA/Mandiri) atau Wise. Invoice berlaku PPN 11% (klien Indonesia)." },
  { id: "cancel", q: "Bisa cancel?", a: "Ya — full refund kalau cancel >7 hari sebelum sesi pertama, 50% kalau <7 hari." },
  { id: "lang", q: "Bahasa apa?", a: "Sesi default Bahasa Indonesia. Bisa English on request, terutama untuk tim multinational." },
];

function FaqSection() {
  return (
    <FAQSection
      eyebrow="FAQ"
      title="Pertanyaan umum"
      items={FAQ_ITEMS}
      layout="two-column"
      className="mt-20 !px-0 !py-0"
    />
  );
}

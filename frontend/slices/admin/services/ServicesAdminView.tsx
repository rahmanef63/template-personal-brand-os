"use client";

import * as React from "react";
import { Plus, Save, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { nid, slugify, useServices, useStore } from "@/features/_app/store";
import type { Service } from "@/features/_app/types";

export function ServicesAdminView() {
  const services = useServices();
  const { dispatch } = useStore();
  const [editingId, setEditingId] = React.useState<string | "new" | null>(null);
  const editing = editingId === "new" ? null : services.find((s) => s.id === editingId) ?? null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Services</h1>
          <p className="text-sm text-muted-foreground">{services.length} services · 1 featured</p>
        </div>
        <Button size="sm" className="gap-1" onClick={() => setEditingId("new")}>
          <Plus className="size-4" /> New service
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Card key={s.id} className={"border-border/60 bg-card/60 " + (s.featured ? "ring-1 ring-foreground/30" : "")}>
            <CardContent className="space-y-2 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{s.name}</p>
                {s.featured && <Badge className="rounded-full text-[10px]"><Star className="mr-1 size-2.5" /> featured</Badge>}
              </div>
              <p className="text-xs text-muted-foreground">{s.priceLabel}{s.period}</p>
              <p className="line-clamp-2 text-xs text-foreground/70">{s.description}</p>
              <div className="flex items-center gap-1 pt-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => setEditingId(s.id)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (confirm(`Hapus "${s.name}"?`)) {
                      dispatch({ type: "service.delete", id: s.id });
                      toast.success("Service dihapus");
                    }
                  }}
                >
                  <Trash2 className="size-3.5 text-rose-400" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ServiceDialog
        open={editingId !== null}
        existing={editing}
        onClose={() => setEditingId(null)}
      />
    </div>
  );
}

function ServiceDialog({
  open,
  existing,
  onClose,
}: {
  open: boolean;
  existing: Service | null;
  onClose: () => void;
}) {
  const { dispatch } = useStore();
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [priceLabel, setPriceLabel] = React.useState("");
  const [period, setPeriod] = React.useState("/sesi");
  const [bullets, setBullets] = React.useState("");
  const [featured, setFeatured] = React.useState(false);

  React.useEffect(() => {
    setName(existing?.name ?? "");
    setDescription(existing?.description ?? "");
    setPriceLabel(existing?.priceLabel ?? "");
    setPeriod(existing?.period ?? "/sesi");
    setBullets((existing?.bullets ?? []).join("\n"));
    setFeatured(existing?.featured ?? false);
  }, [existing, open]);

  function save() {
    if (!name || !priceLabel) {
      toast.error("Nama + harga wajib");
      return;
    }
    const svc: Service = {
      id: existing?.id ?? nid("svc"),
      slug: existing?.slug ?? slugify(name),
      name,
      description,
      priceLabel,
      period,
      bullets: bullets.split("\n").map((b) => b.trim()).filter(Boolean),
      featured,
    };
    dispatch({ type: "service.upsert", svc });
    toast.success("Service tersimpan");
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{existing ? `Edit ${existing.name}` : "New service"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Service name" />
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Description" />
          <div className="grid grid-cols-2 gap-2">
            <Input value={priceLabel} onChange={(e) => setPriceLabel(e.target.value)} placeholder="Rp 4.5jt" />
            <Input value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="/bulan" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Bullets (1 per baris)</label>
            <Textarea value={bullets} onChange={(e) => setBullets(e.target.value)} rows={4} className="mt-1" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="size-4 rounded border bg-background"
            />
            <Star className="size-3.5" /> Featured
          </label>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={save}><Save className="size-4" /> Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

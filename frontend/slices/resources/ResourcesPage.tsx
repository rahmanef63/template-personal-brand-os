"use client";

import * as React from "react";
import { ArrowRight, ArrowUpRight, BookOpen, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Reveal, Stagger } from "@/features/_shared/motion";
import { nid, useResources, useStore } from "@/features/_app/store";

export function ResourcesPage() {
  const resources = useResources();
  const { dispatch } = useStore();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const active = resources.find((r) => r.id === activeId) ?? null;
  const [email, setEmail] = React.useState("");

  function unlock(e: React.FormEvent) {
    e.preventDefault();
    if (!active) return;
    if (!email.includes("@")) {
      toast.error("Email tidak valid");
      return;
    }
    dispatch({
      type: "subscriber.create",
      sub: {
        id: nid("sub"),
        email,
        status: "pending",
        source: `lead-magnet:${active.id}`,
        ts: Date.now(),
      },
    });
    dispatch({
      type: "lead.create",
      lead: {
        id: nid("lead"),
        name: email.split("@")[0],
        email,
        topic: active.title,
        source: `Lead magnet: ${active.title}`,
        status: "new",
        ts: Date.now(),
      },
    });
    dispatch({ type: "resource.download", id: active.id });
    toast.success(`Link download untuk "${active.title}" sudah dikirim ke email.`);
    setActiveId(null);
    setEmail("");
  }

  function freeDownload(id: string) {
    dispatch({ type: "resource.download", id });
    toast.success("Download dimulai…");
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <Reveal>
        <header className="mb-10 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Resources</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">Library</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Koleksi PDF, template, cheatsheet — beberapa free, beberapa email-gated.
            </p>
          </div>
          <BookOpen className="size-8 text-muted-foreground" />
        </header>
      </Reveal>

      <div className="grid gap-4 md:grid-cols-3">
        <Stagger itemClassName="h-full">
          {resources.map((r) => (
            <Card
              key={r.id}
              className="h-full border-border/60 bg-card/60 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex items-center justify-between">
                  <Download className="size-5 text-foreground/70" />
                  {r.gated ? (
                    <Badge variant="outline" className="rounded-full text-[10px]">email-required</Badge>
                  ) : (
                    <Badge className="rounded-full bg-emerald-500/15 text-[10px] text-emerald-300 hover:bg-emerald-500/15">free</Badge>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-medium">{r.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    {r.fileLabel} · {r.downloads.toLocaleString()} downloads
                  </p>
                </div>
                {r.gated ? (
                  <Button variant="outline" size="sm" className="mt-1 w-full" onClick={() => setActiveId(r.id)}>
                    Unlock with email <ArrowRight className="size-3.5" />
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="mt-1 w-full" onClick={() => freeDownload(r.id)}>
                    Download <ArrowUpRight className="size-3.5" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </Stagger>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActiveId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlock — {active?.title}</DialogTitle>
            <DialogDescription>
              Drop email kamu, link download dikirim langsung. Auto-subscribe ke newsletter (bisa unsub kapan saja).
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={unlock} className="space-y-3">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="email@domain.com"
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setActiveId(null)}>Cancel</Button>
              <Button type="submit">Send link <ArrowRight className="size-4" /></Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}

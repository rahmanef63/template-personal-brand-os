"use client";

import * as React from "react";
import { ArrowRight, Calendar, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { nid, useStore } from "../../shared/store";

export function ContactPage() {
  const { dispatch } = useStore();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [topic, setTopic] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [hp, setHp] = React.useState(""); // honeypot

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (hp) return; // bot
    if (!name || !email.includes("@") || message.length < 4) {
      toast.error("Lengkapi nama, email, dan pesan");
      return;
    }
    dispatch({
      type: "lead.create",
      lead: {
        id: nid("lead"),
        name,
        email,
        topic: topic || "(tanpa topik)",
        message,
        source: "Contact form",
        status: "new",
        ts: Date.now(),
      },
    });
    toast.success("Pesan terkirim — biasanya bales dalam 24 jam kerja.");
    setName(""); setEmail(""); setTopic(""); setMessage("");
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2">
      <div>
        <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Contact</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">Mau ngobrol?</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Drop pesan — biasanya bales dalam 24 jam kerja. Untuk konsultasi cepat, langsung book office hours.
        </p>
        <div className="mt-6 space-y-3 text-sm text-muted-foreground">
          <p className="flex items-center gap-2"><Mail className="size-4" /> hi@lorem.dev</p>
          <p className="flex items-center gap-2"><MessageCircle className="size-4" /> +62 812 3456 7890 (WA)</p>
          <p className="flex items-center gap-2"><Calendar className="size-4" /> cal.com/lorem</p>
        </div>
      </div>

      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-6">
          <form onSubmit={submit} className="space-y-3">
            {/* honeypot */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
              className="hidden"
              aria-hidden="true"
            />
            <div className="grid gap-2 md:grid-cols-2">
              <div>
                <label className="text-xs text-muted-foreground">Nama</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Email</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Topik</label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Singkat saja — apa yang ingin dibahas?"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Pesan</label>
              <Textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Lorem ipsum dolor sit amet…"
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full">
              Kirim pesan <ArrowRight className="size-4" />
            </Button>
            <p className="text-[11px] text-muted-foreground">
              Honeypot + rate-limit aktif. Auto-reply terkirim otomatis.
            </p>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}

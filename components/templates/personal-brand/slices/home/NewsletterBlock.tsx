"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { nid, useStore } from "../../shared/store";

export function NewsletterBlock({ source = "home-cta" }: { source?: string }) {
  const { dispatch } = useStore();
  const [email, setEmail] = React.useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Email tidak valid");
      return;
    }
    dispatch({
      type: "subscriber.create",
      sub: { id: nid("sub"), email, status: "pending", source, ts: Date.now() },
    });
    toast.success("Terima kasih — cek email untuk konfirmasi.");
    setEmail("");
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <Card className="border-border/60 bg-gradient-to-br from-card/80 to-muted/20">
        <CardContent className="flex flex-col gap-6 p-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Newsletter</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
              Catatan mingguan — tulisan, sumber, refleksi.
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bebas spam, unsubscribe satu klik.
            </p>
          </div>
          <form onSubmit={submit} className="flex w-full max-w-md gap-2 md:w-auto">
            <Input
              type="email"
              placeholder="kamu@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background"
            />
            <Button type="submit">
              Subscribe <ArrowRight className="size-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}

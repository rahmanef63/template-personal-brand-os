"use client";

import * as React from "react";
import { Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Reveal } from "../../motion";
import { cfgString, parseConfigObject } from "./config";
import type { LandingSection } from "../types";

/**
 * Newsletter capture band. Submit is LOCAL-ONLY (no backend) — shows the
 * success state and stores nothing; consumers wire a real provider later.
 * Config keys: { placeholder, buttonLabel, successText }.
 * Renders inside LandingSectionShell (caller wraps).
 */
export function NewsletterSection({
  section,
  placeholder = "Alamat email kamu",
  buttonLabel = "Daftar",
  successText = "Terima kasih — kamu terdaftar!",
  className,
}: {
  section: LandingSection;
  placeholder?: string;
  buttonLabel?: string;
  successText?: string;
  className?: string;
}) {
  const cfg = parseConfigObject(section.config);
  const ph = cfgString(cfg, "placeholder") ?? placeholder;
  const btn = cfgString(cfg, "buttonLabel") ?? buttonLabel;
  const ok = cfgString(cfg, "successText") ?? successText;
  const [email, setEmail] = React.useState("");
  const [done, setDone] = React.useState(false);

  return (
    <div className={cn("mx-auto max-w-3xl px-4 py-16 sm:px-6", className)}>
      <Reveal variant="zoom">
        <div className="rounded-2xl border border-border/60 bg-gradient-to-b from-muted/40 to-card/60 p-8 text-center sm:p-10">
          <span className="mx-auto grid size-10 place-items-center rounded-full bg-foreground/5">
            <Mail className="size-5 text-foreground/70" />
          </span>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              {section.subtitle}
            </p>
          )}
          {done ? (
            <p className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
              <Check className="size-4 text-emerald-600" /> {ok}
            </p>
          ) : (
            <form
              className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                if (email.includes("@")) setDone(true);
              }}
            >
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={ph}
                className="h-10 flex-1 bg-background"
              />
              <Button type="submit" className="h-10">
                {btn}
              </Button>
            </form>
          )}
        </div>
      </Reveal>
    </div>
  );
}

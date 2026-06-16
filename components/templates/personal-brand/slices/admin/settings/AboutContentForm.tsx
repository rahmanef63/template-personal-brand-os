"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  resolveAboutContent,
  type TimelineEntry,
} from "../../about/about-content";

/** Structured editor for the About page's Timeline + Achievements/Mentions —
 *  serializes to the siteSettings.aboutContent JSON string. Reads current
 *  value (falling back to template defaults) so the form is never empty. */
export function AboutContentForm() {
  const settings = useQuery(api.settings.get);
  const upsert = useMutation(api.settings.upsert);
  const [timeline, setTimeline] = React.useState<TimelineEntry[]>([]);
  const [mentions, setMentions] = React.useState<string[]>([]);
  const [hydrated, setHydrated] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (settings === undefined || hydrated) return;
    const c = resolveAboutContent(settings?.aboutContent);
    setTimeline(c.timeline);
    setMentions(c.mentions);
    setHydrated(true);
  }, [settings, hydrated]);

  async function save() {
    setBusy(true);
    try {
      const cleanTimeline = timeline.filter((t) => t.year.trim() || t.milestone.trim());
      const cleanMentions = mentions.filter((m) => m.trim());
      await upsert({
        aboutContent: JSON.stringify({ timeline: cleanTimeline, mentions: cleanMentions }),
      });
      toast.success("Konten About tersimpan.");
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
      <CardContent className="space-y-6 p-6">
        <div>
          <h2 className="text-sm font-semibold">Halaman About</h2>
          <p className="text-xs text-muted-foreground">
            Timeline & pencapaian yang tampil di halaman /about.
          </p>
        </div>

        <section className="space-y-3">
          <Label className="text-xs text-muted-foreground">Timeline</Label>
          {timeline.map((t, i) => (
            <div key={i} className="flex items-start gap-2">
              <Input
                value={t.year}
                placeholder="2024"
                className="w-24"
                onChange={(e) =>
                  setTimeline((p) => p.map((r, j) => (j === i ? { ...r, year: e.target.value } : r)))
                }
              />
              <Input
                value={t.milestone}
                placeholder="Pencapaian…"
                onChange={(e) =>
                  setTimeline((p) =>
                    p.map((r, j) => (j === i ? { ...r, milestone: e.target.value } : r)),
                  )
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setTimeline((p) => p.filter((_, j) => j !== i))}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setTimeline((p) => [...p, { year: "", milestone: "" }])}
          >
            <Plus className="size-4" /> Tambah baris
          </Button>
        </section>

        <section className="space-y-3">
          <Label className="text-xs text-muted-foreground">Achievements & mentions</Label>
          {mentions.map((m, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={m}
                placeholder="Penghargaan / mention…"
                onChange={(e) =>
                  setMentions((p) => p.map((r, j) => (j === i ? e.target.value : r)))
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setMentions((p) => p.filter((_, j) => j !== i))}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setMentions((p) => [...p, ""])}
          >
            <Plus className="size-4" /> Tambah mention
          </Button>
        </section>

        <div className="flex justify-end">
          <Button onClick={save} disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : "Simpan"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

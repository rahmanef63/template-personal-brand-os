"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Save, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { nid, slugify, useStore } from "@/features/_app/store";
import type { PortfolioItem } from "@/features/_app/types";
import { ADMIN_BASE } from "@/features/_app/nav-config";
import { PUBLIC_BASE } from "@/features/_app/nav-config";
import { ImageField } from "@/components/image-field";

const COVERS = [
  "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1600&q=70",
  "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=70",
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1600&q=70",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=70",
];

const CATEGORIES = ["Product", "Brand", "Strategy", "Workshop", "Engineering"];

export function PortfolioEditor({ id }: { id: string | null }) {
  const router = useRouter();
  const { state, dispatch } = useStore();

  const existing = id ? state.portfolio.find((p) => p.id === id) ?? null : null;

  const [title, setTitle] = React.useState(existing?.title ?? "");
  const [slug, setSlug] = React.useState(existing?.slug ?? "");
  const [category, setCategory] = React.useState(existing?.category ?? CATEGORIES[0]);
  const [cover, setCover] = React.useState(existing?.cover ?? COVERS[0]);
  const [blurb, setBlurb] = React.useState(existing?.blurb ?? "");
  const [problem, setProblem] = React.useState(existing?.problem ?? "");
  const [approach, setApproach] = React.useState(existing?.approach ?? "");
  const [result, setResult] = React.useState(existing?.result ?? "");

  React.useEffect(() => {
    if (!existing && title && !slug) setSlug(slugify(title));
  }, [title, existing, slug]);

  function save() {
    if (!title || !blurb || !problem || !approach || !result) {
      toast.error("Lengkapi semua field");
      return;
    }
    const item: PortfolioItem = {
      id: existing?.id ?? nid("case"),
      slug: slug || slugify(title),
      title,
      category,
      cover,
      blurb,
      problem,
      approach,
      result,
      publishedAt: existing?.publishedAt ?? Date.now(),
    };
    dispatch({ type: "portfolio.upsert", item });
    toast.success("Case study tersimpan");
    if (!existing) router.push(`${ADMIN_BASE}/portfolio/${item.id}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button asChild size="sm" variant="ghost" className="gap-1">
          <Link href={`${ADMIN_BASE}/portfolio`}><ArrowLeft className="size-3.5" /> Portfolio</Link>
        </Button>
        <span className="text-sm text-muted-foreground">/</span>
        <span className="text-sm">{existing ? "Edit" : "New case study"}</span>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {existing && (
            <Button asChild size="sm" variant="outline" className="gap-1">
              <Link href={`${PUBLIC_BASE}/portfolio/${existing.slug}`} target="_top">
                <ArrowUpRight className="size-3.5" /> View live
              </Link>
            </Button>
          )}
          <Button size="sm" onClick={save} className="gap-1">
            <Save className="size-3.5" /> Save
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="border-border/60 bg-card/60">
          <CardContent className="space-y-4 p-6">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Case study title"
              className="h-12 border-none bg-transparent text-2xl font-semibold tracking-tight focus-visible:ring-0"
            />
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">/portfolio/</span>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} className="h-7 w-64" />
              <Badge variant="outline" className="ml-auto rounded-full text-[10px]">{category}</Badge>
            </div>
            <Textarea
              value={blurb}
              onChange={(e) => setBlurb(e.target.value)}
              rows={2}
              placeholder="Blurb singkat — 1 kalimat headline"
            />
            <div className="grid gap-3">
              <Field label="Problem" value={problem} onChange={setProblem} />
              <Field label="Approach" value={approach} onChange={setApproach} />
              <Field label="Result" value={result} onChange={setResult} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border/60 bg-card/60">
            <CardContent className="p-5">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Category</p>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-2 w-full rounded-md border bg-background px-2 py-1.5 text-sm"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>

              <p className="mt-4 text-[11px] uppercase tracking-wider text-muted-foreground">Cover</p>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {COVERS.map((c) => (
                  <Button
                    key={c}
                    variant="outline"
                    onClick={() => setCover(c)}
                    aria-label="Select cover"
                    className={
                      "relative h-auto aspect-video overflow-hidden rounded-md p-0 " +
                      (c === cover ? "border-foreground" : "border-border/60 opacity-60 hover:opacity-100")
                    }
                  >
                    <Image src={c} alt="" fill sizes="160px" className="object-cover" />
                  </Button>
                ))}
              </div>
              <div className="mt-2">
                <ImageField onUploaded={setCover} label="Upload cover" />
              </div>
            </CardContent>
          </Card>

          {existing && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-1 text-rose-400 hover:bg-rose-500/10 hover:text-rose-400"
              onClick={() => {
                if (confirm("Delete case study?")) {
                  dispatch({ type: "portfolio.delete", id: existing.id });
                  router.push(`${ADMIN_BASE}/portfolio`);
                }
              }}
            >
              <Trash2 className="size-3.5" /> Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (s: string) => void }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="mt-1" />
    </div>
  );
}

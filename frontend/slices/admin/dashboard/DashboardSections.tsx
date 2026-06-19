import * as React from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpRight, PenSquare, Sparkles, Star, TrendingUp, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { rel, useStore } from "@/features/_app/store";
import { ADMIN_BASE } from "@/features/_app/nav-config";
import { StatusDot, Sparkbars, type ActivityItem } from "./dashboard-helpers";

type Post = ReturnType<typeof useStore>["state"]["posts"][number];

export type Kpi = { label: string; value: string; delta: string; up: boolean; hint: string };

export function KpiGrid({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {kpis.map((k) => (
        <Card key={k.label} className="border-border/60 bg-card/60">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{k.label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{k.value}</p>
            <div className="mt-2 flex items-center gap-1 text-xs">
              {k.up ? <ArrowUp className="size-3 text-emerald-400" /> : <ArrowDown className="size-3 text-rose-400" />}
              <span className={k.up ? "text-emerald-400" : "text-rose-400"}>{k.delta}</span>
              <span className="text-muted-foreground">— {k.hint}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function TrafficAndTopPosts({ topPosts }: { topPosts: Post[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="border-border/60 bg-card/60 lg:col-span-2">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Traffic</p>
              <h3 className="text-base font-medium">Visits last 30 days</h3>
            </div>
          </div>
          <Sparkbars />
        </CardContent>
      </Card>
      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-6">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Top posts</p>
          <ul className="mt-3 space-y-3">
            {topPosts.length === 0 && (
              <p className="text-xs text-muted-foreground">Belum ada published post.</p>
            )}
            {topPosts.map((p, i) => (
              <li key={p.id} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-muted text-[10px] font-medium">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{p.title}</p>
                  <p className="text-[10px] text-muted-foreground">{p.views.toLocaleString()} views</p>
                </div>
                <TrendingUp className="size-3.5 text-emerald-400" />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export function DraftsAndActivity({
  drafts,
  activity,
}: {
  drafts: Post[];
  activity: ActivityItem[];
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="border-border/60 bg-card/60 lg:col-span-2">
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-border/60 p-4">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Drafts &amp; scheduled</p>
              <h3 className="text-base font-medium">Posts in flight</h3>
            </div>
            <Button asChild size="sm" variant="ghost" className="gap-1">
              <Link href={`${ADMIN_BASE}/posts`}>View all <ArrowUpRight className="size-3.5" /></Link>
            </Button>
          </div>
          {drafts.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">Semua post sudah dipublish.</p>
          ) : (
            <ul className="divide-y divide-border/60">
              {drafts.map((p) => (
                <li key={p.id} className="flex items-center gap-3 p-4">
                  <StatusDot status={p.status} />
                  <div className="min-w-0 flex-1">
                    <Link href={`${ADMIN_BASE}/posts/${p.id}`} className="truncate text-sm hover:underline">{p.title}</Link>
                    <p className="text-[11px] text-muted-foreground">{p.author} · {rel(p.publishedAt || Date.now())}</p>
                  </div>
                  <Badge variant="outline" className="rounded-full text-[10px] capitalize">{p.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-6">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Recent activity</p>
          <ul className="mt-3 space-y-3">
            {activity.length === 0 && (
              <p className="text-xs text-muted-foreground">Belum ada aktivitas.</p>
            )}
            {activity.map((a) => (
              <li key={a.id} className="flex items-start gap-3 text-sm">
                <a.icon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                <p className="leading-snug text-foreground/85">
                  <span className="font-medium">{a.who}</span>{" "}
                  <span className="text-muted-foreground">{a.what}</span>{" "}
                  <span>{a.target}</span>
                  <span className="block text-[10px] text-muted-foreground">{rel(a.ts)}</span>
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export function AiSuggestions({ newLeads, topPost }: { newLeads: number; topPost: Post | undefined }) {
  const suggestions = [
    { icon: PenSquare, title: "Draft follow-up email", blurb: `${newLeads} lead belum dibalas — generate balasan personal.` },
    { icon: Wand2,     title: "Suggest post angle",    blurb: "Top trending topics dari subscribers." },
    { icon: Star,      title: "Boost top performer",   blurb: topPost ? `“${topPost.title}” → repurpose ke X thread.` : "Publish dulu satu post." },
  ];
  return (
    <Card className="border-border/60 bg-card/60">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">AI assistant</p>
            <h3 className="text-base font-medium">Quick suggestions</h3>
          </div>
          <Badge variant="outline" className="rounded-full text-[10px]">model: claude-sonnet-4-6</Badge>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {suggestions.map((s) => {
            const Icon = s.icon;
            return (
              <Button
                key={s.title}
                variant="outline"
                className="h-auto flex-col items-start gap-1 rounded-lg border-border/60 bg-background/50 p-4 text-left whitespace-normal hover:border-foreground/30 hover:bg-accent/50"
              >
                <Icon className="size-4 text-foreground/80" />
                <span className="mt-2 text-sm font-medium">{s.title}</span>
                <span className="text-xs font-normal text-muted-foreground">{s.blurb}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Re-export Sparkles for completeness (not used here but kept in case)
export const _icons = { Sparkles };

"use client";

import * as React from "react";
import { LineChart, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useStore } from "@/features/_app/store";

export function AnalyticsView() {
  const { state } = useStore();
  const published = state.posts.filter((p) => p.status === "published");
  const totalViews = published.reduce((sum, p) => sum + p.views, 0);

  const SOURCE_ROWS = [
    { src: "Direct", visits: 4_120, share: "33%" },
    { src: "Search (Google)", visits: 3_412, share: "27%" },
    { src: "Social — X", visits: 1_840, share: "15%" },
    { src: "Social — LinkedIn", visits: 1_120, share: "9%" },
    { src: "Newsletter", visits: 980, share: "8%" },
    { src: "Other", visits: 876, share: "8%" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground">Self-hosted, no GA — privacy-friendly.</p>
        </div>
        <Badge variant="outline" className="rounded-full">Last 30d</Badge>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Total visits</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{totalViews.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Unique visitors</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{Math.round(totalViews * 0.62).toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Avg time on page</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">2m 18s</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Bounce rate</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">42%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Top posts</p>
              <LineChart className="size-3.5 text-muted-foreground" />
            </div>
            <ul className="space-y-2">
              {published.sort((a, b) => b.views - a.views).slice(0, 6).map((p, i) => (
                <li key={p.id} className="flex items-center gap-3">
                  <span className="grid size-5 place-items-center rounded-full bg-muted text-[10px]">{i + 1}</span>
                  <span className="flex-1 truncate text-sm">{p.title}</span>
                  <span className="font-mono text-xs text-muted-foreground">{p.views.toLocaleString()}</span>
                  <TrendingUp className="size-3 text-emerald-400" />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-5">
            <p className="mb-3 text-[11px] uppercase tracking-wider text-muted-foreground">Sources</p>
            <ul className="space-y-2 text-sm">
              {SOURCE_ROWS.map((r) => (
                <li key={r.src} className="flex items-center gap-3">
                  <span className="flex-1">{r.src}</span>
                  <span className="font-mono text-xs text-muted-foreground">{r.visits.toLocaleString()}</span>
                  <span className="w-12 text-right text-xs text-muted-foreground">{r.share}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

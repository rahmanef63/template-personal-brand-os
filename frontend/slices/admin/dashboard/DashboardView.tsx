"use client";

import * as React from "react";
import Link from "next/link";
import { Filter, PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/features/_app/store";
import { ADMIN_BASE } from "@/features/_app/nav-config";
import { buildActivity } from "./dashboard-helpers";
import {
  AiSuggestions,
  DraftsAndActivity,
  KpiGrid,
  TrafficAndTopPosts,
  type Kpi,
} from "./DashboardSections";

export function DashboardView() {
  const { state } = useStore();

  const published = state.posts.filter((p) => p.status === "published");
  const totalViews = published.reduce((sum, p) => sum + p.views, 0);
  const totalLeads = state.leads.length;
  const newLeads = state.leads.filter((l) => l.status === "new").length;
  const subs = state.subscribers.filter((s) => s.status === "confirmed").length;
  const sessions = state.chatSessions.length;

  const KPIS: Kpi[] = [
    { label: "Total views", value: totalViews.toLocaleString(), delta: "+8.2%", up: true,  hint: `${published.length} published` },
    { label: "Leads",       value: totalLeads.toString(),        delta: `+${newLeads} new`, up: true,  hint: "from contact + services" },
    { label: "Subscribers", value: subs.toLocaleString(),        delta: "+1.4%", up: true,  hint: "double opt-in only" },
    { label: "Chat sessions",value: sessions.toString(),         delta: sessions > 0 ? `+${sessions}` : "—", up: sessions > 0, hint: sessions === 0 ? "open chat from public" : "live" },
  ];

  const topPosts = [...published].sort((a, b) => b.views - a.views).slice(0, 4);
  const draftsAndScheduled = state.posts.filter((p) => p.status !== "published").slice(0, 5);
  const recentActivity = buildActivity(state).slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Selamat datang kembali</h1>
          <p className="text-sm text-muted-foreground">
            {newLeads > 0
              ? `${newLeads} lead baru menunggu — buka tab Public di kitab + isi form Contact untuk demo.`
              : "Semua lead sudah ditangani. Buka tab Public + isi form untuk lihat sync live."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1"><Filter className="size-3.5" /> 30 hari</Button>
          <Button asChild size="sm" className="gap-1">
            <Link href={`${ADMIN_BASE}/posts/new`}><PenSquare className="size-4" /> Tulis post</Link>
          </Button>
        </div>
      </div>

      <KpiGrid kpis={KPIS} />
      <TrafficAndTopPosts topPosts={topPosts} />
      <DraftsAndActivity drafts={draftsAndScheduled} activity={recentActivity} />
      <AiSuggestions newLeads={newLeads} topPost={topPosts[0]} />
    </div>
  );
}

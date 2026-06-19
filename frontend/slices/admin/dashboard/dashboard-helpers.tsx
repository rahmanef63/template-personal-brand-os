import * as React from "react";
import { Bot, Circle, CircleDashed, Sparkles, Star } from "lucide-react";
import type { useStore } from "@/features/_app/store";

export function StatusDot({ status }: { status: string }) {
  const map: Record<string, string> = {
    draft: "text-muted-foreground",
    scheduled: "text-amber-400",
    review: "text-blue-400",
    published: "text-emerald-400",
  };
  const Icon = status === "draft" ? CircleDashed : Circle;
  return <Icon className={"size-3.5 " + (map[status] ?? "")} />;
}

export type ActivityItem = {
  id: string;
  who: string;
  what: string;
  target: string;
  ts: number;
  icon: React.ComponentType<{ className?: string }>;
};

export function buildActivity(state: ReturnType<typeof useStore>["state"]): ActivityItem[] {
  const items: ActivityItem[] = [];

  for (const lead of state.leads) {
    items.push({
      id: `lead:${lead.id}`,
      who: lead.name,
      what: "submitted lead via",
      target: lead.source,
      ts: lead.ts,
      icon: Sparkles,
    });
  }
  for (const c of state.comments) {
    items.push({
      id: `com:${c.id}`,
      who: c.author,
      what: c.status === "spam" ? "blocked spam comment on" : "commented on",
      target: c.postTitle,
      ts: c.ts,
      icon: Bot,
    });
  }
  for (const s of state.subscribers) {
    items.push({
      id: `sub:${s.id}`,
      who: s.email,
      what: "subscribed via",
      target: s.source,
      ts: s.ts,
      icon: Star,
    });
  }
  return items.sort((a, b) => b.ts - a.ts);
}

export function Sparkbars() {
  const data = React.useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => 40 + i * 4 + Math.round(Math.sin(i / 2) * 20));
  }, []);
  const max = Math.max(...data);
  return (
    <div className="flex h-44 items-end gap-1">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm bg-foreground/15 transition hover:bg-foreground/40"
          style={{ height: `${(v / max) * 100}%` }}
          title={`Day ${i + 1}: ${v}`}
        />
      ))}
    </div>
  );
}

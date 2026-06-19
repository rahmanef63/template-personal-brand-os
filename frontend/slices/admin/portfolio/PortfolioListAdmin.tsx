"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { fmtDate, usePortfolio, useStore } from "@/features/_app/store";
import { ADMIN_BASE } from "@/features/_app/nav-config";
import { PUBLIC_BASE } from "@/features/_app/nav-config";

export function PortfolioListAdmin() {
  const items = usePortfolio();
  const { dispatch } = useStore();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Portfolio</h1>
          <p className="text-sm text-muted-foreground">{items.length} case studies</p>
        </div>
        <Button asChild size="sm" className="gap-1">
          <Link href={`${ADMIN_BASE}/portfolio/new`}><Plus className="size-4" /> New case study</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <Card key={p.id} className="overflow-hidden border-border/60 bg-card/60">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image src={p.cover} alt="" fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover" />
            </div>
            <CardContent className="p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <Badge variant="outline" className="rounded-full text-[10px]">{p.category}</Badge>
                <span className="text-[10px] text-muted-foreground">{fmtDate(p.publishedAt)}</span>
              </div>
              <Link href={`${ADMIN_BASE}/portfolio/${p.id}`} className="text-sm font-medium hover:underline">
                {p.title}
              </Link>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.blurb}</p>
              <div className="mt-3 flex items-center gap-1">
                <Button asChild size="sm" variant="outline" className="flex-1 gap-1">
                  <Link href={`${ADMIN_BASE}/portfolio/${p.id}`}>Edit</Link>
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <Link href={`${PUBLIC_BASE}/portfolio/${p.slug}`} target="_top">
                    <Eye className="size-3.5" />
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (confirm(`Hapus "${p.title}"?`)) {
                      dispatch({ type: "portfolio.delete", id: p.id });
                      toast.success("Case study dihapus");
                    }
                  }}
                >
                  <Trash2 className="size-3.5 text-rose-400" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

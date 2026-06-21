import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { ProjectMeta } from "./ProjectMeta";
import type { PortfolioItem } from "../views/PortfolioListSection";

export type PortfolioCardProps = {
  item: PortfolioItem;
  href: string;
  /** Visual variant — matches PortfolioListSection layout. */
  variant?: "uniform" | "masonry" | "featured";
  className?: string;
};

function Cover({
  cover,
  variant,
}: {
  cover: PortfolioItem["cover"];
  variant: NonNullable<PortfolioCardProps["variant"]>;
}) {
  if (variant === "masonry") {
    return (
      <div className="relative w-full overflow-hidden rounded-md border bg-muted">
        <Image
          src={cover.src}
          alt={cover.alt}
          width={1200}
          height={1600}
          className="h-auto w-full object-cover"
        />
      </div>
    );
  }
  const ratio = variant === "featured" ? "aspect-[16/9]" : "aspect-video";
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-md border bg-muted",
        ratio,
      )}
    >
      <Image src={cover.src} alt={cover.alt} fill sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
    </div>
  );
}

export function PortfolioCard({
  item,
  href,
  variant = "uniform",
  className,
}: PortfolioCardProps) {
  const isFeatured = variant === "featured";

  return (
    <Card
      className={cn(
        "group h-full overflow-hidden transition-shadow hover:shadow-md",
        variant === "masonry" && "break-inside-avoid",
        className,
      )}
    >
      <Link href={href} className="flex h-full flex-col">
        <div className={cn(isFeatured ? "p-0" : "p-4 pb-0")}>
          <Cover cover={item.cover} variant={variant} />
        </div>
        <CardHeader className="flex flex-col gap-2">
          <CardTitle
            className={cn(
              "leading-snug transition-colors group-hover:text-primary",
              isFeatured ? "text-2xl md:text-3xl" : "text-lg",
            )}
          >
            {item.title}
          </CardTitle>
          {item.summary ? (
            <CardDescription className="text-sm leading-relaxed">
              {item.summary}
            </CardDescription>
          ) : null}
        </CardHeader>
        <CardContent className="mt-auto">
          <ProjectMeta
            year={item.year}
            client={item.client}
            role={item.role}
            tags={item.tags}
          />
        </CardContent>
      </Link>
    </Card>
  );
}

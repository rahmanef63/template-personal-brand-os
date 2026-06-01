import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type ProjectMetaProps = {
  year?: number;
  client?: string;
  role?: string;
  tags?: string[];
  /** Limit tag count rendered (rest collapsed into "+N"). */
  maxTags?: number;
  className?: string;
};

export function ProjectMeta({
  year,
  client,
  role,
  tags,
  maxTags = 3,
  className,
}: ProjectMetaProps) {
  const shown = tags?.slice(0, maxTags) ?? [];
  const extra = tags && tags.length > maxTags ? tags.length - maxTags : 0;
  const hasBaseline = Boolean(year || client || role);
  const hasTags = shown.length > 0;
  if (!hasBaseline && !hasTags) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground",
        className,
      )}
    >
      {year ? <span className="font-medium text-foreground">{year}</span> : null}
      {year && client ? <span aria-hidden>·</span> : null}
      {client ? <span>{client}</span> : null}
      {(year || client) && role ? <span aria-hidden>·</span> : null}
      {role ? <span className="italic">{role}</span> : null}
      {hasTags ? (
        <>
          {hasBaseline ? <span aria-hidden>·</span> : null}
          <span className="flex flex-wrap items-center gap-1">
            {shown.map((tag) => (
              <Badge key={tag} variant="secondary" className="font-normal">
                {tag}
              </Badge>
            ))}
            {extra > 0 ? (
              <Badge variant="outline" className="font-normal">
                +{extra}
              </Badge>
            ) : null}
          </span>
        </>
      ) : null}
    </div>
  );
}

import { Quote, Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type TestimonialCardProps = {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatar?: { src: string; alt: string };
  rating?: 1 | 2 | 3 | 4 | 5;
  featured?: boolean;
  /** Visual variant — matches TestimonialsGridSection layout. */
  variant?: "cards" | "quote-stack" | "masonry";
  /** Content alignment. */
  align?: "left" | "center";
  className?: string;
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p.charAt(0).toUpperCase()).join("") || "?";
}

function Rating({ value }: { value: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <div aria-label={`Rated ${value} out of 5`} className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden
          className={cn(
            "h-4 w-4",
            i < value
              ? "fill-foreground text-foreground"
              : "fill-transparent text-muted-foreground/40",
          )}
        />
      ))}
    </div>
  );
}

function Identity({
  author,
  role,
  company,
  avatar,
  align,
}: Pick<TestimonialCardProps, "author" | "role" | "company" | "avatar"> & {
  align: "left" | "center";
}) {
  const meta = [role, company].filter(Boolean).join(", ");
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        align === "center" && "justify-center",
      )}
    >
      <Avatar>
        {avatar ? <AvatarImage src={avatar.src} alt={avatar.alt} /> : null}
        <AvatarFallback>{initials(author)}</AvatarFallback>
      </Avatar>
      <div className={cn("flex flex-col", align === "center" && "text-center")}>
        <span className="text-sm font-medium leading-tight">{author}</span>
        {meta ? (
          <span className="text-xs leading-tight text-muted-foreground">{meta}</span>
        ) : null}
      </div>
    </div>
  );
}

export function TestimonialCard({
  quote,
  author,
  role,
  company,
  avatar,
  rating,
  featured = false,
  variant = "cards",
  align = "left",
  className,
}: TestimonialCardProps) {
  const alignClass = align === "center" ? "items-center text-center" : "items-start text-left";

  if (variant === "quote-stack") {
    return (
      <figure className={cn("flex flex-col gap-4", alignClass, className)}>
        <Quote aria-hidden className="h-6 w-6 text-muted-foreground/60" />
        <blockquote className="text-lg leading-relaxed md:text-xl">{quote}</blockquote>
        {rating ? <Rating value={rating} /> : null}
        <figcaption>
          <Identity author={author} role={role} company={company} avatar={avatar} align={align} />
        </figcaption>
      </figure>
    );
  }

  if (variant === "masonry") {
    return (
      <Card
        className={cn(
          "mb-6 break-inside-avoid",
          featured && "ring-2 ring-foreground/10",
          className,
        )}
      >
        <CardContent className={cn("flex flex-col gap-4 p-6", alignClass)}>
          {rating ? <Rating value={rating} /> : null}
          <blockquote className="text-sm leading-relaxed">{quote}</blockquote>
          <Identity author={author} role={role} company={company} avatar={avatar} align={align} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "h-full",
        featured && "ring-2 ring-foreground/10",
        className,
      )}
    >
      <CardHeader className={cn("flex flex-col gap-3", alignClass)}>
        {rating ? <Rating value={rating} /> : null}
        <Quote aria-hidden className="h-5 w-5 text-muted-foreground/60" />
      </CardHeader>
      <CardContent>
        <blockquote className={cn("text-sm leading-relaxed", alignClass)}>{quote}</blockquote>
      </CardContent>
      <CardFooter className={cn(align === "center" && "justify-center")}>
        <Identity author={author} role={role} company={company} avatar={avatar} align={align} />
      </CardFooter>
    </Card>
  );
}

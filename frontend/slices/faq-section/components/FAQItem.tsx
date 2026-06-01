import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export type FAQItemRowProps = {
  id: string;
  q: string;
  a: string;
  className?: string;
};

/**
 * Single FAQ row. Renders one shadcn AccordionItem with the question as
 * trigger and the answer as content. Answer preserves line breaks via
 * `whitespace-pre-line`.
 *
 * Must be rendered inside an `<Accordion>` parent.
 */
export function FAQItemRow({ id, q, a, className }: FAQItemRowProps) {
  return (
    <AccordionItem value={id} className={className}>
      <AccordionTrigger className="text-base font-medium">{q}</AccordionTrigger>
      <AccordionContent>
        <p
          className={cn(
            "whitespace-pre-line text-sm leading-relaxed text-muted-foreground",
          )}
        >
          {a}
        </p>
      </AccordionContent>
    </AccordionItem>
  );
}

"use client";

/** EditableLine — a single inline-editable contentEditable line with live
 *  markdown decoration (shared decorator). Used by block renderers that
 *  need rich-ish text without the full NotionBlock slash/markdown
 *  machinery (callout body, toggle heading, …). Pure callback. */

import { useEffect, useRef } from "react";
import { decorateInPlace } from "../../lib/inlineDecorator";

interface EditableLineProps {
  text: string;
  onChange: (next: string) => void;
  placeholder?: string;
  className?: string;
  hideMarkers?: boolean;
}

export function EditableLine({ text, onChange, placeholder, className, hideMarkers }: EditableLineProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const composingRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || composingRef.current) return;
    if (el.innerText === (text ?? "")) return;
    decorateInPlace(el, text ?? "", { hideMarkers: !!hideMarkers });
  }, [text, hideMarkers]);

  const commit = (el: HTMLElement) => {
    const t = el.innerText;
    onChange(t);
    decorateInPlace(el, t, { hideMarkers: !!hideMarkers });
  };

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      onCompositionStart={() => { composingRef.current = true; }}
      onCompositionEnd={(e) => { composingRef.current = false; commit(e.currentTarget as HTMLElement); }}
      onInput={(e) => { if (composingRef.current) return; commit(e.currentTarget as HTMLElement); }}
      className={className}
    />
  );
}

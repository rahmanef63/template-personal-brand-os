/** Per-line DOM decoration. Pure construction (no caret math here).
 *  Markers stay in the DOM so `innerText` round-trips the source verbatim
 *  — they're wrapped in dim spans so users still see them. `hideMarkers`
 *  collapses markers to zero-size + transparent for surfaces (headings)
 *  where the marker glyphs would be visual noise. */

import { tokenizeInline } from "../inlineMd";

const MARKER_CLS =
  "md-marker text-muted-foreground/50 text-[0.85em] tracking-tight select-none";
const HEADING_MARKER_CLS =
  "md-marker text-transparent select-none text-[0px] leading-[0] tracking-[0]";

function makeMarker(text: string, opts?: { hideMarkers?: boolean }): HTMLSpanElement {
  const span = document.createElement("span");
  span.className = opts?.hideMarkers ? HEADING_MARKER_CLS : MARKER_CLS;
  span.dataset.mdMarker = "1";
  span.textContent = text;
  return span;
}

export function decorateLineToFragment(line: string, opts?: { hideMarkers?: boolean }): DocumentFragment {
  const frag = document.createDocumentFragment();
  if (!line) return frag;
  const tokens = tokenizeInline(line);
  for (const tok of tokens) {
    switch (tok.kind) {
      case "text":
        frag.appendChild(document.createTextNode(tok.value));
        break;
      case "bold": {
        frag.appendChild(makeMarker("**", opts));
        const strong = document.createElement("strong");
        strong.textContent = tok.inner;
        frag.appendChild(strong);
        frag.appendChild(makeMarker("**", opts));
        break;
      }
      case "italic": {
        frag.appendChild(makeMarker("_", opts));
        const em = document.createElement("em");
        em.textContent = tok.inner;
        frag.appendChild(em);
        frag.appendChild(makeMarker("_", opts));
        break;
      }
      case "strike": {
        frag.appendChild(makeMarker("~~", opts));
        const del = document.createElement("del");
        del.textContent = tok.inner;
        frag.appendChild(del);
        frag.appendChild(makeMarker("~~", opts));
        break;
      }
      case "code": {
        frag.appendChild(makeMarker("`", opts));
        const code = document.createElement("code");
        code.className = "rounded bg-muted/70 px-1 py-0.5 font-mono text-[0.9em]";
        code.textContent = tok.inner;
        frag.appendChild(code);
        frag.appendChild(makeMarker("`", opts));
        break;
      }
      case "math": {
        frag.appendChild(makeMarker("$", opts));
        const span = document.createElement("span");
        span.className = "font-mono text-[0.95em] text-foreground/90";
        span.textContent = tok.inner;
        frag.appendChild(span);
        frag.appendChild(makeMarker("$", opts));
        break;
      }
      case "link": {
        frag.appendChild(makeMarker("[", opts));
        const a = document.createElement("span");
        a.className = "text-primary underline decoration-primary/40 underline-offset-2";
        a.textContent = tok.label;
        a.dataset.href = tok.href;
        frag.appendChild(a);
        frag.appendChild(makeMarker("](", opts));
        const href = document.createElement("span");
        href.className = opts?.hideMarkers
          ? "text-transparent text-[0px] leading-[0]"
          : "text-muted-foreground/60 text-[0.85em]";
        href.textContent = tok.href;
        frag.appendChild(href);
        frag.appendChild(makeMarker(")", opts));
        break;
      }
    }
  }
  return frag;
}

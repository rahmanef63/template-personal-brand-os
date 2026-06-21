"use client";

import * as React from "react";

// True when this document is running inside one of the demo-shell iframes —
// either flagged explicitly (?embed=1) or simply not the top-level window. The
// shell + demo ribbon render null while embedded so the iframes stay clean (no
// shell nested inside a shell). Computed after mount to avoid an SSR mismatch:
// the server can't know about window/search params, so it always starts false.
export function useEmbedded(): boolean {
  const [embedded, setEmbedded] = React.useState(false);
  React.useEffect(() => {
    const flagged = new URLSearchParams(window.location.search).get("embed") === "1";
    setEmbedded(flagged || window.self !== window.top);
  }, []);
  return embedded;
}

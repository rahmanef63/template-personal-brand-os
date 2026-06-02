"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle dark mode"
      title={isDark ? "Switch to light" : "Switch to dark"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-full"
    >
      {/* render both, cross-fade via opacity, to avoid hydration flash */}
      <Sun className={`size-4 transition-all ${isDark ? "scale-100 rotate-0" : "scale-0 -rotate-90 absolute"}`} />
      <Moon className={`size-4 transition-all ${isDark ? "scale-0 rotate-90 absolute" : "scale-100 rotate-0"}`} />
    </Button>
  );
}

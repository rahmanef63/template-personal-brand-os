import { defineFeature } from "@/lib/shared/features/defineFeature";

export const notionShellFeature = defineFeature({
  slug: "notion-shell",
  title: "Notion Shell — page + block editor primitives (pure, no sidebar/database)",
  category: "ui",
  routes: [],
  nav: { label: "Notion Shell", group: "tools", icon: "Layout" },
});

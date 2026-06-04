# Host setup — `theme-presets`

Field-tested install guide. Skip this and you'll likely hit the
"only font and border radius change" trap. Read once, save hours.

## 1. Mount the provider tree

```tsx
// app/providers.tsx (or wherever you compose root providers)
"use client";
import { ThemeProvider } from "next-themes";
import { ThemePresetProvider } from "@/features/theme-presets";

export function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="host-theme"            // pick your own key
    >
      <ThemePresetProvider>
        {children}
      </ThemePresetProvider>
    </ThemeProvider>
  );
}
```

`<html lang="en" suppressHydrationWarning>` is mandatory in
`app/layout.tsx` — next-themes mutates the class attribute on first
client paint.

## 2. globals.css — THE contract

This is the part everyone gets wrong. The slice writes
`:root { --background: oklch(…); }` at runtime. For Tailwind's
`bg-background` to follow, your `globals.css` must NOT pre-wrap the
var in `hsl(…)` or any other color function.

```css
/* ✅ GOOD — tweakcn presets re-paint utilities */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  /* …repeat for every token… */
}

:root {
  --background: hsl(0 0% 100%);     /* wrap at source */
  --foreground: hsl(220 13% 13%);
  --primary: hsl(24 90% 56%);
}
.dark {
  --background: hsl(220 14% 10%);
  --foreground: hsl(30 10% 92%);
  --primary: hsl(24 90% 60%);
}
```

```css
/* ❌ BAD — silent failure when preset injects oklch */
@theme inline {
  --color-background: hsl(var(--background));   /* DON'T wrap here */
}
:root {
  --background: 0 0% 100%;                       /* bare triple */
}
```

### Why it breaks

Tailwind 4 `@theme inline` **inlines the mapping expression** at every
utility class compile site. `bg-background` becomes literally
`background-color: hsl(var(--background))`. When the slice writes
`--background: oklch(0.99 0.01 250)` at runtime the browser sees
`hsl(oklch(…))` — invalid CSS, silently dropped. Utility class keeps
the base palette and your preset switcher looks broken. Only tokens
the slice writes that you DIDN'T wrap (`--radius`, `--font-*`)
survive. Hence the iconic "only font and border radius change"
symptom.

### Alpha mixing

`hsl(var(--brand) / 0.25)` requires the var to hold a bare HSL triple,
so it breaks the moment the preset substitutes OKLCH. Use the
format-agnostic alternative:

```css
/* ❌ */ background: hsl(var(--brand) / 0.25);
/* ✅ */ background: color-mix(in oklab, var(--brand) 25%, transparent);
```

`color-mix(in oklab, …)` is supported in Chrome 111+, Firefox 113+,
Safari 16.2+ — fine for any modern app.

### Direct callers

Same trap inside `*.tsx` `style={{ ... }}` blocks and SVG `fill=` /
`stroke=`. Find with:

```bash
grep -rn "hsl(var(--" --include="*.tsx" --include="*.ts" --include="*.css" \
  app/ frontend/ components/ | grep -v node_modules
```

Replace `hsl(var(--X))` → `var(--X)`, and `hsl(var(--X) / N)` →
`color-mix(in oklab, var(--X) ${N*100}%, transparent)`.

## 3. Mount the switcher

One component in the header / sidebar / settings:

```tsx
import { ThemePresetSwitcher } from "@/features/theme-presets";

<header>
  …other chrome
  <ThemePresetSwitcher />
</header>
```

That's the whole UI — light/dark/system tabs + grouped preset list +
hover preview + Default reset, all in one Popover.

## 4. Optional — `<ThemeColorSync />` for PWAs

Drop near the root once if you ship a PWA / want `<meta
name="theme-color">` to follow the active preset (Android address bar,
iOS PWA status bar). Side-effect-only, returns null:

```tsx
import { ThemeColorSync } from "@/features/theme-presets";

<>
  <ThemeColorSync />
  {/* rest of the app */}
</>
```

## 5. Default preset

`DEFAULT_PRESET = "claude"` (warm minimal, works for light + dark) is
applied + persisted on first visit so the session is never empty.
Override by forking `lib/tweakcn/types.ts` — value must match a
`name` in `registry-data.json`.

## 6. Common pitfalls — checklist

- [ ] `<html suppressHydrationWarning>` on the root layout
- [ ] `<ThemeProvider>` from `next-themes` wraps `<ThemePresetProvider>`
- [ ] Every `@theme inline { --color-X: var(--X); }` is BARE — no
      `hsl()` or `oklch()` wrapper at the theme level
- [ ] Source defaults in `:root` / `.dark` use fully-formed values
      (`hsl(…)`, `oklch(…)`, etc.)
- [ ] Alpha mixing uses `color-mix(in oklab, …)` not `hsl(var(--X) / N)`
- [ ] No `hsl(var(--…))` patterns left in SVG fills / inline styles
- [ ] Components consume tokens (`bg-card`, `text-muted-foreground`,
      `text-destructive`) not hardcoded palette (`bg-white`,
      `text-gray-500`, `text-red-600`) — those bypass the var system
      entirely

If a preset doesn't visibly re-paint after step 2, the host's
`globals.css` is the suspect. Re-read step 2.

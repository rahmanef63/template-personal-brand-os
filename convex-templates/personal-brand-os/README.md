# Personal Brand OS — Convex backend

Drop-in Convex slice for the Personal Brand OS template. Mirrors the
localStorage shape used by the preview, so swapping the in-memory store
for live Convex queries needs only `useQuery`/`useMutation` swaps.

## Install

After `npx rahman-resources add personal-brand-os <project>`, this folder
lands at `<project>/convex/templates/personal-brand-os/`.

If your project doesn't have Convex yet:

```bash
cd <project>
pnpm add convex
npx convex dev --once          # generates convex/_generated/
```

## Schema merge

If your project already has a `convex/schema.ts`, **merge** the tables
from `schema.ts` here into your existing `defineSchema({...})` call.
Otherwise move this file up:

```bash
mv convex/templates/personal-brand-os/schema.ts convex/schema.ts
```

## Wiring

Replace the `useReducer + localStorage` calls in
`components/templates/personal-brand/shared/store.tsx` with Convex hooks:

```tsx
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const posts = useQuery(api.templates.personalBrandOs.posts.listPublished);
const createLead = useMutation(api.templates.personalBrandOs.leads.create);
```

## Files

- `schema.ts` — 9 tables (posts, portfolio, services, resources, leads, comments, subscribers, chatSessions, chatMessages)
- `posts.ts` — list/upsert/delete/incrementView
- `portfolio.ts` — list/bySlug/upsert/delete
- `services.ts` — list/upsert/delete
- `resources.ts` — list/upsert/delete/incrementDownload
- `leads.ts` — list/create/update/delete
- `comments.ts` — listForPost/listByStatus/create/moderate
- `subscribers.ts` — list/subscribe/confirm/unsubscribe
- `chat.ts` — listSessions/messages/startSession/sendMessage

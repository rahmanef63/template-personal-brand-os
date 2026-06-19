import { TONES } from "../../ui/tones";
import type { ApiKey, Integration, WorkspaceIdentity } from "./types";

export const DEFAULT_IDENTITY: WorkspaceIdentity = {
  name: "Konsultan OS — Lumen",
  slug: "konsultan-lumen",
  timezone: "Asia/Jakarta",
  language: "id",
  contactEmail: "ops@lumen.dev",
};

export const TIMEZONES = [
  "UTC",
  "Asia/Jakarta",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Europe/London",
  "America/New_York",
  "America/Los_Angeles",
] as const;

export const LANGUAGES: Array<{ code: string; label: string }> = [
  { code: "en", label: "English" },
  { code: "id", label: "Bahasa Indonesia" },
  { code: "ms", label: "Bahasa Melayu" },
  { code: "ja", label: "日本語" },
];

export const INTEGRATION_STATUS_META: Record<
  Integration["status"],
  { label: string; tone: string }
> = {
  connected:    { label: "Connected",     tone: TONES.success.badge },
  disconnected: { label: "Not connected", tone: TONES.neutral.badge },
  error:        { label: "Error",         tone: TONES.danger.badge },
};

export const INTEGRATIONS: Integration[] = [
  {
    id: "slack",
    label: "Slack",
    category: "messaging",
    status: "connected",
    detail: "Posting to #ops · 2 channels",
    docsUrl: "https://api.slack.com/messaging/webhooks",
  },
  {
    id: "resend",
    label: "Resend",
    category: "email",
    status: "connected",
    detail: "Transactional · 12.4K sent (30d)",
    docsUrl: "https://resend.com/docs",
  },
  {
    id: "stripe",
    label: "Stripe",
    category: "payments",
    status: "disconnected",
    detail: "Not connected",
    docsUrl: "https://stripe.com/docs",
  },
  {
    id: "vercel",
    label: "Vercel",
    category: "deploy",
    status: "error",
    detail: "Token expired · reconnect",
    docsUrl: "https://vercel.com/docs",
  },
  {
    id: "github",
    label: "GitHub",
    category: "vcs",
    status: "connected",
    detail: "lumen-dev/konsultan-site",
    docsUrl: "https://docs.github.com/en/apps",
  },
  {
    id: "doku",
    label: "DOKU",
    category: "payments",
    status: "disconnected",
    detail: "Not connected",
    docsUrl: "https://developers.doku.com/",
  },
];

export const SEED_KEYS: ApiKey[] = [
  {
    id: "key_1",
    label: "Production server",
    tail: "k7Q2",
    createdAt: "2026-03-12T08:00:00Z",
    lastUsedAt: "2026-05-21T07:14:00Z",
    scope: "admin",
  },
  {
    id: "key_2",
    label: "Read-only public dashboards",
    tail: "x12M",
    createdAt: "2026-04-02T10:14:00Z",
    lastUsedAt: "2026-05-21T06:42:00Z",
    scope: "read",
  },
  {
    id: "key_3",
    label: "CI integration tests",
    tail: "9b3F",
    createdAt: "2026-04-22T18:00:00Z",
    lastUsedAt: "2026-05-20T22:10:00Z",
    scope: "read-write",
  },
];

export const SCOPE_META: Record<ApiKey["scope"], { tone: string }> = {
  read:         { tone: TONES.neutral.badge },
  "read-write": { tone: TONES.info.badge },
  admin:        { tone: TONES.elevated.badge },
};

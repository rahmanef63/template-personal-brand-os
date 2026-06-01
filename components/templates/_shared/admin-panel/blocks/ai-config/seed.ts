import { TONES } from "../../ui/tones";
import type { AiConfig, AiModel, AiProvider, ModerationRule } from "./types";

// Provider tones are BRAND colors (not semantic) — kept literal so
// they don't drift if the semantic palette is re-themed.
export const PROVIDERS: AiProvider[] = [
  { id: "anthropic", label: "Anthropic", tone: "bg-amber-500/15 text-amber-300 border-amber-500/30",   status: "connected",    keyTail: "k7Q2", docsUrl: "https://docs.anthropic.com/" },
  { id: "openai",    label: "OpenAI",    tone: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", status: "connected",    keyTail: "4F9b", docsUrl: "https://platform.openai.com/docs" },
  { id: "mistral",   label: "Mistral",   tone: "bg-sky-500/15 text-sky-300 border-sky-500/30",         status: "rate-limited", keyTail: "x12M", docsUrl: "https://docs.mistral.ai/" },
  { id: "google",    label: "Google AI", tone: "bg-violet-500/15 text-violet-300 border-violet-500/30", status: "missing-key",                   docsUrl: "https://ai.google.dev/" },
];

export const STATUS_META: Record<
  AiProvider["status"],
  { label: string; tone: string }
> = {
  connected:      { label: "Connected",    tone: TONES.success.badge },
  "missing-key":  { label: "Missing key",  tone: TONES.danger.badge },
  "rate-limited": { label: "Rate limited", tone: TONES.warn.badge },
};

export const TIER_META: Record<AiModel["tier"], { label: string; tone: string }> = {
  fast:     { label: "Fast",     tone: TONES.info.badge },
  balanced: { label: "Balanced", tone: TONES.success.badge },
  frontier: { label: "Frontier", tone: TONES.accent.badge },
};

export const MODELS: AiModel[] = [
  { id: "claude-opus-4-7", provider: "anthropic", label: "Claude Opus 4.7", contextWindowK: 200, inputCostUSD: 15, outputCostUSD: 75, tier: "frontier" },
  { id: "claude-sonnet-4-6", provider: "anthropic", label: "Claude Sonnet 4.6", contextWindowK: 200, inputCostUSD: 3, outputCostUSD: 15, tier: "balanced" },
  { id: "claude-haiku-4-5", provider: "anthropic", label: "Claude Haiku 4.5", contextWindowK: 200, inputCostUSD: 0.8, outputCostUSD: 4, tier: "fast" },
  { id: "gpt-4o", provider: "openai", label: "GPT-4o", contextWindowK: 128, inputCostUSD: 5, outputCostUSD: 15, tier: "frontier" },
  { id: "gpt-4o-mini", provider: "openai", label: "GPT-4o mini", contextWindowK: 128, inputCostUSD: 0.15, outputCostUSD: 0.6, tier: "fast" },
  { id: "o1", provider: "openai", label: "o1", contextWindowK: 200, inputCostUSD: 15, outputCostUSD: 60, tier: "frontier" },
  { id: "mistral-large", provider: "mistral", label: "Mistral Large", contextWindowK: 128, inputCostUSD: 2, outputCostUSD: 6, tier: "balanced" },
  { id: "mistral-small", provider: "mistral", label: "Mistral Small", contextWindowK: 32, inputCostUSD: 0.2, outputCostUSD: 0.6, tier: "fast" },
  { id: "gemini-pro-1.5", provider: "google", label: "Gemini Pro 1.5", contextWindowK: 1000, inputCostUSD: 1.25, outputCostUSD: 5, tier: "balanced" },
  { id: "gemini-flash-1.5", provider: "google", label: "Gemini Flash 1.5", contextWindowK: 1000, inputCostUSD: 0.075, outputCostUSD: 0.3, tier: "fast" },
];

export const DEFAULT_CONFIG: AiConfig = {
  activeModelId: "claude-sonnet-4-6",
  systemPrompt:
    "You are the workspace assistant for this template. Match the brand voice: clear, helpful, no fluff. Refuse questions outside the workspace scope.",
  temperature: 0.6,
  maxOutputTokens: 2048,
};

export const DEFAULT_MODERATION: ModerationRule[] = [
  {
    id: "toxicity",
    label: "Toxicity filter",
    description: "Block responses with toxic language above the threshold.",
    enabled: true,
    threshold: 0.7,
  },
  {
    id: "pii-redact",
    label: "PII redaction",
    description: "Strip emails, phone numbers, and credit-card patterns from outputs.",
    enabled: true,
  },
  {
    id: "off-topic",
    label: "Off-topic refusal",
    description: "Refuse requests unrelated to the workspace domain.",
    enabled: true,
  },
  {
    id: "competitor-mention",
    label: "Competitor mention",
    description: "Warn when responses mention listed competitor brands.",
    enabled: false,
    threshold: 0.5,
  },
  {
    id: "external-links",
    label: "External link allowlist",
    description: "Only emit links to the workspace allowlisted domains.",
    enabled: false,
  },
];

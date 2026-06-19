// AI config types — mirrors what an ai-router slice would expose
// (frontend/slices/ai-router/ today is barrel-only — to be filled
// during real-impl wave).
//
// BU-wave (2026-05-21) — third admin-panel block with real impl.

export type ProviderId = "openai" | "anthropic" | "mistral" | "google";

export type ProviderStatus = "connected" | "missing-key" | "rate-limited";

export type AiProvider = {
  id: ProviderId;
  label: string;
  /** Tailwind tone class for the provider badge. */
  tone: string;
  status: ProviderStatus;
  /** Last 4 of the API key (when connected). */
  keyTail?: string;
  docsUrl: string;
};

export type ModelTier = "fast" | "balanced" | "frontier";

export type AiModel = {
  id: string;
  provider: ProviderId;
  label: string;
  contextWindowK: number;
  /** USD per 1M input tokens. */
  inputCostUSD: number;
  /** USD per 1M output tokens. */
  outputCostUSD: number;
  tier: ModelTier;
};

export type ModerationRule = {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  /** Optional threshold for graded rules (0-1). */
  threshold?: number;
};

export type AiConfig = {
  activeModelId: string;
  systemPrompt: string;
  temperature: number;
  maxOutputTokens: number;
};

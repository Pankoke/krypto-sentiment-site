export type SourceType = "social" | "news" | "onchain";

export interface TopSignal {
  source: SourceType;
  evidence: string;
}

export interface AssetSentiment {
  symbol: string;
  sentiment: "bullish" | "neutral" | "bearish";
  score: number; // [-1, 1]
  confidence: number; // [0, 1]
  rationale: string;
  top_signals: TopSignal[];
}

export interface DailyCryptoSentiment {
  date: string; // YYYY-MM-DD
  universe: string[];
  assets: AssetSentiment[];
  macro_summary: string;
  method_note: string;
}

export type ArchiveItem = {
  date: string;
  assetsCount: number;
  macroSummary: string;
  symbols: string[];
  complete: boolean;
  avgScore: number;
  avgConfidence: number;
  generatedAt: string;
};

export interface NormalizedSourceEntry {
  id: string;
  asset: string;
  type: SourceType;
  title?: string;
  summary: string;
  source: string;
  url?: string;
  timestamp: string;
  importance: number;
  engagement?: number;
}

export interface AdapterEntryInput {
  source: string;
  type: SourceType;
  asset: string;
  summary?: string;
  title?: string;
  url?: string;
  timestamp?: string | Date;
  importance?: number;
  engagement?: number;
  externalId?: string;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStringArray(arr: unknown): arr is string[] {
  return Array.isArray(arr) && arr.every((v) => typeof v === "string");
}

function isTopSignalArray(arr: unknown): arr is TopSignal[] {
  const allowedSources: ReadonlyArray<SourceType> = ["social", "news", "onchain"] as const;
  return (
    Array.isArray(arr) &&
    arr.every((s) =>
      isObject(s) &&
      typeof s.source === "string" &&
      (allowedSources as readonly string[]).includes(s.source) &&
      typeof s.evidence === "string"
    )
  );
}

function isAssetSentimentArray(arr: unknown): arr is AssetSentiment[] {
  const allowedSentiments = ["bullish", "neutral", "bearish"] as const;
  return (
    Array.isArray(arr) &&
    arr.every((a) => {
      if (!isObject(a)) return false;
      const { symbol, sentiment, score, confidence, rationale, top_signals } = a as Record<string, unknown>;
      return (
        typeof symbol === "string" &&
        typeof sentiment === "string" &&
        (allowedSentiments as readonly string[]).includes(sentiment) &&
        typeof score === "number" && score >= -1 && score <= 1 &&
        typeof confidence === "number" && confidence >= 0 && confidence <= 1 &&
        typeof rationale === "string" &&
        isTopSignalArray(top_signals)
      );
    })
  );
}

export function isDailyCryptoSentiment(json: unknown): json is DailyCryptoSentiment {
  // Light guard: only core fields and basic ranges/patterns
  if (!isObject(json)) return false;
  const {
    date,
    universe,
    assets,
    macro_summary,
    method_note
  } = json as Record<string, unknown>;

  const dateOk = typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date);
  const universeOk = isStringArray(universe);
  const assetsOk = isAssetSentimentArray(assets);
  const stringsOk = typeof macro_summary === "string" && typeof method_note === "string";

  return dateOk && universeOk && assetsOk && stringsOk;
}

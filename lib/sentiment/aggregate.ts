import type { SentimentItem } from "./types";

export type GlobalSentimentLabel =
  | "very-bearish"
  | "bearish"
  | "neutral"
  | "bullish"
  | "very-bullish";

export type GlobalSentimentResult = {
  score: number;
  label: GlobalSentimentLabel;
  count: number;
};

const labelFromScore = (score: number): GlobalSentimentLabel => {
  if (score <= 0.2) return "very-bearish";
  if (score <= 0.4) return "bearish";
  if (score < 0.6) return "neutral";
  if (score < 0.8) return "bullish";
  return "very-bullish";
};

export function computeGlobalSentiment(items: SentimentItem[]): GlobalSentimentResult {
  if (!items.length) {
    return { score: 0.5, label: "neutral", count: 0 };
  }
  const total = items.reduce((sum, item) => sum + item.score, 0);
  const avg = total / items.length;
  return { score: avg, label: labelFromScore(avg), count: items.length };
}

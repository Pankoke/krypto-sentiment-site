export type SentimentTrend = 'bullish' | 'neutral' | 'bearish';

export interface SentimentBullet {
  group: 'news' | 'onchain' | 'social';
  text: string;
  source?: string; // e.g. link host
  ageMinutes?: number;
}

export interface SentimentItem {
  symbol: string; // 'BTC' | 'ETH' | ...
  score: number; // 0..1
  confidence: number; // 0..1
  trend: SentimentTrend;
  bullets: SentimentBullet[]; // 2–6 Stichpunkte
  generatedAt: string; // ISO
  sparkline: Array<{ t: number; c: number }>; // UTC ms + Close
}

export interface SentimentResponse {
  dateISO: string; // e.g. '2025-11-06'
  lastUpdatedISO: string; // ISO
  nextRefreshETASeconds?: number;
  items: SentimentItem[];
  dataWindowHours: number; // e.g. 24
  sourcesCount?: number;
}


export type SentimentTrend = 'bullish' | 'neutral' | 'bearish';

export interface SentimentBullet {
  group: 'news' | 'onchain' | 'social';
  text: string;
  source?: string;
  ageMinutes?: number;
}

export interface SentimentItem {
  symbol: string;
  name?: string;
  category?: string;
  score: number;
  confidence: number;
  trend: SentimentTrend;
  bullets: SentimentBullet[];
  generatedAt: string;
  sparkline: Array<{ t: number; c: number }>;
}

export interface SentimentResponse {
  dateISO: string;
  lastUpdatedISO: string;
  nextRefreshETASeconds?: number;
  items: SentimentItem[];
  dataWindowHours: number;
  sourcesCount?: number;
}

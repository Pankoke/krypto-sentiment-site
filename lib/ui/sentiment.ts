import type { AssetSentiment } from '../types';

export type SentimentTone = AssetSentiment['sentiment'];

export function toneLabel(tone: SentimentTone): string {
  switch (tone) {
    case 'bullish':
      return 'Bullish';
    case 'bearish':
      return 'Bearish';
    default:
      return 'Neutral';
  }
}

export function badgeClasses(tone: SentimentTone): string {
  switch (tone) {
    case 'bullish':
      return 'bg-green-50 text-green-700 ring-green-200';
    case 'bearish':
      return 'bg-red-50 text-red-700 ring-red-200';
    default:
      return 'bg-gray-50 text-gray-700 ring-gray-200';
  }
}

export function meterColor(tone: SentimentTone): string {
  switch (tone) {
    case 'bullish':
      return 'bg-green-500';
    case 'bearish':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}


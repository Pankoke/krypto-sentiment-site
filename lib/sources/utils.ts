import type { UnifiedPost } from '../types';

export const randomInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function timestampMinutesAgo(min: number, max: number): string {
  const minutesAgo = randomInt(min, max);
  return new Date(Date.now() - minutesAgo * 60_000).toISOString();
}

export function buildSocialPost(
  asset: string,
  snippet: string,
  engagementMin = 100,
  engagementMax = 1200
): UnifiedPost {
  return {
    source: 'social',
    asset,
    text: snippet,
    ts: timestampMinutesAgo(1, 30),
    engagement: randomInt(engagementMin, engagementMax),
  };
}

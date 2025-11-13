import crypto from 'node:crypto';
import { allowedTickerSet } from '../assets';
import type { AdapterEntryInput, NormalizedSourceEntry } from '../types';

export const SOURCE_TIMEOUT_MS = 6_000;
export const SOURCE_RETRY_LIMIT = 2;
export const SOURCE_BACKOFF_BASE_MS = 350;

const assetAliases: Record<string, string> = {
  BITCOIN: 'BTC',
  ETHEREUM: 'ETH',
  SOLANA: 'SOL',
  RIPPLE: 'XRP',
};

export const randomInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

export function timestampMinutesAgo(min: number, max: number): string {
  const minutesAgo = randomInt(min, max);
  return new Date(Date.now() - minutesAgo * 60_000).toISOString();
}

export function normalizeAssetTicker(asset?: string): string | undefined {
  if (!asset) return undefined;
  const normalized = asset.trim().toUpperCase();
  if (allowedTickerSet.has(normalized)) {
    return normalized;
  }
  return assetAliases[normalized];
}

export function normalizeTimestamp(value?: string | Date): string {
  if (!value) {
    return new Date().toISOString();
  }
  const parsed = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }
  return parsed.toISOString();
}

function clamp(value: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, value));
}

export function computeImportance(override?: number, engagement?: number): number {
  if (typeof override === 'number' && Number.isFinite(override)) {
    return clamp(override);
  }
  if (typeof engagement === 'number' && Number.isFinite(engagement)) {
    return clamp(engagement / 2000, 0.05, 0.95);
  }
  return 0.35;
}

export function createDeterministicId({
  source,
  externalId,
  asset,
  timestamp,
  summary,
  url,
}: {
  source: string;
  externalId?: string;
  asset: string;
  timestamp: string;
  summary: string;
  url?: string;
}): string {
  const hash = crypto.createHash('sha256');
  hash.update(`${source}|${asset}|${timestamp}|${externalId ?? ''}|${url ?? ''}|${summary}`);
  return hash.digest('hex');
}

export function normalizeAdapterEntry(entry: AdapterEntryInput): NormalizedSourceEntry | null {
  const asset = normalizeAssetTicker(entry.asset);
  if (!asset) return null;
  const summary = (entry.summary ?? entry.title ?? '').trim();
  if (!summary) return null;
  const timestamp = normalizeTimestamp(entry.timestamp);
  const importance = computeImportance(entry.importance, entry.engagement);
  const id = createDeterministicId({
    source: entry.source,
    asset,
    timestamp,
    summary,
    externalId: entry.externalId,
    url: entry.url,
  });
  return {
    id,
    asset,
    type: entry.type,
    title: entry.title?.trim(),
    summary,
    source: entry.source,
    url: entry.url,
    timestamp,
    importance,
    engagement: entry.engagement,
  };
}

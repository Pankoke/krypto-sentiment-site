import { locales } from '../../i18n';
import type { AggregatedReport } from './aggregator';
import { addDays, berlinDateString, berlinHour } from '../timezone';
import { listSnapshots as listPersistenceSnapshots } from '../persistence';
import {
  setSnapshot,
  getSnapshot,
  newsSnapshotKey,
  registerNewsDate,
  listNewsDates,
} from '../cache/redis';

export interface NewsSnapshot extends AggregatedReport {
  locale: string;
  generatedAt: string;
}

type SnapshotMeta = {
  snapshot: NewsSnapshot;
  path: string;
  size: number;
  mtime: string;
  date: string;
};

async function loadSnapshotMeta(date: string, locale: string): Promise<SnapshotMeta | null> {
  const snapshot = await getSnapshot<NewsSnapshot>(newsSnapshotKey(locale, date));
  if (!snapshot) {
    return null;
  }
  const payload = JSON.stringify(snapshot);
  return {
    snapshot,
    path: `redis://${newsSnapshotKey(locale, date)}`,
    size: Buffer.byteLength(payload, 'utf-8'),
    mtime: new Date().toISOString(),
    date,
  };
}

export type SnapshotLoadResult = {
  snapshot: NewsSnapshot | null;
  status: 'found' | 'missing' | 'error';
  path?: string;
  size?: number;
  mtime?: string;
  usedFallback?: boolean;
  fallbackDate?: string;
  fallbackReason?: string;
  reason?: string;
};

function logSnapshotAccess(locale: string, result: SnapshotLoadResult) {
  const snapshot = result.snapshot;
  if (!snapshot || !result.path) {
    return;
  }
  const payload = {
    locale,
    path: result.path,
    size: result.size,
    mtime: result.mtime,
    usedFallback: result.usedFallback ?? false,
    fallbackDate: result.fallbackDate,
    fallbackReason: result.fallbackReason,
    itemsTotal: snapshot.assets.length,
    dedupeCount: snapshot.dedupeCount ?? 0,
    adaptersFailed: snapshot.adapterWarnings?.length ?? 0,
  };
  console.info('News snapshot load', payload);
}

export async function loadSnapshotForLocale(locale: 'de' | 'en'): Promise<SnapshotLoadResult> {
  const now = new Date();
  const today = berlinDateString(now);
  try {
    const candidate = await loadSnapshotMeta(today, locale);
    if (candidate) {
      const result: SnapshotLoadResult = {
        snapshot: candidate.snapshot,
        status: 'found',
        path: candidate.path,
        size: candidate.size,
        mtime: candidate.mtime,
      };
      logSnapshotAccess(locale, result);
      return result;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('News snapshot error', { locale, date: today, message });
    return { snapshot: null, status: 'error', reason: message };
  }

  if (berlinHour(now) < 6) {
    const fallbackDate = berlinDateString(addDays(now, -1));
    try {
      const fallback = await loadSnapshotMeta(fallbackDate, locale);
      if (fallback) {
        const result: SnapshotLoadResult = {
          snapshot: fallback.snapshot,
          status: 'found',
          path: fallback.path,
          size: fallback.size,
          mtime: fallback.mtime,
          usedFallback: true,
          fallbackDate,
          fallbackReason: 'before-threshold',
        };
        logSnapshotAccess(locale, result);
        return result;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('News snapshot fallback error', { locale, date: fallbackDate, message });
      return { snapshot: null, status: 'error', reason: message };
    }
  }

  console.warn('News snapshot missing', { locale, date: today });
  return {
    snapshot: null,
    status: 'missing',
    reason: `No news snapshot for ${today}`,
    fallbackDate: berlinDateString(addDays(now, -1)),
  };
}

export async function persistDailyNewsSnapshots(
  report: AggregatedReport,
  options?: { locales?: Array<'de' | 'en'>; force?: boolean }
): Promise<void> {
  const timestamp = report.generatedAt ?? new Date().toISOString();
  const targetLocales = options?.locales ?? locales;
  for (const locale of targetLocales) {
    if (!options?.force) {
      const existing = await getSnapshot<NewsSnapshot>(newsSnapshotKey(locale, report.date));
      if (existing) {
        continue;
      }
    }
    const snapshot: NewsSnapshot = {
      ...report,
      locale,
      generatedAt: timestamp,
    };
    await setSnapshot(newsSnapshotKey(locale, report.date), snapshot);
    await registerNewsDate(locale, report.date);
  }
}

export async function listNewsSnapshots(locale: string): Promise<NewsSnapshot[]> {
  const dates = await listNewsDates(locale);
  const snapshots: NewsSnapshot[] = [];
  for (const date of dates) {
    const snapshot = await getSnapshot<NewsSnapshot>(newsSnapshotKey(locale, date));
    if (snapshot) {
      snapshots.push(snapshot);
    }
  }
  return snapshots;
}

export async function latestNewsSnapshot(locale: string): Promise<NewsSnapshot | null> {
  const snapshots = await listNewsSnapshots(locale);
  return snapshots[0] ?? null;
}

export type LatestSentimentSnapshot = {
  globalScore: number;
  assets: Array<{ ticker: string; score: number; sentiment: AggregatedReport['assets'][number]['sentiment']; confidence: number }>;
  timestamp: string;
};

export async function getLatestSentimentFromSnapshots(locale: string): Promise<LatestSentimentSnapshot | null> {
  const snapshots = await listNewsSnapshots(locale);
  const latest = snapshots[0];
  if (!latest || !latest.assets.length) {
    return null;
  }
  const scores = latest.assets.map((asset) => ({
    ticker: asset.symbol.toUpperCase(),
    score: asset.score,
    sentiment: asset.sentiment,
    confidence: asset.confidence,
  }));
  const total = scores.reduce((sum, item) => sum + item.score, 0);
  const globalScore = scores.length ? total / scores.length : 0;
  return {
    globalScore,
    assets: scores,
    timestamp: latest.generatedAt ?? new Date().toISOString(),
  };
}

export async function readNewsSnapshot(date: string, locale: string): Promise<NewsSnapshot | null> {
  return getSnapshot<NewsSnapshot>(newsSnapshotKey(locale, date));
}

export async function hasNewsSnapshotForDate(date: string): Promise<boolean> {
  const checks = await Promise.all(
    locales.map((locale) => getSnapshot<NewsSnapshot>(newsSnapshotKey(locale, date)))
  );
  return checks.some((snapshot) => Boolean(snapshot));
}

export interface AssetSentimentPoint {
  date: string;
  score: number;
}

export async function getAssetHistory(asset: string, days = 7, locale = 'de'): Promise<AssetSentimentPoint[]> {
  const snapshots = await listPersistenceSnapshots(locale);
  const limit = Math.min(Math.max(days, 1), 60);
  const selected = snapshots.slice(0, limit);
  const history: AssetSentimentPoint[] = [];
  const normalized = asset.toUpperCase();
  for (const snapshot of selected.reverse()) {
    const candidate = snapshot.assets.find((entry) => entry.asset === normalized);
    if (!candidate) continue;
    history.push({
      date: snapshot.date,
      score: candidate.score01,
    });
  }
  return history;
}

export type SnapshotMetadata = {
  date: string;
  locale: string;
  path: string;
  size: number;
  mtime: string;
  items: number;
  generatedAt: string;
  snapshot: NewsSnapshot;
};

export interface AssetCoverage {
  assetId: string;
  daysWithData: number;
}

export interface SnapshotOverview {
  totalDays: number;
  assetCoverage: AssetCoverage[];
}

function buildSnapshotWindow(daysBack: number): string[] {
  const normalizedDays = Math.max(1, Math.min(daysBack, 90));
  const now = new Date();
  const dates: string[] = [];
  for (let i = normalizedDays - 1; i >= 0; i -= 1) {
    dates.push(berlinDateString(addDays(now, -i)));
  }
  return dates;
}

export async function getSnapshotOverview(daysBack = 30): Promise<SnapshotOverview> {
  const windowDates = buildSnapshotWindow(daysBack);
  const windowSet = new Set(windowDates);
  const snapshotsByLocale = await Promise.all(locales.map((locale) => listNewsSnapshots(locale)));
  const coverageByDate = new Map<string, Set<string>>();

  for (const snapshots of snapshotsByLocale) {
    for (const snapshot of snapshots) {
      if (!windowSet.has(snapshot.date)) {
        continue;
      }
      const assets = coverageByDate.get(snapshot.date) ?? new Set<string>();
      for (const asset of snapshot.assets) {
        assets.add(asset.symbol.toUpperCase());
      }
      coverageByDate.set(snapshot.date, assets);
    }
  }

  const totalDays = coverageByDate.size;
  const assetCoverageMap = new Map<string, Set<string>>();
  for (const [date, assets] of coverageByDate.entries()) {
    for (const assetId of assets) {
      const days = assetCoverageMap.get(assetId) ?? new Set<string>();
      days.add(date);
      assetCoverageMap.set(assetId, days);
    }
  }

  const assetCoverage: AssetCoverage[] = Array.from(assetCoverageMap.entries())
    .map(([assetId, dates]) => ({
      assetId,
      daysWithData: dates.size,
    }))
    .sort((a, b) => b.daysWithData - a.daysWithData || a.assetId.localeCompare(b.assetId));

  return {
    totalDays,
    assetCoverage,
  };
}

export interface SnapshotHistoryPoint {
  date: string;
  assetsWithData: number;
}

export async function getSnapshotHistory(daysBack = 30): Promise<SnapshotHistoryPoint[]> {
  const windowDates = buildSnapshotWindow(daysBack);
  const windowSet = new Set(windowDates);
  const snapshotsByLocale = await Promise.all(locales.map((locale) => listNewsSnapshots(locale)));
  const coverageByDate = new Map<string, Set<string>>();

  for (const snapshots of snapshotsByLocale) {
    for (const snapshot of snapshots) {
      if (!windowSet.has(snapshot.date)) {
        continue;
      }
      const assets = coverageByDate.get(snapshot.date) ?? new Set<string>();
      for (const asset of snapshot.assets) {
        assets.add(asset.symbol.toUpperCase());
      }
      coverageByDate.set(snapshot.date, assets);
    }
  }

  return windowDates.map((date) => ({
    date,
    assetsWithData: coverageByDate.get(date)?.size ?? 0,
  }));
}

export async function listSnapshotMetadata(locale: string, limit = 7): Promise<SnapshotMetadata[]> {
  const dates = await listNewsDates(locale);
  const selected = dates.slice(0, limit);
  const metadata: SnapshotMetadata[] = [];
  for (const date of selected) {
    const snapshot = await getSnapshot<NewsSnapshot>(newsSnapshotKey(locale, date));
    if (!snapshot) continue;
    const payload = JSON.stringify(snapshot);
    metadata.push({
      date,
      locale,
      path: `redis://${newsSnapshotKey(locale, date)}`,
      size: Buffer.byteLength(payload, 'utf-8'),
      mtime: new Date().toISOString(),
      items: snapshot.assets.length,
      generatedAt: snapshot.generatedAt,
      snapshot,
    });
  }
  return metadata;
}

export async function loadLatestAvailableSnapshot(locale: 'de' | 'en'): Promise<SnapshotLoadResult | null> {
  try {
    const metadata = await listSnapshotMetadata(locale, 1);
    const latest = metadata[0];
    if (!latest) {
      return null;
    }
    return {
      snapshot: latest.snapshot,
      status: 'found',
      path: latest.path,
      size: latest.size,
      mtime: latest.mtime,
      usedFallback: true,
      fallbackDate: latest.date,
    };
  } catch {
    return null;
  }
}

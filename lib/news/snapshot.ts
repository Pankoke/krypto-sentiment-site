import { locales } from '../../i18n';
import type { AggregatedReport } from './aggregator';
import { addDays, berlinDateString, berlinHour } from '../timezone';
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

export async function readNewsSnapshot(date: string, locale: string): Promise<NewsSnapshot | null> {
  return getSnapshot<NewsSnapshot>(newsSnapshotKey(locale, date));
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

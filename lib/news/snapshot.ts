import { mkdir, readFile, readdir, stat, writeFile } from 'fs/promises';
import { join } from 'path';
import os from 'os';
import { locales } from '../../i18n';
import type { AggregatedReport } from './aggregator';
import { addDays, berlinDateString, berlinHour } from '../timezone';
const DATA_DIR = process.env.GENERATE_DATA_DIR ?? join(process.cwd(), 'data');

export interface NewsSnapshot extends AggregatedReport {
  locale: string;
  generatedAt: string;
}

const NEWS_DIR = join(DATA_DIR, 'news');
const FALLBACK_NEWS_DIR = join(os.tmpdir(), 'krypto-data', 'news');

async function loadSnapshot(date: string, locale: string): Promise<NewsSnapshot | null> {
  const pattern = `${date}.${locale}.json`;
  const directories = [NEWS_DIR, FALLBACK_NEWS_DIR];
  for (const dir of directories) {
    const filePath = join(dir, pattern);
    try {
      const raw = await readFile(filePath, 'utf8');
      return JSON.parse(raw) as NewsSnapshot;
    } catch {
      continue;
    }
  }
  return null;
}

type SnapshotMeta = {
  snapshot: NewsSnapshot;
  path: string;
  size: number;
  mtime: string;
  date: string;
};

async function loadSnapshotMeta(date: string, locale: string): Promise<SnapshotMeta | null> {
  const snapshot = await loadSnapshot(date, locale);
  if (!snapshot) {
    return null;
  }
  const file = snapshotPath(date, locale);
  const stats = await stat(file);
  return {
    snapshot,
    path: file,
    size: stats.size,
    mtime: stats.mtime.toISOString(),
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
  await mkdir(NEWS_DIR, { recursive: true }).catch(() => undefined);
  const timestamp = new Date().toISOString();
  const targetLocales = options?.locales ?? locales;
  for (const locale of targetLocales) {
    if (!options?.force) {
      const existing = await loadSnapshot(report.date, locale);
      if (existing) {
        continue;
      }
    }
    const snapshot: NewsSnapshot = {
      ...report,
      locale,
      generatedAt: timestamp,
    };
    const filePath = join(NEWS_DIR, `${report.date}.${locale}.json`);
    try {
      await writeFile(filePath, JSON.stringify(snapshot, null, 2) + '\n', 'utf8');
    } catch {
      await mkdir(FALLBACK_NEWS_DIR, { recursive: true });
      const fallbackPath = join(FALLBACK_NEWS_DIR, `${report.date}.${locale}.json`);
      await writeFile(fallbackPath, JSON.stringify(snapshot, null, 2) + '\n', 'utf8');
    }
  }
}

export async function listNewsSnapshots(locale: string): Promise<NewsSnapshot[]> {
  const directories = [NEWS_DIR, FALLBACK_NEWS_DIR];
  const pattern = new RegExp(`^\\d{4}-\\d{2}-\\d{2}\\.${locale}\\.json$`);
  const snapshots: NewsSnapshot[] = [];
  for (const dir of directories) {
    try {
      const files = await readdir(dir);
      for (const file of files) {
        if (!pattern.test(file)) continue;
        try {
          const raw = await readFile(join(dir, file), 'utf8');
          snapshots.push(JSON.parse(raw) as NewsSnapshot);
        } catch {
          // ignore corrupt
        }
      }
    } catch {
      // ignore missing dir
    }
  }
  snapshots.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return snapshots;
}

export async function latestNewsSnapshot(locale: string): Promise<NewsSnapshot | null> {
  const snapshots = await listNewsSnapshots(locale);
  return snapshots[0] ?? null;
}

export async function readNewsSnapshot(date: string, locale: string): Promise<NewsSnapshot | null> {
  return loadSnapshot(date, locale);
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
  const snapshots = await listNewsSnapshots(locale);
  const selected = snapshots.slice(0, limit);
  const metadata: SnapshotMetadata[] = [];
  for (const snapshot of selected) {
    const file = snapshotPath(snapshot.date, locale);
    try {
      const stats = await stat(file);
    metadata.push({
      date: snapshot.date,
      locale,
      path: file,
      size: stats.size,
      mtime: stats.mtime.toISOString(),
      items: snapshot.assets.length,
      generatedAt: snapshot.generatedAt,
      snapshot,
    });
    } catch {
      // ignore missing stats
    }
  }
  return metadata;
}

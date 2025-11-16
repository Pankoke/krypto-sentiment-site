import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

const DATA_DIR = join(process.cwd(), 'data');
const NEWS_DIR = join(DATA_DIR, 'news');
const REPORT_DIR = join(DATA_DIR, 'reports');
const LOCALES: Array<'de' | 'en'> = ['de', 'en'];

type SnapshotInfo = {
  date: string;
  path: string;
  count: number;
};

const matcherForLocale = (locale: 'de' | 'en') =>
  new RegExp(`^(\\d{4}-\\d{2}-\\d{2})\\.${locale}\\.json$`);

async function findLatestSnapshot(dir: string, locale: 'de' | 'en'): Promise<SnapshotInfo | null> {
  const files = await readdir(dir);
  const snapshots = files
    .map((file) => {
      const match = file.match(matcherForLocale(locale));
      if (!match) return null;
      return { file, date: match[1] };
    })
    .filter((entry): entry is { file: string; date: string } => Boolean(entry));
  if (snapshots.length === 0) {
    return null;
  }
  snapshots.sort((a, b) => b.date.localeCompare(a.date));
  const latest = snapshots[0];
  if (!latest) {
    return null;
  }
  const path = join(dir, latest.file);
  const raw = await readFile(path, 'utf8');
  const payload = JSON.parse(raw) as { assets?: unknown[] };
  const count = Array.isArray(payload.assets) ? payload.assets.length : 0;
  return { date: latest.date, path, count };
}

async function aggregateSnapshots(dir: string): Promise<{
  total: number;
  latestPath: string | null;
  latestDate: string | null;
}> {
  const results = await Promise.all(LOCALES.map((locale) => findLatestSnapshot(dir, locale)));
  const entries = results.filter((result): result is SnapshotInfo => result !== null);
  const total = entries.reduce((sum, entry) => sum + entry.count, 0);
  const latest = entries.sort((a, b) => b.date.localeCompare(a.date))[0] ?? null;
  return {
    total,
    latestPath: latest?.path ?? null,
    latestDate: latest?.date ?? null,
  };
}

export const runtime = 'nodejs';

export async function GET() {
  try {
    const news = await aggregateSnapshots(NEWS_DIR);
    const reports = await aggregateSnapshots(REPORT_DIR);
    let lastRunStatus: 'ok' | 'partial' | 'fail' = 'fail';
    if (news.total > 0 && reports.total > 0) {
      lastRunStatus = 'ok';
    } else if (news.total > 0 || reports.total > 0) {
      lastRunStatus = 'partial';
    }

    return NextResponse.json({
      lastRunStatus,
      news: {
        lastNewsSnapshotDate: news.latestDate,
        newsItemsCount: news.total,
        resolvedFilePath: news.latestPath,
      },
      reports: {
        lastReportsSnapshotDate: reports.latestDate,
        assetsCount: reports.total,
        resolvedFilePath: reports.latestPath,
      },
    });
  } catch (error) {
    console.error('Health read failed', error);
    return NextResponse.json(
      {
        lastRunStatus: 'fail',
        news: {
          lastNewsSnapshotDate: null,
          newsItemsCount: 0,
          resolvedFilePath: null,
        },
        reports: {
          lastReportsSnapshotDate: null,
          assetsCount: 0,
          resolvedFilePath: null,
        },
      },
      { headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }
}

import { NextResponse } from 'next/server';
import { listSnapshotMetadata } from '../../../lib/news/snapshot';
import { writeLog } from 'lib/monitoring/logs';

const LOCALES: Array<'de' | 'en'> = ['de', 'en'];
const STALE_THRESHOLD_MS = Number(process.env.HEALTH_STALE_THRESHOLD_MS ?? 24 * 60 * 60 * 1000);
const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' } as const;

type HealthStatus = 'ok' | 'partial' | 'stale' | 'warming_up' | 'fail';

interface HealthTopic {
  lastSnapshotDate: string | null;
  generatedAt: string | null;
  itemsCount: number;
  resolvedFilePath: string | null;
}

interface HealthResponse {
  status: HealthStatus;
  news: HealthTopic;
  reports: HealthTopic;
  latestGeneratedAt: string | null;
  staleThresholdMs: number;
  warnings: string[];
}

export const runtime = 'nodejs';

function buildHealthTopic(entry: { date: string; generatedAt: string; items: number; path: string } | null): HealthTopic {
  return {
    lastSnapshotDate: entry?.date ?? null,
    generatedAt: entry?.generatedAt ?? null,
    itemsCount: entry?.items ?? 0,
    resolvedFilePath: entry?.path ?? null,
  };
}

function resolveLatestEntry(entries: Array<{ generatedAt: string }>): { generatedAt: string } | null {
  if (!entries.length) {
    return null;
  }
  return entries.reduce<{ generatedAt: string } | null>((latest, current) => {
    if (!latest) return current;
    if (!current.generatedAt) return latest;
    if (!latest.generatedAt) return current;
    return current.generatedAt > latest.generatedAt ? current : latest;
  }, null);
}

export async function GET() {
  try {
    const newsMetadata = await Promise.all(LOCALES.map((locale) => listSnapshotMetadata(locale, 1)));
    const reportsMetadata = await Promise.all(LOCALES.map((locale) => listSnapshotMetadata(locale, 1)));

    const newsEntries = newsMetadata.flat().map((meta) => ({
      ...meta,
      locale: meta.locale as 'de' | 'en',
    }));
    const reportsEntries = reportsMetadata.flat().map((meta) => ({
      ...meta,
      locale: meta.locale as 'de' | 'en',
    }));

    const totalNewsItems = newsEntries.reduce((sum, entry) => sum + entry.items, 0);
    const totalReportAssets = reportsEntries.reduce((sum, entry) => sum + entry.items, 0);

    const latestNews = newsEntries.sort((a, b) => b.date.localeCompare(a.date))[0] ?? null;
    const latestReport = reportsEntries.sort((a, b) => b.date.localeCompare(a.date))[0] ?? null;
    const allEntries = [...newsEntries, ...reportsEntries];
    const latestGeneratedEntry = resolveLatestEntry(allEntries);
    const latestGeneratedAt = latestGeneratedEntry?.generatedAt ?? null;

    const now = Date.now();
    const generatedTimestamp = latestGeneratedAt ? Date.parse(latestGeneratedAt) : NaN;
    const ageMs = Number.isNaN(generatedTimestamp) ? Infinity : now - generatedTimestamp;
    const isStale = ageMs > STALE_THRESHOLD_MS;
    const hasSnapshots = allEntries.length > 0;

    let status: HealthStatus = 'fail';
    if (!hasSnapshots) {
      status = 'warming_up';
    } else if (isStale) {
      status = 'stale';
    } else if (totalNewsItems > 0 && totalReportAssets > 0) {
      status = 'ok';
    } else {
      status = 'partial';
    }

    if (status === 'stale') {
      await writeLog({
        level: 'warn',
        message: `Health ${status}`,
        context: 'api/health',
      });
    }

    const warnings: string[] = [];
    if (status === 'warming_up') {
      warnings.push('No snapshots available yet.');
    } else if (status === 'stale') {
      warnings.push(`Latest snapshot is older than ${STALE_THRESHOLD_MS}ms.`);
    }

    const response: HealthResponse = {
      status,
      staleThresholdMs: STALE_THRESHOLD_MS,
      latestGeneratedAt,
      warnings,
      news: buildHealthTopic(latestNews),
      reports: buildHealthTopic(latestReport),
    };

    return NextResponse.json(response, { headers: JSON_HEADERS });
  } catch (error) {
    console.error('Health read failed', error);
    await writeLog({
      level: 'error',
      message: 'Health read failed',
      context: 'api/health',
    });
    const fallback: HealthResponse = {
      status: 'fail',
      staleThresholdMs: STALE_THRESHOLD_MS,
      latestGeneratedAt: null,
      warnings: ['Health read failed'],
      news: {
        lastSnapshotDate: null,
        generatedAt: null,
        itemsCount: 0,
        resolvedFilePath: null,
      },
      reports: {
        lastSnapshotDate: null,
        generatedAt: null,
        itemsCount: 0,
        resolvedFilePath: null,
      },
    };
    return NextResponse.json(fallback, { headers: JSON_HEADERS });
  }
}

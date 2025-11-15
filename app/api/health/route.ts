import { NextResponse } from 'next/server';
import { readDailyRunMetrics } from '../../../lib/generate/metrics';
import { listNewsSnapshots } from '../../../lib/news/snapshot';
import { listSnapshots } from '../../../lib/persistence';

export const runtime = 'nodejs';

export async function GET() {
  const metrics = await readDailyRunMetrics();
  const newsSnapshots = await listNewsSnapshots('de');
  const latestNews = newsSnapshots[0];
  const reportSnapshots = await listSnapshots('de');
  const latestReport = reportSnapshots[0];
  const newsItemsCount = metrics?.news?.items ?? latestNews?.assets.length ?? 0;
  const assetsCount = metrics?.reports?.assets ?? latestReport?.assets.length ?? 0;
  const response = {
    ok: true,
    lastRunStatus: metrics?.status ?? 'unknown',
    news: {
      lastNewsSnapshotDate: metrics?.date ?? latestNews?.date ?? null,
      newsItemsCount,
      warnings: metrics?.news?.warnings ?? [],
    },
    reports: {
      lastReportsSnapshotDate: metrics?.date ?? latestReport?.date ?? null,
      assetsCount,
      warnings: metrics?.reports?.warnings ?? [],
    },
    summary: metrics,
  };
  return NextResponse.json(response);
}

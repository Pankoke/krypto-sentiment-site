import { NextResponse } from 'next/server';
import { readNewsMetrics } from '../../../lib/news/metrics';
import { listNewsSnapshots } from '../../../lib/news/snapshot';

export const runtime = 'nodejs';

export async function GET() {
  const metrics = await readNewsMetrics();
  const snapshots = await listNewsSnapshots('de');
  const latest = snapshots[0];
  return NextResponse.json({
    ok: true,
    news: {
      lastNewsSnapshotDate: metrics?.timestamp ?? latest?.generatedAt ?? null,
      newsItemsCount: metrics?.items ?? latest?.assets.length ?? 0,
      dedupeRatio: metrics?.dedupeRatio ?? null,
      warnings: metrics?.warnings ?? [],
    },
  });
}

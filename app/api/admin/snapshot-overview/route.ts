import { NextResponse } from 'next/server';
import { getSnapshotOverview } from 'lib/news/snapshot';
import { requireAdminSecret, AdminAuthError } from '../../../../lib/admin/auth';

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' } as const;

export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    requireAdminSecret(req);
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: JSON_HEADERS });
    }
    throw error;
  }
  const searchParams = new URL(req.url).searchParams;
  const daysParam = Number(searchParams.get('days') ?? '30');
  const daysBack = Number.isNaN(daysParam) ? 30 : Math.max(1, Math.min(daysParam, 90));
  const overview = await getSnapshotOverview(daysBack);
  return NextResponse.json(overview, { headers: JSON_HEADERS });
}

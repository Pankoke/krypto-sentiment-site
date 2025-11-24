import { NextResponse } from 'next/server';
import { getRecentLogs } from 'lib/monitoring/logs';
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
  const limitParam = Number(searchParams.get('limit') ?? '50');
  const days = Number.isNaN(limitParam) ? 50 : Math.max(1, Math.min(limitParam, 200));
  const logs = await getRecentLogs(days);
  return NextResponse.json(logs, { headers: JSON_HEADERS });
}

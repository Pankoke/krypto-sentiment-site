import { NextResponse } from 'next/server';
import redis, { isIoredisClient } from 'lib/cache/redis';
import { requireAdminSecret, AdminAuthError } from '../../../../lib/admin/auth';

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' } as const;
const SNAPSHOT_PREFIXES = ['news:', 'reports:', 'metrics:', 'daily-run-lock:', 'news:dates:'];

export const runtime = 'nodejs';

interface ClearSnapshotsResponse {
  status: 'ok' | 'error';
  deletedKeys?: number;
  message?: string;
}

export async function POST(request: Request) {
  try {
    requireAdminSecret(request);
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: JSON_HEADERS });
    }
    throw error;
  }
  try {
    const keySet = new Set<string>();
    for (const prefix of SNAPSHOT_PREFIXES) {
      const found = await redis.keys(`${prefix}*`);
      for (const key of found) {
        keySet.add(key);
      }
    }
    const keys = [...keySet];
    let deleted = 0;
    if (keys.length) {
      if (isIoredisClient(redis)) {
        deleted = await redis.del(...keys);
      } else {
        for (const key of keys) {
          deleted += await redis.del(key);
        }
      }
    }
    const response: ClearSnapshotsResponse = {
      status: 'ok',
      deletedKeys: deleted,
    };
    return NextResponse.json(response, { headers: JSON_HEADERS });
  } catch (error) {
    const response: ClearSnapshotsResponse = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to clear snapshots',
    };
    return NextResponse.json(response, { status: 500, headers: JSON_HEADERS });
  }
}

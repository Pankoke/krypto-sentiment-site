import { NextResponse } from 'next/server';

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' } as const;

function getCronSecret(): string | null {
  return process.env.CRON_SECRET ?? process.env.NEWS_GENERATE_SECRET ?? null;
}

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const secret = getCronSecret();
  if (!secret) {
    return NextResponse.json(
      { status: 'fail', runStatus: 'failed', reason: 'Missing cron secret' },
      { status: 500, headers: JSON_HEADERS }
    );
  }

  const incomingUrl = new URL(req.url);
  const targetUrl = new URL('/api/generate/daily-run', incomingUrl.origin);
  targetUrl.searchParams.set('key', secret);

  const response = await fetch(targetUrl.toString(), {
    method: 'GET',
    headers: {
      'x-cron-secret': secret,
    },
  });

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch (_) {
    payload = null;
  }

  return NextResponse.json(payload ?? { status: 'fail', runStatus: 'failed', reason: 'No response body' }, {
    headers: JSON_HEADERS,
    status: response.status,
  });
}

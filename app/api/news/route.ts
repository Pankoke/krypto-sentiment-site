import { NextResponse } from 'next/server';
import { aggregateNews } from '../../../lib/news/aggregator';
import { latestNewsSnapshot, persistDailyNewsSnapshots } from '../../../lib/news/snapshot';

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' } as const;

type AggregatedOptions = {
  universe?: string[];
  since?: string;
  force?: boolean;
};

function parseUniverseParam(param: string | null): string[] | undefined {
  if (!param) return undefined;
  const list = param
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return list.length ? list : undefined;
}

function sanitizeUniverseInput(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const list = value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);
  return list.length ? list : undefined;
}

async function handleReportRequest(options?: AggregatedOptions) {
  try {
    if (!options?.force) {
      const snapshot = await latestNewsSnapshot('en');
      if (snapshot) {
        return NextResponse.json(snapshot, { headers: JSON_HEADERS });
      }
    }
    const report = await aggregateNews(options);
    await persistDailyNewsSnapshots(report);
    return NextResponse.json(report, { headers: JSON_HEADERS });
  } catch (error) {
    console.error('Aggregationsfehler:', error);
    const message = error instanceof Error ? error.message : 'Aggregator-Fehler';
    return NextResponse.json({ error: message }, { status: 500, headers: JSON_HEADERS });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const options: AggregatedOptions = {
    universe: parseUniverseParam(url.searchParams.get('universe')),
    since: url.searchParams.get('since') ?? undefined,
    force: url.searchParams.get('refresh') === '1',
  };
  return handleReportRequest(options);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const payloadBody =
    body && typeof body === 'object' ? (body as Record<string, unknown>) : undefined;
  const options: AggregatedOptions = {
    universe: sanitizeUniverseInput(payloadBody?.universe),
    since: typeof payloadBody?.since === 'string' ? payloadBody.since : undefined,
    force: payloadBody?.force === true,
  };
  return handleReportRequest(options);
}

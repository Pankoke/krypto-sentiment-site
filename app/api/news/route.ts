import { NextResponse } from 'next/server';
import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { aggregateNews, type AggregatedReport } from '../../../lib/news/aggregator';

const REPORTS_DIR = path.join(process.cwd(), 'data', 'reports');
const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' } as const;

function parseUniverseParam(param: string | null): string[] | undefined {
  if (!param) {
    return undefined;
  }
  const list = param
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return list.length ? list : undefined;
}

function sanitizeUniverseInput(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const list = value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);
  return list.length ? list : undefined;
}

async function persistReport(report: AggregatedReport): Promise<void> {
  await mkdir(REPORTS_DIR, { recursive: true });
  const targetFile = path.join(REPORTS_DIR, `${report.date}-news.json`);
  await writeFile(targetFile, JSON.stringify(report, null, 2), 'utf8');
}

type AggregatedOptions = {
  universe?: string[];
  since?: string;
  page?: number;
  limit?: number;
};

function parsePositiveInt(param: string | null, fallback: number): number {
  const value = Number(param);
  if (Number.isNaN(value) || value < 1) {
    return fallback;
  }
  return Math.floor(value);
}

async function handleReportRequest(options?: AggregatedOptions) {
  try {
    const report = await aggregateNews(options);
    let fsWarning: string | undefined;
    try {
      await persistReport(report);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'unbekannter Dateifehler';
      fsWarning = `Dateischreibung fehlgeschlagen: ${message}`;
    }
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 4;
    const totalAssets = report.assets.length;
    const start = (page - 1) * limit;
    const paginatedAssets = report.assets.slice(start, start + limit);
    const paginatedReport = {
      ...report,
      assets: paginatedAssets,
      pagination: {
        page,
        limit,
        total: totalAssets,
        hasMore: start + limit < totalAssets,
      },
    };
    if (fsWarning) {
      paginatedReport.method_note = `${report.method_note} | Hinweis: ${fsWarning}`;
    }
    return NextResponse.json(paginatedReport, { headers: JSON_HEADERS });
  } catch (error) {
    console.error('Aggregationsfehler:', error);
    const message = error instanceof Error ? error.message : 'Aggregator-Fehler';
    return NextResponse.json({ error: message }, { status: 500, headers: JSON_HEADERS });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const options = {
    universe: parseUniverseParam(url.searchParams.get('universe')),
    since: url.searchParams.get('since') ?? undefined,
    page: parsePositiveInt(url.searchParams.get('page'), 1),
    limit: parsePositiveInt(url.searchParams.get('limit'), 4),
  };
  return handleReportRequest(options);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const payloadBody =
    body && typeof body === 'object' ? (body as Record<string, unknown>) : undefined;
  const options = {
    universe: sanitizeUniverseInput(payloadBody?.universe),
    since:
      typeof payloadBody?.since === 'string' ? payloadBody.since : undefined,
  };
  return handleReportRequest(options);
}

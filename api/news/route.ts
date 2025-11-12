import { NextResponse } from 'next/server';
import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { aggregateNews, type AggregatedReport } from 'lib/news/aggregator';

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

async function handleReportRequest(options?: {
  universe?: string[];
  since?: string;
}) {
  try {
    const report = await aggregateNews(options);
    let fsWarning: string | undefined;
    try {
      await persistReport(report);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'unbekannter Dateifehler';
      fsWarning = `Dateischreibung fehlgeschlagen: ${message}`;
    }
    const payload = fsWarning
      ? {
          ...report,
          method_note: `${report.method_note} | Hinweis: ${fsWarning}`,
        }
      : report;
    return NextResponse.json(payload, { headers: JSON_HEADERS });
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

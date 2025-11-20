import { generateDailyReport, type DailyGenerateMode } from '../../../lib/daily/generator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' } as const;

export async function GET(req: Request): Promise<Response> {
  const secret = process.env.DAILY_API_SECRET ?? null;
  if (!secret) {
    return Response.json(
      { ok: false, error: 'Daily API secret is not configured.' },
      { status: 500, headers: JSON_HEADERS }
    );
  }

  const url = new URL(req.url);
  const key = url.searchParams.get('key') ?? req.headers.get('x-daily-secret');
  if (key !== secret) {
    return Response.json({ error: 'Forbidden' }, { status: 403, headers: JSON_HEADERS });
  }

  try {
    const modeParam = url.searchParams.get('mode');
    const mode: DailyGenerateMode = modeParam === 'skip' ? 'skip' : 'overwrite';

    const result = await generateDailyReport({ mode });
    const saved = `/data/reports/${result.report.date}.json`;
    return Response.json(
      {
        ok: true,
        date: result.report.date,
        assets: result.report.assets.length,
        mode,
        skipped: result.skipped,
        saved,
      },
      { headers: JSON_HEADERS }
    );
  } catch (err: unknown) {
    // Loggen für Diagnose
    // eslint-disable-next-line no-console
    console.error('daily-report error', err);
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ ok: false, error: message }, { status: 500, headers: JSON_HEADERS });
  }
}

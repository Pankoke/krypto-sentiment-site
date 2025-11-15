import { locales } from '../../../../i18n';
import { generateDailyReport, type DailyGenerateMode } from '../../../../lib/daily/generator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' } as const;

export async function GET(req: Request): Promise<Response> {
  const secret = process.env.DAILY_API_SECRET ?? process.env.CRON_SECRET;
  if (!secret) {
    return Response.json(
      { ok: false, error: 'Daily generator secret is not configured.' },
      { status: 500, headers: JSON_HEADERS }
    );
  }

  const url = new URL(req.url);
  const key = url.searchParams.get('key');
  if (key !== secret) {
    return Response.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401, headers: JSON_HEADERS }
    );
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
        locales,
        skipped: result.skipped,
        mode,
        saved,
      },
      { headers: JSON_HEADERS }
    );
  } catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.error('daily-generate error', err);
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ ok: false, error: message }, { status: 500, headers: JSON_HEADERS });
  }
}

import { generateDailyReport, type DailyGenerateMode } from '../../../../lib/daily/generator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' } as const;

type TriggerResponse =
  | {
      ok: true;
      date: string;
      assets: number;
      saved: string;
      mode: DailyGenerateMode;
      skipped: boolean;
    }
  | { ok: false; error: string };

function buildForbidden(): Response {
  return Response.json({ error: 'Forbidden' }, { status: 403, headers: JSON_HEADERS });
}

export async function GET(req: Request): Promise<Response> {
  const secret = process.env.DAILY_API_SECRET ?? null;
  if (!secret) {
    const payload: TriggerResponse = { ok: false, error: 'Daily API secret is not configured.' };
    return Response.json(payload, { status: 500, headers: JSON_HEADERS });
  }

  const url = new URL(req.url);
  const key = url.searchParams.get('key') ?? req.headers.get('x-daily-secret');
  if (key !== secret) {
    return buildForbidden();
  }

  try {
    const modeParam = url.searchParams.get('mode');
    const mode: DailyGenerateMode = modeParam === 'skip' ? 'skip' : 'overwrite';
    const result = await generateDailyReport({ mode });
    const saved = `/data/reports/${result.report.date}.json`;

    const payload: TriggerResponse = {
      ok: true,
      date: result.report.date,
      assets: result.report.assets.length,
      saved,
      mode,
      skipped: result.skipped,
    };
    return Response.json(payload, { headers: JSON_HEADERS });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const payload: TriggerResponse = { ok: false, error: message };
    return Response.json(payload, { status: 500, headers: JSON_HEADERS });
  }
}

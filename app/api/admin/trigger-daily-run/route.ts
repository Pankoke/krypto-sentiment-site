import { generateDailyReport, type DailyGenerateMode } from '../../../../lib/daily/generator';
import { requireAdminSecret, AdminAuthError } from '../../../../lib/admin/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' } as const;

type TriggerMode = 'triggered' | 'skipped';

type TriggerResponse =
  | {
      ok: true;
      mode: TriggerMode;
      date: string;
      assets: number;
      saved: string;
      skipped: boolean;
    }
  | { ok: false; error: string };

export async function GET(req: Request): Promise<Response> {
  try {
    requireAdminSecret(req);
  } catch (error) {
    if (error instanceof AdminAuthError) {
      const payload: TriggerResponse = { ok: false, error: 'Unauthorized' };
      return Response.json(payload, { status: 401, headers: JSON_HEADERS });
    }
    throw error;
  }
  const secret = process.env.DAILY_API_SECRET ?? process.env.CRON_SECRET;
  const url = new URL(req.url);
  const key = url.searchParams.get('key');
  if (secret && key !== secret) {
    const payload: TriggerResponse = { ok: false, error: 'Forbidden' };
    return Response.json(payload, { status: 403, headers: JSON_HEADERS });
  }

  try {
    const modeParam = url.searchParams.get('mode');
    const mode: DailyGenerateMode = modeParam === 'skip' ? 'skip' : 'overwrite';
    const result = await generateDailyReport({ mode });
    const saved = `/data/reports/${result.report.date}.json`;

    const payload: TriggerResponse = {
      ok: true,
      mode: result.skipped ? 'skipped' : 'triggered',
      date: result.report.date,
      assets: result.report.assets.length,
      saved,
      skipped: result.skipped,
    };
    return Response.json(payload, { headers: JSON_HEADERS });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const payload: TriggerResponse = { ok: false, error: message };
    return Response.json(payload, { status: 500, headers: JSON_HEADERS });
  }
}

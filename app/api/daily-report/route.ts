import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { fetchAllSources } from '../../../lib/sources';
import { runDailySentiment } from '../../../lib/sentiment';
import type { DailyCryptoSentiment } from '../../../lib/types';

export const runtime = 'nodejs';

export async function GET(req: Request): Promise<Response> {
  try {
    const secret = process.env.CRON_SECRET;
    if (secret) {
      const url = new URL(req.url);
      const key = url.searchParams.get('key');
      if (key !== secret) {
        return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
      }
    }
    const posts = await fetchAllSources();
    const report: DailyCryptoSentiment = await runDailySentiment(posts);

    const dir = join(process.cwd(), 'data', 'reports');
    await mkdir(dir, { recursive: true });

    const filename = `${report.date}.json`;
    const fullPath = join(dir, filename);
    await writeFile(fullPath, JSON.stringify(report, null, 2) + '\n', 'utf8');

    const saved = `/data/reports/${filename}`;
    return Response.json({ ok: true, saved });
  } catch (err: unknown) {
    // Loggen für Diagnose
    // eslint-disable-next-line no-console
    console.error('daily-report error', err);
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}

import { access, constants, mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { fetchAllSources } from '../sources';
import { aggregateNews } from '../news/aggregator';
import { persistDailyNewsSnapshots } from '../news/snapshot';
import { runDailySentiment } from '../sentiment';
import { persistDailySnapshots } from '../persistence';
import type { DailyCryptoSentiment } from '../types';

const REPORT_DIR = join(process.cwd(), 'data', 'reports');

export type DailyGenerateMode = 'overwrite' | 'skip';

export interface DailyGenerationResult {
  report: DailyCryptoSentiment;
  path: string;
  skipped: boolean;
}

const reportFile = (date: string) => join(REPORT_DIR, `${date}.json`);

async function exists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function generateDailyReport(
  options?: { mode?: DailyGenerateMode; date?: string }
): Promise<DailyGenerationResult> {
  const posts = await fetchAllSources();
  const report = await runDailySentiment(posts);
  const dateForFile = options?.date ?? report.date;
  const path = reportFile(dateForFile);
  report.date = dateForFile;
  const alreadyExists = await exists(path);
  const mode = options?.mode ?? 'overwrite';

  if (mode === 'skip' && alreadyExists) {
    return { report, path, skipped: true };
  }

  await mkdir(REPORT_DIR, { recursive: true });
  await writeFile(path, JSON.stringify(report, null, 2) + '\n', 'utf8');
  await persistDailySnapshots(report);
  try {
    const newsReport = await aggregateNews();
    await persistDailyNewsSnapshots(newsReport, { force: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('news snapshot failed', error);
  }

  return { report, path, skipped: false };
}

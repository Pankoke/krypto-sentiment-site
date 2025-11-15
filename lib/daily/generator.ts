import { access, constants, mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { fetchAllSources } from '../sources';
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
  options?: { mode?: DailyGenerateMode }
): Promise<DailyGenerationResult> {
  const posts = await fetchAllSources();
  const report = await runDailySentiment(posts);
  const path = reportFile(report.date);
  const alreadyExists = await exists(path);
  const mode = options?.mode ?? 'overwrite';

  if (mode === 'skip' && alreadyExists) {
    return { report, path, skipped: true };
  }

  await mkdir(REPORT_DIR, { recursive: true });
  await writeFile(path, JSON.stringify(report, null, 2) + '\n', 'utf8');
  await persistDailySnapshots(report);

  return { report, path, skipped: false };
}

import { access, constants, mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import os from 'os';
import { fetchAllSources } from '../sources';
import { aggregateNews } from '../news/aggregator';
import { persistDailyNewsSnapshots } from '../news/snapshot';
import { runDailySentiment } from '../sentiment';
import { persistDailySnapshots } from '../persistence';
import type { DailyCryptoSentiment } from '../types';

const DATA_DIR = process.env.GENERATE_DATA_DIR ?? join(process.cwd(), 'data');
const FALLBACK_REPORT_DIR = join(os.tmpdir(), 'krypto-data', 'reports');
const REPORT_DIR = join(DATA_DIR, 'reports');

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

  try {
    await mkdir(REPORT_DIR, { recursive: true });
  } catch {
    // ignore
  }
  const filePath = join(REPORT_DIR, `${dateForFile}.json`);
  let writtenPath = filePath;
  try {
    await writeFile(filePath, JSON.stringify(report, null, 2) + '\n', 'utf8');
  } catch {
    await mkdir(FALLBACK_REPORT_DIR, { recursive: true });
    const fallbackPath = join(FALLBACK_REPORT_DIR, `${dateForFile}.json`);
    await writeFile(fallbackPath, JSON.stringify(report, null, 2) + '\n', 'utf8');
    writtenPath = fallbackPath;
  }
  await persistDailySnapshots(report);
  try {
    const newsReport = await aggregateNews();
    await persistDailyNewsSnapshots(newsReport, { force: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('news snapshot failed', error);
  }

  return { report, path: writtenPath, skipped: false };
}

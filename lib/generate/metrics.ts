import { mkdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import os from 'os';

export type DailyRunMetrics = {
  date: string;
  locales: Array<'de' | 'en'>;
  news: {
    ok: boolean;
    items: number;
    warnings: string[];
    durationMs: number;
  };
  reports: {
    ok: boolean;
    assets: number;
    warnings: string[];
    durationMs: number;
  };
  partial: boolean;
  durationMs: number;
  status: 'ok' | 'partial' | 'fail';
};

const METRICS_DIR = join(os.tmpdir(), 'krypto-generate');
const METRICS_FILE = join(METRICS_DIR, 'daily-run.json');

export async function saveDailyRunMetrics(metrics: DailyRunMetrics): Promise<void> {
  await mkdir(METRICS_DIR, { recursive: true });
  await writeFile(METRICS_FILE, JSON.stringify(metrics, null, 2) + '\n', 'utf8');
}

export async function readDailyRunMetrics(): Promise<DailyRunMetrics | null> {
  try {
    const raw = await readFile(METRICS_FILE, 'utf8');
    return JSON.parse(raw) as DailyRunMetrics;
  } catch {
    return null;
  }
}

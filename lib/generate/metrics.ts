import { mkdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { ensurePersistenceAllowed, isPersistenceAllowed } from '../persistenceGuard';

const DATA_DIR = process.env.GENERATE_DATA_DIR ?? join(process.cwd(), 'data');
const METRICS_DIR = join(DATA_DIR, 'metrics');
const METRICS_FILE = join(METRICS_DIR, 'daily-run.json');

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

export type DailyRunDumpMetrics = {
  date: string;
  locales: Array<'de' | 'en'>;
  newsItemsDE: number;
  newsItemsEN: number;
  assetsCount: number;
  partial: boolean;
  durationMs: number;
  commit: string;
};

export async function saveDailyRunMetrics(metrics: DailyRunMetrics): Promise<void> {
  if (!isPersistenceAllowed()) {
    console.warn('Daily run metrics persistence skipped (production/git-locked environment).');
    return;
  }
  ensurePersistenceAllowed();
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

export async function writeDailyRunDumpMetrics(metrics: DailyRunDumpMetrics): Promise<void> {
  if (!isPersistenceAllowed()) {
    console.warn('Daily run dump persistence skipped (production/git-locked environment).');
    return;
  }
  ensurePersistenceAllowed();
  await mkdir(METRICS_DIR, { recursive: true });
  await writeFile(METRICS_FILE, JSON.stringify(metrics, null, 2) + '\n', 'utf8');
}

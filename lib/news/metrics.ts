import { mkdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

export interface NewsMetrics {
  timestamp: string;
  durationMs: number;
  items: number;
  dedupeRatio: number;
  warnings: string[];
}

const DATA_DIR = process.env.GENERATE_DATA_DIR ?? join(process.cwd(), 'data');
const METRICS_DIR = join(DATA_DIR, 'news');
const METRICS_FILE = join(METRICS_DIR, 'metrics.json');

export async function saveNewsMetrics(metrics: NewsMetrics): Promise<void> {
  await mkdir(METRICS_DIR, {
    recursive: true,
  });
  await writeFile(METRICS_FILE, JSON.stringify(metrics, null, 2) + '\n', 'utf8');
}

export async function readNewsMetrics(): Promise<NewsMetrics | null> {
  try {
    const raw = await readFile(METRICS_FILE, 'utf8');
    return JSON.parse(raw) as NewsMetrics;
  } catch {
    return null;
  }
}

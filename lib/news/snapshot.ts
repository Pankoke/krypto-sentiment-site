import { mkdir, readFile, readdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { locales } from '../../i18n';
import type { AggregatedReport } from './aggregator';

export interface NewsSnapshot extends AggregatedReport {
  locale: string;
  generatedAt: string;
}

const NEWS_DIR = join(process.cwd(), 'data', 'news');

function snapshotPath(date: string, locale: string) {
  return join(NEWS_DIR, `${date}.${locale}.json`);
}

async function loadSnapshot(date: string, locale: string): Promise<NewsSnapshot | null> {
  const file = snapshotPath(date, locale);
  try {
    const raw = await readFile(file, 'utf8');
    return JSON.parse(raw) as NewsSnapshot;
  } catch {
    return null;
  }
}

export async function persistDailyNewsSnapshots(report: AggregatedReport): Promise<void> {
  await mkdir(NEWS_DIR, { recursive: true });
  const timestamp = new Date().toISOString();
  for (const locale of locales) {
    const snapshot: NewsSnapshot = {
      ...report,
      locale,
      generatedAt: timestamp,
    };
    await writeFile(snapshotPath(report.date, locale), JSON.stringify(snapshot, null, 2) + '\n', 'utf8');
  }
}

export async function listNewsSnapshots(locale: string): Promise<NewsSnapshot[]> {
  let files: string[] = [];
  try {
    files = await readdir(NEWS_DIR);
  } catch {
    return [];
  }
  const pattern = new RegExp(`^\\d{4}-\\d{2}-\\d{2}\\.${locale}\\.json$`);
  const snapshots: NewsSnapshot[] = [];
  for (const file of files.filter((f) => pattern.test(f))) {
    try {
      const raw = await readFile(join(NEWS_DIR, file), 'utf8');
      snapshots.push(JSON.parse(raw) as NewsSnapshot);
    } catch {
      // ignore
    }
  }
  snapshots.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return snapshots;
}

export async function latestNewsSnapshot(locale: string): Promise<NewsSnapshot | null> {
  const snapshots = await listNewsSnapshots(locale);
  return snapshots[0] ?? null;
}

export async function readNewsSnapshot(date: string, locale: string): Promise<NewsSnapshot | null> {
  return loadSnapshot(date, locale);
}

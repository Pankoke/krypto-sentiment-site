import { mkdir, readFile, writeFile, readdir } from 'fs/promises';
import { join } from 'path';
import { locales } from '../i18n';
import type { DailyCryptoSentiment } from './types';
import type { AssetReport } from './news/aggregator';
import { computeAssetScore } from './scoring';

export interface SnapshotAsset {
  asset: string;
  score01: number;
  totalScore: number;
  label: string;
  confidence: number;
  confidenceDetails: Record<string, number>;
  reasons: string[];
  subscores: Record<string, number>;
  weights: Record<string, number>;
  asOf: string;
  history: number[];
}

export interface DailySnapshot {
  date: string;
  locale: string;
  macro_summary: string;
  assets: SnapshotAsset[];
  complete: boolean;
  version: string;
  generatedAt: string;
}

const REPORT_DIR = join(process.cwd(), 'data', 'reports');

function snapshotPath(date: string, locale: string) {
  return join(REPORT_DIR, `${date}.${locale}.json`);
}

async function loadSnapshot(date: string, locale: string): Promise<DailySnapshot | null> {
  const file = snapshotPath(date, locale);
  try {
    const raw = await readFile(file, 'utf8');
    return JSON.parse(raw) as DailySnapshot;
  } catch {
    return null;
  }
}

function categorizeSource(source: string) {
  const normalized = source.toLowerCase();
  if (normalized.includes('social')) return 'social';
  if (normalized.includes('news')) return 'news';
  if (normalized.includes('deriv')) return 'derivatives';
  if (normalized.includes('onchain')) return 'onChain';
  return null;
}

function deriveFeatures(asset: AssetReport, previous?: SnapshotAsset) {
  const counts: Record<string, number> = { social: 0, news: 0, derivatives: 0, onChain: 0 };
  const sources = new Set<string>();
  for (const signal of asset.top_signals) {
    const cat = categorizeSource(signal.source);
    if (cat) counts[cat] += 1;
    sources.add(signal.source);
  }
  const total = Math.max(1, asset.top_signals.length);
  const toFeature = (key: 'social' | 'news' | 'derivatives' | 'onChain') => ((counts[key] / total) * 2 - 1);
  return {
    social: toFeature('social'),
    news: toFeature('news'),
    derivatives: toFeature('derivatives'),
    onChain: toFeature('onChain'),
    price: asset.score,
    diversity: Math.min(1, sources.size / 3),
    scoreHistory: previous?.history ?? [],
  };
}

export async function persistDailySnapshots(
  report: DailyCryptoSentiment
): Promise<void> {
  await mkdir(REPORT_DIR, { recursive: true });
  for (const locale of locales) {
    const previous = await loadSnapshot(report.date, locale);
    const prevHistory = new Map(previous?.assets.map((a) => [a.asset, a.history]) ?? []);
    const prevLabels = new Map(previous?.assets.map((a) => [a.asset, a.label as string]) ?? []);
    const assets: SnapshotAsset[] = report.assets.map((asset) => {
      const features = deriveFeatures(asset, previous?.assets.find((a) => a.asset === asset.symbol));
      const context = { previousLabel: prevLabels.get(asset.symbol) as any };
      const result = computeAssetScore(asset.symbol, features, context);
      const history = [...(prevHistory.get(asset.symbol) ?? []), result.totalScore].slice(-5);
      return {
        ...result,
        asOf: new Date().toISOString(),
        history,
      };
    });
    const snapshot: DailySnapshot = {
      date: report.date,
      locale,
      macro_summary: report.macro_summary,
      assets,
      complete: assets.length > 0,
      generatedAt: new Date().toISOString(),
      version: '1.0',
    };
    await writeFile(snapshotPath(report.date, locale), JSON.stringify(snapshot, null, 2) + '\n', 'utf8');
  }
}

export async function listSnapshots(locale: string): Promise<DailySnapshot[]> {
  let files: string[] = [];
  try {
    files = await readdir(REPORT_DIR);
  } catch {
    return [];
  }
  const pattern = new RegExp(`^\\d{4}-\\d{2}-\\d{2}\\.${locale}\\.json$`);
  const snapshots: DailySnapshot[] = [];
  for (const file of files.filter((f) => pattern.test(f))) {
    try {
      const raw = await readFile(join(REPORT_DIR, file), 'utf8');
      snapshots.push(JSON.parse(raw) as DailySnapshot);
    } catch {
      // ignore corrupt file
    }
  }
  snapshots.sort((a, b) => (a.date < b.date ? 1 : -1));
  return snapshots;
}

export async function readSnapshot(date: string, locale: string): Promise<DailySnapshot | null> {
  return loadSnapshot(date, locale);
}

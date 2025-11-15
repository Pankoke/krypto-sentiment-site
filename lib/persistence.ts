import { mkdir, readFile, writeFile, readdir } from 'fs/promises';
import { join } from 'path';
import os from 'os';
import { locales } from '../i18n';
const DATA_DIR = process.env.GENERATE_DATA_DIR ?? join(process.cwd(), 'data');
const FALLBACK_DATA_DIR = join(os.tmpdir(), 'krypto-data');
import type { DailyCryptoSentiment } from './types';
import type { AssetReport } from './news/aggregator';
import {
  type ScoreContext,
  type ScoreLabel,
  type ScoreResult,
} from './scoring/types';
import { computeAssetScore } from './scoring';

export type SnapshotAsset = ScoreResult & {
  asOf: string;
  history: number[];
};

export interface DailySnapshot {
  date: string;
  locale: string;
  macro_summary: string;
  assets: SnapshotAsset[];
  complete: boolean;
  version: string;
  generatedAt: string;
}

const REPORT_DIR = join(DATA_DIR, 'reports');
const FALLBACK_REPORT_DIR = join(FALLBACK_DATA_DIR, 'reports');
const REPORT_DIRS = [REPORT_DIR, FALLBACK_REPORT_DIR];

async function loadSnapshot(date: string, locale: string): Promise<DailySnapshot | null> {
  const pattern = `${date}.${locale}.json`;
  for (const dir of REPORT_DIRS) {
    const filePath = join(dir, pattern);
    try {
      const raw = await readFile(filePath, 'utf8');
      return JSON.parse(raw) as DailySnapshot;
    } catch {
      // try next
    }
  }
  return null;
}

function categorizeSource(source: string) {
  const normalized = source.toLowerCase();
  if (normalized.includes('social')) return 'social';
  if (normalized.includes('news')) return 'news';
  if (normalized.includes('deriv')) return 'derivatives';
  if (normalized.includes('onchain')) return 'onChain';
  return null;
}

type SourceCategoryKey = 'social' | 'news' | 'derivatives' | 'onChain';

function deriveFeatures(asset: AssetReport, previous?: SnapshotAsset) {
  const counts: Record<SourceCategoryKey, number> = { social: 0, news: 0, derivatives: 0, onChain: 0 };
  const sources = new Set<string>();
  for (const signal of asset.top_signals) {
    const cat = categorizeSource(signal.source);
    if (cat) {
      counts[cat] += 1;
    }
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
  let targetDir = REPORT_DIR;
  try {
    await mkdir(targetDir, { recursive: true });
  } catch {
    targetDir = FALLBACK_REPORT_DIR;
    await mkdir(targetDir, { recursive: true });
  }
  for (const locale of locales) {
    const previous = await loadSnapshot(report.date, locale);
    const prevHistory = new Map(previous?.assets.map((a) => [a.asset, a.history]) ?? []);
    const prevLabels = new Map<string, ScoreLabel>(previous?.assets.map((a) => [a.asset, a.label]) ?? []);
    const assets: SnapshotAsset[] = report.assets.map((asset) => {
      const features = deriveFeatures(asset, previous?.assets.find((a) => a.asset === asset.symbol));
      const context: ScoreContext = { previousLabel: prevLabels.get(asset.symbol) };
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
    const filePath = join(targetDir, `${report.date}.${locale}.json`);
    await writeFile(filePath, JSON.stringify(snapshot, null, 2) + '\n', 'utf8');
  }
}

export async function listSnapshots(locale: string): Promise<DailySnapshot[]> {
  const snapshots: DailySnapshot[] = [];
  const pattern = new RegExp(`^\\d{4}-\\d{2}-\\d{2}\\.${locale}\\.json$`);
  for (const dir of REPORT_DIRS) {
    try {
      const dirFiles = await readdir(dir);
      for (const file of dirFiles) {
        if (!pattern.test(file)) continue;
        try {
          const raw = await readFile(join(dir, file), 'utf8');
          snapshots.push(JSON.parse(raw) as DailySnapshot);
        } catch {
          // ignore
        }
      }
    } catch {
      // ignore missing dir
    }
  }
  snapshots.sort((a, b) => (a.date < b.date ? 1 : -1));
  return snapshots;
}

export async function readSnapshot(date: string, locale: string): Promise<DailySnapshot | null> {
  return loadSnapshot(date, locale);
}

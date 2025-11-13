import type { AdapterEntryInput, NormalizedSourceEntry } from '../types';
import { fetchNews } from './news';
import { fetchOnchain } from './onchain';
import { fetchSocial } from './social';
import { normalizeAdapterEntry } from './utils';

const adapters: Array<{ name: string; run: () => Promise<AdapterEntryInput[]> }> = [
  { name: 'news', run: fetchNews },
  { name: 'social', run: fetchSocial },
  { name: 'onchain', run: fetchOnchain },
];

const adapterWarnings: string[] = [];

function normalizeTextForKey(value?: string): string {
  return (value ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function completenessScore(entry: NormalizedSourceEntry): number {
  return (
    (entry.title ? 1 : 0)
      + (entry.url ? 1 : 0)
      + (entry.summary ? 1 : 0)
      + entry.importance
  );
}

function deduplicate(entries: NormalizedSourceEntry[]): NormalizedSourceEntry[] {
  const buckets = new Map<string, NormalizedSourceEntry>();
  for (const entry of entries) {
    const key = `${entry.asset}|${normalizeTextForKey(entry.title)}|${normalizeTextForKey(entry.summary)}`;
    const existing = buckets.get(key);
    if (!existing) {
      buckets.set(key, entry);
      continue;
    }
    const preferred =
      completenessScore(entry) > completenessScore(existing)
        ? entry
        : completenessScore(entry) === completenessScore(existing) && entry.timestamp > existing.timestamp
        ? entry
        : existing;
    buckets.set(key, preferred);
  }
  const deduped = Array.from(buckets.values());
  deduped.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  return deduped;
}

export async function fetchAllSources(): Promise<NormalizedSourceEntry[]> {
  adapterWarnings.length = 0;
  const settled = await Promise.allSettled(adapters.map((adapter) => adapter.run()));
  const normalizedEntries: NormalizedSourceEntry[] = [];

  settled.forEach((result, idx) => {
    const adapter = adapters[idx];
    const adapterName = adapter?.name ?? `adapter-${idx}`;
    if (result.status === 'fulfilled') {
      for (const entry of result.value) {
        const normalized = normalizeAdapterEntry(entry);
        if (normalized) {
          normalizedEntries.push(normalized);
        }
      }
      return;
    }
    const reason = result.reason instanceof Error ? result.reason.message : String(result.reason);
    const warning = `Adapter "${adapterName}" konnte nicht geladen werden: ${reason}`;
    adapterWarnings.push(warning);
    console.warn(warning);
  });

  return deduplicate(normalizedEntries);
}

export function getSourceWarnings(): readonly string[] {
  return [...adapterWarnings];
}

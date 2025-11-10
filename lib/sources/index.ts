import type { UnifiedPost } from '../types';
import { fetchNews } from './news';
import { fetchSocial } from './social';
import { fetchOnchain } from './onchain';

function keyFor(p: UnifiedPost): string {
  return `${p.asset}||${p.text.trim().toLowerCase()}`;
}

function safeTime(ts: string): number {
  const n = Date.parse(ts);
  return Number.isNaN(n) ? 0 : n;
}

export async function fetchAllSources(): Promise<UnifiedPost[]> {
  const [news, social, onchain] = await Promise.all([
    fetchNews(),
    fetchSocial(),
    fetchOnchain()
  ]);

  const all: ReadonlyArray<UnifiedPost> = [...news, ...social, ...onchain];
  const dedup = new Map<string, UnifiedPost>();

  for (const p of all) {
    const k = keyFor(p);
    const existing = dedup.get(k);
    if (!existing) {
      dedup.set(k, p);
      continue;
    }
    const byEng = (p.engagement ?? 0) - (existing.engagement ?? 0);
    const byTs = safeTime(p.ts) - safeTime(existing.ts);
    if (byEng > 0 || (byEng === 0 && byTs > 0)) {
      dedup.set(k, p);
    }
  }

  const merged = Array.from(dedup.values());
  merged.sort((a, b) => safeTime(b.ts) - safeTime(a.ts));
  return merged;
}


import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import type { DailyCryptoSentiment } from '../../../../lib/types';
import { isDailyCryptoSentiment } from '../../../../lib/types';
import ArchiveList from '../../../../components/archive/ArchiveList';
import { getTranslations } from 'next-intl/server';

export type ArchiveItem = {
  date: string;
  assetsCount: number;
  macroSummary: string;
  symbols: string[];
};

async function loadArchive(): Promise<ArchiveItem[]> {
  const dir = join(process.cwd(), 'data', 'reports');
  let files: string[] = [];
  try {
    files = await readdir(dir);
  } catch {
    return [];
  }
  const jsonFiles = files.filter((f) => f.endsWith('.json'));
  const items: ArchiveItem[] = [];
  for (const f of jsonFiles) {
    try {
      const raw = await readFile(join(dir, f), 'utf8');
      const parsed = JSON.parse(raw) as unknown;
      if (!isDailyCryptoSentiment(parsed)) continue;
      const rep = parsed as DailyCryptoSentiment;
      items.push({
        date: rep.date,
        assetsCount: rep.assets.length,
        macroSummary: rep.macro_summary,
        symbols: Array.from(new Set(rep.assets.map((a) => a.symbol))).sort(),
      });
    } catch {
      // ignore
    }
  }
  items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return items;
}

export const metadata = {
  robots: { index: false, follow: true },
};

export default async function Page() {
  const t = await getTranslations();
  const items = await loadArchive();
  // ArchiveList ist clientseitig, nutzt eigene Labels; TODO: i18n-Props durchreichen
  return <ArchiveList items={items} />;
}


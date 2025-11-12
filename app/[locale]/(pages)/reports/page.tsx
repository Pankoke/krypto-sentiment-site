import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import type { ArchiveItem, DailyCryptoSentiment } from '../../../../lib/types';
import { isDailyCryptoSentiment } from '../../../../lib/types';
import ArchiveList from '../../../../components/archive/ArchiveList';

import {
  buildLocalePath,
  filterAssetsByWhitelist,
  sortAssetsByWhitelistOrder,
} from '../../../../lib/assets';

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
      const allowedAssets = sortAssetsByWhitelistOrder(filterAssetsByWhitelist(rep.assets));
      if (!allowedAssets.length) continue;
      items.push({
        date: rep.date,
        assetsCount: allowedAssets.length,
        macroSummary: rep.macro_summary,
        symbols: allowedAssets.map((a) => a.symbol),
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

export default async function Page({ params }: { params: { locale: string } }) {
  const items = await loadArchive();
  const localeRoot = buildLocalePath(params.locale);
  return <ArchiveList items={items} localeRoot={localeRoot} />;
}

import { buildLocalePath } from '../../../../lib/assets';
import { listSnapshots } from '../../../../lib/persistence';
import ArchiveList from '../../../../components/archive/ArchiveList';

async function loadArchive(locale: string) {
  return listSnapshots(locale).map((snapshot) => ({
    date: snapshot.date,
    assetsCount: snapshot.assets.length,
    macroSummary: snapshot.macro_summary,
    symbols: snapshot.assets.map((asset) => asset.asset),
    complete: snapshot.complete,
  }));
}

export const metadata = {
  robots: { index: false, follow: true },
};

export default async function Page({ params }: { params: { locale: string } }) {
  const items = await loadArchive(params.locale);
  const localeRoot = buildLocalePath(params.locale);
  return <ArchiveList items={items} localeRoot={localeRoot} />;
}

import { listSnapshots } from 'lib/persistence';
import ArchiveList from 'components/archive/ArchiveList';
import { buildLocalePath } from 'lib/assets';

export const revalidate = 3600;

async function loadArchive(locale: string) {
  const snapshots = await listSnapshots(locale);
  return snapshots.map((snapshot) => {
    const avgScore =
      snapshot.assets.length === 0
        ? 0
        : Math.round(snapshot.assets.reduce((sum, asset) => sum + asset.score01, 0) / snapshot.assets.length);
    const avgConfidence =
      snapshot.assets.length === 0
        ? 0
        : Math.round(snapshot.assets.reduce((sum, asset) => sum + asset.confidence, 0) / snapshot.assets.length);
    return {
      date: snapshot.date,
      assetsCount: snapshot.assets.length,
      macroSummary: snapshot.macro_summary,
      symbols: snapshot.assets.map((asset) => asset.asset),
      complete: snapshot.complete,
      avgScore,
      avgConfidence,
      generatedAt: snapshot.generatedAt,
    };
  });
}

export const metadata = {
  robots: { index: false, follow: true },
};

export default async function Page({ params }: { params: { locale: string } }) {
  const items = await loadArchive(params.locale);
  const localeRoot = buildLocalePath(params.locale);
  return <ArchiveList items={items} localeRoot={localeRoot} />;
}

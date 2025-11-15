import { listSnapshots } from 'lib/persistence';
import { allowedTickerOrder, allowedTickerSet } from 'lib/assets';
import AssetScoreCard from 'components/ui/AssetScoreCard';
import { buildLocalePath } from 'lib/assets';
import EncodingTest from '@/components/EncodingTest';
import { getTranslations } from 'next-intl/server';

async function loadLatestSnapshot(locale: string) {
  const snapshots = await listSnapshots(locale);
  return snapshots.length ? snapshots[0] : null;
}

export default async function Page({ params }: { params: { locale: string } }) {
  const t = await getTranslations();
  const localeRoot = buildLocalePath(params.locale);
  const snapshot = await loadLatestSnapshot(params.locale);

  if (!snapshot) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold">{t('title.sentiment')}</h1>
        <p className="text-sm text-gray-700">{t('home.noReport')}</p>
        <a
          href={`${localeRoot}/reports`}
          className="text-sm text-gray-700 hover:text-black"
        >
          {t('nav.archive')}
        </a>
      </section>
    );
  }

  const order = new Map(allowedTickerOrder.map((ticker, index) => [ticker, index]));
  const filteredAssets = snapshot.assets
    .filter((asset) => allowedTickerSet.has(asset.asset))
    .sort((a, b) => (order.get(a.asset) ?? Number.MAX_SAFE_INTEGER) - (order.get(b.asset) ?? Number.MAX_SAFE_INTEGER));

  if (!filteredAssets.length) {
    return (
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold">{t('title.sentiment')}</h1>
        <p className="text-sm text-gray-700">{t('empty.noResults')}</p>
        <a
          href={`${localeRoot}/reports`}
          className="text-sm text-gray-700 hover:text-black"
        >
          {t('nav.backHome')}
        </a>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{t('title.sentiment')}</h1>
          <p className="text-sm text-gray-700">{snapshot.macro_summary}</p>
        </div>
        <a
          href={`${localeRoot}/reports`}
          className="text-sm text-gray-700 hover:text-black"
        >
          {t('home.detailsFor', { date: snapshot.date })}
        </a>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAssets.map((asset) => (
          <AssetScoreCard key={asset.asset} asset={asset} t={t} />
        ))}
      </div>
      <EncodingTest />
    </section>
  );
}

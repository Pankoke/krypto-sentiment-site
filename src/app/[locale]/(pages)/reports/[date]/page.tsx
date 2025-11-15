import { readSnapshot } from 'lib/persistence';
import { allowedTickerOrder, allowedTickerSet } from 'lib/assets';
import AssetScoreCard from 'components/ui/AssetScoreCard';
import { buildLocalePath } from 'lib/assets';
import { getTranslations } from 'next-intl/server';

async function loadSnapshot(date: string, locale: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return null;
  }
  return readSnapshot(date, locale);
}

export const metadata = {
  robots: { index: false, follow: true },
};

export default async function Page({ params }: { params: { locale: string; date: string } }) {
  const t = await getTranslations();
  const localeRoot = buildLocalePath(params.locale);
  const snapshot = await loadSnapshot(params.date, params.locale);

  if (!snapshot) {
    return (
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold">{t('detail.notFoundTitle')}</h1>
        <p className="text-sm text-gray-700">{t('detail.notFoundText', { date: params.date })}</p>
        <a href={localeRoot} className="text-sm text-gray-700 hover:text-black">
          {t('nav.backHome')}
        </a>
      </section>
    );
  }

  const order = new Map(allowedTickerOrder.map((ticker, index) => [ticker, index]));
  const filteredAssets = snapshot.assets
    .filter((asset) => allowedTickerSet.has(asset.asset))
    .sort(
      (a, b) =>
        (order.get(a.asset) ?? Number.MAX_SAFE_INTEGER) -
        (order.get(b.asset) ?? Number.MAX_SAFE_INTEGER)
    );

  if (!filteredAssets.length) {
    return (
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold">{t('title.sentiment')}</h1>
        <p className="text-sm text-gray-700">{t('empty.noResults')}</p>
        <a href={`${localeRoot}/reports`} className="text-sm text-gray-700 hover:text-black">
          {t('nav.backHome')}
        </a>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {t('title.sentiment')} · {snapshot.date}
          </h1>
          <p className="text-sm text-gray-700">{snapshot.macro_summary}</p>
        </div>
        <a href={`${localeRoot}/reports`} className="text-sm text-gray-700 hover:text-black">
          {t('archive.details', { default: 'Details ansehen' })}
        </a>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAssets.map((asset) => (
          <AssetScoreCard key={asset.asset} asset={asset} t={t} />
        ))}
      </div>
    </section>
  );
}

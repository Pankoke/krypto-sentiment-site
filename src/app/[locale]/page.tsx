import { listSnapshots } from 'lib/persistence';
import { allowedTickerOrder, allowedTickerSet } from 'lib/assets';
import AssetScoreCard from 'components/ui/AssetScoreCard';
import EncodingTest from '@/components/EncodingTest';
import { getTranslations } from 'next-intl/server';
import type { DailySnapshot } from 'lib/persistence';

const STALE_THRESHOLD_MS = Number(process.env.SENTIMENT_STALE_THRESHOLD_MS ?? 24 * 60 * 60 * 1000);

type SnapshotStatus = 'ok' | 'empty' | 'stale' | 'error';

async function loadLatestSnapshot(locale: string) {
  const snapshots = await listSnapshots(locale);
  return snapshots.length ? snapshots[0] : null;
}

function determineStatus(snapshot?: DailySnapshot | null): SnapshotStatus {
  if (!snapshot) {
    return 'empty';
  }
  if (!snapshot.generatedAt) {
    return 'empty';
  }
  const parsed = Date.parse(snapshot.generatedAt);
  if (Number.isNaN(parsed)) {
    return 'empty';
  }
  const age = Date.now() - parsed;
  if (age > STALE_THRESHOLD_MS) {
    return 'stale';
  }
  if (!snapshot.assets.length) {
    return 'empty';
  }
  return 'ok';
}

export default async function Page({ params }: { params: { locale: string } }) {
  const t = await getTranslations();
  const snapshot = await loadLatestSnapshot(params.locale);
  const status = determineStatus(snapshot);

  if (status === 'error') {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold">{t('title.sentiment')}</h1>
        <p className="text-sm text-red-600">{t('snapshotStatus.error')}</p>
      </section>
    );
  }

  if (!snapshot || status === 'empty') {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold">{t('title.sentiment')}</h1>
        <p className="text-sm text-gray-700">{t('snapshotStatus.empty')}</p>
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
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{t('title.sentiment')}</h1>
          <p className="text-sm text-gray-700">{snapshot.macro_summary}</p>
        </div>
        <p className="text-sm text-gray-500">{snapshot.date}</p>
      </div>
      {status === 'stale' ? (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-900">
          {t('snapshotStatus.stale', {
            date: new Date(snapshot.generatedAt).toLocaleString(),
          })}
        </div>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAssets.map((asset) => (
          <AssetScoreCard key={asset.asset} asset={asset} t={t} />
        ))}
      </div>
      <EncodingTest />
    </section>
  );
}

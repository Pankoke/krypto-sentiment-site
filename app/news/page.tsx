import type { Metadata } from 'next';
import NewsList from '../../src/components/news/NewsList';
import { loadLatestAvailableSnapshot, loadSnapshotForLocale } from '../../lib/news/snapshot';
import { formatBerlinSnapshotLabel } from '../../lib/timezone';
import { RefreshButton } from '../../src/components/news/RefreshButton';

const DEFAULT_LOCALE = 'de' as const;

export const metadata: Metadata = {
  title: 'News & Signals',
  description: 'Tagesaktuelle News & Signale mit Sentiment-Scores für Kryptowährungen.',
};

export default async function NewsPage() {
  const snapshotResult = await loadSnapshotForLocale(DEFAULT_LOCALE);
  let snapshot = snapshotResult.snapshot;
  let banner: string | null = null;

  if (!snapshot) {
    if (snapshotResult.status === 'missing') {
      const latestResult = await loadLatestAvailableSnapshot(DEFAULT_LOCALE);
      if (latestResult?.snapshot) {
        snapshot = latestResult.snapshot;
        const fallbackDateTime = formatBerlinSnapshotLabel(
          latestResult.snapshot.generatedAt ?? new Date().toISOString()
        );
        banner = `Letzter Bericht vom ${fallbackDateTime?.date ?? 'unbekannt'} um ${
          fallbackDateTime?.time ?? '??'
        } (Berlin).`;
      }
    }
  } else if (snapshotResult.usedFallback) {
    const fallbackDateTime = formatBerlinSnapshotLabel(snapshot.generatedAt ?? new Date().toISOString());
    banner = `Letzter Bericht vom ${fallbackDateTime?.date ?? 'unbekannt'} um ${
      fallbackDateTime?.time ?? '??'
    } (Berlin).`;
  }

  const hasContent = Boolean(snapshot && snapshot.assets.length > 0);

  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Daily Report</p>
        <h1 className="text-2xl font-semibold mb-2">News & Signals</h1>
        <p className="text-sm text-gray-600">
          Explore the latest sentiment signals that drive the crypto markets.
        </p>
      </header>
      {banner ? (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          {banner}
        </div>
      ) : null}
      {hasContent ? (
        <>
          <NewsList
            assets={snapshot!.assets}
            reportDate={snapshot!.date}
            generatedAt={snapshot!.generatedAt}
            methodNote={snapshot!.method_note}
          />
          <p className="text-xs text-gray-500">Stand: {snapshot!.generatedAt}</p>
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center space-y-4 text-sm text-gray-700">
          <p>Zurzeit liegen keine News-Reports vor. Versuche es später noch einmal.</p>
          <RefreshButton />
        </div>
      )}
    </main>
  );
}

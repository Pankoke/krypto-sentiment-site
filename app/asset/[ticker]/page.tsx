import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { allowedAssets, buildLocalePath } from 'lib/assets';

const assetMap = new Map(allowedAssets.map((asset) => [asset.ticker, asset]));

type PageParams = { params: { ticker: string } };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const asset = assetMap.get(params.ticker.toUpperCase());
  if (!asset) {
    return { title: 'Unbekannte Kryptowährung' };
  }
  return {
    title: `Sentiment-Check für ${asset.name}`,
    description: `Aktuelle Stimmung, News und Daten zu ${asset.name} (${asset.ticker}).`,
  };
}

export default function AssetPage({ params }: PageParams) {
  const ticker = params.ticker.toUpperCase();
  const asset = assetMap.get(ticker);
  if (!asset) {
    notFound();
  }
  const localeRoot = buildLocalePath();
  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <section className="mx-auto max-w-4xl space-y-6 rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-lg">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Kryptowährung</p>
          <h1 className="text-4xl font-semibold text-gray-900">
            {asset.name} ({asset.ticker})
          </h1>
          <p className="text-sm text-gray-600">
            Diese Seite verknüpft dich mit Sentiment, News und Daten rund um {asset.name}.
          </p>
        </header>
        <div className="grid gap-4 text-sm text-gray-700">
          <p>
            Nutze <Link href={`${localeRoot}/sentiment`} className="text-indigo-600 underline">Sentiment-Übersicht</Link>, um den aktuellen Score zu prüfen.
          </p>
          <p>
            Schau dir <Link href={`${localeRoot}/news`} className="text-indigo-600 underline">News & Signale</Link> an, um die narrativen Auslöser zu verstehen.
          </p>
          <p>
            In <Link href={`${localeRoot}/daten`} className="text-indigo-600 underline">Daten & Charts</Link> findest du Visualisierungen der Stimmung über die Zeit für {asset.name}.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
          <p className="font-semibold text-gray-900">Hinweis:</p>
          <p>
            Wir speichern keine Live-Daten auf dieser Seite. Verwende die oben verlinkten Bereiche, um vollständig validierte Scores, News und Charts für {asset.name} zu sehen.
          </p>
        </div>
      </section>
    </main>
  );
}

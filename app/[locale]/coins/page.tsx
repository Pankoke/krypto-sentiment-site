import Link from 'next/link';
import type { Metadata } from 'next';

const BASE_URL = 'https://krypto-sentiment-site.vercel.app';
const DESCRIPTION =
  'Krypto Marktstimmung, Sentiment-Analysen, On-Chain Daten und News auf Deutsch.';

const presentation = {
  en: {
    headerLabel: 'Overview',
    title: 'Cryptocurrency Overview',
    subtitle:
      'Select a cryptocurrency to view sentiment scores, news, on-chain activity and trend analysis.',
    cardNote: 'View detailed sentiment, signals and chart notes.',
    coins: [
      { label: 'Bitcoin (BTC)', slug: 'btc' },
      { label: 'Ethereum (ETH)', slug: 'eth' },
      { label: 'Solana (SOL)', slug: 'sol' }
    ]
  },
  de: {
    headerLabel: 'Übersicht',
    title: 'Kryptowährungen',
    subtitle:
      'Wählen Sie eine Kryptowährung aus, um Sentiment-Daten, aktuelle News, On-Chain-Informationen und Trendanalysen zu sehen.',
    cardNote: 'Sentiment, Signale und Chart-Notizen im Überblick.',
    coins: [
      { label: 'Bitcoin (BTC)', slug: 'btc' },
      { label: 'Ethereum (ETH)', slug: 'eth' },
      { label: 'Solana (SOL)', slug: 'sol' }
    ]
  }
};

export const generateMetadata = ({ params }: { params: { locale: 'de' | 'en' } }): Metadata => {
  const canonical = `${BASE_URL}/${params.locale}/coins`;
  const localeCopy = presentation[params.locale];
  const title =
    params.locale === 'de'
      ? 'Krypto Sentiment – Kryptowährungen'
      : 'Cryptocurrency Overview – Krypto Sentiment';
  return {
    title,
    description: params.locale === 'de' ? DESCRIPTION : localeCopy.subtitle,
    alternates: { canonical }
  };
};

export default function CoinsPage({ params }: { params: { locale: 'de' | 'en' } }) {
  const { locale } = params;
  const copy = presentation[locale];

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <section className="mx-auto max-w-5xl space-y-8 rounded-2xl border border-gray-200 bg-white/80 p-8 shadow-sm">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-400">{copy.headerLabel}</p>
          <h1 className="text-4xl font-semibold text-gray-900">{copy.title}</h1>
          <p className="text-base text-gray-600">{copy.subtitle}</p>
        </header>
        <div className="grid gap-4 sm:grid-cols-3">
          {copy.coins.map((coin) => (
            <Link
              key={coin.slug}
              href={`/${locale}/coins/${coin.slug}`}
              className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-5 text-left transition hover:border-gray-400 hover:bg-white"
            >
              <p className="text-lg font-semibold text-gray-900">{coin.label}</p>
              <p className="text-sm text-gray-500">{copy.cardNote}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

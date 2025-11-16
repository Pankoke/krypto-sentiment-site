import type { Metadata } from 'next';

const BASE_URL = process.env.APP_BASE_URL ?? 'https://krypto-sentiment-site.com';

export async function generateMetadata({
  params
}: {
  params: { locale: 'de' | 'en' };
}): Promise<Metadata> {
  const canonical = new URL(`/${params.locale}`, BASE_URL).toString();
  return {
    title: 'Krypto Sentiment – Real-Time Market Mood Analysis',
    description:
      'Explore daily crypto sentiment updates, news, and data-driven indicators for traders and analysts.',
    alternates: { canonical }
  };
}

type HeroContent = { title: string; subtitle: string; footer: string };

const heroByLocale: Record<'de' | 'en', HeroContent> = {
  de: {
    title: 'Willkommen bei Krypto Sentiment',
    subtitle:
      'Entdecken Sie die aktuelle Marktstimmung im Kryptobereich. Wir analysieren News, Social-Media-Signale und On-Chain-Daten, um einen klaren Sentiment-Score (bullish, neutral oder bearish) bereitzustellen.',
    footer: 'Hinweis: Alle Inhalte werden automatisiert durch KI generiert und stellen keine Finanzberatung dar.'
  },
  en: {
    title: 'Welcome to Krypto Sentiment',
    subtitle:
      'Explore real-time market sentiment for cryptocurrencies. We analyze news, social media signals and on-chain activity to provide a data-driven sentiment score (bullish, neutral or bearish).',
    footer: 'Note: All content is AI-generated and does not constitute financial advice.'
  }
};

export default function LocaleRootPage({ params }: { params: { locale: 'de' | 'en' } }) {
  const hero = heroByLocale[params.locale];
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <section className="mx-auto max-w-4xl space-y-6 text-center">
        <h1 className="text-4xl font-semibold text-gray-900">{hero.title}</h1>
        <p className="text-lg leading-relaxed text-gray-600">{hero.subtitle}</p>
        <p className="text-sm text-gray-500">{hero.footer}</p>
      </section>
    </main>
  );
}

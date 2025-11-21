import Link from 'next/link';
import type { Metadata } from 'next';

const BASE_URL = process.env.APP_BASE_URL ?? 'https://krypto-sentiment-site.com';

const copy = {
  de: {
    metaTitle: 'Krypto Sentiment – Dein täglicher Überblick über die Stimmung im Kryptomarkt',
    metaDescription:
      'Krypto-Sentiment in Klartext: Täglicher Blick auf bullish, neutral oder bearish – KI-gestützt, datenbasiert, leicht verständlich. Keine Finanzberatung.',
    short:
      'Auf dieser Seite bekommst du jeden Tag eine aktuelle Einschätzung der Marktstimmung. Wir analysieren Nachrichten, Social Media und On-Chain-Daten, berechnen ein Sentiment und ordnen es verständlich ein. Für Einsteiger genauso gut geeignet wie für Fortgeschrittene, die über den Tellerrand hinaus schauen möchten.',
    longIntroTitle: 'Dein täglicher Überblick über die Stimmung im Kryptomarkt',
    longIntro:
      'Krypto-Sentiment in Klartext: Wir zeigen dir täglich, wie die Crowd gerade drauf ist – bullish, neutral oder bearish. KI-gestützt, datenbasiert und leicht verständlich. Keine Finanzberatung.',
    combines: 'Kurzversion',
    combineItems: [
      'Sentiment zeigt, wie optimistisch oder pessimistisch die Stimmung ist.',
      'Score liegt zwischen 0 (bearish) und 1 (bullish).',
      'Vertrauen zeigt, wie stabil die Einschätzung ist.',
      'Wir werten täglich Signale aus Nachrichten, Social Media und On-Chain-Daten aus.',
      'Keine Preisprognosen, keine Trading-Tipps – nur Stimmungsanalyse.'
    ],
    score:
      'Wie lese ich den Sentiment-Score?\nDer Score liegt zwischen 0 und 1:\n• 0.00–0.33: eher bearish\n• 0.34–0.66: neutral\n• 0.67–1.00: eher bullish\n\nVertrauen (%): Zeigt, wie stabil der Score wirkt.\nHohe Werte = wenig Rauschen in den Daten.\n\nWichtig: Der Score ist kein Preisziel. Er beschreibt nur die Stimmung.',
    stadiumTitle: 'Aktualisierung',
    stadiumBody:
      'Unsere Modelle laufen aktuell einmal täglich.\nWir aggregieren Social Media, News und On-Chain-Daten.\nDie Methodik bleibt transparent – die Quellen können sich im Laufe der Zeit verändern.',
    usageIntro: 'Nächste Schritte',
    usageSections: [
      { title: 'Aktuelle News & Signale ansehen', description: '' },
      { title: 'Sentiment-Trends in Charts entdecken', description: '' },
      { title: 'Grundlagen zum Sentiment lernen', description: '' },
      { title: 'Sentiment für einzelne Kryptowährungen ansehen', description: '' }
    ],
    audienceTitle: 'Kurzversion',
    audienceList: [],
    transparencyTitle: 'Keine Preisprognosen, keine Trading-Tipps – nur Stimmungsanalyse.',
    transparencyPoints: [
      'Sentiment zeigt, wie optimistisch oder pessimistisch die Stimmung ist.',
      'Score liegt zwischen 0 (bearish) und 1 (bullish).',
      'Vertrauen zeigt, wie stabil die Einschätzung ist.'
    ],
    finalCall:
      'Wichtig: Der Score ist kein Preisziel. Er beschreibt nur die Stimmung. Keine Finanzberatung.',
    ecosystemTitle: 'Nächste Schritte',
    ecosystemList: [
      { title: 'Heutige Marktstimmung ansehen', description: 'Zum täglichen Überblick wechseln.' },
      { title: 'Grundlagen zum Sentiment lernen', description: 'Die Basics zum Stimmungs-Scoring verstehen.' },
      { title: 'Sentiment-Trends in Charts entdecken', description: 'Verläufe und Trends visuell nachvollziehen.' },
      { title: 'Sentiment für einzelne Kryptowährungen ansehen', description: 'Detaillierte Coin-Ansichten öffnen.' }
    ],
    ctas: [
      { label: 'Heutige Marktstimmung ansehen', href: '/de/news' },
      { label: 'Grundlagen zum Sentiment lernen', href: '/de/learn' },
      { label: 'Sentiment-Trends in Charts entdecken', href: '/de/daten' },
      { label: 'Sentiment für einzelne Kryptowährungen ansehen', href: '/de/coins' }
    ],
    seoKeywords: [
      'Crypto Sentiment',
      'Krypto Marktstimmung',
      'Bitcoin Sentiment Analyse',
      'Kryptowährungen bullish bearish',
      'KI Krypto Analyse',
      'Crypto market mood dashboard',
      'On-chain sentiment data',
      'Krypto News & Signale',
      'Sentiment Score Bitcoin Ethereum',
      'Crypto trading psychology',
      'Kryptomarkt Überblick',
      'Real-time crypto sentiment'
    ]
  },
  en: {
    metaTitle: 'Krypto Sentiment – Your daily overview of the crypto market’s mood',
    metaDescription:
      'Clear, AI-based sentiment analysis: See whether the market feels bullish, neutral or bearish — explained in simple, data-driven language. No financial advice.',
    short:
      'Every day, you’ll find a fresh sentiment analysis of the crypto market. We evaluate news, social media and on-chain data, calculate a sentiment score and explain it in a beginner-friendly way. Useful for newcomers and advanced users alike.',
    longIntroTitle: 'Your daily overview of the crypto market’s mood',
    longIntro:
      'Clear, AI-based sentiment analysis: See whether the market feels bullish, neutral or bearish — explained in simple, data-driven language. No financial advice.',
    combines: 'Short version',
    combineItems: [
      'Sentiment shows whether the market feels optimistic or pessimistic.',
      'Score ranges from 0 (bearish) to 1 (bullish).',
      'Confidence shows how stable the score appears.',
      'We analyse headlines, social media signals and on-chain metrics.',
      'No price predictions, no trading advice – only sentiment.'
    ],
    score:
      'How to read the sentiment score\nThe score ranges from 0 to 1:\n• 0.00–0.33: bearish\n• 0.34–0.66: neutral\n• 0.67–1.00: bullish\n\nConfidence (%): Shows how stable the score appears.\nHigh values = less noise in the data.\n\nImportant: The score is not a price prediction — it only describes the mood.',
    stadiumTitle: 'Update Frequency',
    stadiumBody:
      'Our models currently update once per day.\nWe aggregate social media signals, news headlines and on-chain metrics.\nData sources may evolve, but the methodology stays as transparent as possible.',
    usageIntro: 'Next steps',
    usageSections: [
      { title: 'See today’s market mood', description: '' },
      { title: 'Learn the basics of sentiment', description: '' },
      { title: 'Explore sentiment trends in charts', description: '' },
      { title: 'View sentiment for individual cryptocurrencies', description: '' }
    ],
    audienceTitle: 'Short version',
    audienceList: [],
    transparencyTitle: 'No price predictions, no trading advice – only sentiment.',
    transparencyPoints: [
      'Sentiment shows whether the market feels optimistic or pessimistic.',
      'Score ranges from 0 (bearish) to 1 (bullish).',
      'Confidence shows how stable the score appears.'
    ],
    finalCall:
      'Important: The score is not a price prediction — it only describes the mood. No financial advice.',
    ecosystemTitle: 'Next steps',
    ecosystemList: [
      { title: 'See today’s market mood', description: 'Jump to the latest overview.' },
      { title: 'Learn the basics of sentiment', description: 'Understand how scoring works.' },
      { title: 'Explore sentiment trends in charts', description: 'Follow trends and volatility.' },
      { title: 'View sentiment for individual cryptocurrencies', description: 'Open detailed coin views.' }
    ],
    ctas: [
      { label: 'See today’s market mood', href: '/en/news' },
      { label: 'Learn the basics of sentiment', href: '/en/learn' },
      { label: 'Explore sentiment trends in charts', href: '/en/data' },
      { label: 'View sentiment for individual cryptocurrencies', href: '/en/coins' }
    ],
    seoKeywords: [
      'Crypto Sentiment',
      'Crypto market mood',
      'Bitcoin sentiment analysis',
      'Crypto bullish bearish score',
      'AI crypto analysis',
      'Crypto market mood dashboard',
      'On-chain sentiment data',
      'Crypto news signals sentiment',
      'Sentiment score Bitcoin Ethereum',
      'Crypto trading psychology',
      'Crypto market overview',
      'Real-time crypto sentiment'
    ]
  }
} as const;

const supportedLocales = ['de', 'en'] as const;
type LocaleKey = typeof supportedLocales[number];

function resolveLocale(locale?: string): LocaleKey {
  return supportedLocales.includes(locale as LocaleKey) ? (locale as LocaleKey) : 'de';
}

function getLocaleCopy(locale?: string) {
  return copy[resolveLocale(locale)];
}

export const generateMetadata = ({ params }: { params: { locale: string } }): Metadata => {
  const localeCopy = getLocaleCopy(params.locale);
  const canonical = `${BASE_URL}/${resolveLocale(params.locale)}`;
  return {
    title: localeCopy.metaTitle,
    description: localeCopy.metaDescription,
    alternates: { canonical }
  };
};

export default function LocaleRootPage({ params }: { params: { locale: string } }) {
  const localeCopy = getLocaleCopy(params.locale);

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-6">
        <article className="rounded-3xl border border-gray-200 bg-white/80 p-10 shadow-xl">
          <p className="text-sm uppercase tracking-[0.5em] text-gray-400">Krypto Sentiment</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-gray-900">
            {localeCopy.longIntroTitle}
          </h1>
          <p className="mt-6 text-lg text-gray-700">{localeCopy.longIntro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {localeCopy.ctas.map((cta) => (
              <Link
                key={cta.label}
                href={cta.href}
                className="rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-gray-800"
              >
                {cta.label}
              </Link>
            ))}
          </div>
        </article>

        <article className="space-y-4 rounded-3xl border border-gray-200 bg-white/70 p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-900">
            {localeCopy.longIntroTitle.includes('Willkommen') ? 'Kurzversion' : 'Short summary'}
          </h2>
          <p className="text-lg text-gray-700">{localeCopy.short}</p>
        </article>

        <article className="space-y-6 rounded-3xl border border-gray-200 bg-white/80 p-8 shadow-lg">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-400">{localeCopy.combines}</p>
            <ul className="grid gap-2 text-gray-700">
              {localeCopy.combineItems.map((item) => (
                <li key={item} className="text-base">• {item}</li>
              ))}
            </ul>
            <p className="text-base text-gray-700">{localeCopy.score}</p>
          </div>
          <div className="space-y-3 pt-4">
            <h3 className="text-xl font-semibold text-gray-900">{localeCopy.stadiumTitle}</h3>
            <p className="text-gray-700">{localeCopy.stadiumBody}</p>
          </div>
        </article>

        <article className="space-y-6 rounded-3xl border border-gray-200 bg-white/70 p-8 shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-900">{localeCopy.usageIntro}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {localeCopy.usageSections.map((section) => (
              <div key={section.title} className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-gray-700">
                <h4 className="text-lg font-semibold text-gray-900">{section.title}</h4>
                <p className="text-sm leading-relaxed">{section.description}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="space-y-4 rounded-3xl border border-gray-200 bg-white/80 p-8 shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-900">{localeCopy.audienceTitle}</h3>
          <ul className="space-y-2 text-gray-700">
            {localeCopy.audienceList.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>

        <article className="space-y-4 rounded-3xl border border-gray-200 bg-white/70 p-8 shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-900">{localeCopy.transparencyTitle}</h3>
          <ul className="space-y-2 text-gray-700">
            {localeCopy.transparencyPoints.map((point) => (
              <li key={point}>• {point}</li>
            ))}
          </ul>
          <p className="text-sm text-gray-500">{localeCopy.finalCall}</p>
        </article>

        <article className="space-y-6 rounded-3xl border border-gray-200 bg-white/80 p-8 shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-900">{localeCopy.ecosystemTitle}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {localeCopy.ecosystemList.map((item) => (
              <div key={item.title} className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-gray-700">
                <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                <p className="text-sm">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Link href={params.locale === 'de' ? '/de/news' : '/en/news'} className="text-sm font-semibold text-indigo-600 hover:underline">
              {params.locale === 'de' ? 'News & Signale' : 'News & Signals'}
            </Link>
            <Link href={params.locale === 'de' ? '/de/coins' : '/en/coins'} className="text-sm font-semibold text-indigo-600 hover:underline">
              {params.locale === 'de' ? 'Kryptowährungen' : 'Cryptocurrencies'}
            </Link>
            <Link href={params.locale === 'de' ? '/de/data' : '/en/data'} className="text-sm font-semibold text-indigo-600 hover:underline">
              {params.locale === 'de' ? 'Daten & Charts' : 'Data & Charts'}
            </Link>
            <Link href={params.locale === 'de' ? '/de/lernen' : '/en/learn'} className="text-sm font-semibold text-indigo-600 hover:underline">
              {params.locale === 'de' ? 'Lernen' : 'Learn'}
            </Link>
            <Link href={params.locale === 'de' ? '/de/ueber-uns' : '/en/about'} className="text-sm font-semibold text-indigo-600 hover:underline">
              {params.locale === 'de' ? 'Über uns' : 'About'}
            </Link>
            <Link href={params.locale === 'de' ? '/de/kontakt' : '/en/contact'} className="text-sm font-semibold text-indigo-600 hover:underline">
              {params.locale === 'de' ? 'Kontakt' : 'Contact'}
            </Link>
          </div>
        </article>

        <article className="space-y-3 rounded-3xl border border-gray-200 bg-white/70 p-8 shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">SEO & Keywords</p>
          <div className="flex flex-wrap gap-2">
            {localeCopy.seoKeywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700"
              >
                {keyword}
              </span>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}

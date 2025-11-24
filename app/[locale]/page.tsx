import Link from 'next/link';
import type { Metadata } from 'next';

const BASE_URL = process.env.APP_BASE_URL ?? 'https://krypto-sentiment-site.com';

const copy = {
  de: {
    metaTitle: 'Krypto-Stimmung. Jeden Tag neu.',
    metaDescription:
      'Wir analysieren News, Social Media und On-Chain-Daten und machen daraus leicht verständliche Sentiment-Scores für die wichtigsten Kryptowährungen.',
    short:
      'Spare dir endlose Feeds: Sieh auf einen Blick, wie der Markt tickt – und warum. Tägliche Updates, klare Texte, keine Preisversprechen.',
    longIntroTitle: 'Krypto-Stimmung. Jeden Tag neu.',
    longIntro:
      'Wir analysieren News, Social Media und On-Chain-Daten und machen daraus leicht verständliche Sentiment-Scores für die wichtigsten Kryptowährungen.',
    combines: 'Kurzversion',
    combineItems: [
      'Score 0–1: 0–0.33 bearish, 0.34–0.66 neutral, 0.67–1 bullish.',
      'Vertrauen zeigt, wie stabil der Score ist.',
      'Tägliche Updates aus echten Marktsignalen.',
      'Keine Preisprognosen, keine Trading-Tipps.',
    ],
    score:
      'Wie lese ich den Score?\n0.00–0.33: eher bearish\n0.34–0.66: neutral\n0.67–1.00: eher bullish\nVertrauen (%): zeigt, wie stabil die Einschätzung ist. Der Score ist kein Preisziel – er beschreibt nur die Stimmung.',
    stadiumTitle: 'Aktualisierung',
    stadiumBody:
      'Unsere Modelle laufen aktuell einmal täglich.\nWir aggregieren Social Media, News und On-Chain-Daten.\nDie Methodik bleibt transparent und entwickelt sich weiter.',
    usageIntro: 'Nächste Schritte',
    usageSections: [
      { title: 'Aktuelle News & Signale ansehen', description: '' },
      { title: 'Sentiment-Trends in Charts entdecken', description: '' },
      { title: 'Grundlagen zum Sentiment lernen', description: '' },
      { title: 'Sentiment für einzelne Kryptowährungen ansehen', description: '' },
    ],
    ctas: [
      { label: 'Heutige Marktstimmung ansehen', href: '/de/news' },
      { label: 'Zur Methodik', href: '/de/methodik' },
      { label: 'Grundlagen lernen', href: '/de/learn' },
      { label: 'Sentiment-Trends entdecken', href: '/de/daten' },
    ],
  },
  en: {
    metaTitle: 'Crypto sentiment. Updated daily.',
    metaDescription:
      'We analyze news, social media and on-chain data and turn it into easy-to-read sentiment scores for the most important cryptocurrencies.',
    short:
      'Skip endless feeds: see at a glance how the market feels right now – and why. Daily updates, clear language, no price promises.',
    longIntroTitle: 'Crypto sentiment. Updated daily.',
    longIntro:
      'We analyze news, social media and on-chain data and turn it into easy-to-read sentiment scores for the most important cryptocurrencies.',
    combines: 'Short version',
    combineItems: [
      'Score 0–1: 0–0.33 bearish, 0.34–0.66 neutral, 0.67–1 bullish.',
      'Confidence shows how stable the score is.',
      'Daily updates based on real market signals.',
      'No price predictions, no trading advice.',
    ],
    score:
      'How to read the score?\n0.00–0.33: bearish\n0.34–0.66: neutral\n0.67–1.00: bullish\nConfidence (%): shows how stable the score is. The score is not a price target – it only describes sentiment.',
    stadiumTitle: 'Update Frequency',
    stadiumBody:
      'Our models currently update once per day.\nWe aggregate social media signals, news headlines and on-chain metrics.\nData sources may evolve, but the methodology stays as transparent as possible.',
    usageIntro: 'Next steps',
    usageSections: [
      { title: 'See today’s market mood', description: '' },
      { title: 'Learn the basics of sentiment', description: '' },
      { title: 'Explore sentiment trends in charts', description: '' },
      { title: 'View sentiment for individual cryptocurrencies', description: '' },
    ],
    ctas: [
      { label: 'View today’s market sentiment', href: '/en/news' },
      { label: 'How we calculate the score', href: '/en/methodology' },
      { label: 'Learn the basics', href: '/en/learn' },
      { label: 'Explore sentiment trends', href: '/en/data' },
    ],
  },
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
    alternates: { canonical },
  };
};

export default function LocaleRootPage({ params }: { params: { locale: string } }) {
  const localeCopy = getLocaleCopy(params.locale);

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-6">
        <article className="rounded-3xl border border-gray-200 bg-white/80 p-10 shadow-xl">
          <p className="text-sm uppercase tracking-[0.5em] text-gray-400">Krypto Sentiment</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
            {localeCopy.longIntroTitle}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-gray-700">{localeCopy.longIntro}</p>
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
                <li key={item} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-400">{localeCopy.stadiumTitle}</p>
            <p className="text-gray-700 whitespace-pre-line">{localeCopy.stadiumBody}</p>
          </div>

          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-400">{localeCopy.usageIntro}</p>
            <ul className="grid gap-2 text-gray-700">
              {localeCopy.usageSections.map((section) => (
                <li key={section.title} className="leading-relaxed">
                  <span className="font-semibold text-gray-900">{section.title}</span>
                  {section.description ? <span className="text-gray-600"> – {section.description}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </section>
    </main>
  );
}

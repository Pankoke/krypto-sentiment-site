import type { Metadata } from 'next';

const BASE_URL = 'https://krypto-sentiment-site.vercel.app';
const DESCRIPTION =
  'Krypto Marktstimmung, Sentiment-Analysen, On-Chain Daten und News auf Deutsch.';

const sectionsByLocale = {
  en: [
    {
      title: 'What is Market Sentiment?',
      body: [
        'Market sentiment describes how investors feel about the overall direction of cryptocurrencies.',
        'It combines data from news, social chatter and on-chain indicators to deliver a single mood score.',
        'Sentiment can swing quickly, so tracking it in real time helps you anticipate rapid changes.'
      ]
    },
    {
      title: 'Why Does Sentiment Matter?',
      body: [
        'Sentiment often leads price action, because traders react emotionally to headlines and signals.',
        'Monitoring consensus mood protects you from pump-and-dump traps and reveals momentum shifts.',
        'Sentiment adds context to fundamentals, revealing when optimism or fear is overextended.'
      ]
    },
    {
      title: 'How to Read Sentiment Scores?',
      body: [
        'Scores range from 0 to 1, where near 0 signals bearish conditions and near 1 points to bullishness.',
        'We pair the value with a confidence index—higher confidence means more reliable signals.',
        'Look for divergence between sentiment and price to spot potential reversals or continuations.'
      ]
    }
  ],
  de: [
    {
      title: 'Was ist Marktstimmung?',
      body: [
        'Die Marktstimmung beschreibt, wie positiv oder negativ Investoren über den Kryptomarkt denken.',
        'Sie ist ein wichtiger Faktor für Kursbewegungen.'
      ]
    },
    {
      title: 'Warum ist Sentiment wichtig?',
      body: [
        'Sentiment-Daten zeigen Trends oft früher als Kurscharts.',
        'Sie helfen dabei, Marktphasen besser zu verstehen.'
      ]
    },
    {
      title: 'Wie lese ich Sentiment-Scores?',
      body: [
        'Ein Wert nahe 1 bedeutet bullishe Stimmung, Werte nahe 0 zeigen bearishe Tendenzen.',
        'Der Vertrauenswert zeigt an, wie zuverlässig die Datenlage ist.'
      ]
    }
  ]
};

export const generateMetadata = ({ params }: { params: { locale: 'de' | 'en' } }): Metadata => {
  const canonical = `${BASE_URL}/${params.locale}/${params.locale === 'de' ? 'lernen' : 'learn'}`;
  return {
    title:
      params.locale === 'de'
        ? 'Krypto Sentiment – Lernen – Grundlagen der Marktstimmung'
        : 'Krypto Sentiment – Learn Crypto Sentiment',
    description: params.locale === 'de' ? DESCRIPTION : 'Understand crypto market sentiment, its importance and how to interpret sentiment scores.',
    alternates: { canonical }
  };
};

export default function LearnPage({ params }: { params: { locale: 'de' | 'en' } }) {
  const locale = params.locale;
  const sections = sectionsByLocale[locale];
  const intro =
    locale === 'de'
      ? 'Verständnis für Marktstimmung hilft, Signale besser einzuordnen und Handelsentscheidungen zu treffen.'
      : 'Building intuition for crypto sentiment helps you interpret signals and make informed decisions.';
  const headerLabel = locale === 'de' ? 'Lernen' : 'Learn';
  const title =
    locale === 'de' ? 'Lernen – Grundlagen der Marktstimmung' : 'Learn Crypto Sentiment';

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <section className="mx-auto max-w-5xl space-y-10 rounded-2xl border border-gray-200 bg-white/80 p-8 shadow-sm">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-400">{headerLabel}</p>
          <h1 className="text-4xl font-semibold text-gray-900">{title}</h1>
          <p className="text-base text-gray-600">{intro}</p>
        </header>
        <div className="space-y-6">
          {sections.map((section) => (
            <article
              key={section.title}
              className="space-y-3 rounded-xl border border-gray-100 bg-gray-50/60 p-5 shadow-sm"
            >
              <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
              <div className="space-y-2 text-gray-700">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

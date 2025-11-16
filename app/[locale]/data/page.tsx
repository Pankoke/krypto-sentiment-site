import Link from 'next/link';
import type { Metadata } from 'next';

const BASE_URL = process.env.APP_BASE_URL ?? 'https://krypto-sentiment-site.vercel.app';

const copy = {
  de: {
    metaTitle: 'Daten & Charts – Visuelle Krypto-Sentiment-Analyse',
    metaDescription:
      'Entdecke Sentiment-Verläufe, Coin-Vergleiche und On-Chain-Kennzahlen in interaktiven Charts – als Ergänzung zu News, Methodik und Marktübersicht.',
    short:
      'Hier werden Sentiment-Scores sichtbar: Verläufe, Vergleiche und Kennzahlen, damit du nicht nur ein Gefühl, sondern auch Daten dazu hast.',
    sections: [
      {
        title: 'Warum überhaupt Sentiment-Charts?',
        paragraphs: [
          'Stimmung ist flüchtig – Tweets, Hacks und Gerüchte können den Ton sofort kippen.',
          'Charts helfen dir, Trends, Reaktionen auf Ereignisse und Wahrnehmungsverzerrungen zu erkennen.'
        ]
      },
      {
        title: 'Was du hier typischerweise findest',
        paragraphs: [
          'Gesamt-Sentiment-Verläufe mit Linien von bearish bis bullish.',
          'Sentiment je Kryptowährung und Event-Marker für wichtige News oder On-Chain-Geschehnisse.',
          'On-Chain-Indikatoren wie Exchange-Flows oder aktive Adressen ergänzen das Storytelling.'
        ]
      },
      {
        title: 'Wie du „Daten & Charts“ nutzt',
        paragraphs: [
          'Gesamttrend checken: War die Stimmung stabil bullish, oder gibt es einen Trendwechsel?',
          'Events sehen: Nutze News & Signale Markierungen, um Reaktionen zu prüfen.',
          'Coins beobachten: Vergleiche Watchlist-Projekte mit dem Gesamtmarkt.',
          'On-Chain als Reality-Check: Wenn Stimmung hoch, aber Aktivität niedrig ist, ergibt sich ein Warnsignal.'
        ]
      },
      {
        title: 'Typische Fragen',
        paragraphs: [
          'Hat der Markt einen Trendwechsel erlebt oder nur einen kleinen Ausschlag?',
          'Steigt Sentiment länger als die Kurse?',
          'Reagiert ein Asset übertrieben auf kleine News?',
          'Entsteht ein neues Narrativ für News & Signale oder Learn?'
        ]
      },
      {
        title: 'Grenzen der Visualisierung',
        paragraphs: [
          'Charts zeigen die Vergangenheit, nicht die Zukunft.',
          'Daten sind nie vollständig.',
          'Menschen sehen Muster – nicht jedes ist echt.',
          'Behandle „Daten & Charts“ als Analyse-Tool, nicht als Orakel.'
        ]
      },
      {
        title: 'So passt es ins Gesamtbild',
        paragraphs: [
          'Die Startseite liefert das aktuelle Bauchgefühl.',
          'Sentiment strukturiert Scores.',
          'News & Signale liefert den narrativen Kontext.',
          'Kryptowährungen zoomt auf einzelne Assets.',
          'Methodik erklärt, wie Kennzahlen entstehen.',
          'Learn schärft deinen Blick für kritische Dateninterpretation.'
        ]
      }
    ],
    navLinks: [
      { label: 'Startseite', href: '/de' },
      { label: 'Sentiment-Übersicht', href: '/de/sentiment' },
      { label: 'News & Signale', href: '/de/news' },
      { label: 'Kryptowährungen', href: '/de/coins' },
      { label: 'Lernen', href: '/de/lernen' },
      { label: 'Methodik', href: '/de/methodik' }
    ],
    ctas: [
      { label: 'Gesamt-Sentiment-Verlauf anzeigen', href: '/de/sentiment' },
      { label: 'Sentiment eines Coins im Detail ansehen', href: '/de/coins' },
      { label: 'Passende News & Signale einblenden', href: '/de/news' },
      { label: 'Mehr zur Methodik hinter den Daten lesen', href: '/de/methodik' }
    ],
    seoKeywords: [
      'Krypto Sentiment Charts',
      'Daten & Charts Krypto',
      'Crypto sentiment time series',
      'On-Chain Daten Visualisierung',
      'Bitcoin Sentiment Verlauf',
      'Kryptowährungen Daten Dashboard',
      'Crypto market mood charts',
      'Sentiment vs On-Chain Analyse',
      'Krypto Kennzahlen Visualisierung'
    ]
  },
  en: {
    metaTitle: 'Data & Charts – visual crypto sentiment analysis',
    metaDescription:
      'This is where sentiment becomes visible: time series, coin comparisons and metrics to back the feeling with data.',
    short:
      'This is where sentiment becomes visible: time series, comparisons and metrics so you don’t just have a feeling, but data to back it.',
    sections: [
      {
        title: 'Why sentiment charts matter',
        paragraphs: [
          'Sentiment flips in an instant. Tweets, hacks, rumours can change the tone.',
          'Charts help spot trends, event reactions, and perception mismatches.'
        ]
      },
      {
        title: 'What you typically find here',
        paragraphs: [
          'Overall sentiment curves from bearish to bullish.',
          'Per-coin sentiment, event markers, and on-chain indicators.',
          'Filters to adjust timeframes, highlight assets and connect to News & Signals.'
        ]
      },
      {
        title: 'How to work with Data & Charts',
        paragraphs: [
          'Start with the big picture: is sentiment trending or just noisy?',
          'Overlay events from News & Signals to verify reactions.',
          'Combine watchlist coins with charts and observe divergences.',
          'Use on-chain metrics as a reality check.'
        ]
      },
      {
        title: 'Questions charts can help with',
        paragraphs: [
          'Is this a trend shift or a small spike?',
          'Has sentiment been leading prices?',
          'Is a specific asset overreacting?',
          'Do you see a new narrative worth exploring in News & Signals and Learn?'
        ]
      },
      {
        title: 'Limits of visual data',
        paragraphs: [
          'Charts show the past, not a future guarantee.',
          'Data can be incomplete.',
          'Humans tend to see patterns even in randomness.',
          'Use Data & Charts as an analysis aid, not a prophecy.'
        ]
      },
      {
        title: 'How it fits into the platform',
        paragraphs: [
          'Homepage shows the current gut feeling.',
          'Sentiment structures the scores.',
          'News & Signals adds narrative context to swings.',
          'Cryptocurrencies zooms in on assets.',
          'Methodology explains how metrics are built.',
          'Learn teaches you to question charts and data.'
        ]
      }
    ],
    navLinks: [
      { label: 'Homepage', href: '/en' },
      { label: 'Sentiment overview', href: '/en/sentiment' },
      { label: 'News & Signals', href: '/en/news' },
      { label: 'Cryptocurrencies', href: '/en/coins' },
      { label: 'Learn', href: '/en/learn' },
      { label: 'Methodology', href: '/en/methodology' }
    ],
    ctas: [
      { label: 'View overall sentiment timeline', href: '/en/sentiment' },
      { label: "Inspect a coin’s sentiment in detail", href: '/en/coins' },
      { label: 'Show related News & Signals', href: '/en/news' },
      { label: 'Read about the data methodology', href: '/en/methodology' }
    ],
    seoKeywords: [
      'Krypto Sentiment Charts',
      'Daten & Charts Krypto',
      'Crypto sentiment time series',
      'On-Chain Daten Visualisierung',
      'Bitcoin Sentiment Verlauf',
      'Kryptowährungen Daten Dashboard',
      'Crypto market mood charts',
      'Sentiment vs On-Chain Analyse',
      'Krypto Kennzahlen Visualisierung'
    ]
  }
};

export const generateMetadata = ({ params }: { params: { locale: 'de' | 'en' } }): Metadata => {
  const canonical = `${BASE_URL}/${params.locale}/${params.locale === 'de' ? 'daten' : 'data'}`;
  const localeCopy = copy[params.locale];
  return {
    title: localeCopy.metaTitle,
    description: localeCopy.metaDescription,
    alternates: { canonical }
  };
};

export default function DataPage({ params }: { params: { locale: 'de' | 'en' } }) {
  const locale = params.locale;
  const localeCopy = copy[locale];

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <section className="mx-auto max-w-5xl space-y-6 rounded-3xl border border-gray-200 bg-white/80 p-8 shadow-xl">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.5em] text-gray-400">
            {locale === 'de' ? 'Daten & Charts' : 'Data & Charts'}
          </p>
          <h1 className="text-4xl font-semibold text-gray-900">{localeCopy.metaTitle}</h1>
          <p className="text-sm text-gray-600">{localeCopy.short}</p>
        </header>
        <nav className="flex flex-wrap gap-3 text-xs uppercase tracking-wide text-indigo-600">
          {localeCopy.navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="hover:text-indigo-900">
              {link.label}
            </Link>
          ))}
        </nav>
        {localeCopy.sections.map((section) => (
          <article
            key={section.title}
            className="space-y-3 rounded-2xl border border-gray-100 bg-gray-50/70 p-5 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-sm text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </article>
        ))}
        <div className="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">{locale === 'de' ? 'CTAs' : 'CTAs'}</h3>
          <div className="mt-3 flex flex-wrap gap-3">
            {localeCopy.ctas.map((cta) => (
              <Link
                key={cta.label}
                href={cta.href}
                className="rounded-full bg-black px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-gray-800"
              >
                {cta.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.4em] text-gray-400">SEO Keywords</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {localeCopy.seoKeywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

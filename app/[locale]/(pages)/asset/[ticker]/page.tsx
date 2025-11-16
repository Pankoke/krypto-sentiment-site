import Link from 'next/link';
import type { Metadata } from 'next';

const BASE_URL = process.env.APP_BASE_URL ?? 'https://krypto-sentiment-site.com';

const copy = {
  de: {
    metaTitle: 'Coin-Sentiment – Stimmungsprofil für eine einzelne Kryptowährung',
    metaDescription:
      'Sieh dir das Stimmungsprofil einer ausgewählten Kryptowährung an – inklusive Narrativ, On-Chain-Kontext und Vergleich zur Gesamtmarktstimmung.',
    short:
      'Auf dieser Seite zoomst du ganz nah an eine einzelne Kryptowährung heran. Du siehst, wie die Stimmung rund um diesen Coin aussieht, welche Themen gerade diskutiert werden und wie das zum Gesamtmarkt passt.',
    sections: [
      {
        title: 'Überblick: Stimmung rund um den ausgewählten Coin',
        paragraphs: [
          'Schau, ob Diskussion eher bullish, neutral oder bearish ist und wie stark sie sich verändert hat.',
          'Wichtig ist, ob der Verband zur Gesamtmarktstimmung passt oder auffällig abweicht.'
        ]
      },
      {
        title: 'Narrative & Themen',
        paragraphs: [
          'Welche Themen tauchen in News und Social Media auf (Upgrades, Regulation, Sicherheit, Spekulation)?',
          'Hat sich das Narrativ jüngst verschoben, z. B. von Hype zu Enttäuschung?'
        ]
      },
      {
        title: 'On-Chain-Kontext',
        paragraphs: [
          'Beobachte Exchange-Flows, große Wallet-Bewegungen oder aktive Adressen.',
          'Vergleiche, ob Talk mit tatsächlicher Aktivität zusammenpasst oder ob eine Lücke besteht.'
        ]
      },
      {
        title: 'Vergleich mit dem Gesamtmarkt',
        paragraphs: [
          'Ist dieser Coin positiv abweichend oder deutlich negativer als das Gesamtbild?',
          'Nutze Links zur Sentiment-Übersicht, News & Signale und Daten & Charts für den Abgleich.'
        ]
      },
      {
        title: 'Anwendungstipps',
        paragraphs: [
          'Watchlist nutzen, Abweichungen finden und mit eigenen Quellen vergleichen.',
          'Narrativ-Verläufe nach Events beobachten, um Stimmungstrends zu erkennen.'
        ]
      },
      {
        title: 'Keine Coin-Shilling',
        paragraphs: [
          'Wir geben keine Kauf/Verkaufsempfehlungen oder Preisziele.',
          'Die Seite hilft, die emotionale Umgebung besser zu verstehen, ohne Entscheidungen vorzugeben.'
        ]
      },
      {
        title: 'Verbindung zur Plattform',
        paragraphs: [
          'Homepage und Sentiment zeigen Gesamtstimmung.',
          'News & Signale benennt die relevanten Ereignisse.',
          'Data & Charts liefern visuelle Verläufe.',
          'Learn und Methodik erklären den Hintergrund.'
        ]
      }
    ],
    navLinks: [
      { label: 'Startseite', href: '/de' },
      { label: 'Sentiment-Übersicht', href: '/de/sentiment' },
      { label: 'News & Signale', href: '/de/news' },
      { label: 'Daten & Charts', href: '/de/daten' },
      { label: 'Kryptowährungen', href: '/de/coins' },
      { label: 'Methodik', href: '/de/methodik' },
      { label: 'Lernen', href: '/de/lernen' }
    ],
    ctas: [
      { label: 'Zum Markt-Sentiment zurückkehren', href: '/de/sentiment' },
      { label: 'Passende News & Signale anzeigen', href: '/de/news' },
      { label: 'Verlauf in Daten & Charts ansehen', href: '/de/daten' },
      { label: 'Mehr zur Methodik lesen', href: '/de/methodik' }
    ],
    seoKeywords: [
      'Coin Detailseite Sentiment',
      'Einzelne Kryptowährung Stimmung',
      'Asset Sentiment Analyse',
      'Krypto Asset Marktstimmung'
    ]
  },
  en: {
    metaTitle: 'Coin Sentiment – profile for a single cryptocurrency',
    metaDescription:
      'See the sentiment profile for one crypto asset – narrative, on-chain context and how it compares to broader market mood.',
    short:
      'This page zooms to a single cryptocurrency. You see how the crowd feels about this asset, which topics dominate the conversation and how that mood compares to the broader market.',
    sections: [
      {
        title: 'Overview: mood around the selected coin',
        paragraphs: [
          'Check whether the discussion feels bullish, neutral or bearish and how strongly it has shifted recently.',
          'Important is whether this mood matches the broader market or stands out.'
        ]
      },
      {
        title: 'Narratives & topics',
        paragraphs: [
          'Which themes repeat in news/social media (tech, regulation, security, speculation)?',
          'Has the story shifted from hype to disappointment or vice versa?'
        ]
      },
      {
        title: 'On-chain context',
        paragraphs: [
          'Look at exchange inflows/outflows, large wallet moves, active addresses.',
          'Compare whether talk aligns with on-chain action or if there is a gap.'
        ]
      },
      {
        title: 'Comparing with the broader market',
        paragraphs: [
          'Is this asset mood much more optimistic or pessimistic than the overall sentiment?',
          'Use Sentiment, News & Signals and Data & Charts links to explore why.'
        ]
      },
      {
        title: 'Practical use',
        paragraphs: [
          'Use it with your watchlist and look for divergences.',
          'Combine with other tools and revisit after major events.'
        ]
      },
      {
        title: 'No coin shilling',
        paragraphs: [
          'No buy/sell calls, no price targets.',
          'Intended to help you understand the emotional environment without deciding for you.'
        ]
      },
      {
        title: 'How it ties in',
        paragraphs: [
          'Homepage and Sentiment show the big picture.',
          'News & Signals add the event context.',
          'Data & Charts reveal trends.',
          'Learn and Methodology explain the mechanics.'
        ]
      }
    ],
    navLinks: [
      { label: 'Homepage', href: '/en' },
      { label: 'Sentiment overview', href: '/en/sentiment' },
      { label: 'News & Signals', href: '/en/news' },
      { label: 'Data & Charts', href: '/en/data' },
      { label: 'Cryptocurrencies', href: '/en/coins' },
      { label: 'Methodology', href: '/en/methodology' },
      { label: 'Learn', href: '/en/learn' }
    ],
    ctas: [
      { label: 'Back to overall market sentiment', href: '/en/sentiment' },
      { label: 'Show related News & Signals', href: '/en/news' },
      { label: 'View history in Data & Charts', href: '/en/data' },
      { label: 'Learn how this score is calculated', href: '/en/methodology' }
    ],
    seoKeywords: [
      'Coin Detailseite Sentiment',
      'Single crypto sentiment analysis',
      'Asset sentiment profile',
      'Crypto asset market mood'
    ]
  }
};

export const generateMetadata = ({
  params
}: {
  params: { locale: 'de' | 'en'; ticker: string };
}): Metadata => {
  const canonical = `${BASE_URL}/${params.locale}/asset/${params.ticker}`;
  const localeCopy = copy[params.locale];
  return {
    title: localeCopy.metaTitle,
    description: localeCopy.metaDescription,
    alternates: { canonical }
  };
};

export default function AssetPage({ params }: { params: { locale: 'de' | 'en'; ticker: string } }) {
  const locale = params.locale;
  const localeCopy = copy[locale];

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <section className="mx-auto max-w-5xl space-y-6 rounded-3xl border border-gray-200 bg-white/80 p-8 shadow-xl">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.5em] text-gray-400">
            {locale === 'de' ? 'Krypto Asset' : 'Crypto asset'}
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
        <div className="rounded-2xl border border-gray-100 bg-white/90 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">CTAs</h3>
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

import Link from 'next/link';
import type { Metadata } from 'next';

const BASE_URL = process.env.APP_BASE_URL ?? 'https://krypto-sentiment-site.vercel.app';

const copy = {
  de: {
    metaTitle: 'Kryptowährungen – Sentiment-Profile für einzelne Krypto-Assets',
    metaDescription:
      'Entdecke Sentiment-Profile für einzelne Kryptowährungen: Stimmung, Narrative und On-Chain-Kontext als Ergänzung zu Charts.',
    short:
      'Hier zoomst du vom Gesamtmarkt auf einzelne Coins. Für jede Kryptowährung bekommst du Sentiment-Einschätzungen, Kontext und Hinweise, wie sich die Stimmung vom breiten Markt unterscheiden kann.',
    sections: [
      {
        title: 'Einzelne Coins, eigene Stimmungen',
        paragraphs: [
          'Der Markt kann neutral wirken, während einzelne Projekte schon im Mini-Bullenmarkt oder tief im lokalen Winter stecken.',
          'Für jede unterstützte Kryptowährung erfassen wir die aktuelle Stimmung, wiederkehrende Narrative und On-Chain-Signale, die das Bild bestätigen oder widersprechen.'
        ]
      },
      {
        title: 'Wie die Coin-Ansicht mit anderen Bereichen zusammenspielt',
        paragraphs: [
          'Über die Startseite und die Sentiment-Übersicht bekommst du den Markt-Gesamteindruck.',
          'News & Signale zeigt dir Meldungen, die bestimmte Coins betreffen.',
          'Daten & Charts liefert Sentiment-Verläufe und Kennzahlen.',
          'Diese Seite beantwortet die Frage: „Was bedeutet all das konkret für Coin X?“'
        ]
      },
      {
        title: 'Was du typischerweise siehst',
        paragraphs: [
          'Aktuelles Sentiment (bullish/neutral/bearish) inklusive kurzer Einordnung.',
          'Schlüsselthemen aus News & Social-Media-Diskussionen.',
          'Hinweise auf On-Chain-Trends wie aktive Adressen oder Exchange-Flows.',
          'Links zu weiterführenden Daten & Charts zu diesem Asset.'
        ]
      },
      {
        title: 'Keine Coin-Tipps, keine geheimen Picks',
        paragraphs: [
          'Wir geben keine Kauf- oder Verkaufsempfehlungen.',
          'Wir zeigen, worüber gesprochen wird, wie es besprochen wird und wie sich die Stimmung verändert.',
          'Was du daraus machst, bleibt komplett dir überlassen.'
        ]
      },
      {
        title: 'Wie du den Bereich sinnvoll nutzt',
        paragraphs: [
          'Watchlist checken: Schau regelmäßig deine Favoriten an.',
          'Abweichungen erkennen: Achte auf Coins mit einer anderen Stimmung als der Gesamtmarkt.',
          'Mit eigenen Quellen abgleichen: Kombiniere unsere Einschätzung mit eigenen Recherchen, On-Chain-Tools und Charts.'
        ]
      }
    ],
    ecosystemLinks: [
      { label: 'Startseite', href: '/de' },
      { label: 'Sentiment-Übersicht', href: '/de/sentiment' },
      { label: 'News & Signale', href: '/de/news' },
      { label: 'Daten & Charts', href: '/de/daten' },
      { label: 'Lernen', href: '/de/lernen' }
    ],
    ctas: [
      { label: 'Zu deiner Coin-Übersicht wechseln', href: '/de/coins' },
      { label: 'Sentiment einzelner Coins mit dem Gesamtmarkt vergleichen', href: '/de/sentiment' },
      { label: 'Zu passenden Daten & Charts springen', href: '/de/daten' }
    ],
    seoKeywords: [
      'Kryptowährungen Sentiment Übersicht',
      'Coin Stimmungsanalyse',
      'Bitcoin Ethereum Sentiment Coins',
      'Crypto asset mood analysis',
      'Einzelne Coins bullish bearish',
      'Krypto Coin Watchlist Sentiment',
      'On-chain Daten pro Coin',
      'Crypto sentiment per asset',
      'Krypto Marktübersicht Coins'
    ]
  },
  en: {
    metaTitle: 'Cryptocurrencies – sentiment profiles for individual crypto assets',
    metaDescription:
      'Zoom in from the overall market to each coin: sentiment, narrative context and on-chain hints without financial advice.',
    short:
      'This is where you zoom in from the overall market to individual coins. For each cryptocurrency you get sentiment insights, context and hints on how its mood might diverge from the broader market.',
    sections: [
      {
        title: 'Each coin with its own mood',
        paragraphs: [
          'Markets can overall look neutral while specific projects are in mini bull runs or their own winters.',
          'We capture the current sentiment, recurring narratives, and on-chain signals for every supported asset.'
        ]
      },
      {
        title: 'How the coin view connects to other sections',
        paragraphs: [
          'The Homepage and Sentiment overview show the market mood.',
          'News & Signals highlights headlines tied to certain coins.',
          'Data & Charts visualizes sentiment curves and metrics.',
          'This page answers: “What does all that mean for coin X?”'
        ]
      },
      {
        title: 'What you typically see',
        paragraphs: [
          'A current sentiment label with short explanation.',
          'Key themes from news and social discussions.',
          'On-chain hints like active addresses or unusual exchange flows.',
          'Links to detailed Data & Charts for that asset.'
        ]
      },
      {
        title: 'No coin shilling, no secret picks',
        paragraphs: [
          'We do not provide buy/sell calls.',
          'We help you understand what people talk about, how they talk about it, and how the mood shifts.',
          'What you do with this information is entirely your decision.'
        ]
      },
      {
        title: 'How to plug this into your workflow',
        paragraphs: [
          'Check your watchlist regularly.',
          'Watch for divergences between a coin’s mood and the broader market.',
          'Compare our sentiment with your own research, on-chain dashboards and charts.'
        ]
      }
    ],
    ecosystemLinks: [
      { label: 'Homepage', href: '/en' },
      { label: 'Sentiment overview', href: '/en/sentiment' },
      { label: 'News & Signals', href: '/en/news' },
      { label: 'Data & Charts', href: '/en/data' },
      { label: 'Learn', href: '/en/learn' }
    ],
    ctas: [
      { label: 'Open your coin overview', href: '/en/coins' },
      { label: 'Compare coin sentiment with overall market', href: '/en/sentiment' },
      { label: 'Jump to related Data & Charts', href: '/en/data' }
    ],
    seoKeywords: [
      'Kryptowährungen Sentiment Übersicht',
      'Coin Stimmungsanalyse',
      'Bitcoin Ethereum Sentiment Coins',
      'Crypto asset mood analysis',
      'Einzelne Coins bullish bearish',
      'Krypto Coin Watchlist Sentiment',
      'On-chain Daten pro Coin',
      'Crypto sentiment per asset',
      'Krypto Marktübersicht Coins'
    ]
  }
};

export const generateMetadata = ({ params }: { params: { locale: 'de' | 'en' } }): Metadata => {
  const canonical = `${BASE_URL}/${params.locale}/coins`;
  const localeCopy = copy[params.locale];
  return {
    title: localeCopy.metaTitle,
    description: localeCopy.metaDescription,
    alternates: { canonical }
  };
};

export default function CoinsPage({ params }: { params: { locale: 'de' | 'en' } }) {
  const locale = params.locale;
  const localeCopy = copy[locale];

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <section className="mx-auto max-w-5xl space-y-6 rounded-3xl border border-gray-200 bg-white/80 p-8 shadow-xl">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.5em] text-gray-400">
            {locale === 'de' ? 'Kryptowährungen' : 'Cryptocurrencies'}
          </p>
          <h1 className="text-4xl font-semibold text-gray-900">{localeCopy.metaTitle}</h1>
          <p className="text-sm text-gray-600">{localeCopy.short}</p>
        </header>
        <div className="flex flex-wrap gap-3">
          {localeCopy.ecosystemLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 transition hover:border-black"
            >
              {link.label}
            </Link>
          ))}
        </div>
        {localeCopy.sections.map((section) => (
          <article
            key={section.title}
            className="space-y-3 rounded-2xl border border-gray-100 bg-gray-50/70 p-5 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
            {section.paragraphs.map((text) => (
              <p key={text} className="text-sm text-gray-700 leading-relaxed">
                {text}
              </p>
            ))}
          </article>
        ))}
        <div className="rounded-2xl border border-gray-100 bg-white/90 p-6 shadow-sm">
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

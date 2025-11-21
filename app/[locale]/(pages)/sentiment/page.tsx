import Link from 'next/link';
import type { Metadata } from 'next';
import type { SentimentItem } from 'lib/sentiment/types';
import type { AssetSentimentPoint } from 'lib/news/snapshot';
import { SentimentCard } from '@/components/sentiment/SentimentCard';

const BASE_URL = process.env.APP_BASE_URL ?? 'https://krypto-sentiment-site.com';

const copy = {
  de: {
    title: 'Sentiment-Übersicht – Aktuelle Marktstimmung im Überblick',
    description:
      'Sieh dir die aktuelle Krypto-Marktstimmung als Sentiment-Score an – inklusive Trend, Einordnung und Verknüpfung mit News, Coins und Daten & Charts.',
    short:
      'Hier landet alles, worum sich Krypto Sentiment dreht: die aktuelle Marktstimmung als Score, eingeordnet in bullish, neutral oder bearish – plus Kontext, wie sich die Lage zuletzt verändert hat.',
    sections: [
      {
        title: 'Der Sentiment-Score in Klartext',
        paragraphs: [
          'Schwerpunkte: deutlich bearish, leicht bearish, neutral, leicht bullish, deutlich bullish.',
          'Der Häufigkeit nach zählt weniger die Zahl als der Bereich, die Veränderung gegenüber gestern und dein eigenes Bauchgefühl.',
          'Merkst du: „Ich hätte dir Stimmung viel schlechter eingeschätzt“, hast du schon einen Lernmoment.'
        ]
      },
      {
        title: 'Veränderung statt Momentaufnahme',
        paragraphs: [
          'Zeigen, ob die Stimmung zuletzt gestiegen, gefallen oder stabil blieb.',
          'Zeigen, welche Zeitspanne betrachtet wird und ob kürzliche Ausschläge wieder abgeklungen sind.',
          'So unterscheidest du kurzfristiges Rauschen von echten Trendwechseln.'
        ]
      },
      {
        title: 'Zusammenspiel mit News, Coins und On-Chain',
        paragraphs: [
          'News & Signale zeigt Ereignisse zur aktuellen Stimmung.',
          'Kryptowährungen verrät, welche Coins besonders aus dem Rahmen fallen.',
          'Daten & Charts veranschaulicht, wie sich Scores um Events entwickeln.',
          'Methodik erklärt, wie wir News, Social Media und On-Chain-Daten in Scores transformieren.'
        ]
      },
      {
        title: 'Typische Fragen',
        paragraphs: [
          'Stimmt deine Twitter-Wahrnehmung mit dem Gesamtmarkt?',
          'Ist die Stimmung überhitzt oder eher ruhig?',
          'Hat sich die Stimmung seit dem letzten Event erholt oder verschlechtert?',
          'Sind kleine News aktuell für große Reaktionen verantwortlich?'
        ]
      },
      {
        title: 'Was die Seite nicht ist',
        paragraphs: [
          'Kein Turbo-Indikator, keine Kauf-/Verkaufsempfehlung.',
          'Keine Garantie, dass hohe Stimmung direkt steigende Kurse bedeutet.',
          'Kein Ersatz für eigene Recherche und Risikomanagement.'
        ]
      },
      {
        title: 'So nutzt du die Seite',
        paragraphs: [
          'Vor größeren Entscheidungen kurz den aktuellen Regime-Status prüfen.',
          'Vergleichen, ob deine Wahrnehmung mit dem Score übereinstimmt.',
          'Bei starken Verschiebungen News & Signale konsultieren.'
        ]
      },
      {
        title: 'Verbindung zu Methodik & Learn',
        paragraphs: [
          'Methodik erklärt den technischen Unterbau.',
          'Learn zeigt Beispiele und Denkfehler.',
          'Zusammen ergibt das ein Werkzeug, kein Spielzeug.'
        ]
      }
    ],
    navLinks: [
      { label: 'Startseite', href: '/de' },
      { label: 'News & Signale', href: '/de/news' },
      { label: 'Kryptowährungen', href: '/de/coins' },
      { label: 'Daten & Charts', href: '/de/daten' },
      { label: 'Methodik', href: '/de/methodik' },
      { label: 'Lernen', href: '/de/lernen' }
    ],
    ctas: [
      { label: 'Zum Sentiment-Verlauf in Daten & Charts', href: '/de/daten' },
      { label: 'Passende News & Signale anzeigen', href: '/de/news' },
      { label: 'Abweichungen bei einzelnen Coins prüfen', href: '/de/coins' },
      { label: 'Mehr zur Methodik hinter dem Score lesen', href: '/de/methodik' }
    ],
    seoKeywords: [
      'Krypto Sentiment Übersicht',
      'Marktstimmung bullish neutral bearish',
      'Crypto sentiment score',
      'Krypto Marktstimmungsindex',
      'Sentiment Dashboard Krypto',
      'Crypto market mood indicator',
      'Bitcoin Ethereum sentiment index',
      'Krypto Sentiment Trend'
    ]
  },
  en: {
    title: 'Sentiment Overview – Current market mood at a glance',
    description:
      'See the current market mood as a sentiment score – zoned into bullish, neutral or bearish with trend context.',
    short:
      'This is where everything comes together: the current market mood as a score, classified into bullish, neutral or bearish – plus context on how things have been shifting.',
    sections: [
      {
        title: 'The sentiment score in plain language',
        paragraphs: [
          'Zones like strongly/slightly bearish, neutral, slightly/strongly bullish.',
          'What matters is the zone, change to yesterday/last week and your gut feeling.',
          'If you expected worse mood than the score shows, that is a learning moment.'
        ]
      },
      {
        title: 'Focus on change, not just levels',
        paragraphs: [
          'Displays rising, falling or stable moods.',
          'Shows covered time span and whether recent spikes faded.',
          'Helps separate noise from real trend shifts.'
        ]
      },
      {
        title: 'How it ties into news, coins and on-chain data',
        paragraphs: [
          'News & Signals highlights events driving the mood.',
          'Cryptocurrencies reveals outlier assets.',
          'Data & Charts shows score behavior around events.',
          'Methodology explains how we derive the score.'
        ]
      },
      {
        title: 'Questions this page answers',
        paragraphs: [
          'Does X’s Twitter bubble reflect the whole market?',
          'Is the market overheated or calm?',
          'Has mood really recovered since the last crash?',
          'Are minor news causing big reactions?'
        ]
      },
      {
        title: 'What this page is not',
        paragraphs: [
          'Not a magic buy/sell indicator.',
          'Not a guarantee that strong mood equals strong prices.',
          'Not a replacement for your own analysis.'
        ]
      },
      {
        title: 'How to use this page',
        paragraphs: [
          'Check the regime before major moves.',
          'Compare your own perception to the score.',
          'Inspect News & Signals when mood shifts abruptly.'
        ]
      },
      {
        title: 'Link to Learn & Methodology',
        paragraphs: [
          'Methodology breaks down the pipeline.',
          'Learn offers examples and pitfalls.',
          'Together they make the overview a practical tool.'
        ]
      }
    ],
    navLinks: [
      { label: 'Homepage', href: '/en' },
      { label: 'News & Signals', href: '/en/news' },
      { label: 'Cryptocurrencies', href: '/en/coins' },
      { label: 'Data & Charts', href: '/en/data' },
      { label: 'Methodology', href: '/en/methodology' },
      { label: 'Learn', href: '/en/learn' }
    ],
    ctas: [
      { label: 'View sentiment history in Data & Charts', href: '/en/data' },
      { label: 'Show related News & Signals', href: '/en/news' },
      { label: 'Check divergences for individual coins', href: '/en/coins' },
      { label: 'Learn how this score is calculated', href: '/en/methodology' }
    ],
    seoKeywords: [
      'Krypto Sentiment Übersicht',
      'Marktstimmung bullish neutral bearish',
      'Crypto sentiment score',
      'Krypto Marktstimmungsindex',
      'Sentiment Dashboard Krypto',
      'Crypto market mood indicator',
      'Bitcoin Ethereum sentiment index',
      'Krypto Sentiment Trend'
    ]
  }
};

type BulkHistoryEntry = {
  asset: string;
  points: AssetSentimentPoint[];
};

async function loadSentimentItems(): Promise<SentimentItem[]> {
  try {
    const res = await fetch('/api/sentiment', { next: { revalidate: 300 } });
    if (!res.ok) {
      return [];
    }
    const data = (await res.json()) as { items?: SentimentItem[] };
    return Array.isArray(data.items) ? data.items : [];
  } catch {
    return [];
  }
}

async function loadHistoryMap(symbols: string[], days = 30): Promise<Map<string, AssetSentimentPoint[]>> {
  if (!symbols.length) {
    return new Map();
  }
  const params = new URLSearchParams({
    assets: symbols.join(','),
    days: String(days),
  }).toString();
  try {
    const res = await fetch(`/api/sentiment/history/bulk?${params}`, { next: { revalidate: 300 } });
    if (!res.ok) {
      return new Map();
    }
    const data = (await res.json()) as BulkHistoryEntry[];
    const map = new Map<string, AssetSentimentPoint[]>();
    data.forEach((entry) => {
      map.set(entry.asset.toUpperCase(), entry.points ?? []);
    });
    return map;
  } catch {
    return new Map();
  }
}

export const generateMetadata = ({ params }: { params: { locale: 'de' | 'en' } }): Metadata => {
  const canonical = `${BASE_URL}/${params.locale}/sentiment`;
  const localeCopy = copy[params.locale];
  return {
    title: localeCopy.title,
    description: localeCopy.description,
    alternates: { canonical }
  };
};

export default async function Page({ params }: { params: { locale: 'de' | 'en' } }) {
  const locale = params.locale;
  const localeCopy = copy[locale];
  const sentimentItems = await loadSentimentItems();
  const historyMap = await loadHistoryMap(sentimentItems.map((item) => item.symbol));

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <section className="mx-auto max-w-5xl space-y-6 rounded-3xl border border-gray-200 bg-white/80 p-8 shadow-xl">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.5em] text-gray-400">
            {locale === 'de' ? 'Sentiment-Übersicht' : 'Sentiment Overview'}
          </p>
          <h1 className="text-4xl font-semibold text-gray-900">{localeCopy.title}</h1>
          <p className="text-sm text-gray-600">{localeCopy.short}</p>
        </header>
        <nav className="flex flex-wrap gap-3 text-xs uppercase tracking-wide text-indigo-600">
          {localeCopy.navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="hover:text-indigo-900">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="space-y-3 rounded-2xl border border-gray-100 bg-gray-50/70 p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            {locale === 'de' ? 'Aktuelle Sentiment-Karten' : 'Current Sentiment Cards'}
          </h2>
          {sentimentItems.length === 0 ? (
            <p className="text-sm text-gray-700">
              {locale === 'de'
                ? 'Keine Sentiment-Daten vorhanden.'
                : 'No sentiment data available.'}
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {sentimentItems.map((item) => (
                <SentimentCard
                  key={item.symbol}
                  item={item}
                  historyPoints={historyMap.get(item.symbol.toUpperCase())}
                />
              ))}
            </div>
          )}
        </div>
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

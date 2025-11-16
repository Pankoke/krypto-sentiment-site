import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import NewsList from '../../../../src/components/news/NewsList';
import { RefreshButton } from '../../../../src/components/news/RefreshButton';
import { loadLatestAvailableSnapshot, loadSnapshotForLocale } from '../../../../lib/news/snapshot';
import { formatBerlinSnapshotLabel } from '../../../../lib/timezone';

const BASE_URL = process.env.APP_BASE_URL ?? 'https://krypto-sentiment-site.com';
const OG_LOCALES: Record<'de' | 'en', string> = {
  de: 'de_DE',
  en: 'en_US',
};

type NewsSection = {
  title: string;
  paragraphs: readonly string[];
  followUp?: string;
};

type LocaleCopy = {
  metaTitle: string;
  metaDescription: string;
  short: string;
  sections: NewsSection[];
  ecosystem: { title: string; description: string }[];
  ctas: { label: string; href: string }[];
  seoKeywords: string[];
};

const copy: Record<'de' | 'en', LocaleCopy> = {
  de: {
    metaTitle: 'Krypto News & Signale – Stimmungsrelevante Krypto-Meldungen im Überblick',
    metaDescription:
      'Gefilterte News mit Fokus auf Marktstimmung: Welche Meldungen treiben Sentiment bullish, neutral oder bearish?',
    short:
      'Hier landen die täglichen Krypto-News, gefiltert nach Relevanz für die Marktstimmung. Statt News-Overload bekommst du kompakte Signale, die erklären, warum die Stimmung heute eher bullish, neutral oder bearish ist.',
    sections: [
      {
        title: 'Von News-Flut zu Sentiment-Signalen',
        paragraphs: [
          'Unsere KI analysiert kontinuierlich News-Artikel aus unterschiedlichen Quellen, Social-Media-Posts, Threads sowie offizielle Ankündigungen von Projekten und Börsen.',
          'Statt dir einfach nur alles der Reihe nach aufzulisten, versuchen wir, das Ganze in Stimmungssignale zu übersetzen: Welche Meldungen pushen die Stimmung klar nach oben? Welche sorgen für Unsicherheit oder Panik? Welche sind laut, aber am Ende nur Buzz ohne Substanz?'
        ],
        followUp:
          'Das Ergebnis ist ein Radar für Stimmungs-Trigger. Du siehst nicht nur die News, sondern auch, warum sie wichtig ist und wie sie in das aktuelle Gesamtbild passt.'
      },
      {
        title: 'Wie du „News & Signale“ nutzen kannst',
        paragraphs: [
          'Tagesüberblick holen: Schau dir die wichtigsten Meldungen des Tages an und beachte, ob sie eher positiv, neutral oder negativ wirken.',
          'Mit dem Sentiment-Score abgleichen: Wechsle zur Sentiment-Übersicht, um zu sehen, ob die Nachrichtenlage zum Gesamt-Sentiment passt.',
          'Einzelne Coins im Blick behalten: Über die Kryptowährungen-Sektion erkennst du, ob bestimmte News eher auf das Ökosystem oder einen spezifischen Coin zielen.',
          'Rausfiltern, was dir egal ist: Nutze die News eher als Kontext als als To-Do-Liste.'
        ]
      },
      {
        title: 'KI hilft – ersetzt aber nicht dein Denken',
        paragraphs: [
          'Unsere Modelle helfen, Schlagzeilen zu clustern, Tonalität einzuschätzen und wiederkehrende Themen zu erkennen.',
          'KI kann News falsch einordnen, Ironie übersehen oder Hype verspätet erkennen.',
          'Deshalb verstehen wir News & Signale als Werkzeug – nicht als Wahrheit.'
        ],
        followUp:
          'Wenn dich ein Thema interessiert, klicke auf die Originalquelle und hole dir weitere Perspektiven. Im Lernbereich findest du dazu passende Inhalte.'
      },
      {
        title: 'Keine Handels-Signale',
        paragraphs: [
          'Signal heißt bei uns: Dieses Ereignis hat spürbaren Einfluss auf die Stimmung, positiv oder negativ.',
          'Was du daraus machst, ist komplett dir überlassen. Crypto-Märkte sind risikoreich, und selbst scheinbar klare News können ganz anders interpretiert werden.'
        ]
      }
    ],
    ecosystem: [
      { title: 'Homepage', description: 'Gesamteindruck und Kontext auf einen Blick.' },
      { title: 'Sentiment-Übersicht', description: 'Stimmungen und Veränderungen einordnen.' },
      { title: 'Kryptowährungen', description: 'Verlinkung zu einzelnen Assets.' },
      { title: 'Daten & Charts', description: 'Sentiment-Visualisierungen.' },
      { title: 'Methodik', description: 'Transparenter Blick auf unseren Ansatz.' }
    ],
    ctas: [
      { label: 'Heutige Signale ansehen', href: '/de/news' },
      { label: 'Sentiment-Übersicht dazu vergleichen', href: '/de/sentiment' },
      { label: 'Zu den betroffenen Kryptowährungen wechseln', href: '/de/coins' },
      { label: 'Mehr über unsere News-Methodik erfahren', href: '/de/methodik' }
    ],
    seoKeywords: ['Krypto News & Signale', 'Crypto sentiment news feed', 'Bitcoin News Sentiment', 'Ethereum market signals', 'KI News Analyse Krypto', 'Crypto narrative tracking', 'Sentiment-basierte Nachrichten', 'Relevante Krypto Meldungen', 'Daily crypto sentiment signals', 'Market-moving crypto news']

  },
  en: {
    metaTitle: 'Krypto News & Signals – sentiment-aware crypto headlines',
    metaDescription:
      'This is where the daily crypto news drops – filtered by their impact on market mood. Focused signals with clear sentiment context.',
    short:
      'This is where the daily crypto news drops – filtered by their impact on market mood. No endless headline spam, just focused signals that explain why sentiment is bullish, neutral or bearish today.',
    sections: [
      {
        title: 'From headline overload to sentiment signals',
        paragraphs: [
          'Our AI continuously scans news articles, social media posts, threads and official announcements from projects and exchanges.',
          'Instead of dumping everything into a long list, we try to translate it into signals that highlight the stories moving mood up, pushing it down, or just creating noise.'
        ],
        followUp:
          'The result is a radar of mood-moving events. You see not just what happened, but why it matters today.'
      },
      {
        title: 'How to get value from News & Signals',
        paragraphs: [
          'Grab a quick daily overview: note whether the headlines are likely to impact market mood positively, neutrally or negatively.',
          'Match them with the sentiment score: check whether the news flow aligns with the overall trend.',
          'Keep an eye on specific coins through the Cryptocurrencies section.',
          'Ignore what doesn’t matter to you – use the feed as context, not as a checklist.'
        ]
      },
      {
        title: 'AI helps – but you’re still in charge',
        paragraphs: [
          'Our models cluster similar headlines, estimate tone, and detect recurring themes.',
          'But AI can misread sarcasm, miss nuance or react slowly to niche stories.',
          'We treat News & Signals as a tool, not a final judgment.'
        ],
        followUp:
          'If something looks important, click the original source and cross-check. The Learn area explains how to read narratives critically.'
      },
      {
        title: 'No trading calls',
        paragraphs: [
          'Signal means: this event noticeably impacts the mood, positively or negatively.',
          'What you do with it is entirely up to you.'
        ]
      }
    ],
    ecosystem: [
      { title: 'Homepage', description: 'See the complete picture at a glance.' },
      { title: 'Sentiment overview', description: 'Understand how moods shift.' },
      { title: 'Cryptocurrencies', description: 'Drill into asset-specific reactions.' },
      { title: 'Data & Charts', description: 'Track how sentiment evolves.' },
      { title: 'Methodology', description: 'Learn how our models work.' }
    ],
    ctas: [
      { label: "See today’s key signals", href: '/en/news' },
      { label: 'Compare with the sentiment overview', href: '/en/sentiment' },
      { label: 'Jump to the affected cryptocurrencies', href: '/en/coins' },
      { label: 'Learn how our news methodology works', href: '/en/methodology' }
    ],
    seoKeywords: ['Krypto News & Signale', 'Crypto sentiment news feed', 'Bitcoin News Sentiment', 'Ethereum market signals', 'KI News Analyse Krypto', 'Crypto narrative tracking', 'Sentiment-basierte Nachrichten', 'Relevante Krypto Meldungen', 'Daily crypto sentiment signals', 'Market-moving crypto news']
  }
};

export const runtime = 'nodejs';
export const revalidate = 86400;
export const dynamic = 'force-static';

type NewsPageProps = { params: { locale: 'de' | 'en' } };

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const base = new URL(BASE_URL);
  const canonical = new URL(`/${params.locale}/news`, base).toString();
  const localeCopy = copy[params.locale];
  return {
    title: localeCopy.metaTitle,
    description: localeCopy.metaDescription,
    alternates: {
      canonical,
      languages: {
        de: new URL('/de/news', base).toString(),
        en: new URL('/en/news', base).toString()
      }
    },
    openGraph: {
      title: localeCopy.metaTitle,
      description: localeCopy.metaDescription,
      url: canonical,
      locale: OG_LOCALES[params.locale],
      siteName: 'Krypto Sentiment'
    }
  };
}

export default async function NewsPage({ params }: NewsPageProps) {
  const t = await getTranslations();
  const snapshotResult = await loadSnapshotForLocale(params.locale);
  let snapshot = snapshotResult.snapshot;
  let banner: string | null = null;
  if (!snapshot) {
    if (snapshotResult.status === 'error') {
      banner = null;
    } else {
      const latestResult = await loadLatestAvailableSnapshot(params.locale);
      if (latestResult?.snapshot) {
        snapshot = latestResult.snapshot;
        const fallbackDateTime = formatBerlinSnapshotLabel(
          latestResult.snapshot.generatedAt ?? new Date().toISOString()
        );
        banner = t('news.fallbackBanner', {
          date: fallbackDateTime?.date ?? '',
          time: fallbackDateTime?.time ?? '',
        });
      }
    }
  } else if (snapshotResult.usedFallback) {
    const fallbackDateTime = formatBerlinSnapshotLabel(snapshot.generatedAt ?? new Date().toISOString());
    banner = t('news.fallbackBanner', {
      date: fallbackDateTime?.date ?? '',
      time: fallbackDateTime?.time ?? '',
    });
  }

  const regenUrl = '/api/news/generate?mode=overwrite';
  const assetsCount = snapshot?.assets.length ?? 0;
  const hasContent = Boolean(snapshot && assetsCount > 0);
  const noNewsMessage =
    params.locale === 'de'
      ? 'Derzeit sind keine News verfügbar. Bitte später erneut versuchen.'
      : t('news.emptySnapshot');
  const refreshLabel = params.locale === 'de' ? 'Aktualisieren' : 'Refresh';
  const localeCopy = copy[params.locale];
  const navLinks = [
    { label: params.locale === 'de' ? 'Startseite' : 'Homepage', href: `/${params.locale}` },
    {
      label: params.locale === 'de' ? 'Sentiment-Übersicht' : 'Sentiment overview',
      href: `/${params.locale}/sentiment`
    },
    {
      label: params.locale === 'de' ? 'Kryptowährungen' : 'Cryptocurrencies',
      href: `/${params.locale}/coins`
    },
    {
      label: params.locale === 'de' ? 'Daten & Charts' : 'Data & Charts',
      href: `/${params.locale}/${
        params.locale === 'de' ? 'daten' : 'data'
      }`
    },
    {
      label: params.locale === 'de' ? 'Lernen' : 'Learn',
      href: `/${params.locale}/${params.locale === 'de' ? 'lernen' : 'learn'}`
    },
    {
      label: params.locale === 'de' ? 'Methodik' : 'Methodology',
      href: `/${params.locale}/${params.locale === 'de' ? 'methodik' : 'methodology'}`
    }
  ];

  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold mb-2">{t('news.title')}</h1>
        <p className="text-sm text-gray-600">{t('news.description')}</p>
        <nav className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-indigo-600">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="hover:text-indigo-900">
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <article className="space-y-4 rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm">
        <p className="font-semibold text-gray-800">{localeCopy.short}</p>
        <div className="flex flex-wrap gap-2">
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
      </article>
      {localeCopy.sections.map((section) => (
        <article
          key={section.title}
          className="space-y-3 rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-sm text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
          {section.followUp ? (
            <p className="text-sm font-semibold text-gray-600">{section.followUp}</p>
          ) : null}
        </article>
      ))}
      <article className="space-y-4 rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900">
          {params.locale === 'de' ? 'Perfekte Ergänzung zum Rest der Seite' : 'A natural puzzle piece in the whole platform'}
        </h3>
        <div className="grid gap-2">
          {localeCopy.ecosystem.map((item) => (
            <p key={item.title} className="text-sm text-gray-700">
              <span className="font-semibold text-gray-900">{item.title}:</span> {item.description}
            </p>
          ))}
        </div>
      </article>
      {banner ? (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          {banner}
        </div>
      ) : null}
      {snapshot && hasContent ? (
        <>
          <NewsList
            assets={snapshot.assets}
            reportDate={snapshot.date}
            generatedAt={snapshot.generatedAt}
            methodNote={snapshot.method_note}
          />
          <p className="text-xs text-gray-500">
            {t('news.generatedAt', { date: snapshot.generatedAt })}
          </p>
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center space-y-4 text-sm text-gray-700">
          {snapshotResult.status === 'error' ? (
            <>
              <p>{t('news.errorLoading', { error: snapshotResult.reason ?? 'unknown' })}</p>
              <a
                href="/de/news?retry=1"
                className="font-semibold text-indigo-600 hover:text-indigo-700"
              >
                {t('news.retry')}
              </a>
            </>
          ) : (
            <>
              <p>{noNewsMessage}</p>
              <div className="flex justify-center">
                <RefreshButton label={refreshLabel} />
              </div>
            </>
          )}
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/de/news" className="text-gray-700 hover:text-black">
              {t('nav.backHome')}
            </a>
            {process.env.NODE_ENV !== 'production' ? (
              <a
                href={regenUrl}
                className="rounded-md bg-indigo-600 px-3 py-1 text-white hover:bg-indigo-500"
              >
                {t('news.rebuildButton')}
              </a>
            ) : null}
          </div>
        </div>
      )}
      <div className="text-sm">
        <a href="/de/news" className="text-gray-700 hover:text-black">
          {t('nav.backHome')}
        </a>
      </div>
    </main>
  );
}

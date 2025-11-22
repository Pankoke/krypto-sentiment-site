import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import NewsList, { type NewsSnapshotStatus } from '../../../../src/components/news/NewsList';
import { RefreshButton } from '../../../../src/components/news/RefreshButton';
import { loadLatestAvailableSnapshot, loadSnapshotForLocale } from '../../../../lib/news/snapshot';
import { formatBerlinSnapshotLabel } from '../../../../lib/timezone';
import { snapshotToNewsItems } from '../../../../lib/news/transform';

const BASE_URL = process.env.APP_BASE_URL ?? 'https://krypto-sentiment-site.com';
const OG_LOCALES: Record<'de' | 'en', string> = {
  de: 'de_DE',
  en: 'en_US',
};

const STALE_THRESHOLD_MS = Number(process.env.NEWS_STALE_THRESHOLD_MS ?? 24 * 60 * 60 * 1000);

type SnapshotState = NewsSnapshotStatus;

function determineStatus(
  snapshot: Awaited<ReturnType<typeof loadSnapshotForLocale>>['snapshot'],
  snapshotFlag: string | undefined
): SnapshotState {
  if (snapshotFlag === 'error') {
    return 'error';
  }
  if (!snapshot) {
    return snapshotFlag === 'missing' ? 'empty' : 'empty';
  }
  if (!snapshot.generatedAt) {
    return 'empty';
  }
  const parsed = Date.parse(snapshot.generatedAt);
  if (Number.isNaN(parsed)) {
    return 'empty';
  }
  const age = Date.now() - parsed;
  if (age > STALE_THRESHOLD_MS) {
    return 'stale';
  }
  if (!snapshot.assets.length) {
    return 'empty';
  }
  return 'ok';
}

export const runtime = 'nodejs';
export const revalidate = 86400;
export const dynamic = 'force-static';

type NewsPageProps = { params: { locale: 'de' | 'en' } };

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const base = new URL(BASE_URL);
  const canonical = new URL(`/${params.locale}/news`, base).toString();
  const title = params.locale === 'de' ? 'Was heute die Stimmung bewegt' : 'What’s moving sentiment today';
  const description =
    params.locale === 'de'
      ? 'Hier findest du die wichtigsten Ereignisse des Tages – Nachrichten, Social-Media-Trends und On-Chain-Signale, die unsere KI als stimmungsrelevant eingestuft hat. Kurz, klar und ohne Fachjargon.'
      : 'Here you’ll find the key events of the day — news headlines, social trends and on-chain signals that our AI identified as relevant for market sentiment. Short, clear and easy to understand.';

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        de: new URL('/de/news', base).toString(),
        en: new URL('/en/news', base).toString()
      }
    },
    openGraph: {
      title,
      description,
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
        const fallbackDateTime = formatBerlinSnapshotLabel(latestResult.snapshot.generatedAt ?? new Date().toISOString());
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

  const status = determineStatus(snapshot, snapshotResult.status);
  const statusAction =
    status === 'empty' || status === 'stale'
      ? (
          <div className="flex justify-center">
            <RefreshButton label={t('news.retry')} />
          </div>
        )
      : status === 'error'
      ? (
          <div className="flex justify-center">
            <RefreshButton label={t('news.retry')} />
          </div>
        )
      : null;

  const newsItems = snapshot ? snapshotToNewsItems(snapshot, snapshot.generatedAt) : [];

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-4xl px-4 py-10 md:py-12">
        <header className="mb-8 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            {params.locale === 'de' ? 'Krypto-News & Signale' : 'Crypto News & Signals'}
          </h1>
          <p className="max-w-2xl text-sm text-slate-600">
            {params.locale === 'de'
              ? 'Tägliche Nachrichten, Signale und Marktstimmungsindikatoren aus ausgewählten Quellen.'
              : 'Daily news, signals and market mood indicators from selected sources.'}
          </p>
        </header>

        {banner ? (
          <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            {banner}
          </div>
        ) : null}

        <NewsList
          items={newsItems}
          reportDate={snapshot?.date ?? new Date().toISOString()}
          generatedAt={snapshot?.generatedAt}
          methodNote={snapshot?.method_note}
          status={status}
          errorMessage={snapshotResult.reason ?? undefined}
          action={statusAction ?? undefined}
          locale={params.locale}
        />

        {snapshot?.generatedAt ? (
          <p className="mt-4 text-xs text-slate-500">{t('news.generatedAt', { date: snapshot.generatedAt })}</p>
        ) : null}
      </section>
    </main>
  );
}

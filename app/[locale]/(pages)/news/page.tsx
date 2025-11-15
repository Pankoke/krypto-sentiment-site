import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import NewsList from '../../../../src/components/news/NewsList';
import { loadLatestAvailableSnapshot, loadSnapshotForLocale } from '../../../../lib/news/snapshot';
import { formatBerlinSnapshotLabel } from '../../../../lib/timezone';

const BASE_URL = process.env.APP_BASE_URL ?? 'https://krypto-sentiment-site.com';
const OG_LOCALES: Record<'de' | 'en', string> = {
  de: 'de_DE',
  en: 'en_US',
};

export const runtime = 'nodejs';

type NewsPageProps = { params: { locale: 'de' | 'en' } };

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const t = await getTranslations();
  const base = new URL(BASE_URL);
  const canonical = new URL('/de/news', base).toString();
  return {
    title: t('news.title'),
    description: t('news.description'),
    alternates: {
      canonical,
      languages: {
        de: new URL('/de/news', base).toString(),
        en: new URL('/en/news', base).toString(),
      },
    },
    openGraph: {
      title: t('news.title'),
      description: t('news.description'),
      url: canonical,
      locale: OG_LOCALES[params.locale],
      siteName: 'Krypto Sentiment',
    },
  };
}

export const revalidate = 86400;
export const dynamic = 'force-static';

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
  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold mb-2">{t('news.title')}</h1>
        <p className="text-sm text-gray-600">{t('news.description')}</p>
      </header>
      {banner ? (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          {banner}
        </div>
      ) : null}
      {hasContent ? (
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
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center space-y-3 text-sm text-gray-700">
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
            <p>{t('news.emptySnapshot')}</p>
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

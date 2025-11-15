import { buildLocalePath } from '../../../../lib/assets';
import { getTranslations } from 'next-intl/server';
import NewsList from '../../../../src/components/news/NewsList';

export const revalidate = 86400;
export const dynamic = 'force-static';

async function fetchSnapshot(locale: 'de' | 'en') {
  try {
    const res = await fetch(`/api/news?locale=${locale}`, {
      next: { tags: ['news-daily'], revalidate: 86400 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function NewsPage({ params }: { params: { locale: 'de' | 'en' } }) {
  const t = await getTranslations();
  const snapshot = await fetchSnapshot(params.locale);
  const displayDate = snapshot?.date ?? new Date().toISOString().slice(0, 10);
  const generatedAt = snapshot?.generatedAt;
  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold mb-2">{t('news.title')}</h1>
        <p className="text-sm text-gray-600">{t('news.description')}</p>
      </header>
      <NewsList
        assets={snapshot?.assets ?? []}
        reportDate={displayDate}
        generatedAt={generatedAt}
        methodNote={snapshot?.method_note}
      />
      {snapshot ? (
        <p className="text-xs text-gray-500">
          {t('news.generatedAt', { date: snapshot.date })}
        </p>
      ) : (
        <p className="text-xs text-gray-500">{t('news.emptySnapshot')}</p>
      )}
      <div className="text-sm">
        <a
          href={`${buildLocalePath(params.locale)}/reports`}
          className="text-gray-700 hover:text-black"
        >
          {t('nav.backHome')}
        </a>
      </div>
    </main>
  );
}

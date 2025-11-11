import NewsList from '../../../../src/components/news/NewsList';
import { getTranslations } from 'next-intl/server';

export default async function NewsPage() {
  const t = await getTranslations();
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">{t('news.title')}</h1>
      <p className="text-sm text-gray-600 mb-6">{t('news.description')}</p>
      <NewsList />
    </main>
  );
}

import SentimentPageClient from '../../../../src/app/sentiment/SentimentPageClient';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations();
  return { title: t('title.sentiment') };
}

export default function Page() {
  return <SentimentPageClient />;
}


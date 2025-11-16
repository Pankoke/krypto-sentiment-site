import type { Metadata } from 'next';
import SentimentPageClient from '../../../../src/app/sentiment/SentimentPageClient';
import { getTranslations } from 'next-intl/server';

const BASE_URL = process.env.APP_BASE_URL ?? 'https://krypto-sentiment-site.com';

export async function generateMetadata({
  params
}: {
  params: { locale: 'de' | 'en' };
}): Promise<Metadata> {
  const t = await getTranslations();
  const canonical = new URL(`/${params.locale}/sentiment`, BASE_URL).toString();
  return {
    title: t('title.sentiment'),
    description: 'Live sentiment overview combining news, social and on-chain indicators.',
    alternates: { canonical }
  };
}

export default function Page() {
  return <SentimentPageClient />;
}

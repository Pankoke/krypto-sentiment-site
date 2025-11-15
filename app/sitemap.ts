import type { MetadataRoute } from 'next';

const BASE_URL = process.env.APP_BASE_URL ?? 'https://krypto-sentiment-site.com';
const LOCALES = ['de', 'en'];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = new URL(BASE_URL);
  const entries: string[] = [];
  LOCALES.forEach((locale) => {
    entries.push(`/${locale}`);
    entries.push(`/${locale}/news`);
    entries.push(`/${locale}/reports`);
    entries.push(`/${locale}/${locale === 'de' ? 'methodik' : 'methodology'}`);
  });
  return entries.map((path) => ({ url: new URL(path, base).toString() }));
}

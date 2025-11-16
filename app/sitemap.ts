import type { MetadataRoute } from 'next';

const BASE_URL = process.env.APP_BASE_URL ?? 'https://krypto-sentiment-site.com';
const ENTRIES = [
  '/en',
  '/en/news',
  '/en/methodology',
  '/en/coins',
  '/en/coins/btc',
  '/en/coins/eth',
  '/en/coins/sol',
  '/en/data',
  '/en/learn',
  '/en/about',
  '/en/contact',
  '/de',
  '/de/news',
  '/de/methodik',
  '/de/coins',
  '/de/coins/btc',
  '/de/coins/eth',
  '/de/coins/sol',
  '/de/daten',
  '/de/lernen',
  '/de/ueber-uns',
  '/de/kontakt'
];

export async function generateSitemap(): Promise<MetadataRoute.Sitemap> {
  const base = new URL(BASE_URL);
  return ENTRIES.map((path) => ({
    url: new URL(path, base).toString()
  }));
}

import assetData from '../data/assets.json';
import { defaultLocale, locales, type Locale } from '../i18n';

export type AssetDefinition = {
  ticker: string;
  name: string;
  enabled: boolean;
};

const normalizedAssets: AssetDefinition[] = assetData.map((asset) => ({
  ...asset,
  ticker: asset.ticker.toUpperCase(),
}));

export const assetDefinitions = Object.freeze(normalizedAssets);
export const allowedAssets = assetDefinitions.filter((asset) => asset.enabled);
export const allowedTickerOrder = Object.freeze(allowedAssets.map((asset) => asset.ticker));
const allowedTickerSet = new Set(allowedTickerOrder);

export function isTickerAllowed(ticker?: string): boolean {
  if (!ticker) return false;
  return allowedTickerSet.has(ticker.trim().toUpperCase());
}

export function filterAssetsByWhitelist<T extends { symbol: string }>(items: T[]): T[] {
  return items.filter((item) => {
    const symbol = item.symbol?.trim?.() ?? '';
    return isTickerAllowed(symbol);
  });
}

export function sortAssetsByWhitelistOrder<T extends { symbol: string }>(items: T[]): T[] {
  const order = new Map(allowedTickerOrder.map((ticker, index) => [ticker, index]));
  return [...items].sort((a, b) => {
    const idxA = order.get(a.symbol.toUpperCase()) ?? Number.MAX_SAFE_INTEGER;
    const idxB = order.get(b.symbol.toUpperCase()) ?? Number.MAX_SAFE_INTEGER;
    return idxA - idxB;
  });
}

export function buildLocalePath(locale?: string): `/${string}` {
  const normalized = locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;
  return `/${normalized}`;
}

export function buildAssetRedirectUrl(options?: { locale?: string; queryKey?: string }) {
  const base = buildLocalePath(options?.locale);
  const query = options?.queryKey ? `?redirect=${encodeURIComponent(options.queryKey)}` : '';
  return `${base}${query}`;
}

export function getAllowedTickerOrder(): readonly string[] {
  return allowedTickerOrder;
}

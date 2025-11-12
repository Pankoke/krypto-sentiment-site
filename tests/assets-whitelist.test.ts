import { describe, expect, it } from 'vitest';
import {
  allowedAssets,
  buildAssetRedirectUrl,
  filterAssetsByWhitelist,
  isTickerAllowed,
} from '../lib/assets';

describe('asset whitelist', () => {
  it('exposes exactly four enabled assets in the intended order', () => {
    expect(allowedAssets.map((asset) => asset.ticker)).toEqual(['BTC', 'ETH', 'SOL', 'XRP']);
  });

  it('filters payloads down to the alphabet of enabled tickers', () => {
    const sample = [
      { symbol: 'BTC', extra: 1 },
      { symbol: 'XRP', extra: 2 },
      { symbol: 'AVAX', extra: 3 },
    ];
    expect(filterAssetsByWhitelist(sample).map((item) => item.symbol)).toEqual(['BTC', 'XRP']);
  });

  it('identifies allowed versus blocked tickers', () => {
    expect(isTickerAllowed('btc')).toBe(true);
    expect(isTickerAllowed('Ada')).toBe(false);
  });

  it('builds a redirect URL for invalid tickers that keeps the locale prefix', () => {
    const url = buildAssetRedirectUrl({ locale: 'en', queryKey: 'invalid-asset' });
    expect(url).toContain('/en');
    expect(url).toContain('?redirect=invalid-asset');
  });
});

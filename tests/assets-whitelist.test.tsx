console.log('[assets] module loaded');
import { describe, it, expect } from 'vitest';
import { allowedAssets, buildAssetRedirectUrl, filterAssetsByWhitelist, isTickerAllowed } from '../lib/assets';

console.log('[assets] before describe');
describe('asset whitelist', () => {
  it('exposes exactly four assets', () => {
    expect(allowedAssets.map((asset) => asset.ticker)).toEqual(['BTC', 'ETH', 'SOL', 'XRP']);
  });

  it('filters payloads to allowed tickers', () => {
    const sample = [
      { symbol: 'BTC', extra: 1 },
      { symbol: 'XRP', extra: 2 },
      { symbol: 'AVAX', extra: 3 },
    ];
    expect(filterAssetsByWhitelist(sample).map((item) => item.symbol)).toEqual(['BTC', 'XRP']);
  });

  it('identifies allowed tickers case-insensitively', () => {
    expect(isTickerAllowed('btc')).toBe(true);
    expect(isTickerAllowed('Ada')).toBe(false);
  });

  it('builds redirect URL keeping locale prefix', () => {
    const url = buildAssetRedirectUrl({ locale: 'en', queryKey: 'invalid-asset' });
    expect(url).toContain('/en');
    expect(url).toContain('?redirect=invalid-asset');
  });
});

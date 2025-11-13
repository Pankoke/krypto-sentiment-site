import { describe, expect, it } from 'vitest';
import { buildWeights, computeAssetScore } from '../lib/scoring';

console.log('[scoring] module loaded');

describe('Scoring MVP', () => {
  console.log('[scoring] before describe');
  it('produces > 60 score01 when social and derivatives are strongly positive', () => {
    const result = computeAssetScore('BTC', {
      social: 0.9,
      derivatives: 0.85,
      news: 0,
      onChain: 0,
      price: 0,
    });
    expect(result.score01).toBeGreaterThan(60);
    expect(result.label).toBe('bullish');
  });

  it('boosts news weight when event severity is active', () => {
    const base = buildWeights();
    const boosted = buildWeights(0.8, 'normal');
    expect(boosted.news).toBeGreaterThan(base.news);
    expect(boosted.news - base.news).toBeGreaterThan(0);
  });

  it('shifts weight to derivatives in high-vol regime', () => {
    const base = buildWeights();
    const highVol = buildWeights(undefined, 'high');
    expect(highVol.derivatives).toBeGreaterThan(base.derivatives);
  });

  it('maintains label via hysteresis for small oscillations', () => {
    const initial = computeAssetScore('SOL', {
      social: 0.5,
      derivatives: 0.5,
      news: 0,
      onChain: 0,
      price: 0,
    });
    expect(initial.label).toBe('neutral');
    const second = computeAssetScore(
      'SOL',
      { social: 0.55, derivatives: 0.55, news: 0, onChain: 0, price: 0 },
      { previousLabel: initial.label }
    );
    expect(second.label).toBe('neutral');
  });

  it('confidence drops when coverage is low', () => {
    const result = computeAssetScore('XRP', { social: 0.7 }, { previousLabel: 'neutral' });
    expect(result.confidence).toBeLessThan(80);
  });

  it('reasons mention dominant signals', () => {
    const result = computeAssetScore('ETH', {
      social: -0.6,
      derivatives: 0.1,
      news: 0.4,
      onChain: 0,
      price: 0,
    });
    expect(result.reasons[0]).toContain('Social');
  });
});

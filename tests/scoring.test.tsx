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
});

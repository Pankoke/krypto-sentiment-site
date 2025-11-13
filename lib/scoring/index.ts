import type { AssetFeatureSet, ScoreResult, SourceCategory } from './types';

const baseWeights: Record<SourceCategory, number> = {
  social: 0.25,
  news: 0.15,
  derivatives: 0.25,
  onChain: 0.2,
  price: 0.15,
};

const categories: SourceCategory[] = ['social', 'news', 'derivatives', 'onChain', 'price'];

function clamp(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(-1, Math.min(1, value));
}

function normalizeWeights(raw: Record<SourceCategory, number>): Record<SourceCategory, number> {
  const sum = categories.reduce((total, key) => total + (raw[key] ?? 0), 0);
  if (sum === 0) {
    return { ...baseWeights };
  }
  return categories.reduce((acc, key) => {
    acc[key] = (raw[key] ?? 0) / sum;
    return acc;
  }, {} as Record<SourceCategory, number>);
}

export function buildWeights(eventSeverity?: number, volatilityRegime?: AssetFeatureSet['volatilityRegime']): Record<SourceCategory, number> {
  const adjusted: Record<SourceCategory, number> = { ...baseWeights };

  if (eventSeverity && eventSeverity > 0) {
    const boost = Math.min(1, eventSeverity) * 0.05;
    adjusted.news += boost;
    const others = categories.filter((k) => k !== 'news');
    const deduction = boost / others.length;
    others.forEach((key) => {
      adjusted[key] = Math.max(0, adjusted[key] - deduction);
    });
  }

  if (volatilityRegime === 'high') {
    adjusted.derivatives += 0.05;
    const others = categories.filter((k) => k !== 'derivatives');
    const deduction = 0.05 / others.length;
    others.forEach((key) => {
      adjusted[key] = Math.max(0, adjusted[key] - deduction);
    });
  } else if (volatilityRegime === 'low') {
    adjusted.onChain += 0.04;
    adjusted.social += 0.04;
    const others = categories.filter((k) => k !== 'onChain' && k !== 'social');
    const deduction = 0.08 / others.length;
    others.forEach((key) => {
      adjusted[key] = Math.max(0, adjusted[key] - deduction);
    });
  }

  return normalizeWeights(adjusted);
}

export function computeAssetScore(asset: string, features: AssetFeatureSet): ScoreResult {
  const subscores: Record<SourceCategory, number> = categories.reduce((acc, key) => {
    acc[key] = clamp(features[key] ?? 0);
    return acc;
  }, {} as Record<SourceCategory, number>);

  const weights = buildWeights(features.eventSeverity, features.volatilityRegime);
  const totalScore = categories.reduce((sum, key) => sum + subscores[key] * weights[key], 0);
  const score01 = Math.round(((totalScore + 1) / 2) * 100);
  const usedCategories = categories.filter((key) => typeof features[key] === 'number').length;
  const confidence = usedCategories / categories.length;

  return {
    asset,
    subscores,
    weights,
    totalScore: Math.max(-1, Math.min(1, totalScore)),
    score01: Math.max(0, Math.min(100, score01)),
    confidence: Math.max(0, Math.min(1, confidence)),
  };
}

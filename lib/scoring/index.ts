import type { AssetFeatureSet, ScoreResult, ScoreContext, SourceCategory, ScoreLabel } from './types';

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

function computeAgreement(subscores: Record<SourceCategory, number>): number {
  const values = Object.values(subscores);
  const max = Math.max(...values);
  const min = Math.min(...values);
  return 1 - Math.max(0, (max - min) / 2);
}

function computeStability(history?: number[]): number {
  if (!history || history.length < 2) return 0.5;
  const mean = history.reduce((sum, val) => sum + val, 0) / history.length;
  const variance = history.reduce((sum, val) => sum + (val - mean) ** 2, 0) / history.length;
  const stddev = Math.sqrt(variance) / 100;
  return Math.max(0, Math.min(1, 1 - stddev));
}

function determineLabel(score01: number, previous?: ScoreLabel): ScoreLabel {
  const bullishEnter = 65;
  const bullishExit = 55;
  const bearishEnter = 35;
  const bearishExit = 45;

  if (previous === 'bullish') {
    if (score01 <= bearishEnter) return 'bearish';
    if (score01 <= bullishExit) return 'neutral';
    return 'bullish';
  }
  if (previous === 'bearish') {
    if (score01 >= bullishEnter) return 'bullish';
    if (score01 >= bearishExit) return 'neutral';
    return 'bearish';
  }
  if (score01 >= bullishEnter) return 'bullish';
  if (score01 <= bearishEnter) return 'bearish';
  return 'neutral';
}

function buildReasons(subscores: Record<SourceCategory, number>, weights: Record<SourceCategory, number>): string[] {
  const entries = Object.entries(subscores) as Array<[SourceCategory, number]>;
  const sorted = entries.sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
  const primary = sorted[0];
  const secondary = sorted[1];
  const labelMap: Record<SourceCategory, string> = {
    social: 'Social',
    news: 'News',
    derivatives: 'Derivate',
    onChain: 'On-Chain',
    price: 'Preis',
  };
  const dir = primary[1] >= 0 ? 'positiv' : 'negativ';
  const reason1 = `${labelMap[primary[0]]} ist ${dir} und prägt damit den Score.`;
  const reason2 = secondary
    ? `${labelMap[secondary[0]]} trägt mit einem Gewicht von ${(weights[secondary[0]] * 100).toFixed(0)}% zusätzlich bei.`
    : 'Weitere Signale sind derzeit neutral.';
  return [reason1, reason2];
}

function computeConfidenceDetails(
  features: AssetFeatureSet,
  subscores: Record<SourceCategory, number>,
  usedCategories: number
): { confidence: number; details: { coverage: number; diversity: number; agreement: number; stability: number } } {
  const coverage = Math.max(0, Math.min(1, usedCategories / categories.length));
  const diversity = Math.max(0, Math.min(1, features.diversity ?? 0.5));
  const agreement = computeAgreement(subscores);
  const stability = computeStability(features.scoreHistory);
  const confidence = 0.4 * coverage + 0.2 * diversity + 0.2 * agreement + 0.2 * stability;
  return { confidence, details: { coverage, diversity, agreement, stability } };
}

export function computeAssetScore(asset: string, features: AssetFeatureSet, context?: ScoreContext): ScoreResult {
  const subscores: Record<SourceCategory, number> = categories.reduce((acc, key) => {
    acc[key] = clamp(features[key] ?? 0);
    return acc;
  }, {} as Record<SourceCategory, number>);

  const weights = buildWeights(features.eventSeverity, features.volatilityRegime);
  const totalScore = categories.reduce((sum, key) => sum + subscores[key] * weights[key], 0);
  const score01 = Math.round(((totalScore + 1) / 2) * 100);
  const usedCategories = categories.filter((key) => typeof features[key] === 'number').length;
  const { confidence, details } = computeConfidenceDetails(features, subscores, usedCategories);
  const label = determineLabel(score01, context?.previousLabel);
  const reasons = buildReasons(subscores, weights);

  return {
    asset,
    subscores,
    weights,
    totalScore: Math.max(-1, Math.min(1, totalScore)),
    score01: Math.max(0, Math.min(100, score01)),
    confidence: Math.round(Math.max(0, Math.min(1, confidence)) * 100),
    confidenceDetails: details,
    label,
    reasons,
  };
}

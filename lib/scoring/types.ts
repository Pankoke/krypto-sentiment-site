export type SourceCategory = 'social' | 'news' | 'derivatives' | 'onChain' | 'price';

export interface AssetFeatureSet {
  social?: number;
  news?: number;
  derivatives?: number;
  onChain?: number;
  price?: number;
  eventSeverity?: number;
  volatilityRegime?: 'high' | 'low' | 'normal';
}

export interface ScoreResult {
  asset: string;
  subscores: Record<SourceCategory, number>;
  weights: Record<SourceCategory, number>;
  totalScore: number;
  score01: number;
  confidence: number;
}

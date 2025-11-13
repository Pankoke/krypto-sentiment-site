export type SourceCategory = 'social' | 'news' | 'derivatives' | 'onChain' | 'price';
export type ScoreLabel = 'bullish' | 'neutral' | 'bearish';

export interface AssetFeatureSet {
  social?: number;
  news?: number;
  derivatives?: number;
  onChain?: number;
  price?: number;
  eventSeverity?: number;
  volatilityRegime?: 'high' | 'low' | 'normal';
  diversity?: number;
  scoreHistory?: number[];
}

export interface ScoreContext {
  previousLabel?: ScoreLabel;
}

export interface ScoreConfidence {
  coverage: number;
  diversity: number;
  agreement: number;
  stability: number;
}

export interface ScoreResult {
  asset: string;
  subscores: Record<SourceCategory, number>;
  weights: Record<SourceCategory, number>;
  totalScore: number;
  score01: number;
  confidence: number;
  confidenceDetails: ScoreConfidence;
  label: ScoreLabel;
  reasons: string[];
}

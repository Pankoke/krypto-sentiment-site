import type { UnifiedPost } from '../types';

export async function fetchOnchain(): Promise<UnifiedPost[]> {
  const now = Date.now();
  const t = (m: number) => new Date(now - m * 60_000).toISOString();
  const posts: UnifiedPost[] = [
    {
      source: 'onchain',
      asset: 'BTC',
      text: 'Exchange netflow ↓ (netto Abflüsse); Reserve sinkt.',
      ts: t(3)
    },
    {
      source: 'onchain',
      asset: 'ETH',
      text: 'Active addresses ↑; Staking-Quote stabil; L2-Transaktionen ↑.',
      ts: t(5)
    },
    {
      source: 'onchain',
      asset: 'SOL',
      text: 'Neue Adressen ↑; TPS stabil hoch; DEX-Volumen +7% d/ d.',
      ts: t(9)
    }
  ];
  return posts;
}


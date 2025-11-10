import type { UnifiedPost } from '../types';

export async function fetchSocial(): Promise<UnifiedPost[]> {
  const now = Date.now();
  const t = (m: number) => new Date(now - m * 60_000).toISOString();
  const posts: UnifiedPost[] = [
    {
      source: 'social',
      asset: 'ETH',
      text: 'ETH gas fees super low rn, L2s buzzing',
      ts: t(1),
      engagement: 1200
    },
    {
      source: 'social',
      asset: 'SOL',
      text: 'SOL memecoins pumping again, volume picking up',
      ts: t(4),
      engagement: 530
    },
    {
      source: 'social',
      asset: 'BTC',
      text: 'BTC whales moving? on-chain says outflows from exchanges',
      ts: t(8),
      engagement: 310
    },
    {
      source: 'social',
      asset: 'BTC',
      text: 'ETF narrative not over yet, institutions still buying',
      ts: t(12),
      engagement: 420
    }
  ];
  return posts;
}


import type { UnifiedPost } from '../types';

function tsMinus(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

export async function fetchNews(): Promise<UnifiedPost[]> {
  const now = Date.now();
  const base = (m: number) => new Date(now - m * 60_000).toISOString();
  const posts: UnifiedPost[] = [
    {
      source: 'news',
      asset: 'BTC',
      text: 'BTC ETF-Zuflüsse steigen über 250 Mio. USD; Kurs hält 70k.',
      ts: base(2)
    },
    {
      source: 'news',
      asset: 'ETH',
      text: 'Ethereum Dencun-Upgrade senkt L2-Gebühren weiter laut mehreren Rollups.',
      ts: base(6)
    },
    {
      source: 'news',
      asset: 'SOL',
      text: 'Solana DeFi-TVL erreicht neues Jahreshoch; Aktivität im Ökosystem nimmt zu.',
      ts: base(10)
    },
    {
      source: 'news',
      asset: 'BTC',
      text: 'Bitcoin Miner-Erlöse steigen; Hashrate bleibt nahe Allzeithoch.',
      ts: base(14)
    }
  ];
  return posts;
}


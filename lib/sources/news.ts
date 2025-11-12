import type { UnifiedPost } from '../types';
import { pick, timestampMinutesAgo } from './utils';

const newsBlueprints = [
  {
    asset: 'BTC',
    snippets: [
      'BTC ETF-Zuflüsse steigen über 250 Mio. USD; Kurs hält 70k.',
      'Bitcoin-Miner sehen steigende Erlöse bei stabiler Hashrate.',
    ],
  },
  {
    asset: 'ETH',
    snippets: [
      'Ethereum Dencun-Upgrade senkt L2-Gebühren weiter laut mehreren Rollups.',
      'Layer-2-Ökosystem verzeichnet neue Kapitalkraft für Asset-Interoperabilität.',
    ],
  },
  {
    asset: 'SOL',
    snippets: [
      'Solana DeFi-TVL erreicht neues Jahreshoch; Aktivität im Ökosystem nimmt zu.',
      'Solana-Infrastrukturfirmen berichten von erhöhtem Validator-Engagement.',
    ],
  },
  {
    asset: 'AVAX',
    snippets: [
      'Avalanche-DApps melden wachsende TVL nach erfolgreichem Update.',
      'AVAX-Community diskutiert Multi-Chain-Strategien und neue Brücken.',
    ],
  },
];

export async function fetchNews(): Promise<UnifiedPost[]> {
  return newsBlueprints.flatMap((blueprint, index) => {
    const text = pick(blueprint.snippets);
    const basePost: UnifiedPost = {
      source: 'news',
      asset: blueprint.asset,
      text,
      ts: timestampMinutesAgo(4 + index * 3, 8 + index * 3),
    };
    if (blueprint.asset === 'BTC') {
      return [
        basePost,
        {
          source: 'news',
          asset: 'BTC',
          text: 'Makro-Analysten sehen Bitcoin als sicheren Hafen während traditioneller Märkte schwächeln.',
          ts: timestampMinutesAgo(10 + index * 2, 14 + index * 2),
        },
      ];
    }
    return [basePost];
  });
}

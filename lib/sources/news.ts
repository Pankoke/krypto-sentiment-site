import type { UnifiedPost } from '../types';
import { pick, timestampMinutesAgo } from './utils';

const newsBlueprints = [
  {
    asset: 'BTC',
    snippets: [
      'BTC ETF-ZuflǬsse steigen Ǭber 250 Mio. USD; Kurs h��lt 70k.',
      'Bitcoin-Miner sehen steigende Erl��se bei stabiler Hashrate.',
    ],
  },
  {
    asset: 'ETH',
    snippets: [
      'Ethereum Dencun-Upgrade senkt L2-GebǬhren weiter laut mehreren Rollups.',
      'Layer-2-Ökosystem verzeichnet neue Kapitalkraft fǬr Asset-InteroperabilitǬt.',
    ],
  },
  {
    asset: 'SOL',
    snippets: [
      'Solana DeFi-TVL erreicht neues Jahreshoch; Aktivit��t im �-kosystem nimmt zu.',
      'Solana-Infrastrukturfirmen berichten von erhǬhtem Validator-Engagement.',
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
          text: 'Makro-Analysten sehen Bitcoin als sicheren Hafen wǬhrend traditioneller Märkte schwächeln.',
          ts: timestampMinutesAgo(10 + index * 2, 14 + index * 2),
        },
      ];
    }
    return [basePost];
  });
}

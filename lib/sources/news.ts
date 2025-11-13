import type { AdapterEntryInput } from '../types';
import { pick, timestampMinutesAgo } from './utils';

const newsBlueprints = [
  {
    asset: 'BTC',
    snippets: [
      'Bitcoin-ETF-Zuflüsse steigen über 250 Mio. USD, der Kurs bleibt über 70k.',
      'Miner melden steigende Erlöse bei stabiler Hashrate.',
    ],
    title: 'ETF-Flüsse und Miner-Erlöse im Blick',
  },
  {
    asset: 'ETH',
    snippets: [
      'Dencun-Upgrade reduziert L2-Gebühren, Rollups melden steigende Aktivität.',
      'Layer-2-Ökosystem erhält neue Kapitalkraft für Asset-Interoperabilität.',
    ],
    title: 'Ethereum Layer-2-Ökosystem gewinnt Tempo',
  },
  {
    asset: 'SOL',
    snippets: [
      'Solana-DeFi-TVL erreicht neues Jahreshoch, Aktivitäten im Ökosystem nehmen zu.',
      'Infrastrukturfirmen berichten von erhöhtem Validator-Engagement.',
    ],
    title: 'Solana-Infrastruktur verzeichnet Wachstum',
  },
  {
    asset: 'XRP',
    snippets: [
      'Ripple kündigt neue Partnerschaften mit Zahlungsdienstleistern an.',
      'XRP-Transactions zeigen erhöhtes Volumen bei On-Chain-Sicherheit.',
    ],
    title: 'Ripple kooperiert mit Zahlungsdienstleistern',
  },
];

export async function fetchNews(): Promise<AdapterEntryInput[]> {
  return newsBlueprints.flatMap((blueprint, index) => {
    const summary = pick(blueprint.snippets);
    const baseEntry: AdapterEntryInput = {
      source: 'news-wire',
      type: 'news',
      asset: blueprint.asset,
      title: blueprint.title,
      summary,
      url: `https://news.example.com/${blueprint.asset.toLowerCase()}`,
      timestamp: timestampMinutesAgo(4 + index * 2, 8 + index * 2),
      importance: 0.6,
      externalId: `news-${blueprint.asset}-${index}`,
    };
    if (blueprint.asset === 'BTC') {
      return [
        baseEntry,
        {
          ...baseEntry,
          summary: 'Makro-Analysten sehen Bitcoin als sicheren Hafen während traditioneller Märkte schwächeln.',
          timestamp: timestampMinutesAgo(10 + index * 2, 14 + index * 2),
          externalId: `news-${blueprint.asset}-bonus`,
        },
      ];
    }
    return [baseEntry];
  });
}

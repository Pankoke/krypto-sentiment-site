import type { UnifiedPost } from '../types';
import { pick, timestampMinutesAgo } from './utils';

const onchainSignals = [
  {
    asset: 'BTC',
    snippets: [
      'Exchange netflow (netto Abflüsse); Reserve sinkt.',
      'Bitcoin UTXOs mit >1k BTC bewegen sich vermehrt.',
    ],
  },
  {
    asset: 'ETH',
    snippets: [
      'Active addresses steigen; Staking-Quote bleibt stabil.',
      'L2-Transaktionen zeigen wachsende Durchsätze seit dem Dencun-Upgrade.',
    ],
  },
  {
    asset: 'SOL',
    snippets: [
      'Neue Adressen; TPS stabil hoch; DEX-Volumen +7% d/d.',
      'Solana Validators sehen steigende Votes und On-Chain-Aktivität.',
    ],
  },
  {
    asset: 'AVAX',
    snippets: [
      'Avalanche-Brücken melden mehr Mittelzufluss in Smart-Contracts.',
      'AVAX-Miner sichern weiterhin hohe TPS mit stabilem Belohnungsfluss.',
    ],
  },
];

export async function fetchOnchain(): Promise<UnifiedPost[]> {
  return onchainSignals.map((signal, index) => ({
    source: 'onchain',
    asset: signal.asset,
    text: pick(signal.snippets),
    ts: timestampMinutesAgo(5 + index * 2, 10 + index * 2),
  }));
}

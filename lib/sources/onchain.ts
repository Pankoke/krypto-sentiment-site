import type { AdapterEntryInput } from '../types';
import { pick, timestampMinutesAgo } from './utils';

const onchainSignals = [
  {
    asset: 'BTC',
    snippets: [
      'Netto-Abflüsse von Exchanges lassen Reserven schrumpfen.',
      'UTXOs mit über 1k BTC werden wieder aktiv bewegt.',
    ],
    title: 'Exchange-Reserven und UTXOs im Fokus',
  },
  {
    asset: 'ETH',
    snippets: [
      'Aktive Adressen steigen, Staking-Quote stabil.',
      'Layer-2-Transaktionen zeigen höhere Durchsätze seit dem Dencun-Upgrade.',
    ],
    title: 'Ethereum On-Chain-Activity klettert',
  },
  {
    asset: 'SOL',
    snippets: [
      'Neue Adressen und hohe TPS, DEX-Volumen plus 7% d/d.',
      'Validatoren sehen steigende Votes und On-Chain-Aktivität.',
    ],
    title: 'Solana On-Chain-Kennzahlen bleiben stark',
  },
  {
    asset: 'XRP',
    snippets: [
      'Brücken melden Mittelzuflüsse in Smart-Contracts.',
      'Validatoren sichern hohe TPS bei stabilem Belohnungsfluss.',
    ],
    title: 'Ripple Brücken und Validatoren aktiv',
  },
];

export async function fetchOnchain(): Promise<AdapterEntryInput[]> {
  return onchainSignals.map((signal, index) => ({
    type: 'onchain',
    source: 'onchain',
    asset: signal.asset,
    summary: pick(signal.snippets),
    title: signal.title,
    timestamp: timestampMinutesAgo(5 + index * 2, 10 + index * 2),
    importance: 0.55,
    externalId: `onchain-${signal.asset}-${index}`,
  }));
}

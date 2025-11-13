import type { AdapterEntryInput } from '../types';
import { pick, timestampMinutesAgo } from './utils';

const socialSignals = [
  {
    asset: 'ETH',
    snippets: [
      'ETH-Gebühren bleiben niedrig, Layer-2-Communities feiern.',
      'L2s berichten von deutlich niedrigeren Durchsätzen pro Transaktion.',
    ],
  },
  {
    asset: 'SOL',
    snippets: [
      'SOL-Memecoins bringen wieder Volumen, Token-Entwickler planen Governance-Bump.',
      'Dezentrale Projekte setzen auf Solana für Releases in Q4.',
    ],
  },
  {
    asset: 'BTC',
    snippets: [
      'Whale-Muster zeigen Anhäufung, traditionelle Börsen verzeichnen Zuflüsse.',
      'ETF-Narrativ lebt weiter, institutionelle Käufer bleiben aktiv.',
    ],
  },
];

const extraSocial = [
  'Community diskutiert frische Finanzierungsrunden für Layer-1-Infrastruktur.',
  'Trader beobachten Stablecoin-Balances parallel zu BTC-Zuflüssen.',
  'Council Minutes geben Hinweise auf Zeitpläne für Scaling-Updates.',
];

export async function fetchSocial(): Promise<AdapterEntryInput[]> {
  const dynamic = socialSignals.map((signal) => {
    const summary = pick(signal.snippets);
    return {
      type: 'social',
      source: 'social',
      asset: signal.asset,
      summary,
      timestamp: timestampMinutesAgo(2, 18),
      importance: 0.45,
      externalId: `social-${signal.asset}-${summary.slice(0, 10)}`,
      engagement: Math.floor(Math.random() * 900) + 300,
    } satisfies AdapterEntryInput;
  });

  const bonus: AdapterEntryInput[] = extraSocial.map((text, idx) => ({
    type: 'social',
    source: 'social',
    asset: pick(['BTC', 'ETH', 'SOL', 'XRP']),
    summary: text,
    timestamp: timestampMinutesAgo(1 + idx * 3, 5 + idx * 3),
    importance: 0.35,
    externalId: `social-bonus-${idx}`,
    engagement: Math.floor(Math.random() * 500) + 200,
  }));

  return [...dynamic, ...bonus];
}

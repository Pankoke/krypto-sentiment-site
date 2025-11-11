import type { UnifiedPost } from '../types';
import { buildSocialPost, pick, randomInt, timestampMinutesAgo } from './utils';

const socialSignals = [
  {
    asset: 'ETH',
    snippets: [
      'ETH gas fees super low rn, L2s buzzing.',
      'Layer-2 communities celebrating smoother rollups.',
    ],
    engagement: [800, 1400],
  },
  {
    asset: 'SOL',
    snippets: [
      'SOL memecoins pumping again, volume picking up.',
      'SOL devs hyped about upcoming governance push.',
    ],
    engagement: [400, 900],
  },
  {
    asset: 'BTC',
    snippets: [
      'BTC whales moving? on-chain says outflows from exchanges.',
      'ETF narrative not over yet, institutions still buying.',
      'Bitcoin on-chain data hints at renewed accumulation.',
    ],
    engagement: [300, 1200],
  },
];

const extraSocial = [
  'Community notes fresh funding rounds for infrastructure builders.',
  'Traders watch stablecoin balances alongside BTC inflows.',
  'Minutes from the last council highlight scheduling for scaling updates.',
];

export async function fetchSocial(): Promise<UnifiedPost[]> {
  const dynamic = socialSignals.map((signal) => {
    const [minEng, maxEng] = signal.engagement;
    return buildSocialPost(
      signal.asset,
      pick(signal.snippets),
      minEng,
      maxEng
    );
  });

  const bonus: UnifiedPost[] = Array.from({ length: extraSocial.length }).map((_, idx) => ({
    source: 'social',
    asset: pick(['BTC', 'ETH', 'SOL', 'AVAX']),
    text: extraSocial[idx],
    ts: timestampMinutesAgo(2 + idx * 3, 6 + idx * 3),
    engagement: randomInt(250, 700),
  }));

  return [...dynamic, ...bonus];
}

import { readFile } from 'fs/promises';
import { join } from 'path';
import Link from 'next/link';
import type { DailyCryptoSentiment } from '../../../../../lib/types';
import { isDailyCryptoSentiment } from '../../../../../lib/types';
import Card from '../../../../../components/ui/Card';
import Badge from '../../../../../components/ui/Badge';
import Meter from '../../../../../components/ui/Meter';
import { meterColor, toneLabel } from '../../../../../lib/ui/sentiment';
import { getTranslations } from 'next-intl/server';

import {
  buildLocalePath,
  filterAssetsByWhitelist,
  sortAssetsByWhitelistOrder,
} from '../../../../../lib/assets';

async function loadReportByDate(date: string): Promise<DailyCryptoSentiment | null> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const file = join(process.cwd(), 'data', 'reports', `${date}.json`);
  try {
    const raw = await readFile(file, 'utf8');
    const parsed = JSON.parse(raw) as unknown;
    if (!isDailyCryptoSentiment(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export const metadata = {
  robots: { index: false, follow: true },
};

export default async function Page({ params }: { params: { locale: string; date: string } }) {
  const t = await getTranslations();
  const localeRoot = buildLocalePath(params.locale);
  const report = await loadReportByDate(params.date);

  if (!report) {
    return (
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold">404 – {t('detail.notFoundTitle')}</h1>
        <p className="text-sm text-gray-700">{t('detail.notFoundText', { date: params.date })}</p>
        <Link href={localeRoot} className="text-sm text-gray-700 hover:text-black">
          {t('nav.backHome')}
        </Link>
      </section>
    );
  }

  const allowedAssets = sortAssetsByWhitelistOrder(filterAssetsByWhitelist(report.assets));
  if (!allowedAssets.length) {
    return (
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold">{t('title.sentiment')}</h1>
        <p className="text-sm text-gray-700">{t('empty.noResults')}</p>
        <Link href={`${localeRoot}/reports`} className="text-sm text-gray-700 hover:text-black">
          {t('nav.backHome')}
        </Link>
      </section>
    );
  }

  const { date, macro_summary } = report;

  return (
    <section>
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-semibold">{t('title.sentiment')} – {date}</h1>
        <Link href={`${localeRoot}/reports`} className="text-sm text-gray-700 hover:text-black">
          {t('nav.archive')}
        </Link>
      </div>
      <p className="mt-4 text-base">{macro_summary}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allowedAssets.map((a) => {
          const confPct = Math.round(a.confidence * 100);
          const top = a.top_signals.slice(0, 3);
          return (
            <Card key={`${a.symbol}-${a.sentiment}-${a.score}`}>
              <header className="mb-2 flex items-center justify-between">
                <h2 className="font-semibold">{a.symbol}</h2>
                <Badge tone={a.sentiment}>{toneLabel(a.sentiment)}</Badge>
              </header>
              <div className="text-sm text-gray-700 mb-1">
                Score {a.score.toFixed(2)} · {confPct}% {t('label.confidence')}
              </div>
              <Meter percent={confPct} colorClass={meterColor(a.sentiment)} className="mb-3" />
              <p className="text-sm mb-3">{a.rationale}</p>
              {top.length > 0 && (
                <ul className="text-sm list-disc pl-5 space-y-1">
                  {top.map((s, i) => (
                    <li key={i}>
                      <span className="font-medium">{s.source}:</span> {s.evidence}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}


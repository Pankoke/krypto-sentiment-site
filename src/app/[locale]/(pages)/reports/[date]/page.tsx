import Link from 'next/link';
import { readSnapshot } from '../../../../lib/persistence';
import { buildLocalePath } from '../../../../lib/assets';
import type { DailySnapshot } from '../../../../lib/persistence';
import type { ScoreLabel } from '../../../../lib/scoring/types';
import Badge from '../../../../components/ui/Badge';
import Card from '../../../../components/ui/Card';
import Meter from '../../../../components/ui/Meter';
import { meterColor, toneLabel } from '../../../../lib/ui/sentiment';
import { getTranslations } from 'next-intl/server';

async function loadReportByDate(date: string, locale: string): Promise<DailySnapshot | null> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return null;
  }
  return readSnapshot(date, locale);
}

export const metadata = {
  robots: { index: false, follow: true },
};

export default async function Page({ params }: { params: { locale: string; date: string } }) {
  const t = await getTranslations();
  const localeRoot = buildLocalePath(params.locale);
  const report = await loadReportByDate(params.date, params.locale);

  if (!report) {
    return (
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold">{t('detail.notFoundTitle')}</h1>
        <p className="text-sm text-gray-700">{t('detail.notFoundText', { date: params.date })}</p>
        <Link href={localeRoot} className="text-sm text-gray-700 hover:text-black">
          {t('nav.backHome')}
        </Link>
      </section>
    );
  }

  const allowedAssets = report.assets;
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

  return (
    <section>
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {t('title.sentiment')} · {report.date}
          </h1>
          <p className="text-xs text-gray-500">
            {report.complete
              ? t('archive.complete', { default: 'Vollstaendiger Report' })
              : t('archive.incomplete', { default: 'Unvollstaendiger Report' })}
            {' · '}
            {new Date(report.generatedAt).toLocaleString()}
          </p>
        </div>
        <Link href={`${localeRoot}/reports`} className="text-sm text-gray-700 hover:text-black">
          {t('archive.details', { default: 'Details ansehen' })}
        </Link>
      </div>
      <p className="mt-3 text-base text-gray-700">{report.macro_summary}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allowedAssets.map((asset) => {
          const tone: ScoreLabel = asset.label;
          return (
            <Card key={asset.asset}>
              <header className="mb-2 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">{asset.asset}</h2>
                  <p className="text-xs text-gray-500">{asset.label.toUpperCase()}</p>
                </div>
                <Badge tone={tone}>{toneLabel(tone)}</Badge>
              </header>
              <div className="text-sm text-gray-700 mb-1">
                Score {asset.totalScore.toFixed(2)} · {asset.score01}/100
              </div>
              <Meter percent={asset.score01} colorClass={meterColor(tone)} className="mb-3" />
              <div className="text-xs text-gray-500 mb-2">
                Confidence {asset.confidence}% · {t('archive.macroSummary', { default: 'Reasons below' })}
              </div>
              <ul className="text-sm list-disc pl-5 space-y-1 mb-3">
                {asset.reasons.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
              <div className="text-xs text-gray-500">
                <p>
                  {t('scoring.weights', { default: 'Weights' })}:{' '}
                  {Object.entries(asset.weights)
                    .map(([key, weight]) => `${key}: ${(weight * 100).toFixed(0)}%`)
                    .join(', ')}
                </p>
                <p>
                  {t('scoring.asOf', { default: 'Stand' })}: {new Date(asset.asOf).toLocaleTimeString()}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

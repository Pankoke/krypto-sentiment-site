import Link from 'next/link';
import { listSnapshots } from '../../../lib/persistence';
import Badge from '../../../components/ui/Badge';
import Card from '../../../components/ui/Card';
import Meter from '../../../components/ui/Meter';
import { meterColor, toneLabel } from '../../../lib/ui/sentiment';
import { buildLocalePath } from '../../../lib/assets';
import { getTranslations } from 'next-intl/server';

async function loadLatestSnapshot(locale: string) {
  const snapshots = await listSnapshots(locale);
  return snapshots.length ? snapshots[0] : null;
}

export default async function Page({ params }: { params: { locale: string } }) {
  const t = await getTranslations();
  const localeRoot = buildLocalePath(params.locale);
  const snapshot = await loadLatestSnapshot(params.locale);

  if (!snapshot) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold">{t('title.sentiment')}</h1>
        <p className="text-sm text-gray-700">{t('home.noReport')}</p>
        <Link href={`${localeRoot}/reports`} className="text-sm text-gray-700 hover:text-black">
          {t('nav.archive')}
        </Link>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {t('title.sentiment')} · {snapshot.date}
          </h1>
          <p className="text-xs text-gray-500">
            {snapshot.complete
              ? t('archive.complete', { default: 'Vollstaendiger Report' })
              : t('archive.incomplete', { default: 'Unvollstaendiger Report' })}
            {' · '}
            {new Date(snapshot.generatedAt).toLocaleString()}
          </p>
        </div>
        <Link href={`/reports/${snapshot.date}`} className="text-sm text-gray-700 hover:text-black">
          {t('home.detailsFor', { date: snapshot.date })}
        </Link>
      </div>
      <p className="mt-4 text-base text-gray-700">{snapshot.macro_summary}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {snapshot.assets.map((asset) => (
          <Card key={asset.asset}>
            <header className="mb-2 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">{asset.asset}</h2>
                <p className="text-xs text-gray-500">{asset.label}</p>
              </div>
              <Badge tone={asset.label}>{toneLabel(asset.label)}</Badge>
            </header>
            <div className="text-sm text-gray-700 mb-1">
              Score {asset.totalScore.toFixed(2)} · {asset.score01}/100
            </div>
            <Meter percent={asset.score01} colorClass={meterColor(asset.label)} className="mb-3" />
            <div className="text-xs text-gray-500 mb-2">
              Confidence {asset.confidence}% · {asset.reasons[0]}
            </div>
            <ul className="text-sm list-disc pl-5 space-y-1">
              {asset.reasons.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
            <div className="mt-3 text-xs text-gray-500">
              {t('scoring.asOf', { default: 'Stand' })}: {new Date(asset.asOf).toLocaleTimeString()}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

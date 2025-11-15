import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import Link from 'next/link';
import type { DailyCryptoSentiment } from '../../lib/types';
import { isDailyCryptoSentiment } from '../../lib/types';
import {
  buildLocalePath,
  filterAssetsByWhitelist,
  sortAssetsByWhitelistOrder,
} from '../../lib/assets';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Meter from '../../components/ui/Meter';
import GenerateButton from '../../components/GenerateButton';
import { meterColor, toneLabel } from '../../lib/ui/sentiment';
import { getTranslations } from 'next-intl/server';
import EncodingTest from '@/components/EncodingTest';

export const revalidate = 3600;

async function loadLatestReport(): Promise<DailyCryptoSentiment | null> {
  const dir = join(process.cwd(), 'data', 'reports');
  let files: string[] = [];
  try {
    files = await readdir(dir);
  } catch {
    return null;
  }
  const jsonFiles = files.filter((f) => f.endsWith('.json'));
  if (jsonFiles.length === 0) return null;
  jsonFiles.sort();
  const latest = jsonFiles[jsonFiles.length - 1]!;
  const raw = await readFile(join(dir, latest), 'utf8');
  const parsed = JSON.parse(raw) as unknown;
  if (!isDailyCryptoSentiment(parsed)) return null;
  return parsed;
}

export default async function Page({ params }: { params: { locale: string } }) {
  const t = await getTranslations();
  const localeRoot = buildLocalePath(params.locale);
  const report = await loadLatestReport();

  if (!report) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold">{t('title.sentiment')}</h1>
        <p className="text-sm text-gray-700">{t('home.noReport')}</p>
        <GenerateButton />
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
        <Link href={`${localeRoot}/reports/${date}`} className="text-sm text-gray-700 hover:text-black">
          {t('home.detailsFor', { date })}
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
      <EncodingTest />
    </section>
  );
}


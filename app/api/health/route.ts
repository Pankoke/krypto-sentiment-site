import { NextResponse } from 'next/server';
import { listSnapshotMetadata } from '../../../lib/news/snapshot';

const LOCALES: Array<'de' | 'en'> = ['de', 'en'];

export const runtime = 'nodejs';

export async function GET() {
  try {
    const newsMetadata = await Promise.all(LOCALES.map((locale) => listSnapshotMetadata(locale, 1)));
    const reportsMetadata = await Promise.all(LOCALES.map((locale) => listSnapshotMetadata(locale, 1)));

    const newsEntries = newsMetadata.flat().map((meta) => ({
      ...meta,
      locale: meta.locale as 'de' | 'en',
    }));
    const reportsEntries = reportsMetadata.flat().map((meta) => ({
      ...meta,
      locale: meta.locale as 'de' | 'en',
    }));

    const totalNewsItems = newsEntries.reduce((sum, entry) => sum + entry.items, 0);
    const totalReportAssets = reportsEntries.reduce((sum, entry) => sum + entry.items, 0);

    const latestNews = newsEntries.sort((a, b) => b.date.localeCompare(a.date))[0] ?? null;
    const latestReport = reportsEntries.sort((a, b) => b.date.localeCompare(a.date))[0] ?? null;

    let lastRunStatus: 'ok' | 'partial' | 'fail' = 'fail';
    if (totalNewsItems > 0 && totalReportAssets > 0) {
      lastRunStatus = 'ok';
    } else if (totalNewsItems > 0 || totalReportAssets > 0) {
      lastRunStatus = 'partial';
    }

    return NextResponse.json({
      lastRunStatus,
      news: {
        lastNewsSnapshotDate: latestNews?.date ?? null,
        newsItemsCount: totalNewsItems,
        resolvedFilePath: latestNews?.path ?? null,
      },
      reports: {
        lastReportsSnapshotDate: latestReport?.date ?? null,
        assetsCount: totalReportAssets,
        resolvedFilePath: latestReport?.path ?? null,
      },
    });
  } catch (error) {
    console.error('Health read failed', error);
    return NextResponse.json(
      {
        lastRunStatus: 'fail',
        news: {
          lastNewsSnapshotDate: null,
          newsItemsCount: 0,
          resolvedFilePath: null,
        },
        reports: {
          lastReportsSnapshotDate: null,
          assetsCount: 0,
          resolvedFilePath: null,
        },
      },
      { headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }
}

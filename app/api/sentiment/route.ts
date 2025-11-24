import { NextResponse } from 'next/server';
import { getLatestSentimentFromSnapshots } from '@/lib/news/snapshot';

function determineLocale(request: Request): 'de' | 'en' {
  const url = new URL(request.url);
  const queryLocale = url.searchParams.get('locale');
  if (queryLocale === 'en') return 'en';
  return 'de';
}

export async function GET(request: Request): Promise<Response> {
  const locale = determineLocale(request);
  const latest = await getLatestSentimentFromSnapshots(locale);
  if (!latest) {
    return NextResponse.json({ error: 'No sentiment snapshot available' }, { status: 404 });
  }
  return NextResponse.json(latest);
}

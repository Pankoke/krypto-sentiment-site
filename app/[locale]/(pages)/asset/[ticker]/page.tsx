import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLatestSentimentFromSnapshots, getAssetHistoryFromSnapshots } from "lib/news/snapshot";
import { Sparkline } from "@/components/sentiment/Sparkline";

const BASE_URL = process.env.APP_BASE_URL ?? "https://krypto-sentiment-site.com";

const ASSET_META: Record<string, { name: string; ticker: string }> = {
  btc: { name: "Bitcoin", ticker: "BTC" },
  eth: { name: "Ethereum", ticker: "ETH" },
  sol: { name: "Solana", ticker: "SOL" },
  xrp: { name: "Ripple", ticker: "XRP" },
};

const copy = {
  de: {
    intro:
      "Hier zeigen wir dir bald die tagesaktuelle Marktstimmung, Historie und relevante News für diesen Coin.",
    comingSoon: "Coming soon: Live-Sentiment, Trends und News für diesen Coin.",
    backCoins: "Zur Coins-Übersicht",
    backSentiment: "Zur Sentiment-Übersicht",
    metaDescription: "Profil und Marktstimmung für {name} ({ticker}).",
  },
  en: {
    intro:
      "Soon you’ll see the daily market sentiment, history and relevant news for this coin.",
    comingSoon: "Coming soon: Live sentiment, trends and news for this coin.",
    backCoins: "Back to coins",
    backSentiment: "Back to sentiment overview",
    metaDescription: "Profile and market sentiment for {name} ({ticker}).",
  },
} as const;

type PageParams = { params: { locale: "de" | "en"; ticker: string } };

export function generateMetadata({ params }: PageParams): Metadata {
  const ticker = params.ticker.toLowerCase();
  const meta = ASSET_META[ticker];
  if (!meta) {
    return { title: "Asset nicht gefunden", description: "Dieser Coin wird aktuell nicht unterstützt." };
  }
  const canonical = `${BASE_URL}/${params.locale}/asset/${ticker}`;
  const text = copy[params.locale === "en" ? "en" : "de"];
  const description = text.metaDescription
    .replace("{name}", meta.name)
    .replace("{ticker}", meta.ticker);
  return {
    title: `${meta.name} (${meta.ticker})`,
    description,
    alternates: { canonical },
  };
}

export default async function AssetPage({ params }: PageParams) {
  const locale = params.locale === "en" ? "en" : "de";
  const ticker = params.ticker.toLowerCase();
  const meta = ASSET_META[ticker];
  if (!meta) {
    notFound();
  }
  const text = copy[locale];
  const snapshot = await getLatestSentimentFromSnapshots(locale);
  const assetEntry = snapshot?.assets.find((entry) => entry.ticker.toLowerCase() === ticker);
  if (snapshot && !assetEntry) {
    notFound();
  }
  const history = await getAssetHistoryFromSnapshots(ticker, locale);
  const sparklineData = history.points.map((point) => ({
    t: new Date(point.timestamp).getTime(),
    c: point.score,
  }));
  const change24h =
    history.points.length >= 2
      ? history.points[history.points.length - 1].score - history.points[history.points.length - 2].score
      : null;

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <section className="mx-auto max-w-5xl space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            {locale === "de" ? "Krypto-Asset" : "Crypto asset"}
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            {meta.name} ({meta.ticker})
          </h1>
          <p className="text-sm text-slate-600">{text.intro}</p>
        </header>

        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
          <h2 className="text-base font-semibold text-slate-900">
            {locale === "de" ? "Aktuelle Marktstimmung" : "Current market sentiment"}
          </h2>
          {assetEntry ? (
            <div className="mt-3 space-y-1">
              <p className="text-lg font-semibold text-slate-900">
                Score: {assetEntry.score.toFixed(2)}
              </p>
              <p className="text-sm text-slate-600">
                {locale === "de" ? "Globale Marktstimmung" : "Global market sentiment"}:{" "}
                {snapshot ? snapshot.globalScore.toFixed(2) : "-"}
              </p>
              <p className="text-sm text-slate-600">
                {locale === "de" ? "Stand" : "As of"}:{" "}
                {new Date(snapshot?.timestamp ?? Date.now()).toLocaleString(locale === "de" ? "de-DE" : "en-US")}
              </p>
              <p className="text-sm text-slate-600">
                {locale === "de" ? "24h Änderung" : "24h change"}:{" "}
                {change24h === null ? "–" : change24h >= 0 ? `+${change24h.toFixed(2)}` : change24h.toFixed(2)}
              </p>
              <div className="pt-2">
                {sparklineData.length ? (
                  <Sparkline data={sparklineData} className="w-40 h-12" />
                ) : (
                  <p className="text-xs text-slate-500">
                    {locale === "de" ? "Noch keine Sentiment-Historie verfügbar." : "No sentiment history available yet."}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="mt-2">{text.comingSoon}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-3 text-sm font-medium">
          <Link
            href={`/${locale}/coins`}
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-800 hover:bg-slate-50"
          >
            {text.backCoins}
          </Link>
          <Link
            href={`/${locale}/sentiment`}
            className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
          >
            {text.backSentiment}
          </Link>
        </div>
      </section>
    </main>
  );
}

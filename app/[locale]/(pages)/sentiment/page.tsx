import Link from "next/link";
import type { Metadata } from "next";
import type { SentimentItem } from "lib/sentiment/types";
import type { AssetSentimentPoint } from "lib/news/snapshot";
import { SentimentCard } from "@/components/sentiment/SentimentCard";
import { computeGlobalSentiment } from "lib/sentiment/aggregate";
import { GlobalMarketBar } from "@/components/sentiment/GlobalMarketBar";
import { AssetScoreStrip } from "@/components/sentiment/AssetScoreStrip";
import { getTranslations } from "next-intl/server";
import { getLatestSentimentFromSnapshots } from "lib/news/snapshot";

const BASE_URL = process.env.APP_BASE_URL ?? "https://krypto-sentiment-site.com";

async function loadHistoryMap(symbols: string[], days = 30): Promise<Map<string, AssetSentimentPoint[]>> {
  if (!symbols.length) {
    return new Map();
  }
  const params = new URLSearchParams({
    assets: symbols.join(","),
    days: String(days),
  }).toString();
  try {
    const res = await fetch(`/api/sentiment/history/bulk?${params}`, { next: { revalidate: 300 } });
    if (!res.ok) {
      return new Map();
    }
    const data = (await res.json()) as { asset: string; points: AssetSentimentPoint[] }[];
    const map = new Map<string, AssetSentimentPoint[]>();
    data.forEach((entry) => {
      map.set(entry.asset.toUpperCase(), entry.points ?? []);
    });
    return map;
  } catch {
    return new Map();
  }
}

export const generateMetadata = ({ params }: { params: { locale: "de" | "en" } }): Metadata => {
  const canonical = `${BASE_URL}/${params.locale}/sentiment`;
  const title =
    params.locale === "de" ? "Krypto-Stimmungsübersicht" : "Crypto market sentiment overview";
  const description =
    params.locale === "de"
      ? "Tägliche Marktstimmung für ausgewählte Kryptowährungen. Scores basieren auf News, Social Media und On-Chain-Signalen."
      : "Daily market mood for selected cryptocurrencies. Scores are based on news, social media, and on-chain signals.";

  return {
    title,
    description,
    alternates: { canonical }
  };
};

type SentimentPageProps = { params: { locale: "de" | "en" } };

export default async function SentimentPage({ params }: SentimentPageProps) {
  const { locale } = params;
  const t = await getTranslations("sentiment");
  const snapshot = await getLatestSentimentFromSnapshots(locale);
  const sentimentItems: SentimentItem[] = snapshot
    ? snapshot.assets.map((asset) => ({
        symbol: asset.ticker,
        score: Math.max(0, Math.min(1, asset.score)),
        confidence: Math.max(0, Math.min(1, asset.confidence)),
        trend: asset.sentiment,
        bullets: [],
        generatedAt: snapshot.timestamp,
        sparkline: [],
      }))
    : [];
  const historyMap = await loadHistoryMap(sentimentItems.map((item) => item.symbol));

  const headingTitle =
    locale === "de" ? "Krypto-Stimmungsübersicht" : "Crypto market sentiment overview";
  const subline =
    locale === "de"
      ? "Tägliche Marktstimmung für ausgewählte Kryptowährungen. Scores basieren auf News, Social Media und On-Chain-Signalen."
      : "Daily market mood for selected cryptocurrencies. Scores are based on news, social media, and on-chain signals.";

  const latestReportDate = (() => {
    const candidate = snapshot?.timestamp;
    if (!candidate) return null;
    const parsed = new Date(candidate);
    return Number.isNaN(parsed.getTime())
      ? null
      : parsed.toLocaleDateString(locale === "de" ? "de-DE" : "en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        });
  })();

  const globalSentiment = computeGlobalSentiment(sentimentItems);
  const legendLabels = [
    t("scoreLegend.veryBearish"),
    t("scoreLegend.slightlyBearish"),
    t("scoreLegend.neutral"),
    t("scoreLegend.slightlyBullish"),
    t("scoreLegend.veryBullish"),
  ];
  const changeTexts = {
    increase: t("change24h.increase"),
    decrease: t("change24h.decrease"),
    neutral: t("change24h.neutral"),
  };
  const methodPath = locale === "de" ? "/de/methodik" : "/en/methodology";
  const methodText =
    locale === "de"
      ? "Wie wir diesen Score berechnen, erfährst du in unserer Methodik."
      : "Learn how we calculate this score in our methodology section.";

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        <header className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
              {headingTitle}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">{subline}</p>
          </div>
          {latestReportDate && (
            <p className="text-sm text-slate-500">
              {locale === "de" ? "Letzter Report:" : "Latest report:"}{" "}
              <span className="font-medium text-slate-700">{latestReportDate}</span>
            </p>
          )}
        </header>

        <div className="mb-6 rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-700">
          {methodText}{" "}
          <Link href={methodPath} className="font-semibold text-indigo-700 hover:text-indigo-900 underline">
            {locale === "de" ? "Zur Methodik" : "View methodology"}
          </Link>
        </div>

        {sentimentItems.length > 0 ? (
          <div className="mb-6 space-y-4">
            <GlobalMarketBar
              score={globalSentiment.score}
              label={globalSentiment.label}
              count={globalSentiment.count}
              legendLabels={legendLabels}
              tooltipTitle={t("scoreTooltip.title")}
              tooltipText={t("scoreTooltip.text")}
              asOf={latestReportDate ?? undefined}
            />
            <AssetScoreStrip
              items={sentimentItems}
              locale={locale === "de" ? "de-DE" : "en-US"}
              changeTexts={changeTexts}
            />
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">{t("scoreExplanation.heading")}</h3>
              <p className="mt-1 leading-relaxed">
                {t("scoreExplanation.text")}{" "}
                <Link href={`/${locale}/methodik`} className="text-indigo-700 hover:text-indigo-900 underline">
                  {locale === "de" ? "Mehr zur Methodik" : "How the score works"}
                </Link>
              </p>
            </div>
          </div>
        ) : null}

        <h2 className="sr-only">
          {locale === "de" ? "Aktuelle Sentiment-Karten" : "Current sentiment cards"}
        </h2>
        {sentimentItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-500">
            {locale === "de"
              ? "Keine Sentiment-Daten vorhanden. Aktuell liegen keine Sentiment-Daten vor. Versuche es später erneut oder prüfe den Admin-Bereich."
              : "No sentiment data available right now. Try again later or check the admin area."}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {sentimentItems.map((item) => (
              <SentimentCard
                key={item.symbol}
                item={item}
                historyPoints={historyMap.get(item.symbol.toUpperCase())}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}


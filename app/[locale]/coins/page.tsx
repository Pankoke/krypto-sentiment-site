import Link from "next/link";
import type { Metadata } from "next";
import { allowedAssets } from "lib/assets";

export const metadata: Metadata = {
  title: "Coins & Marktstimmung",
  description: "Übersicht der Assets, für die wir Sentiment analysieren.",
};

const copy = {
  de: {
    title: "Coins & Marktstimmung",
    intro:
      "Hier findest du die wichtigsten Kryptowährungen, für die wir aktuell die Marktstimmung analysieren. In Zukunft kannst du hier nach Sentiment, Volatilität und weiteren Metriken filtern.",
    cta: "Zum Profil",
  },
  en: {
    title: "Coins & Market Sentiment",
    intro:
      "Here you’ll find the key cryptocurrencies we currently track. In future updates you’ll be able to filter by sentiment, volatility and more.",
    cta: "View profile",
  },
} as const;

type CoinsPageProps = { params: { locale: "de" | "en" } };

export default function CoinsPage({ params }: CoinsPageProps) {
  const locale = params.locale === "en" ? "en" : "de";
  const text = copy[locale];
  const assets = allowedAssets.filter((asset) => asset.enabled);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <p className="text-sm text-slate-500">Krypto Sentiment</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{text.title}</h1>
        <p className="max-w-3xl text-base text-slate-600">{text.intro}</p>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {assets.map((asset) => (
          <article
            key={asset.ticker}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">{asset.category ?? "Asset"}</p>
                <h2 className="text-lg font-semibold text-slate-900">
                  {asset.name} ({asset.ticker})
                </h2>
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{asset.ticker}</span>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {locale === "de"
                ? "Tägliche Stimmung aus News, Social und On-Chain-Signalen."
                : "Daily sentiment from news, social and on-chain signals."}
            </p>
            <Link
              href={`/${locale}/asset/${asset.ticker.toLowerCase()}`}
              className="mt-3 inline-flex items-center text-sm font-medium text-indigo-700 hover:text-indigo-900"
            >
              {text.cta}
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}

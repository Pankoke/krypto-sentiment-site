import Link from "next/link";
import type { Metadata } from "next";

const BASE_URL = process.env.APP_BASE_URL ?? "https://krypto-sentiment-site.vercel.app";

const copy = {
  de: {
    metaTitle: "Wie es einzelnen Coins wirklich geht",
    metaDescription:
      "Hier bekommst du die Stimmung für die wichtigsten Kryptowährungen – tagesaktuell, datenbasiert und leicht verständlich eingeordnet.",
    short:
      "Hier bekommst du die Stimmung für die wichtigsten Kryptowährungen – tagesaktuell, datenbasiert und leicht verständlich eingeordnet.",
    sections: [
      {
        title: "Hinweis zur Interpretation",
        paragraphs: [
          "Die angezeigten Sentiment-Werte basieren auf täglichen KI-Auswertungen zu Nachrichten, Social Media und On-Chain-Daten.",
          "Alle Inhalte dienen ausschließlich der Marktstimmungsanalyse und stellen keine Finanzberatung dar."
        ]
      }
    ],
    ecosystemLinks: [
      { label: "Startseite", href: "/de" },
      { label: "Sentiment-Übersicht", href: "/de/sentiment" },
      { label: "News & Signale", href: "/de/news" },
      { label: "Daten & Charts", href: "/de/daten" },
      { label: "Lernen", href: "/de/lernen" }
    ],
    ctas: [
      { label: "Heutige Marktstimmung ansehen", href: "/de/sentiment" },
      { label: "Grundlagen zum Sentiment lernen", href: "/de/lernen" },
      { label: "Sentiment-Trends in Charts entdecken", href: "/de/daten" },
      { label: "Sentiment für einzelne Coins prüfen", href: "/de/coins" }
    ],
    seoKeywords: [
      "Kryptowährungen Sentiment Übersicht",
      "Coin Stimmungsanalyse",
      "Bitcoin Ethereum Sentiment Coins",
      "Crypto asset mood analysis",
      "Einzelne Coins bullish bearish",
      "Krypto Coin Watchlist Sentiment",
      "On-chain Daten pro Coin",
      "Crypto sentiment per asset",
      "Krypto Marktübersicht Coins"
    ]
  },
  en: {
    metaTitle: "How individual coins are really doing",
    metaDescription:
      "See the current sentiment for the most important cryptocurrencies — updated daily and explained in a simple, data-driven way.",
    short:
      "See the current sentiment for the most important cryptocurrencies — updated daily and explained in a simple, data-driven way.",
    sections: [
      {
        title: "Interpretation note",
        paragraphs: [
          "The displayed sentiment values are based on daily AI analysis of news, social media and on-chain data.",
          "All content is for sentiment analysis only and does not constitute financial advice."
        ]
      }
    ],
    ecosystemLinks: [
      { label: "Homepage", href: "/en" },
      { label: "Sentiment overview", href: "/en/sentiment" },
      { label: "News & Signals", href: "/en/news" },
      { label: "Data & Charts", href: "/en/data" },
      { label: "Learn", href: "/en/learn" }
    ],
    ctas: [
      { label: "See today’s market mood", href: "/en/sentiment" },
      { label: "Learn the basics of sentiment", href: "/en/learn" },
      { label: "Explore sentiment trends in charts", href: "/en/data" },
      { label: "View sentiment for individual cryptocurrencies", href: "/en/coins" }
    ],
    seoKeywords: [
      "Cryptocurrency sentiment overview",
      "Coin sentiment analysis",
      "Bitcoin Ethereum sentiment coins",
      "Crypto asset mood analysis",
      "Single coin bullish bearish",
      "Crypto coin watchlist sentiment",
      "On-chain data per coin",
      "Crypto sentiment per asset",
      "Crypto market overview coins"
    ]
  }
};

export const generateMetadata = ({ params }: { params: { locale: "de" | "en" } }): Metadata => {
  const canonical = `${BASE_URL}/${params.locale}/coins`;
  const localeCopy = copy[params.locale];
  return {
    title: localeCopy.metaTitle,
    description: localeCopy.metaDescription,
    alternates: { canonical }
  };
};

export default function CoinsPage({ params }: { params: { locale: "de" | "en" } }) {
  const locale = params.locale;
  const localeCopy = copy[locale];

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <section className="mx-auto max-w-5xl space-y-6 rounded-3xl border border-gray-200 bg-white/80 p-8 shadow-xl">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.5em] text-gray-400">
            {locale === "de" ? "Kryptowährungen" : "Cryptocurrencies"}
          </p>
          <h1 className="text-4xl font-semibold text-gray-900">{localeCopy.metaTitle}</h1>
          <p className="text-sm text-gray-600">{localeCopy.short}</p>
        </header>
        <div className="flex flex-wrap gap-3">
          {localeCopy.ecosystemLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 transition hover:border-black"
            >
              {link.label}
            </Link>
          ))}
        </div>
        {localeCopy.sections.map((section) => (
          <article
            key={section.title}
            className="space-y-3 rounded-2xl border border-gray-100 bg-gray-50/70 p-5 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
            {section.paragraphs.map((text) => (
              <p key={text} className="text-sm text-gray-700 leading-relaxed">
                {text}
              </p>
            ))}
          </article>
        ))}
        <div className="rounded-2xl border border-gray-100 bg-white/90 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">{locale === "de" ? "CTAs" : "CTAs"}</h3>
          <div className="mt-3 flex flex-wrap gap-3">
            {localeCopy.ctas.map((cta) => (
              <Link
                key={cta.label}
                href={cta.href}
                className="rounded-full bg-black px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-gray-800"
              >
                {cta.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.4em] text-gray-400">SEO Keywords</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {localeCopy.seoKeywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

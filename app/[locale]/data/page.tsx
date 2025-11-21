import Link from "next/link";
import type { Metadata } from "next";

const BASE_URL = process.env.APP_BASE_URL ?? "https://krypto-sentiment-site.vercel.app";

const copy = {
  de: {
    metaTitle: "Wenn Gefühl auf Zahlen trifft",
    metaDescription:
      "Stimmung ist nicht nur eine Momentaufnahme. Hier kannst du sehen, wie sich das Sentiment im Verlauf entwickelt hat – bullish, neutral oder bearish – und wie stark die täglichen Schwankungen ausfallen.",
    short:
      "Stimmung ist nicht nur eine Momentaufnahme. Hier kannst du sehen, wie sich das Sentiment im Verlauf entwickelt hat – bullish, neutral oder bearish – und wie stark die täglichen Schwankungen ausfallen.",
    sections: [
      {
        title: "Wie lese ich den Sentiment-Score?",
        paragraphs: [
          "Der Score liegt zwischen 0 und 1:",
          "• 0.00–0.33: eher bearish",
          "• 0.34–0.66: neutral",
          "• 0.67–1.00: eher bullish",
          "",
          "Vertrauen (%): Zeigt, wie stabil der Score wirkt.",
          "Hohe Werte = wenig Rauschen in den Daten.",
          "",
          "Wichtig: Der Score ist kein Preisziel. Er beschreibt nur die Stimmung."
        ]
      },
      {
        title: "Aktualisierung",
        paragraphs: [
          "Unsere Modelle laufen aktuell einmal täglich.",
          "Wir aggregieren Social Media, News und On-Chain-Daten.",
          "Die Methodik bleibt transparent – die Quellen können sich im Laufe der Zeit verändern."
        ]
      }
    ],
    navLinks: [
      { label: "Startseite", href: "/de" },
      { label: "Sentiment-Übersicht", href: "/de/sentiment" },
      { label: "News & Signale", href: "/de/news" },
      { label: "Kryptowährungen", href: "/de/coins" },
      { label: "Lernen", href: "/de/lernen" },
      { label: "Methodik", href: "/de/methodik" }
    ],
    ctas: [
      { label: "Heutige Marktstimmung ansehen", href: "/de/sentiment" },
      { label: "Sentiment-Trends in Charts entdecken", href: "/de/daten" },
      { label: "Sentiment für einzelne Coins prüfen", href: "/de/coins" },
      { label: "Grundlagen zum Sentiment lernen", href: "/de/lernen" }
    ],
    seoKeywords: [
      "Krypto Sentiment Charts",
      "Daten & Charts Krypto",
      "Crypto sentiment time series",
      "On-Chain Daten Visualisierung",
      "Bitcoin Sentiment Verlauf",
      "Kryptowährungen Daten Dashboard",
      "Crypto market mood charts",
      "Sentiment vs On-Chain Analyse",
      "Krypto Kennzahlen Visualisierung"
    ]
  },
  en: {
    metaTitle: "Where mood meets metrics",
    metaDescription:
      "Sentiment isn’t just a snapshot. Here you can track how the market mood has changed over time — bullish, neutral or bearish.",
    short:
      "Sentiment isn’t just a snapshot. Here you can track how the market mood has changed over time — bullish, neutral or bearish.",
    sections: [
      {
        title: "How to read the sentiment score",
        paragraphs: [
          "The score ranges from 0 to 1:",
          "• 0.00–0.33: bearish",
          "• 0.34–0.66: neutral",
          "• 0.67–1.00: bullish",
          "",
          "Confidence (%): Shows how stable the score appears.",
          "High values = less noise in the data.",
          "",
          "Important: The score is not a price prediction — it only describes the mood."
        ]
      },
      {
        title: "Update Frequency",
        paragraphs: [
          "Our models currently update once per day.",
          "We aggregate social media signals, news headlines and on-chain metrics.",
          "Data sources may evolve, but the methodology stays as transparent as possible."
        ]
      }
    ],
    navLinks: [
      { label: "Homepage", href: "/en" },
      { label: "Sentiment overview", href: "/en/sentiment" },
      { label: "News & Signals", href: "/en/news" },
      { label: "Cryptocurrencies", href: "/en/coins" },
      { label: "Learn", href: "/en/learn" },
      { label: "Methodology", href: "/en/methodology" }
    ],
    ctas: [
      { label: "See today’s market mood", href: "/en/sentiment" },
      { label: "Explore sentiment trends in charts", href: "/en/data" },
      { label: "View sentiment for individual cryptocurrencies", href: "/en/coins" },
      { label: "Learn the basics of sentiment", href: "/en/learn" }
    ],
    seoKeywords: [
      "Crypto sentiment charts",
      "Data & Charts crypto",
      "Crypto sentiment time series",
      "On-chain data visualization",
      "Bitcoin sentiment timeline",
      "Cryptocurrency data dashboard",
      "Crypto market mood charts",
      "Sentiment vs on-chain analysis",
      "Crypto metrics visualization"
    ]
  }
};

export const generateMetadata = ({ params }: { params: { locale: "de" | "en" } }): Metadata => {
  const canonical = `${BASE_URL}/${params.locale}/${params.locale === "de" ? "daten" : "data"}`;
  const localeCopy = copy[params.locale];
  return {
    title: localeCopy.metaTitle,
    description: localeCopy.metaDescription,
    alternates: { canonical }
  };
};

export default function DataPage({ params }: { params: { locale: "de" | "en" } }) {
  const locale = params.locale;
  const localeCopy = copy[locale];

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <section className="mx-auto max-w-5xl space-y-6 rounded-3xl border border-gray-200 bg-white/80 p-8 shadow-xl">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.5em] text-gray-400">
            {locale === "de" ? "Daten & Charts" : "Data & Charts"}
          </p>
          <h1 className="text-4xl font-semibold text-gray-900">{localeCopy.metaTitle}</h1>
          <p className="text-sm text-gray-600">{localeCopy.short}</p>
        </header>
        <nav className="flex flex-wrap gap-3 text-xs uppercase tracking-wide text-indigo-600">
          {localeCopy.navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="hover:text-indigo-900">
              {link.label}
            </Link>
          ))}
        </nav>
        {localeCopy.sections.map((section) => (
          <article
            key={section.title}
            className="space-y-3 rounded-2xl border border-gray-100 bg-gray-50/70 p-5 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-sm text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </article>
        ))}
        <div className="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm">
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

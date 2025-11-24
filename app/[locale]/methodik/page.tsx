import Link from "next/link";
import type { Metadata } from "next";

const BASE_URL = process.env.APP_BASE_URL ?? "https://krypto-sentiment-site.com";

const copy = {
  de: {
    metaTitle: "Wie unsere KI Sentiment erkennt",
    metaDescription:
      "Wir analysieren täglich Nachrichten, Social Media und On-Chain-Daten und berechnen daraus einen transparenten Sentiment-Score.",
    short:
      "Wir zeigen offen, welche Daten in den Score fließen, wie wir sie gewichten und warum wir keine Preisprognosen abgeben.",
    sections: [
      {
        title: "Wie der Score entsteht",
        paragraphs: [
          "Wir werten täglich News, Social Media und On-Chain-Daten aus und berechnen daraus einen Score von 0 (bearish) bis 1 (bullish).",
          "Der Prozess ist transparent: Datenquellen, Gewichtungen und Regeln werden offen beschrieben."
        ]
      },
      {
        title: "Grenzen und Risiken",
        paragraphs: [
          "Unsere Modelle erkennen Muster, nicht die Zukunft.",
          "Daten können Verzerrungen enthalten und sich schnell ändern – der Score ist eine Momentaufnahme, keine Finanzberatung."
        ]
      }
    ],
    ecosystemLinks: [
      { label: "Startseite", href: "/de" },
      { label: "Sentiment-Übersicht", href: "/de/sentiment" },
      { label: "News & Signale", href: "/de/news" },
      { label: "Kryptowährungen", href: "/de/coins" },
      { label: "Daten & Charts", href: "/de/daten" },
      { label: "Lernen", href: "/de/lernen" }
    ],
    ctas: [
      { label: "Zur Sentiment-Übersicht wechseln", href: "/de/sentiment" },
      { label: "Beispiele in Daten & Charts ansehen", href: "/de/daten" },
      { label: "Im Lernbereich mehr zu KI & Daten lesen", href: "/de/lernen" }
    ],
    SEO: [
      "Krypto Sentiment Methodik",
      "Wie funktioniert Sentiment Analyse",
      "KI Modell Erklärung Krypto",
      "Datenquellen Crypto Sentiment",
      "On-Chain und Social Media Analyse",
      "Crypto sentiment methodology",
      "Transparent AI crypto analytics",
      "Limitations of sentiment analysis",
      "Krypto Datenqualität",
      "Market mood scoring"
    ]
  },
  en: {
    metaTitle: "How our AI detects sentiment",
    metaDescription:
      "We analyze news, social and on-chain data daily to calculate a transparent sentiment score.",
    short:
      "We disclose which data flows into the score, how we weight it and why we don’t make price predictions.",
    sections: [
      {
        title: "How the score is built",
        paragraphs: [
          "We analyse news, social media and on-chain data daily and derive a score from 0 (bearish) to 1 (bullish).",
          "The process stays transparent: sources, weighting and rules are documented."
        ]
      },
      {
        title: "Limitations and risks",
        paragraphs: [
          "Our models detect patterns, not the future.",
          "Data may be biased or change quickly – the score is a snapshot, not financial advice."
        ]
      }
    ],
    ecosystemLinks: [
      { label: "Homepage", href: "/en" },
      { label: "Sentiment overview", href: "/en/sentiment" },
      { label: "News & Signals", href: "/en/news" },
      { label: "Cryptocurrencies", href: "/en/coins" },
      { label: "Data & Charts", href: "/en/data" },
      { label: "Learn", href: "/en/learn" }
    ],
    ctas: [
      { label: "Go to the sentiment overview", href: "/en/sentiment" },
      { label: "See examples in Data & Charts", href: "/en/data" },
      { label: "Learn more about AI & data in the Learn section", href: "/en/learn" }
    ],
    SEO: [
      "Krypto Sentiment Methodology",
      "How sentiment analysis works",
      "AI model explanation crypto",
      "Data sources crypto sentiment",
      "On-chain and social media analysis",
      "Crypto sentiment methodology",
      "Transparent AI crypto analytics",
      "Limitations of sentiment analysis",
      "Crypto data quality",
      "Market mood scoring"
    ]
  }
};

export const generateMetadata = ({ params }: { params: { locale: "de" | "en" } }): Metadata => {
  const canonical = `${BASE_URL}/${params.locale}/${params.locale === "de" ? "methodik" : "methodology"}`;
  return {
    title: copy[params.locale].metaTitle,
    description: copy[params.locale].metaDescription,
    alternates: { canonical }
  };
};

export default function MethodikPage({ params }: { params: { locale: "de" | "en" } }) {
  const locale = params.locale;
  const localeCopy = copy[locale];

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <section className="mx-auto max-w-5xl space-y-6 rounded-3xl border border-gray-200 bg-white/80 p-8 shadow-sm">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.5em] text-gray-400">
            {locale === "de" ? "Methodik" : "Methodology"}
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
            className="space-y-3 rounded-2xl border border-gray-100 bg-gray-50/80 p-5 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-sm text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </article>
        ))}
        <div className="space-y-3 rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900">{locale === "de" ? "CTAs" : "CTAs"}</h3>
          <div className="flex flex-wrap gap-3">
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
        <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.4em] text-gray-400">SEO Keywords</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {copy[locale].SEO.map((keyword) => (
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

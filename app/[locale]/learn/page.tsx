import Link from "next/link";
import type { Metadata } from "next";

const BASE_URL = process.env.APP_BASE_URL ?? "https://krypto-sentiment-site.vercel.app";

const copy = {
  de: {
    metaTitle: "Verstehen statt raten",
    metaDescription:
      "Hier lernst du die Grundlagen von Sentiment, KI-Auswertung, Datenqualität und Risiken. Einsteiger bekommen einen einfachen Einstieg, Fortgeschrittene vertiefen ihr Know-how.",
    short:
      "Hier lernst du die Grundlagen von Sentiment, KI-Auswertung, Datenqualität und Risiken. Einsteiger bekommen einen einfachen Einstieg, Fortgeschrittene vertiefen ihr Know-how.",
    sections: [
      {
        title: "Grundbegriffe",
        paragraphs: [
          "Sentiment: Die allgemeine Stimmung zum Markt oder zu einem bestimmten Coin.",
          "Score: Eine Zahl zwischen 0 und 1, die zeigt, wie bullish oder bearish die Stimmung wirkt.",
          "Vertrauen: Wie sicher die KI ist, dass der Score stabil ist.",
          "Signal: Ein Ereignis oder eine Meldung, die die Stimmung messbar beeinflusst.",
          "On-Chain-Daten: Messwerte direkt aus der Blockchain (Transaktionen, aktive Adressen, Zu-/Abflüsse)."
        ]
      }
    ],
    ecosystemLinks: [
      { label: "Startseite", href: "/de" },
      { label: "Sentiment-Übersicht", href: "/de/sentiment" },
      { label: "News & Signale", href: "/de/news" },
      { label: "Kryptowährungen", href: "/de/coins" },
      { label: "Daten & Charts", href: "/de/daten" },
      { label: "Methodik", href: "/de/methodik" }
    ],
    ctas: [
      { label: "Heutige Marktstimmung ansehen", href: "/de/sentiment" },
      { label: "News & Signale durchsuchen", href: "/de/news" },
      { label: "Sentiment-Trends in Charts entdecken", href: "/de/daten" }
    ],
    seoKeywords: [
      "Krypto Sentiment Lernen",
      "Sentiment Grundlagen",
      "KI Auswertung Krypto",
      "Datenqualität Risiko Krypto",
      "On-Chain Glossar"
    ]
  },
  en: {
    metaTitle: "Understanding before guessing",
    metaDescription:
      "This section teaches you the basics of sentiment, AI models, data quality and risks. Beginners get a smooth introduction, advanced users gain more depth.",
    short:
      "This section teaches you the basics of sentiment, AI models, data quality and risks. Beginners get a smooth introduction, advanced users gain more depth.",
    sections: [
      {
        title: "Key terms",
        paragraphs: [
          "Sentiment: Overall mood around the market or a specific coin.",
          "Score: Number between 0 and 1 showing how bullish or bearish the mood looks.",
          "Confidence: How stable the model considers this score.",
          "Signal: An event or headline that significantly influences sentiment.",
          "On-chain data: Metrics directly from the blockchain (transactions, active addresses, flows)."
        ]
      }
    ],
    ecosystemLinks: [
      { label: "Homepage", href: "/en" },
      { label: "Sentiment overview", href: "/en/sentiment" },
      { label: "News & Signals", href: "/en/news" },
      { label: "Cryptocurrencies", href: "/en/coins" },
      { label: "Data & Charts", href: "/en/data" },
      { label: "Methodology", href: "/en/methodology" }
    ],
    ctas: [
      { label: "See today’s market mood", href: "/en/sentiment" },
      { label: "Check today’s News & Signals", href: "/en/news" },
      { label: "Explore sentiment trends in charts", href: "/en/data" }
    ],
    seoKeywords: [
      "Crypto sentiment learning",
      "Sentiment basics",
      "AI models crypto",
      "Data quality risks crypto",
      "On-chain glossary"
    ]
  }
};

export const generateMetadata = ({ params }: { params: { locale: "de" | "en" } }): Metadata => {
  const canonical = `${BASE_URL}/${params.locale}/${params.locale === "de" ? "lernen" : "learn"}`;
  const localeCopy = copy[params.locale];
  return {
    title: localeCopy.metaTitle,
    description: localeCopy.metaDescription,
    alternates: { canonical }
  };
};

export default function LearnPage({ params }: { params: { locale: "de" | "en" } }) {
  const locale = params.locale;
  const localeCopy = copy[locale];

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <section className="mx-auto max-w-5xl space-y-6 rounded-3xl border border-gray-200 bg-white/80 p-8 shadow-xl">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.5em] text-gray-400">{locale === "de" ? "Lernen" : "Learn"}</p>
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
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-sm text-gray-700 leading-relaxed">
                {paragraph}
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

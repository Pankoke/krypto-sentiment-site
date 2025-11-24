import Link from "next/link";
import type { Metadata } from "next";

const BASE_URL = process.env.APP_BASE_URL ?? "https://krypto-sentiment-site.vercel.app";

const copy = {
  de: {
    metaTitle: "Mehr über Krypto & Sentiment lernen",
    metaDescription:
      "Hier findest du kurze Erklärungen zu den wichtigsten Begriffen und Ideen hinter unserer Plattform.",
    short:
      "Kurz, klar, ohne Marketing: die wichtigsten Konzepte rund um Stimmung, Datenquellen und Score.",
    sections: [
      {
        title: "Was ist Sentiment?",
        paragraphs: [
          "Sentiment beschreibt, wie positiv oder negativ Marktteilnehmer über ein Thema sprechen. Wir machen diese Stimmung für einzelne Coins messbar."
        ]
      },
      {
        title: "Warum News & Social Media?",
        paragraphs: [
          "Starke Kursbewegungen werden oft von Narrativen begleitet – Schlagzeilen, Threads und Diskussionen. Diese Signale sammeln und strukturieren wir."
        ]
      },
      {
        title: "Rolle von On-Chain-Daten",
        paragraphs: [
          "On-Chain-Kennzahlen wie Aktivität oder Flows zeigen, ob die Stimmung nur Gerede ist oder sich auch on-chain widerspiegelt."
        ]
      },
      {
        title: "Was du damit machen kannst",
        paragraphs: [
          "Nutze Sentiment, um Trends früher zu erkennen, Übertreibungen zu sehen oder die Marktstimmung im Blick zu behalten – aber nie als alleinige Entscheidungsgrundlage."
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
    metaTitle: "Learn more about crypto & sentiment",
    metaDescription:
      "This page gives you short explanations of the key concepts and ideas behind our platform.",
    short:
      "Concise explanations of sentiment, data sources and how the score works – no fluff.",
    sections: [
      {
        title: "What is sentiment?",
        paragraphs: [
          "Sentiment describes how positive or negative market participants talk about a topic. We turn that into a measurable signal for individual coins."
        ]
      },
      {
        title: "Why news & social data?",
        paragraphs: [
          "Strong price moves often come with narratives – headlines, threads and discussions. We collect and structure these signals."
        ]
      },
      {
        title: "On-chain signals",
        paragraphs: [
          "On-chain metrics like activity or flows help us see whether sentiment is just talk – or also visible on-chain."
        ]
      },
      {
        title: "How to use this",
        paragraphs: [
          "Use sentiment to spot trends earlier, see extremes in market mood and stay aware of the bigger picture – but never rely on it as your only signal."
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
    <main className="min-h-screen bg-gray-50 py-14">
      <section className="mx-auto max-w-5xl space-y-6 rounded-3xl border border-gray-200 bg-white/80 p-8 shadow-xl">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.5em] text-gray-400">{locale === "de" ? "Lernen" : "Learn"}</p>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">{localeCopy.metaTitle}</h1>
          <p className="text-base leading-relaxed text-gray-600">{localeCopy.short}</p>
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
            <h2 className="text-xl font-semibold tracking-tight text-gray-900">{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-base leading-relaxed text-gray-700">
                {paragraph}
              </p>
            ))}
          </article>
        ))}
        <div className="rounded-2xl border border-gray-100 bg-white/90 p-6 shadow-sm">
          <h3 className="text-lg font-semibold tracking-tight text-gray-900">{locale === "de" ? "CTAs" : "CTAs"}</h3>
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

import Link from "next/link";
import type { Metadata } from "next";

const BASE_URL = process.env.APP_BASE_URL ?? "https://krypto-sentiment-site.vercel.app";

const copy = {
  de: {
    metaTitle: "Über uns",
    metaDescription:
      "Wir möchten Sentiment-Analysen verständlich machen – ohne Hype, ohne Versprechen, ohne Finanzberatung.",
    short:
      "Wir möchten Sentiment-Analysen verständlich machen – ohne Hype, ohne Versprechen, ohne Finanzberatung. Unsere Seite bietet einen unabhängigen, datenbasierten Blick auf die Stimmung im Kryptomarkt.",
    sections: [
      {
        title: "Warum wir das tun",
        paragraphs: [
          "Wir möchten Sentiment-Analysen verständlich machen – ohne Hype, ohne Versprechen, ohne Finanzberatung.",
          "Unsere Seite bietet einen unabhängigen, datenbasierten Blick auf die Stimmung im Kryptomarkt."
        ]
      },
      {
        title: "Wofür die Bereiche stehen",
        paragraphs: [
          "Die Startseite zeigt die Gesamtstimmung.",
          "News & Signale erklären, welche Ereignisse die Stimmung bewegen.",
          "Daten & Charts visualisieren Trends.",
          "In der Methodik erfährst du, wie alles im Hintergrund funktioniert."
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
    nextSteps: {
      title: "Nächste Schritte",
      links: [
        { label: "Aktuelle News & Signale ansehen", href: "/de/news" },
        { label: "Sentiment-Trends in Charts erkunden", href: "/de/daten" },
        { label: "Grundlagen im Lernbereich durchgehen", href: "/de/lernen" },
        { label: "Sentiment für einzelne Coins prüfen", href: "/de/coins" }
      ]
    }
  },
  en: {
    metaTitle: "About us",
    metaDescription:
      "We want to make sentiment analysis transparent and easy to understand — without hype, promises or financial advice.",
    short:
      "We want to make sentiment analysis transparent and easy to understand — without hype, promises or financial advice. Our goal is to provide an independent, data-driven view of crypto market mood.",
    sections: [
      {
        title: "Why we built this",
        paragraphs: [
          "We want to make sentiment analysis transparent and easy to understand — without hype, promises or financial advice.",
          "Our goal is to provide an independent, data-driven view of crypto market mood."
        ]
      },
      {
        title: "How the sections fit together",
        paragraphs: [
          "The homepage shows the overall market mood.",
          "News & Signals highlights the events that move sentiment.",
          "Data & Charts visualizes trends.",
          "The methodology section explains how everything works behind the scenes."
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
    nextSteps: {
      title: "Next steps",
      links: [
        { label: "Check today’s News & Signals", href: "/en/news" },
        { label: "Explore sentiment trends in charts", href: "/en/data" },
        { label: "Learn more in the education section", href: "/en/learn" },
        { label: "View sentiment for individual coins", href: "/en/coins" }
      ]
    }
  }
};

export const generateMetadata = ({ params }: { params: { locale: "de" | "en" } }): Metadata => {
  const canonical = `${BASE_URL}/${params.locale}/${params.locale === "de" ? "ueber-uns" : "about"}`;
  const localeCopy = copy[params.locale];
  return {
    title: localeCopy.metaTitle,
    description: localeCopy.metaDescription,
    alternates: { canonical }
  };
};

export default function AboutPage({ params }: { params: { locale: "de" | "en" } }) {
  const locale = params.locale;
  const localeCopy = copy[locale];

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <section className="mx-auto max-w-5xl space-y-6 rounded-3xl border border-gray-200 bg-white/80 p-8 shadow-xl">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.5em] text-gray-400">{locale === "de" ? "Über uns" : "About"}</p>
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
          <h3 className="text-lg font-semibold text-gray-900">{localeCopy.nextSteps.title}</h3>
          <div className="mt-3 flex flex-wrap gap-3">
            {localeCopy.nextSteps.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-full bg-black px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-gray-800"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

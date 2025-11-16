import Link from 'next/link';
import type { Metadata } from 'next';

const BASE_URL = process.env.APP_BASE_URL ?? 'https://krypto-sentiment-site.vercel.app';

const copy = {
  de: {
    metaTitle: 'Lernen – Wissen zu Krypto, Sentiment, Daten & KI',
    metaDescription:
      'Lerne Schritt für Schritt, wie Krypto-Sentiment, Daten, KI-Modelle und Risiken zusammenhängen – mit verständlichen Artikeln statt Hype.',
    short:
      'Der Lernbereich ist dein sicherer Spielplatz rund um Sentiment, KI und Krypto-Risiken. Statt Buzzwords bekommst du verständliche Erklärungen, Beispiele und Guides – vom ersten Einstieg bis zu tieferen Analysen.',
    sections: [
      {
        title: 'Was dich im Lernbereich erwartet',
        paragraphs: [
          'Grundlagenartikel zu Krypto-Sentiment, Methodik, Daten & Charts, Risikomanagement und KI.',
          'Die Texte kannst du unabhängig lesen, doch zusammen formen sie ein rotes Band durch das Projekt.'
        ]
      },
      {
        title: 'Für wen ist der Lernbereich gedacht?',
        paragraphs: [
          'Einsteiger:innen ohne Profi-Jargon.',
          'Fortgeschrittene, die Sentiment professionell nutzen möchten.',
          'Skeptiker, die verstehen wollen, was KI kann und wo sie scheitert.',
          'Daten- und Tech-Fans, die tiefer in Methodik und Modelle eintauchen wollen.'
        ]
      },
      {
        title: 'Lernpfade statt Content-Chaos',
        paragraphs: [
          'Basics: Was ist Sentiment, warum ist Krypto volatil, wie liest man die Startseite?',
          'Data & Tools: Methodik, Kennzahlen in Daten & Charts, News & Signals ohne FOMO.',
          'Deep Dives: typische Fehler, KI-Grenzen, Narrative.',
          'Responsible Use: keine Finanzberatung, psychologische Fallen, eigene Entscheidungsprozesse.'
        ]
      },
      {
        title: 'Verbindung zum Rest der Seite',
        paragraphs: [
          'Homepage gibt das Bauchgefühl, Sentiment strukturiert Scores.',
          'News & Signale fügt Narrative hinzu, Kryptowährungen zoomt auf einzelne Assets.',
          'Methodik und Data & Charts erklären, wie Kennzahlen entstehen.'
        ]
      },
      {
        title: 'Lernen ohne Druck',
        paragraphs: [
          'Keine Clickbait-„Tricks“, sondern ehrliche, praxisnahe Inhalte.',
          'Der Bereich zeigt Werkzeuge, keine Kaufempfehlungen.',
          'Du sollst verstehen, wann „nichts tun“ die richtige Entscheidung ist.'
        ]
      },
      {
        title: 'Dein persönlicher Fortschritt',
        paragraphs: [
          'Schlage Begriffe nach, wenn etwas auf der Seite unklar ist.',
          'Nutze Lernpfade für tieferes Verständnis.',
          'Kehre zurück, wenn du Dir Grundlagen wieder ins Gedächtnis rufen willst.'
        ]
      }
    ],
    navLinks: [
      { label: 'Startseite', href: '/de' },
      { label: 'Sentiment-Übersicht', href: '/de/sentiment' },
      { label: 'News & Signale', href: '/de/news' },
      { label: 'Kryptowährungen', href: '/de/coins' },
      { label: 'Daten & Charts', href: '/de/daten' },
      { label: 'Methodik', href: '/de/methodik' }
    ],
    ctas: [
      { label: 'Mit den Grundlagen starten', href: '/de/learn' },
      { label: 'Mehr über unsere Methodik lesen', href: '/de/methodik' },
      { label: 'Artikel zu Daten & Charts öffnen', href: '/de/daten' },
      { label: 'Verbindung zu News & Signale verstehen', href: '/de/news' }
    ],
    seoKeywords: [
      'Krypto Sentiment lernen',
      'Krypto Grundlagen Sentiment',
      'Lernen über KI und Krypto',
      'Crypto sentiment education',
      'Krypto Risikomanagement Wissen',
      'Sentiment Analyse Tutorial',
      'Daten & Charts verstehen',
      'Crypto learning hub'
    ]
  },
  en: {
    metaTitle: 'Learn – Knowledge on crypto, sentiment, data & AI',
    metaDescription:
      'Learn step by step how crypto sentiment, data, AI models and risks relate – with clear explanations instead of hype.',
    short:
      'The Learn section is your safe playground for sentiment, AI and crypto risk. You get clear explanations, examples and guides – from first steps to deeper dives.',
    sections: [
      {
        title: 'What you’ll find in Learn',
        paragraphs: [
          'Intro pieces on crypto sentiment, methodology, data & charts, risk, and AI.',
          'Articles work independently yet create a coherent learning path through the project.'
        ]
      },
      {
        title: 'Who this section is for',
        paragraphs: [
          'Beginners who dislike jargon.',
          'Advanced users who want to use sentiment systematically.',
          'Skeptics curious about AI limitations.',
          'Data and tech fans exploring models and methodology.'
        ]
      },
      {
        title: 'From random reading to learning paths',
        paragraphs: [
          'Basics: What is sentiment, why is crypto volatile, how to read the homepage?',
          'Data & Tools: Methodology, Data & Charts metrics, News & Signals without FOMO.',
          'Deep dives: Mistakes in sentiment analysis, AI limits, narrative cycles.',
          'Responsible use: why nothing here is financial advice, how to add sentiment to decisions.'
        ]
      },
      {
        title: 'Connection to the rest of the platform',
        paragraphs: [
          'Homepage shows the gut feel, Sentiment structures the scores.',
          'News & Signals adds narrative context, Cryptocurrencies zooms in on assets.',
          'Methodology explains the metrics, Learn teaches you to question data.'
        ]
      },
      {
        title: 'Learning without pressure',
        paragraphs: [
          'No clickbait “secret tricks”, just honest practical content.',
          'The section equips you to make better choices, including doing nothing.',
          'It’s about understanding, not pushing specific assets.'
        ]
      },
      {
        title: 'Your ongoing learning loop',
        paragraphs: [
          'Look up terms when something is unclear.',
          'Binge a learning path when you have time.',
          'Return later to refresh foundations.'
        ]
      }
    ],
    navLinks: [
      { label: 'Homepage', href: '/en' },
      { label: 'Sentiment overview', href: '/en/sentiment' },
      { label: 'News & Signals', href: '/en/news' },
      { label: 'Cryptocurrencies', href: '/en/coins' },
      { label: 'Data & Charts', href: '/en/data' },
      { label: 'Methodology', href: '/en/methodology' }
    ],
    ctas: [
      { label: 'Start with the basics', href: '/en/learn' },
      { label: 'Read more about our methodology', href: '/en/methodology' },
      { label: 'Open articles on Data & Charts', href: '/en/data' },
      { label: 'Understand the link to News & Signals', href: '/en/news' }
    ],
    seoKeywords: [
      'Krypto Sentiment lernen',
      'Krypto Grundlagen Sentiment',
      'Lernen über KI und Krypto',
      'Crypto sentiment education',
      'Krypto Risikomanagement Wissen',
      'Sentiment Analyse Tutorial',
      'Daten & Charts verstehen',
      'Crypto learning hub'
    ]
  }
};

export const generateMetadata = ({ params }: { params: { locale: 'de' | 'en' } }): Metadata => {
  const canonical = `${BASE_URL}/${params.locale}/${params.locale === 'de' ? 'lernen' : 'learn'}`;
  const localeCopy = copy[params.locale];
  return {
    title: localeCopy.metaTitle,
    description: localeCopy.metaDescription,
    alternates: { canonical }
  };
};

export default function LearnPage({ params }: { params: { locale: 'de' | 'en' } }) {
  const locale = params.locale;
  const localeCopy = copy[locale];
  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <section className="mx-auto max-w-5xl space-y-6 rounded-3xl border border-gray-200 bg-white/80 p-8 shadow-xl">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.5em] text-gray-400">
            {locale === 'de' ? 'Lernen' : 'Learn'}
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
          <h3 className="text-lg font-semibold text-gray-900">{locale === 'de' ? 'CTAs' : 'CTAs'}</h3>
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

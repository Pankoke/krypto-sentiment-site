import Link from 'next/link';
import type { Metadata } from 'next';

const BASE_URL = process.env.APP_BASE_URL ?? 'https://krypto-sentiment-site.vercel.app';

const copy = {
  de: {
    metaTitle: 'Über uns – Die Idee hinter Krypto Sentiment',
    metaDescription:
      'Erfahre, wer hinter Krypto Sentiment steht, warum wir Marktstimmung analysieren und warum unsere Inhalte keine Finanzberatung sind.',
    short:
      'Krypto Sentiment ist kein Trading-Geheimclub, sondern ein Projekt aus Datennerds, Krypto-Fans und Skeptiker:innen. Wir bauen Tools, die Marktstimmung sichtbar machen – transparent, ehrlich und ohne Finanzberatungs-Anspruch.',
    sections: [
      {
        title: 'Unsere Motivation',
        paragraphs: [
          'Wir mögen Krypto – aber auch Ehrlichkeit. Zwischen „Alles auf 0“ und „Diesmal ist es anders“ fehlt oft nüchterne Einordnung.',
          'Krypto Sentiment ist der Gegenpol: Datengetrieben, erklärend und selbstkritisch.'
        ]
      },
      {
        title: 'Was wir bauen',
        paragraphs: [
          'Homepage, Sentiment, News & Signale, Kryptowährungen und Daten & Charts arbeiten zusammen.',
          'Methodik und Lernen erklären, wie alles zusammenspielt.',
          'Wir verstehen uns nicht als Signalgeber, sondern als Informations-/Lernplattform.'
        ]
      },
      {
        title: 'Was wir nicht machen',
        paragraphs: [
          'Keine Kauf- oder Verkaufsempfehlungen, keine Renditeversprechen.',
          'Keine VIP-Gruppen mit „noch geheimeren“ Infos.',
          'Wenn du nach „Was soll ich morgen kaufen?“ suchst, bist du hier falsch.'
        ]
      },
      {
        title: 'Unser Umgang mit KI',
        paragraphs: [
          'KI analysiert Texte, bewertet Stimmung und hilft bei Beschreibungen.',
          'Methodik zeigt, wie Modelle arbeiten und wo sie Fehler machen können.',
          'Learn erklärt, was KI leisten kann und warum „alles automatisieren“ unrealistisch ist.'
        ]
      },
      {
        title: 'Transparenz & Verantwortung',
        paragraphs: [
          'Transparenz: Wir nennen die KI, erklären Scores und räumen Datenlücken ein.',
          'Verantwortung: Inhalte sind keine Finanzberatung, wir erinnern an Risiken und eigenen Research.'
        ]
      },
      {
        title: 'Weiterentwicklung',
        paragraphs: [
          'Wir verstehen die Plattform als laufendes Projekt.',
          'Community-Feedback über Kontakt fließt in neue Features.',
          'Ideen und Kritik werden aktiv aufgenommen.'
        ]
      },
      {
        title: 'Wer diese Seite nutzen soll',
        paragraphs: [
          'Neugierige, die nicht jede Nacht in Telegram-Chats verbringen wollen.',
          'Trader:innen, die Sentiment als zusätzlichen Layer einsetzen.',
          'Langfristige Investor:innen, die ohne FOMO-Stress informieren wollen.',
          'Skeptiker:innen, die beobachten und verstehen wollen.'
        ]
      },
      {
        title: 'Wie es weitergeht',
        paragraphs: [
          'Mehr Datenquellen, bessere Modelle, verfeinerte Visualisierungen.',
          'Neue Lerninhalte und potenzielle Kooperationen.',
          'Feedback aus Kontakt hilft bei der Weiterentwicklung.'
        ]
      }
    ],
    navLinks: [
      { label: 'Startseite', href: '/de' },
      { label: 'Methodik', href: '/de/methodik' },
      { label: 'Lernen', href: '/de/lernen' },
      { label: 'Daten & Charts', href: '/de/daten' },
      { label: 'News & Signale', href: '/de/news' },
      { label: 'Kryptowährungen', href: '/de/coins' },
      { label: 'Kontakt', href: '/de/kontakt' }
    ],
    ctas: [
      { label: 'Mehr über unsere Methodik lesen', href: '/de/methodik' },
      { label: 'Aktuelle Marktstimmung ansehen', href: '/de/news' },
      { label: 'Lernbereich öffnen', href: '/de/lernen' },
      { label: 'Kontakt für Feedback & Kooperationen nutzen', href: '/de/kontakt' }
    ],
    seoKeywords: [
      'Über uns Krypto Sentiment',
      'Crypto sentiment project story',
      'Transparente Krypto Analyse',
      'Wer steckt hinter Krypto Sentiment',
      'About crypto sentiment platform',
      'KI basierte Krypto Stimmungsanalyse',
      'Non financial advice disclaimer'
    ]
  },
  en: {
    metaTitle: 'About – the idea behind Krypto Sentiment',
    metaDescription:
      'Learn who builds Krypto Sentiment, why we analyze market mood and why our content is not financial advice.',
    short:
      'Krypto Sentiment isn’t a secret trading cabal, but a project by data nerds, crypto fans and healthy skeptics. We build tools that make market mood visible – transparent, honest and without pretending to give financial advice.',
    sections: [
      {
        title: 'Why we created this',
        paragraphs: [
          'We like crypto – and honesty. Extreme narratives need sober counterpoints.',
          'Krypto Sentiment is data-driven, explanatory and self-critical.'
        ]
      },
      {
        title: 'What we’re building',
        paragraphs: [
          'Homepage pulses, Sentiment structures scores, News collects events.',
          'Cryptocurrencies and Data & Charts dive deeper, Methodology and Learn explain the logic.',
          'This is an information and education project, not a signal service.'
        ]
      },
      {
        title: 'What we explicitly don’t do',
        paragraphs: [
          'No buy/sell calls, no return promises, no secret tips.',
          'No VIP group claiming to know “even more”.',
          'If you want to be told what to buy tomorrow, you’re in the wrong place.'
        ]
      },
      {
        title: 'How we use AI',
        paragraphs: [
          'AI helps with text analysis, sentiment, and some copy.',
          'Methodology explains the models, data and failure modes.',
          'Learn adds context on what AI realistically can and can’t do.'
        ]
      },
      {
        title: 'Transparency & responsibility',
        paragraphs: [
          'We state that we use AI, explain how scores arise and admit data gaps.',
          'We label everything as not financial advice and remind you of crypto risks.'
        ]
      },
      {
        title: 'Continuous improvement',
        paragraphs: [
          'The platform is a living project.',
          'Feedback via Contact shapes charts, features and explanations.',
          'We welcome ideas, wishes and criticism.'
        ]
      },
      {
        title: 'Who this is for',
        paragraphs: [
          'People who like crypto but don’t live in chatrooms.',
          'Traders using sentiment as an extra lens.',
          'Long-term investors who want the mood without the FOMO.',
          'Skeptics observing irrational moves.'
        ]
      },
      {
        title: 'Where we want to go',
        paragraphs: [
          'More data sources, refined models, improved Data & Charts.',
          'New learning content shaped by the community.',
          'Potential collaborations with tools, projects, educators.'
        ]
      }
    ],
    navLinks: [
      { label: 'Homepage', href: '/en' },
      { label: 'Methodology', href: '/en/methodology' },
      { label: 'Learn', href: '/en/learn' },
      { label: 'Data & Charts', href: '/en/data' },
      { label: 'News & Signals', href: '/en/news' },
      { label: 'Cryptocurrencies', href: '/en/coins' },
      { label: 'Contact', href: '/en/contact' }
    ],
    ctas: [
      { label: 'Read our methodology', href: '/en/methodology' },
      { label: 'Check the current market sentiment', href: '/en/news' },
      { label: 'Open the Learn section', href: '/en/learn' },
      { label: 'Use Contact for feedback & collaborations', href: '/en/contact' }
    ],
    seoKeywords: [
      'Über uns Krypto Sentiment',
      'Crypto sentiment project story',
      'Transparente Krypto Analyse',
      'Wer steckt hinter Krypto Sentiment',
      'About crypto sentiment platform',
      'KI basierte Krypto Stimmungsanalyse',
      'Non financial advice disclaimer'
    ]
  }
};

export const generateMetadata = ({ params }: { params: { locale: 'de' | 'en' } }): Metadata => {
  const canonical = `${BASE_URL}/${params.locale}/${params.locale === 'de' ? 'about' : 'about'}`;
  const localeCopy = copy[params.locale];
  return {
    title: localeCopy.metaTitle,
    description: localeCopy.metaDescription,
    alternates: { canonical }
  };
};

export default function AboutPage({ params }: { params: { locale: 'de' | 'en' } }) {
  const locale = params.locale;
  const localeCopy = copy[locale];

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <section className="mx-auto max-w-5xl space-y-6 rounded-3xl border border-gray-200 bg-white/80 p-8 shadow-xl">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.5em] text-gray-400">
            {locale === 'de' ? 'Über uns' : 'About'}
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

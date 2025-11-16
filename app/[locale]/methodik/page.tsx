import Link from 'next/link';
import type { Metadata } from 'next';

const BASE_URL = process.env.APP_BASE_URL ?? 'https://krypto-sentiment-site.com';

const copy = {
  de: {
    metaTitle: 'Krypto Sentiment Methodik – So entstehen unsere Stimmungs-Scores',
    metaDescription:
      'Erfahre transparent, welche Datenquellen, KI-Modelle und Gewichtungen hinter den Krypto-Sentiment-Scores stehen – inklusive Grenzen und Risiken.',
    short:
      'Hier legen wir offen, wie die Sentiment-Scores entstehen: Welche Daten wir nutzen, wie die KI Texte bewertet und wo die Grenzen liegen. Transparenz statt Magie, damit du unsere Zahlen einordnen kannst.',
    sections: [
      {
        title: '1. Datenquellen: Woraus unser Bild entsteht',
        paragraphs: [
          'News & Artikel liefern offizielle Meldungen, Blogposts und Analysen, also die Narrative, die den Markt bewegen.',
          'Social Media & Community-Kanäle zeigen ungefilterte Stimmung – von FOMO bis „alles Betrug“.',
          'On-Chain-Daten (Transaktionsvolumen, aktive Adressen, Börsenflüsse) zeigen, ob Emotionen auch Taten folgen.'
        ]
      },
      {
        title: '2. Vorverarbeitung: Aus rohem Rauschen wird strukturierter Input',
        paragraphs: [
          'Spracherkennung & Übersetzung vereinheitlichen unterschiedliche Formate.',
          'Spam-Filter, Duplikate und irrelevante Erwähnungen werden aussortiert.',
          'Relevanz-Filter sorgen dafür, dass wirklich marktrelevante Signale übrigbleiben.'
        ]
      },
      {
        title: '3. Sentiment-Modelle: Wie KI Stimmung bewertet',
        paragraphs: [
          'Spezialisierte Modelle kategorisieren Texte als positiv, neutral oder negativ und schätzen zusätzlich die Stärke ein.',
          'Wortwahl, Tonfall und Kontextsignale wie „Hack“, „ETF“, „Verbot“ oder „All-Time-High“ werden kombiniert.',
          'Metadaten (Quelle, Zeitpunkt, Reichweite) fließen mit ein, bevor ein aggregierter Score entsteht.'
        ]
      },
      {
        title: '4. Gewichtung & Aggregation: Nicht jede Stimme zählt gleich',
        paragraphs: [
          'Große Börsen- oder Regulierungsnachrichten erhalten mehr Gewicht, Meme-Accounts weniger.',
          'On-Chain-Daten verstärken oft ein bereits bullishes oder bearishes Narrativ.',
          'Ziel ist ein stabiles Bild, das laute, aber unwichtige Stimmen dämpft.'
        ]
      },
      {
        title: '5. Grenzen & Risiken unserer Methode',
        paragraphs: [
          'Daten bleiben unvollständig; wir sehen nie den gesamten Markt.',
          'Modelle können Ironie, Insider-Jokes oder politische Nuancen falsch interpretieren.',
          'Sentiment ist kein Preisindikator – es liefert eine zusätzliche Perspektive, keine Vorhersage.',
          'Hindsight Bias: Nach großen Events wirkt vieles „offensichtlich“, live ist es das nicht.'
        ]
      },
      {
        title: '6. Wie du diese Infos nutzen kannst',
        paragraphs: [
          'Verstehe, warum die Zahlen auf der Startseite, in News & Signale, bei Kryptowährungen und in Daten & Charts entstehen.',
          'Vergleiche unsere Ergebnisse mit anderen Tools, um Abweichungen nachvollziehen zu können.',
          'Der Learn-Bereich liefert ergänzende Inhalte zu KI-Methoden, Datenqualität und typischen Fallstricken.'
        ]
      }
    ],
    ecosystemLinks: [
      { label: 'Startseite', href: '/de' },
      { label: 'Sentiment-Übersicht', href: '/de/sentiment' },
      { label: 'News & Signale', href: '/de/news' },
      { label: 'Kryptowährungen', href: '/de/coins' },
      { label: 'Daten & Charts', href: '/de/daten' },
      { label: 'Lernen', href: '/de/lernen' }
    ],
    ctas: [
      { label: 'Zur Sentiment-Übersicht wechseln', href: '/de/sentiment' },
      { label: 'Beispiele in Daten & Charts ansehen', href: '/de/daten' },
      { label: 'Im Lernbereich mehr zu KI & Daten lesen', href: '/de/lernen' }
    ],
    SEO: [
      'Krypto Sentiment Methodik',
      'Wie funktioniert Sentiment Analyse',
      'KI Modell Erklärung Krypto',
      'Datenquellen Crypto Sentiment',
      'On-Chain und Social Media Analyse',
      'Crypto sentiment methodology',
      'Transparent AI crypto analytics',
      'Limitations of sentiment analysis',
      'Krypto Datenqualität',
      'Market mood scoring'
    ]
  },
  en: {
    metaTitle: 'Krypto Sentiment Methodology – how our mood scores are built',
    metaDescription:
      'This is where we open the black box: which data sources we use, how AI evaluates text, and where the limits of analysis lie.',
    short:
      'This is where we open the black box: which data sources we use, how AI evaluates text and where the hard limits of our analysis are. Transparency instead of magic, so you can interpret our scores properly.',
    sections: [
      {
        title: '1. Data sources: what our picture is built from',
        paragraphs: [
          'News & articles: official announcements, blog posts, analyses – where market narratives form.',
          'Social media: posts and discussions showing the raw emotion from FOMO to doom.',
          'On-chain data: transaction volume, active addresses, inflows/outflows – revealing if people act on their mood.'
        ]
      },
      {
        title: '2. Pre-processing: turning raw noise into structured input',
        paragraphs: [
          'Language detection & translation normalize multilingual content.',
          'Spam filtering, deduplication and relevance checks prune the clutter.',
          'This makes the remaining data useful for the models.'
        ]
      },
      {
        title: '3. Sentiment models: how AI scores mood',
        paragraphs: [
          'Specialized language models classify text as positive, neutral or negative, plus intensity.',
          'They rely on wording, tone and context signals such as “hack”, “ETF approval” or “all-time high.”',
          'Metadata (source, time, reach) enters the mix before we compute an aggregated score.'
        ]
      },
      {
        title: '4. Weighting & aggregation: not every voice is equal',
        paragraphs: [
          'Major announcements get more weight, meme account hype less.',
          'On-chain flows reinforce existing sentiment trends.',
          'The aim is to avoid bias from loud but low-impact sources.'
        ]
      },
      {
        title: '5. Limits & risks of our approach',
        paragraphs: [
          'Data is incomplete; we never see the full market.',
          'Models can misread context, sarcasm or cultural nuance.',
          'Sentiment is not a price oracle – markets can move contrary to the mood.',
          'Hindsight bias makes old data look obvious; live it isn’t.'
        ]
      },
      {
        title: '6. How this page helps you',
        paragraphs: [
          'It gives you a framework for the Homepage, News & Signals, Cryptocurrencies and Data & Charts.',
          'Compare our results with other tools to understand divergence.',
          'The Learn section provides background on AI, data quality and typical pitfalls.'
        ]
      }
    ],
    ecosystemLinks: [
      { label: 'Homepage', href: '/en' },
      { label: 'Sentiment overview', href: '/en/sentiment' },
      { label: 'News & Signals', href: '/en/news' },
      { label: 'Cryptocurrencies', href: '/en/coins' },
      { label: 'Data & Charts', href: '/en/data' },
      { label: 'Learn', href: '/en/learn' }
    ],
    ctas: [
      { label: 'Go to the sentiment overview', href: '/en/sentiment' },
      { label: 'See examples in Data & Charts', href: '/en/data' },
      { label: 'Learn more about AI & data in the Learn section', href: '/en/learn' }
    ],
    SEO: [
      'Krypto Sentiment Methodology',
      'How sentiment analysis works',
      'AI model explanation crypto',
      'Data sources crypto sentiment',
      'On-chain and social media analysis',
      'Crypto sentiment methodology',
      'Transparent AI crypto analytics',
      'Limitations of sentiment analysis',
      'Crypto data quality',
      'Market mood scoring'
    ]
  }
};

export const generateMetadata = ({ params }: { params: { locale: 'de' | 'en' } }): Metadata => {
  const canonical = `${BASE_URL}/${params.locale}/${params.locale === 'de' ? 'methodik' : 'methodology'}`;
  return {
    title: copy[params.locale].metaTitle,
    description: copy[params.locale].metaDescription,
    alternates: { canonical }
  };
};

export default function MethodikPage({ params }: { params: { locale: 'de' | 'en' } }) {
  const locale = params.locale;
  const localeCopy = copy[locale];

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <section className="mx-auto max-w-5xl space-y-6 rounded-3xl border border-gray-200 bg-white/80 p-8 shadow-sm">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.5em] text-gray-400">
            {locale === 'de' ? 'Methodik' : 'Methodology'}
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
          <h3 className="text-xl font-semibold text-gray-900">{locale === 'de' ? 'CTAs' : 'CTAs'}</h3>
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

import Link from 'next/link';
import type { Metadata } from 'next';

const BASE_URL = process.env.APP_BASE_URL ?? 'https://krypto-sentiment-site.com';

const copy = {
  de: {
    metaTitle: 'Krypto Sentiment – Echtzeit Marktstimmung für Kryptowährungen',
    metaDescription: 'Entdecke die Marktstimmung: KI-gestützte Scores aus News, Social Media und On-Chain-Daten.',
    short: 'Krypto-Sentiment in Klartext: Wir zeigen dir, wie die Crowd gerade wirklich drauf ist – bullish, neutral oder bearish. Täglich analysiert, KI-gestützt, aber leicht verständlich erklärt.',
    longIntroTitle: 'Willkommen bei Krypto Sentiment – deinem Kontrollzentrum für Stimmung im Kryptomarkt.',
    longIntro:
      'Während andere noch durch X-Threads, Telegram-Gruppen und News-Feeds scrollen, bekommst du hier eine klare Antwort auf die simple Frage: „Wie fühlt sich der Markt gerade an?“',
    combines:
      'Wir kombinieren dafür drei Welten:',
    combineItems: [
      'Social Media – was diskutiert die Community?',
      'News & Signale – welche Meldungen bewegen den Markt?',
      'On-Chain-Daten – was machen Wallets, Volumen und Flows wirklich?'
    ],
    score:
      'Aus all diesen Puzzleteilen baut unsere KI einen Sentiment-Score: bullish, neutral oder bearish – ergänzt durch erklärenden Kontext, Beispiele und, wo sinnvoll, Charts aus dem Bereich Daten & Charts.',
    stadiumTitle: 'Warum eine Sentiment-Seite, wenn es doch schon Kurse gibt?',
    stadiumBody:
      'Kurse erzählen dir, was passiert ist. Sentiment versucht zu zeigen, wie der Markt gerade denkt. Stell dir vor, du sitzt in einem Stadion: Der Spielstand ist der Kurs – rein objektiv. Die Stimmung auf den Rängen ist das Sentiment – manchmal euphorisch, manchmal nervös, manchmal einfach nur müde. Genau dieses „Stadiongefühl“ des Kryptomarkts bringen wir auf eine übersichtliche Seite. Du kannst dann selbst entscheiden, ob du dich lieber mit der Masse treiben lässt oder bewusst gegen den Strom schwimmst – natürlich immer in eigener Verantwortung und ohne dass unsere Inhalte als Finanzberatung zu verstehen sind.',
    usageIntro: 'Wie du die Startseite sinnvoll nutzt',
    usageSections: [
      {
        title: 'Sentiment checken',
        description:
          'Schau zuerst auf den aktuellen Marktstimmungs-Status. Ist die allgemeine Stimmung eher bullish, eher neutral oder klar bearish?'
      },
      {
        title: 'In die Details springen',
        description:
          'Über den Bereich News & Signale kannst du nachsehen, welche Meldungen besonders stark auf die Stimmung wirken. Über Kryptowährungen gelangst du zu den einzelnen Coins und siehst, wie sich Stimmung und Narrativ pro Asset unterscheiden.'
      },
      {
        title: 'Daten & Charts',
        description:
          'In Daten & Charts findest du Visualisierungen, die den Sentiment-Kontext greifbarer machen.'
      },
      {
        title: 'Hintergründe verstehen',
        description:
          'Wenn du genauer wissen willst, wie unsere Scores entstehen, lohnt sich ein Blick in die Methodik. Dort erklären wir transparent, wie die KI Daten zusammenträgt, filtert und gewichtet.'
      },
      {
        title: 'Weiterlernen statt blind traden',
        description:
          'Im Bereich Lernen findest du verständliche Artikel rund um Sentiment-Analyse, Risikobewusstsein, Dateninterpretation und KI-Grundlagen.'
      }
    ],
    audienceTitle: 'Für wen ist Krypto Sentiment gedacht?',
    audienceList: [
      'Neugierige Einsteiger:innen, die ein Gefühl dafür bekommen wollen, wie verrückt (oder entspannt) der Markt gerade ist.',
      'Erfahrene Trader, die Sentiment als zusätzlichen Layer neben Charttechnik und Fundamentaldaten nutzen.',
      'Langfristige Investor:innen, die nicht jedem Hype hinterherlaufen wollen, aber trotzdem ein Auge auf die Stimmung haben.',
      'Tech-Nerds & Datenfans, die sehen möchten, wie KI, On-Chain-Analysen und Social-Signals zusammengeführt werden.'
    ],
    transparencyTitle: 'Transparenz & Verantwortung',
    transparencyPoints: [
      'KI-generiert (mit menschlich kuratierter Struktur).',
      'Automatisiert aktualisiert.',
      'Ohne Anspruch auf Vollständigkeit.',
      'Keine Finanzberatung.'
    ],
    finalCall:
      'Krypto ist volatil, riskant und nichts für Geld, das du kurzfristig dringend brauchst. Nutze unsere Analysen als einen Baustein von vielen – und kombiniere sie mit eigener Recherche, kritischem Denken und einem klaren Risikomanagement.',
    ecosystemTitle: 'Dein Einstieg in das Krypto-Stimmungs-Ökosystem',
    ecosystemList: [
      { title: 'Kryptowährungen', description: 'Sieh, welche Coins aktuell im Fokus stehen.' },
      { title: 'News & Signale', description: 'Täglicher Stimmungs-Kontext zu relevanten Ereignissen.' },
      { title: 'Daten & Charts', description: 'Visualisierungen zu Sentiment-Verläufen und Kennzahlen.' },
      { title: 'Über uns', description: 'Lerne das Projekt und die Idee kennen.' },
      { title: 'Kontakt', description: 'Teile Feedback, Feature-Wünsche oder Kooperationsideen.' }
    ],
    ctas: [
      { label: 'Jetzt aktuelle Marktstimmung checken', href: '/de/news' },
      { label: 'Zu News & Signalen wechseln', href: '/de/news' },
      { label: 'Mehr über unsere Methodik erfahren', href: '/de/methodik' },
      { label: 'Im Lernbereich tiefer einsteigen', href: '/de/lernen' }
    ],
    seoKeywords: ['Crypto Sentiment', 'Krypto Marktstimmung', 'Bitcoin Sentiment Analyse', 'Kryptowährungen bullish bearish', 'KI Krypto Analyse', 'Crypto market mood dashboard', 'On-chain sentiment data', 'Krypto News & Signale', 'Sentiment Score Bitcoin Ethereum', 'Crypto trading psychology', 'Kryptomarkt Überblick', 'Real-time crypto sentiment']
  },
  en: {
    metaTitle: 'Krypto Sentiment – Real-time market mood for cryptocurrencies',
    metaDescription: 'Crypto market mood explained: AI scores from News, Social Signals, and on-chain data. No financial advice.',
    short: 'Krypto-Sentiment in plain language: we show you how the crowd actually feels – bullish, neutral or bearish. Updated daily, powered by AI, but explained in a way humans understand.',
    longIntroTitle: 'Welcome to Krypto Sentiment – your control center for crypto market mood.',
    longIntro:
      'While others are still doom-scrolling through X threads, Telegram chats and news feeds, you get a simple answer to a simple question: “How does the market feel right now?”',
    combines: 'We bring together three worlds:',
    combineItems: [
      'Social media – what is the community talking about?',
      'News & signals – which headlines are actually moving the market?',
      'On-chain data – what are wallets, volumes and flows doing under the surface?'
    ],
    score:
      'From all of this, our AI builds a sentiment score: bullish, neutral or bearish – backed by short explanations, examples and, where it makes sense, charts from the Data & Charts section.',
    stadiumTitle: 'Why a sentiment homepage if prices already exist?',
    stadiumBody:
      'Prices tell you what happened. Sentiment tries to show how the market is thinking right now. Imagine you’re in a stadium: The score on the board is the price – cold and objective. The noise from the stands is the sentiment – sometimes euphoric, sometimes stressed, sometimes weirdly quiet. Our goal is to capture this “stadium feeling” of the crypto market on a clean, structured page. You decide whether you want to move with the crowd or deliberately against it – always at your own risk and never as financial advice.',
    usageIntro: 'How to use this homepage',
    usageSections: [
      {
        title: 'Check the current sentiment',
        description: 'Start with today’s overall mood: is the market leaning bullish, stuck in neutral or clearly bearish?'
      },
      {
        title: 'Dive into the details',
        description: 'Use the News & Signals area to see which stories are pushing sentiment up or down. Jump into the Cryptocurrencies section to explore how sentiment differs from coin to coin.'
      },
      {
        title: 'Visit Data & Charts',
        description: 'See visualizations that make the mood and its changes easier to grasp.'
      },
      {
        title: 'Understand the logic behind the numbers',
        description: 'The Methodology section walks you through how AI models collect, filter and weight data points.'
      },
      {
        title: 'Learn instead of blindly trading',
        description: 'Find accessible articles on sentiment analysis, risk awareness, data interpretation and AI basics.'
      }
    ],
    audienceTitle: 'Who is Krypto Sentiment for?',
    audienceList: [
      'Curious beginners who want a quick feeling for how crazy (or calm) the market is right now.',
      'Experienced traders who use sentiment as an additional layer on top of charts and fundamentals.',
      'Long-term investors who don’t want to chase every hype cycle but still like to track the emotional side of the market.',
      'Tech and data enthusiasts who enjoy seeing AI, on-chain analytics and social signals combined.'
    ],
    transparencyTitle: 'Transparency & responsibility',
    transparencyPoints: [
      'AI-generated with a human-designed structure.',
      'Automatically updated.',
      'Incomplete by nature (no model sees everything).',
      'Not financial advice.'
    ],
    finalCall:
      'Crypto is volatile and risky. Never use money you can’t afford to lose, and always combine our insights with your own research, a healthy dose of skepticism and a clear risk strategy.',
    ecosystemTitle: 'Your entry point into the sentiment ecosystem',
    ecosystemList: [
      { title: 'Cryptocurrencies', description: 'See which assets are currently in focus and how their sentiment develops.' },
      { title: 'News & Signals', description: 'Key events and their mood context.' },
      { title: 'Data & Charts', description: 'Visualize sentiment, trends and related metrics.' },
      { title: 'About', description: 'Read the story and idea behind the project.' },
      { title: 'Contact', description: 'Share feedback, ideas or collaboration requests.' }
    ],
    ctas: [
      { label: "Check today’s market sentiment", href: '/en/news' },
      { label: 'Jump to News & Signals', href: '/en/news' },
      { label: 'Learn more about our methodology', href: '/en/methodology' },
      { label: 'Dive deeper in the Learn section', href: '/en/learn' }
    ],
    seoKeywords: ['Crypto Sentiment', 'Krypto Marktstimmung', 'Bitcoin Sentiment Analyse', 'Kryptowährungen bullish bearish', 'KI Krypto Analyse', 'Crypto market mood dashboard', 'On-chain sentiment data', 'Krypto News & Signale', 'Sentiment Score Bitcoin Ethereum', 'Crypto trading psychology', 'Kryptomarkt Überblick', 'Real-time crypto sentiment']
  }
} as const;

export const generateMetadata = ({ params }: { params: { locale: 'de' | 'en' } }): Metadata => {
  const localeCopy = copy[params.locale];
  const canonical = `${BASE_URL}/${params.locale}`;
  return {
    title: localeCopy.metaTitle,
    description: localeCopy.metaDescription,
    alternates: { canonical }
  };
};

export default function LocaleRootPage({ params }: { params: { locale: 'de' | 'en' } }) {
  const localeCopy = copy[params.locale];

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-6">
        <article className="rounded-3xl border border-gray-200 bg-white/80 p-10 shadow-xl">
          <p className="text-sm uppercase tracking-[0.5em] text-gray-400">Krypto Sentiment</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-gray-900">
            {localeCopy.longIntroTitle}
          </h1>
          <p className="mt-6 text-lg text-gray-700">{localeCopy.longIntro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {localeCopy.ctas.map((cta) => (
              <Link
                key={cta.label}
                href={cta.href}
                className="rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-gray-800"
              >
                {cta.label}
              </Link>
            ))}
          </div>
        </article>

        <article className="space-y-4 rounded-3xl border border-gray-200 bg-white/70 p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-900">
            {localeCopy.longIntroTitle.includes('Willkommen') ? 'Kurzversion' : 'Short summary'}
          </h2>
          <p className="text-lg text-gray-700">{localeCopy.short}</p>
        </article>

        <article className="space-y-6 rounded-3xl border border-gray-200 bg-white/80 p-8 shadow-lg">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-400">{localeCopy.combines}</p>
            <ul className="grid gap-2 text-gray-700">
              {localeCopy.combineItems.map((item) => (
                <li key={item} className="text-base">• {item}</li>
              ))}
            </ul>
            <p className="text-base text-gray-700">{localeCopy.score}</p>
          </div>
          <div className="space-y-3 pt-4">
            <h3 className="text-xl font-semibold text-gray-900">{localeCopy.stadiumTitle}</h3>
            <p className="text-gray-700">{localeCopy.stadiumBody}</p>
          </div>
        </article>

        <article className="space-y-6 rounded-3xl border border-gray-200 bg-white/70 p-8 shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-900">{localeCopy.usageIntro}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {localeCopy.usageSections.map((section) => (
              <div key={section.title} className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-gray-700">
                <h4 className="text-lg font-semibold text-gray-900">{section.title}</h4>
                <p className="text-sm leading-relaxed">{section.description}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="space-y-4 rounded-3xl border border-gray-200 bg-white/80 p-8 shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-900">{localeCopy.audienceTitle}</h3>
          <ul className="space-y-2 text-gray-700">
            {localeCopy.audienceList.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>

        <article className="space-y-4 rounded-3xl border border-gray-200 bg-white/70 p-8 shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-900">{localeCopy.transparencyTitle}</h3>
          <ul className="space-y-2 text-gray-700">
            {localeCopy.transparencyPoints.map((point) => (
              <li key={point}>• {point}</li>
            ))}
          </ul>
          <p className="text-sm text-gray-500">{localeCopy.finalCall}</p>
        </article>

        <article className="space-y-6 rounded-3xl border border-gray-200 bg-white/80 p-8 shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-900">{localeCopy.ecosystemTitle}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {localeCopy.ecosystemList.map((item) => (
              <div key={item.title} className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-gray-700">
                <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                <p className="text-sm">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Link href={params.locale === 'de' ? '/de/news' : '/en/news'} className="text-sm font-semibold text-indigo-600 hover:underline">
              {params.locale === 'de' ? 'News & Signale' : 'News & Signals'}
            </Link>
            <Link href={params.locale === 'de' ? '/de/coins' : '/en/coins'} className="text-sm font-semibold text-indigo-600 hover:underline">
              {params.locale === 'de' ? 'Kryptowährungen' : 'Cryptocurrencies'}
            </Link>
            <Link href={params.locale === 'de' ? '/de/data' : '/en/data'} className="text-sm font-semibold text-indigo-600 hover:underline">
              {params.locale === 'de' ? 'Daten & Charts' : 'Data & Charts'}
            </Link>
            <Link href={params.locale === 'de' ? '/de/lernen' : '/en/learn'} className="text-sm font-semibold text-indigo-600 hover:underline">
              {params.locale === 'de' ? 'Lernen' : 'Learn'}
            </Link>
            <Link href={params.locale === 'de' ? '/de/ueber-uns' : '/en/about'} className="text-sm font-semibold text-indigo-600 hover:underline">
              {params.locale === 'de' ? 'Über uns' : 'About'}
            </Link>
            <Link href={params.locale === 'de' ? '/de/kontakt' : '/en/contact'} className="text-sm font-semibold text-indigo-600 hover:underline">
              {params.locale === 'de' ? 'Kontakt' : 'Contact'}
            </Link>
          </div>
        </article>

        <article className="space-y-3 rounded-3xl border border-gray-200 bg-white/70 p-8 shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">SEO & Keywords</p>
          <div className="flex flex-wrap gap-2">
            {localeCopy.seoKeywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700"
              >
                {keyword}
              </span>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}

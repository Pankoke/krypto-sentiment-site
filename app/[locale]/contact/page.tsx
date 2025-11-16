import Link from 'next/link';
import type { Metadata } from 'next';

const BASE_URL = process.env.APP_BASE_URL ?? 'https://krypto-sentiment-site.vercel.app';

const copy = {
  de: {
    metaTitle: 'Kontakt – Dein Draht zu Krypto Sentiment',
    metaDescription:
      'Melde dich bei Krypto Sentiment für Feedback, Fragen, Bugreports oder Kooperationen – nicht für Kaufempfehlungen, aber für alles rund um Daten und Features.',
    short:
      'Hier erreichst du das Team hinter Krypto Sentiment: für Feedback, Fragen, Bugreports oder Kooperationsideen. Kein Trading-Support, aber gern Hilfe rund um Daten, Features und Verständnisfragen.',
    helpTopics: [
      'Fehler & Bugs, z. B. Charts, Sprachversionen oder Darstellungen, die nicht laden.',
      'Inhaltliches Feedback zu Learn, Methodik oder verwirrenden Stellen.',
      'Feature-Wünsche wie neue Filter, Datenquellen oder Ansichten.'
    ],
    nonSupport: [
      'Keine Anlageberatung („Coin X kaufen/verkaufen?“).',
      'Kein persönlicher Trading-Support.',
      'Keine steuerlichen oder rechtlichen Auskünfte.'
    ],
    processing: [
      'Anfragen landen im Kontaktpostfach und werden thematisch sortiert.',
      'Fehler werden geprüft, Feedback an die passenden Bereiche geknüpft.',
      'Jede Nachricht hilft, die Plattform langfristig zu verbessern.'
    ],
    dataNotes: [
      'Wir nutzen deine Angaben nur für die Antwort.',
      'Bitte teile keine privaten Schlüssel oder Wallet-Daten.',
      'Screenshots sind hilfreich, aber achte auf sensible Informationen.'
    ],
    tips: [
      'Beschreibe, auf welcher Seite (z. B. Daten & Charts) das Problem auftritt.',
      'Sag, was du zuletzt geklickt oder gefiltert hast.',
      'Ein Screenshot hilft dem Support-Team.'
    ],
    final: 'Danke fürs Mitmachen! Danach kannst du zur Startseite, Learn, Daten & Charts oder News & Signale zurückkehren.',
    navLinks: [
      { label: 'Startseite', href: '/de' },
      { label: 'Methodik', href: '/de/methodik' },
      { label: 'Lernen', href: '/de/lernen' },
      { label: 'Daten & Charts', href: '/de/daten' },
      { label: 'News & Signale', href: '/de/news' },
      { label: 'Kryptowährungen', href: '/de/coins' },
      { label: 'Kontakt', href: '/de/kontakt' }
    ],
    formLabel: 'Kontakt',
    formSubtitle:
      'Für Feedback, Fragen oder Kooperationen kannst du uns hier schreiben. Kein Support für „Welche Coin soll ich kaufen?“.',
    placeholder: {
      name: 'Dein Name',
      email: 'deine@email.de',
      message: 'Deine Nachricht (optional mit Screenshot-Link)'
    },
    submit: 'Nachricht an das Team senden',
    ctas: [
      { label: 'Nachricht an das Team senden', href: '#form' },
      { label: 'Bug mit Screenshot melden', href: '#form' },
      { label: 'Zur Startseite zurückkehren', href: '/de' },
      { label: 'Lernbereich öffnen', href: '/de/lernen' },
      { label: 'Daten & Charts erkunden', href: '/de/daten' },
      { label: 'News & Signale anschauen', href: '/de/news' }
    ],
    seoKeywords: [
      'Krypto Sentiment Kontakt',
      'Support Krypto Sentiment',
      'Feedback Crypto Sentiment',
      'Kontaktformular Krypto Analyse',
      'Crypto sentiment support contact',
      'Bugreport Krypto Plattform',
      'Kooperation Krypto Sentiment'
    ]
  },
  en: {
    metaTitle: 'Contact – Your line to Krypto Sentiment',
    metaDescription:
      'Reach out for feedback, questions, bug reports or collaborations – not for investment calls but for insight and feature discussions.',
    short:
      'This is how you reach the Krypto Sentiment team: for feedback, questions, bug reports or collaboration ideas. We can’t tell you “which coin to buy”, but we help with data, features and understanding the platform.',
    helpTopics: [
      'Bugs, broken charts, missing language versions or problematic pages.',
      'Content feedback on Learn, Methodology or confusing spots.',
      'Feature wishes like filters, data sources or extra views.'
    ],
    nonSupport: [
      'No personal investment advice (“Should I buy/sell coin X?”).',
      'No personal trading support.',
      'No tax or legal guidance.'
    ],
    processing: [
      'Messages land in the contact inbox and get categorized.',
      'Bugs are checked, ideas are evaluated against the platform.',
      'Every note shapes the long-term roadmap.'
    ],
    dataNotes: [
      'We only use your info to respond.',
      'Please don’t send private keys or wallet access.',
      'Screenshots help – just omit sensitive data.'
    ],
    tips: [
      'Mention which page (Data & Charts, News & Signals, Cryptocurrencies) you were on.',
      'Describe what you clicked or filtered before the issue occurred.',
      'A screenshot makes it easier to understand.'
    ],
    final: 'Thanks for helping. Then hop back to Homepage, Learn, Data & Charts or News & Signals.',
    navLinks: [
      { label: 'Homepage', href: '/en' },
      { label: 'Methodology', href: '/en/methodology' },
      { label: 'Learn', href: '/en/learn' },
      { label: 'Data & Charts', href: '/en/data' },
      { label: 'News & Signals', href: '/en/news' },
      { label: 'Cryptocurrencies', href: '/en/coins' },
      { label: 'Contact', href: '/en/contact' }
    ],
    formLabel: 'Contact',
    formSubtitle:
      'Share feedback, questions or collab ideas. Not for “what should I buy?”, but for feature and data help.',
    placeholder: {
      name: 'Your name',
      email: 'your@email.com',
      message: 'Your message (optional screenshot link)'
    },
    submit: 'Send a message to the team',
    ctas: [
      { label: 'Send a message to the team', href: '#form' },
      { label: 'Report a bug with screenshot', href: '#form' },
      { label: 'Return to the homepage', href: '/en' },
      { label: 'Open the Learn section', href: '/en/learn' },
      { label: 'Explore Data & Charts', href: '/en/data' },
      { label: 'Check today’s News & Signals', href: '/en/news' }
    ],
    seoKeywords: [
      'Krypto Sentiment Kontakt',
      'Support Krypto Sentiment',
      'Feedback Crypto Sentiment',
      'Kontaktformular Krypto Analyse',
      'Crypto sentiment support contact',
      'Bugreport Krypto Plattform',
      'Kooperation Krypto Sentiment'
    ]
  }
};

export const generateMetadata = ({ params }: { params: { locale: 'de' | 'en' } }): Metadata => {
  const canonical = `${BASE_URL}/${params.locale}/${params.locale === 'de' ? 'kontakt' : 'contact'}`;
  const localeCopy = copy[params.locale];
  return {
    title: localeCopy.metaTitle,
    description: localeCopy.metaDescription,
    alternates: { canonical }
  };
};

export default function ContactPage({ params }: { params: { locale: 'de' | 'en' } }) {
  const locale = params.locale;
  const localeCopy = copy[locale];

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <section className="mx-auto max-w-5xl space-y-6 rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-xl">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.5em] text-gray-400">
            {locale === 'de' ? 'Kontakt' : 'Contact'}
          </p>
          <h1 className="text-4xl font-semibold text-gray-900">{localeCopy.metaTitle}</h1>
          <p className="text-sm text-gray-600">{localeCopy.short}</p>
        </header>
        <div className="grid gap-3 text-xs uppercase tracking-wide text-indigo-600 md:grid-cols-3">
          {localeCopy.navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="hover:text-indigo-900">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="space-y-3 rounded-2xl border border-gray-100 bg-gray-50/70 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            {locale === 'de' ? 'Womit du dich gerne melden kannst' : 'What you’re welcome to contact us about'}
          </h2>
          <ul className="text-sm text-gray-700">
            {localeCopy.helpTopics.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-3 rounded-2xl border border-gray-100 bg-gray-50/70 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            {locale === 'de' ? 'Was wir dir nicht bieten' : 'What we can’t provide via Contact'}
          </h2>
          <ul className="text-sm text-gray-700">
            {localeCopy.nonSupport.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            {locale === 'de' ? 'So läuft deine Nachricht durch' : 'What happens to your message'}
          </h2>
          <ul className="text-sm text-gray-700">
            {localeCopy.processing.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            {locale === 'de' ? 'Hinweise zum Umgang mit Daten' : 'Data handling & safety'}
          </h2>
          <ul className="text-sm text-gray-700">
            {localeCopy.dataNotes.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            {locale === 'de' ? 'Wie du deine Anfrage hilfreich formulierst' : 'How to write a super helpful message'}
          </h2>
          <ul className="text-sm text-gray-700">
            {localeCopy.tips.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div id="form" className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <form className="space-y-6">
            <label className="space-y-1 text-sm font-medium text-gray-700">
              {locale === 'de' ? 'Name' : 'Name'}
              <input
                type="text"
                name="name"
                placeholder={localeCopy.placeholder.name}
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-base text-gray-900 focus:border-black focus:outline-none"
              />
            </label>
            <label className="space-y-1 text-sm font-medium text-gray-700">
              {locale === 'de' ? 'E-Mail' : 'Email'}
              <input
                type="email"
                name="email"
                placeholder={localeCopy.placeholder.email}
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-base text-gray-900 focus:border-black focus:outline-none"
              />
            </label>
            <label className="space-y-1 text-sm font-medium text-gray-700">
              {locale === 'de' ? 'Nachricht' : 'Message'}
              <textarea
                name="message"
                rows={5}
                placeholder={localeCopy.placeholder.message}
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-base text-gray-900 focus:border-black focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-md bg-black px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-gray-800"
            >
              {localeCopy.submit}
            </button>
          </form>
          <p className="text-sm text-gray-500">{localeCopy.final}</p>
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
      <section className="mt-8 flex flex-wrap justify-center gap-3">
        {localeCopy.ctas.map((cta) => (
          <Link
            key={cta.label}
            href={cta.href}
            className="rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 transition hover:border-black"
          >
            {cta.label}
          </Link>
        ))}
      </section>
    </main>
  );
}

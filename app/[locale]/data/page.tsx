import type { Metadata } from 'next';

const BASE_URL = 'https://krypto-sentiment-site.vercel.app';
const DESCRIPTION =
  'Krypto Marktstimmung, Sentiment-Analysen, On-Chain Daten und News auf Deutsch.';

const copy = {
  de: {
    title: 'Daten & Charts',
    intro:
      'Wir kombinieren Markt-, On-Chain- und Derivate-Daten, um aussagekräftige Sentiment-Dashboards zu erstellen.',
    details: [
      'Echtzeit-Daten geben Hinweise auf führende Marktbewegungen.',
      'On-Chain-Metriken zeigen Aktivität, Flüsse und Nutzerverhalten.',
      'Charts helfen, Stimmungsschwankungen visuell zu erkennen und Entscheidungen zu treffen.'
    ]
  },
  en: {
    title: 'Data & Charts',
    intro:
      'We aggregate market, on-chain and derivatives data into actionable sentiment dashboards.',
    details: [
      'Real-time figures highlight leading market action.',
      'On-chain metrics expose flows, activity and network health.',
      'Charts visualize sentiment swings so you can react confidently.'
    ]
  }
};

export const generateMetadata = ({ params }: { params: { locale: 'de' | 'en' } }): Metadata => {
  const canonical = `${BASE_URL}/${params.locale}/${params.locale === 'de' ? 'daten' : 'data'}`;
  return {
    title:
      params.locale === 'de'
        ? 'Krypto Sentiment – Daten & Charts'
        : 'Krypto Sentiment – Data & Charts',
    description: params.locale === 'de' ? DESCRIPTION : copy.en.intro,
    alternates: { canonical }
  };
};

export default function DataPage({ params }: { params: { locale: 'de' | 'en' } }) {
  const localeCopy = copy[params.locale];
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <section className="mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-white/80 p-8 shadow-sm space-y-6">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
            {params.locale === 'de' ? 'Daten & Charts' : 'Data & Charts'}
          </p>
          <h1 className="text-4xl font-semibold text-gray-900">{localeCopy.title}</h1>
          <p className="text-base text-gray-600">{localeCopy.intro}</p>
        </header>
        <div className="space-y-3 text-gray-700">
          {localeCopy.details.map((detail) => (
            <p key={detail} className="text-base leading-relaxed">
              {detail}
            </p>
          ))}
        </div>
      </section>
    </main>
  );
}

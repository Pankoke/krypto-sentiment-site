import type { Metadata } from 'next';

const BASE_URL = 'https://krypto-sentiment-site.vercel.app';
const DESCRIPTION =
  'Krypto Marktstimmung, Sentiment-Analysen, On-Chain Daten und News auf Deutsch.';

const copy = {
  de: {
    label: 'Über uns',
    title: 'Über uns',
    body: [
      'Wir sind ein unabhängiges Projekt im Bereich Krypto- und Datenanalyse.',
      'Unser Ziel ist es, Marktinformationen verständlich aufzubereiten und Sentiment-Daten transparent darzustellen.',
      'Wir setzen auf KI-gestützte Analyseverfahren, um Trends frühzeitig sichtbar zu machen.'
    ],
    footer: 'Alle Inhalte dienen ausschließlich Informationszwecken und stellen keine Finanzberatung dar.'
  },
  en: {
    label: 'Company',
    title: 'About Us',
    body: [
      'We are an independent crypto and data analytics project providing accessible and transparent sentiment insights.',
      'Our platform aggregates multiple sources to simplify market information for traders and researchers.'
    ],
    footer: 'This website does not provide financial advice.'
  }
};

export const generateMetadata = ({ params }: { params: { locale: 'de' | 'en' } }): Metadata => {
  const canonical = `${BASE_URL}/${params.locale}/about`;
  return {
    title: params.locale === 'de' ? 'Krypto Sentiment – Über uns' : 'Krypto Sentiment – About Us',
    description: params.locale === 'de' ? DESCRIPTION : 'Independent crypto sentiment analytics to help traders and researchers.',
    alternates: { canonical }
  };
};

export default function AboutPage({ params }: { params: { locale: 'de' | 'en' } }) {
  const localeCopy = copy[params.locale];
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <section className="mx-auto max-w-4xl space-y-8 rounded-2xl border border-gray-200 bg-white/80 p-8 shadow-sm">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-400">{localeCopy.label}</p>
          <h1 className="text-4xl font-semibold text-gray-900">{localeCopy.title}</h1>
        </header>
        <div className="space-y-4 text-gray-700">
          {localeCopy.body.map((paragraph) => (
            <p key={paragraph} className="text-lg leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
        <p className="text-sm text-gray-500">{localeCopy.footer}</p>
      </section>
    </main>
  );
}

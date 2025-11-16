import type { Metadata } from 'next';

const BASE_URL = process.env.APP_BASE_URL ?? 'https://krypto-sentiment-site.com';

export async function generateMetadata(): Promise<Metadata> {
  const canonical = `${BASE_URL}/de/methodik`;
  return {
    title: 'Unsere Methodik – Krypto Sentiment',
    description:
      'Erfahren Sie, welche Datenquellen wir kombinieren, um einen transparenten Sentiment-Score für Kryptowährungen zu berechnen.',
    alternates: { canonical }
  };
}

const sections = [
  {
    title: 'Unsere Methodik',
    description:
      'Wir kombinieren mehrere Datenquellen, um die Marktstimmung zu bestimmen:',
    bullets: [
      'Analyse von Nachrichten und Schlagzeilen',
      'Social-Media-Sentiment (Erwähnungen, Stimmung)',
      'On-Chain-Daten wie aktive Adressen und Nettoflüsse',
      'Derivate-Daten, z. B. Funding Rates'
    ]
  },
  {
    title: 'Sentiment-Score & Vertrauen',
    description:
      'Der resultierende Sentiment-Score bewegt sich zwischen 0 und 1 und wird durch einen Vertrauenswert ergänzt.',
    bullets: [
      'Scores nahe 0 zeigen bearishe Stimmung, Scores nahe 1 bullishe Stimmung.',
      'Der Vertrauenswert hilft, Schwankungen und Rauschen einzuschätzen.',
      'Wir veröffentlichen die Daten transparent und nachvollziehbar für Trader und Analysten.'
    ]
  }
];

export default function MethodikPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <section className="mx-auto max-w-4xl space-y-8 rounded-2xl border border-gray-200 bg-white/80 p-8 shadow-sm">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Methodik</p>
          <h1 className="text-4xl font-semibold text-gray-900">Unsere Methodik</h1>
        </header>
        <div className="space-y-6">
          {sections.map((section) => (
            <article key={section.title} className="space-y-3 rounded-xl border border-gray-100 bg-gray-50/60 p-5 shadow-sm">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
                <p className="text-sm text-gray-700">{section.description}</p>
              </div>
              <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="text-sm text-gray-500">Diese Seite dient ausschließlich Informationszwecken.</p>
      </section>
    </main>
  );
}

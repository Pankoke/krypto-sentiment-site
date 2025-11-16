import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Methodology',
  description: 'How we combine data sources to calculate the crypto market sentiment.',
};

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <section className="mx-auto max-w-4xl space-y-8 rounded-2xl border border-gray-200 bg-white/80 p-8 shadow-sm">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Insights</p>
          <h1 className="text-4xl font-semibold text-gray-900">Our Methodology</h1>
        </header>
        <article className="space-y-4 text-gray-700">
          <p className="text-lg leading-relaxed">
            We combine multiple data sources to calculate market sentiment:
          </p>
          <ul className="list-disc space-y-2 pl-5 text-gray-700">
            <li>News sentiment analysis</li>
            <li>Social media signals</li>
            <li>On-chain metrics (active addresses, net flows)</li>
            <li>Derivatives data such as funding rates</li>
          </ul>
        </article>
        <article className="space-y-3 text-gray-700">
          <p>
            Our sentiment score ranges from 0–1 and includes a confidence index. We aim to provide transparent and
            understandable metrics for traders and researchers.
          </p>
        </article>
        <p className="text-sm text-gray-500">This page is for informational purposes only.</p>
      </section>
    </main>
  );
}

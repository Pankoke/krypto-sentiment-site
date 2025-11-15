import type { Metadata } from 'next';
import { methodikContent } from 'lib/methodik';
import { methodPageSlug } from 'lib/methodPages';

const BASE_URL = process.env.APP_BASE_URL ?? 'https://krypto-sentiment-site.com';

export function generateStaticParams() {
  return [{ locale: 'en' }];
}

function createMetadata(locale: 'de' | 'en', slug: string, content: { title: string; description: string }) {
  const canonical = `${BASE_URL}/${locale}/${slug}`;
  return {
    title: content.title,
    description: content.description,
    openGraph: {
      title: content.title,
      description: content.description,
      url: canonical,
    },
    alternates: {
      canonical,
      languages: {
        de: `${BASE_URL}/de/${methodPageSlug.de}`,
        en: `${BASE_URL}/en/${methodPageSlug.en}`,
      },
    },
  } satisfies Metadata;
}

export async function generateMetadata(): Promise<Metadata> {
  const content = methodikContent.en;
  return createMetadata('en', methodPageSlug.en, content);
}

export default function MethodologyPage() {
  const content = methodikContent.en;
  return (
    <section className="space-y-6 py-10 px-4">
      <header>
        <h1 className="text-3xl font-semibold">{content.title}</h1>
        <p className="mt-2 text-gray-600">{content.description}</p>
      </header>
      {content.sections.map((section) => (
        <article key={section.title} className="space-y-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-xl font-semibold">{section.title}</h2>
          <p className="text-sm text-gray-600">{section.description}</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
            {section.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </article>
      ))}
      <section className="space-y-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
        <h3 className="text-lg font-semibold">Disclaimer</h3>
        <p className="text-sm text-gray-600">{content.disclaimer}</p>
        <h3 className="text-lg font-semibold">Scaling the coverage</h3>
        <p className="text-sm text-gray-600">{content.expansion}</p>
      </section>
    </section>
  );
}

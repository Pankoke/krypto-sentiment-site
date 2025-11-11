import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return [{ locale: 'de' }, { locale: 'en' }];
}

export default async function LocaleLayout({ children, params: { locale } }: { children: React.ReactNode; params: { locale: 'de' | 'en' } }) {
  // Keep generateStaticParams for localized routing. Messages are now provided by the root layout.
  // Validate messages exist for this locale to surface 404 early if missing.
  try {
    await import(`../../src/app/messages/${locale}.json`);
  } catch {
    notFound();
  }
  return <>{children}</>;
}

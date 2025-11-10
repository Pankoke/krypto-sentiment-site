import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return [{ locale: 'de' }, { locale: 'en' }];
}

export default async function LocaleLayout({ children, params: { locale } }: { children: React.ReactNode; params: { locale: 'de' | 'en' } }) {
  let messages: Record<string, string>;
  try {
    // Load messages from src folder to avoid duplication
    messages = (await import(`../../src/app/messages/${locale}.json`)).default as Record<string, string>;
  } catch {
    notFound();
  }
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

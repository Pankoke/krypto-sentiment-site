import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { cookies } from 'next/headers';
import { defaultLocale } from '../i18n';
import { LanguageSwitcher } from '../src/components/LanguageSwitcher';
import { LocaleNav } from '../src/components/LocaleNav';

export const metadata: Metadata = {
  title: 'Krypto Sentiment',
  description: 'Tägliche Krypto-Sentiment Berichte'
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  // determine locale from cookie set by middleware or fallback
  const cookieLocale = cookies().get('NEXT_LOCALE')?.value ?? defaultLocale;
  let messages: Record<string, string> = {};
  try {
    messages = (await import(`../src/app/messages/${cookieLocale}.json`)).default as Record<string, string>;
  } catch (e) {
    // ignore — provider can still render with empty messages
  }

  return (
    <html lang={cookieLocale}>
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <NextIntlClientProvider locale={cookieLocale} messages={messages}>
          <header className="border-b bg-white/70 backdrop-blur">
            <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
              <Link href="/" className="text-lg font-semibold">Krypto Sentiment</Link>
              <div className="text-sm flex items-center gap-4">
                <LocaleNav />
                <LanguageSwitcher />
              </div>
            </div>
          </header>
          <main className="max-w-5xl mx-auto p-6">{children}</main>
          <footer className="border-t bg-white/70 backdrop-blur">
            <div className="max-w-5xl mx-auto px-6 py-4 text-xs text-gray-500">
              {(messages as any)?.footer?.disclaimer ?? 'KI‑generierter Inhalt; keine Finanzberatung.'}
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
